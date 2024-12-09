import mintRateDao from "../Dao/mintRate.js";
import userDao from "../Dao/user.js";
import userNowDao from "../Dao/userNow.js";
import {errorHandle, errorTip, getNow, httpResult, ONEDAY} from "../utils/utils.js";
import {config} from "../config/index.js";
import sequelize from "../models/init.js";
import taxTableDao from "../Dao/taxTable.js";
import SafeCalc from "../utils/bignumberjs.js";
import userEarningsDao from "../Dao/userEarnings.js";
import {
  addBillForMERC_Sys,
  addMintTotal,
  addUserContribution,
  checkSignAddress, checkSignAddressByAddress,
  getUserEth,
  queryCheckId
} from "./utils.js";
import {earningTypes} from "../types/index.js";
import {ethers} from "ethers";
import userOnlineDao from "../Dao/userOnline.js";
import userContributeDao from "../Dao/userContribute.js";
import {getTotalDataInfo} from "../timerGlobalData/totalData.js";
import mqBindAddressDao from "../Dao/mqBindAddress.js";

// 获取基础数据
export const getbalance = async (req, res) => {
  let {id} = req.body;
  queryCheckId(id);
  let baseMintRate = await getBaseData(id);
  let userData = await getUserData(id);
  let groupMintRate = await getGroupMintRate(id);
  let userEth = await getUserEth(id);
  // 下级用户给你加速产生的币
  // let lockContribute = await userContributeDao.getLockContribute(id);
  let result = {
    nexttime: userData.nexttime || 0,
    tax: Number(userData.tax) || 0,
    groupMintRate: groupMintRate,
    baseMintRate,
    balance: Number(userData.balance) || 0,
    lastsettletime: userData.lastsettletime,
    address: userData.address,
    unlockBalance: Number(userData.unlock_balance) || 0,
    ...userEth,
    result: true
  };
  res.json(httpResult.success(result));
};

// 开始挖矿
export const startMint = async (req, res) => {
  let {id, signRes} = req.body;
  queryCheckId(id);
  await checkSignAddress(id, signRes);
  let result = await mint(id);
  res.json(httpResult.success(result));
};

// 结束挖矿
export const settleMint = async (req, res) => {
  let {id} = req.body;
  queryCheckId(id);
  let result = await settle(id);
  res.json(httpResult.success(result));
};

// 获取7天历史的收益数量
export const getWeekEarnings = async (req, res) => {
  let {id} = req.body;
  queryCheckId(id);
  let result = await userEarningsDao.getWeekEarnings(id);
  let taxList = await userEarningsDao.getWeekTax(id);
  res.json(httpResult.success({
    result: true,
    earnList: result,
    taxList
  }));
};

// 设置我的上级信息
export const setMySuperiors = async (req, res) => {
  let {id, data} = req.body;
  if (!data) {
    throw new Error("上级信息不能为空");
  }
  queryCheckId(id);
  let superiors = await userDao.getUserLockByEmailOrCode(data);
  if (!superiors) {
    throw new Error("上级信息不存在");
  }
  const t = await sequelize.transaction();
  try {
    // 设置用户上级
    await userDao.updateInviterId(id, superiors.id, t);
    // 设置用户在线上级
    await userNowDao.updateInviterId(id, superiors.id, t);
    await t.commit();
    res.json(httpResult.success({
      result: true
    }));
  } catch (e) {
    console.log(e, '上级设置失败');
    t.rollback();
    throw new Error('上级设置失败');
  }
};

// 获取我的上级信息
export const getMySuperior = async (req, res) => {
  let {id} = req.body;
  queryCheckId(id);
  let userData = await getUserData(id);
  let inviter_id = userData.inviter_id;
  let inviter = await userDao.getUserLock(inviter_id);
  let inviteCount = await userNowDao.getInviteCount(inviter_id);
  res.json(httpResult.success({
    result: true,
    id: inviter_id,
    inviteCount,
    email: inviter.email
  }));
};

// 获取收益列表
export const getEarningsList = async (req, res) => {
  let {id, page, pageSize} = req.body;
  if (!pageSize) {
    pageSize = 10;
  }
  if (!page) {
    page = 1;
  }
  queryCheckId(id);
  let result = await userEarningsDao.getEarnings(id, page, pageSize);
  res.json(httpResult.success({
    result: true,
    earnList: result
  }));
};

// 获取我的团队信息
export const getMyGroup = async (req, res) => {
  let {id, pageNumber} = req.body;
  queryCheckId(id);
  let onlineNumber = await userNowDao.getInviteOnlineCount(id);
  let result = await userNowDao.getInviteListPage(id, pageNumber, 10);
  // result 根据id属性补全邮箱
  let userList = await userDao.getUserByIds(result.rows.map(item => item.id));
  let userMap = {};
  userList.forEach(it => {
    userMap[it.id] = it;
  });
  result.rows.forEach(it => {
    it.email = userMap[it.id].email;
    it.address = userMap[it.id].address;
    it.user_name = userMap[it.id].user_name;
  });
  result.onlineNumber = onlineNumber;
  res.json(httpResult.success({
    result: true,
    list: result
  }));
};

// 添加验证码设置 设置绑定地址并且更新地址的绑定完成状态
export const setBindAddress = async (req, res) => {
  let {id, address, code, signRes} = req.body;
  if (!id || !address) {
    throw new Error('绑定地址数据不正确');
  }
  if (!ethers.isAddress(address)) {
    throw new Error('请输入正确地址');
  }
  // 检查签名是否是这个地址的, 判断地址是否是这个用户的
  checkSignAddressByAddress(config.BIND_ADDRESS_SIGN_WORD, address, signRes);

  // 检查地址是否存在数据库
  let user = await userDao.getUserByAddress(address);
  if (user) {
    throw new Error('该地址已被绑定');
  }
  let userAddress = await userDao.getUserLock(id);
  if(userAddress.address) {
    throw new Error('该用户已绑定地址');
  }
  // 检查验证码是否正确
  let bindCode = await mqBindAddressDao.queryCode(id);
  if (!bindCode || bindCode.code !== code) {
    throw new Error('验证码错误');
  }
  const t = await sequelize.transaction();
  try {
    // 更新用户地址
    await userDao.updateUserAddress(id, address, t);
    // 更新用户绑定的地址状态
    await mqBindAddressDao.updateStatus(id, 1, t);
    // 提交事务
    await t.commit();
  } catch (e) {
    console.log(e, '更新用户地址失败');
    await t.rollback();
    throw new Error('更新用户地址失败');
  }
  res.json(httpResult.success({result: true}));
};

// 获取用户总数和释放总量和税收总量
export const getTotalData = async (req, res) => {
  let data = getTotalDataInfo();
  // console.log(data)
  res.json(httpResult.success({
    result: true,
    data: data
  }));
};

// 获取当前基础算力
export async function getBaseData(id) {
  let userNow = await userNowDao.getLock(id);
  if (!userNow || userNow.nexttime < Date.now()) {
    // 不在挖矿中
    let baseData = await mintRateDao.getMintRate();
    return baseData.cur_mint_rate;
  }
  return userNow.base_mint_rate;

}

// 获取用户数据
export async function getUserData(id) {
  let userData = await userDao.getUserLock(id);
  if (!userData) {
    throw new Error('用户不存在');
  }
  let userNow = await userNowDao.getLock(id);
  if (userNow) {
    return {...userNow, ...userData};
  }
  return userData;
}

// 获取用户团队速率
export async function getGroupMintRate(id) {
  let userNow = await userNowDao.getLock(id);
  if (!userNow || userNow.nexttime < Date.now()) {
    // 不在挖矿中
    let inviteData = await userNowDao.getInviteOnlineCount(id);
    let baseMintRate = (await mintRateDao.getMintRate()).cur_mint_rate;
    return SafeCalc.mul(SafeCalc.mul(inviteData, config.GROUP_MINT_RATIO), baseMintRate);
  }
  // 挖矿中
  return userNow.group_mint_rate;
}

// 开始挖矿
export async function mint(id) {
  const t = await sequelize.transaction();
  //console.log(`start transaction`, getNow(), `mint-id:${id}`)
  try {
    let startTime = getNow();
    //console.log(`startTime:${startTime}, id:${id}`, `mint-id:${id}`)
    let userNow = await userNowDao.getLock(id, t);// 这里最好锁住这id，防止多次进入增加挖矿总量
    //console.log(`userNow:${JSON.stringify(userNow)}`, Number(userNow.nexttime) >= Date.now(), Number(userNow.nexttime), Date.now(), `mint-id:${id}`)
    if (!userNow || Number(userNow.nexttime) >= Date.now()) {
      errorTip('您正在挖矿中');
      // throw new Error('您正在挖矿中');
    }
    //console.log(userNow.nexttime, Number(userNow.nexttime || 0), userNow.lastsettletime, Number(userNow.lastsettletime || 0), `mint-id:${id}`)
    if (Number(userNow.nexttime || 0) > Number(userNow.lastsettletime || 0)) {
      errorTip('您还未结算');
      // throw new Error('您还未结算');
    }
    // 当前基础算力
    let curMintRate = (await mintRateDao.getCurMintRate()).cur_mint_rate;
    //console.log(`curMintRate:${curMintRate}`, `mint-id:${id}`)
    // 用户当前团队算力
    let groupMintRate = await getGroupMintRate(id);
    //console.log(`groupMintRate:${groupMintRate}`, `mint-id:${id}`)
    let nexttime = getNow() + ONEDAY;
    //console.log(`nexttime:${nexttime}`, `mint-id:${id}`);
    // 获取团队在线人
    let inviteUsers = await userNowDao.getInviteOnline(id);
    //console.log(`inviteUsers:${JSON.stringify(inviteUsers)}`, `mint-id:${id}`)
    // 从inviterUsers数组中获取id
    let inviteUserIds = inviteUsers.map(item => item.id);
    //console.log(`inviteUserIds:${JSON.stringify(inviteUserIds)}`, `mint-id:${id}`)
    // 判断这个用户是否添加了在团队在线数据中，如果不在就创建
    for (let i = 0; i < inviteUserIds.length; i++) {
      //console.log(`inviteUserIds[i]:${inviteUserIds[i]}`, `mint-id:${id}`)
      let userOnline = await userOnlineDao.getUserInviteeOnline(id, inviteUserIds[i], t);
      if (!userOnline) {
        // 添加在线用户
        //console.log(`add userOnline`, `mint-id:${id}`)
        await userOnlineDao.create(id, inviteUserIds[i], 1, t);
      }
    }
    // 更新用户挖矿的团队在线用户
    //console.log(`update userOnline`, id, inviteUserIds, `mint-id:${id}`)
    await userOnlineDao.updateUserOnline(id, inviteUserIds, 1, t);
    // 更新挖矿数据
    //console.log(`update userMint`, id, nexttime, curMintRate, groupMintRate, `mint-id:${id}`)
    await userNowDao.updateMintData(id, nexttime, curMintRate, groupMintRate, t);
    // 结算挖矿总量
    console.log(`updateMintTotal`, id, SafeCalc.add(curMintRate, groupMintRate), `mint-id:${id}`);
    await updateMintTotal(id, SafeCalc.add(curMintRate, groupMintRate), t);
    await t.commit();
    console.log(`settle success`, `开启挖矿时间：${getNow() - startTime}`, `mint-id:${id}`);
    return {
      nexttime,
      baseMintRate: curMintRate,
      groupMintRate,
      result: true
    };
  } catch (e) {
    await t.rollback();
    // console.log(e, '开启挖矿失败');
    errorHandle(e, `开启挖矿失败`);
    // throw new Error('开启挖矿失败');
  }
}

// 结算挖矿
export async function settle(id) {
  const startTime = getNow();
  const t = await sequelize.transaction();
  try {
    let userNow = await userNowDao.getLock(id, t);
    let createtime = getNow();
    if (
      !userNow ||
      (Number(userNow.nexttime || 0) >= createtime) ||
      (Number(userNow.lastsettletime || 0) >= Number(userNow.nexttime)) ||
      (Number(userNow.lastsettletime || 0) + (config.PER_MINT_TIME - 1) * 60 * 60 * 1000 >= createtime) // 上次结算时间距离现在不到23小时
    ) {
      errorTip('您正在挖矿中');
    }
    // 计算税收 增加余额
    let totalRate = SafeCalc.add(userNow.base_mint_rate, userNow.group_mint_rate);
    let total = SafeCalc.mul(totalRate, config.PER_MINT_TIME);
    let tax = await getTax(total);
    let user = await userDao.getUserLock(id, t);
    // 获取用户挖矿在线团队
    let userOnlineList = await userOnlineDao.getUserOnline(id, t);
    // 添加用户挖矿团队贡献余额
    for (let userOnline of userOnlineList) {
      // 获取用户贡献数据并且锁定
      await userContributeDao.getLock(userOnline.invitee_id, t);
      let userHelpMintRate = SafeCalc.mul(userNow.base_mint_rate, 0.1);
      let userHelpContribute = SafeCalc.mul(userHelpMintRate, config.PER_MINT_TIME);
      // 更新或者创建用户贡献记录 并且增加用户贡献账单
      await addUserContribution(userOnline.invitee_id, userHelpContribute, id, t);
    }
    // 更新用户上次结算的时间
    await userNowDao.updateLastsettletime(id, createtime, t);
    // 税收 增加余额
    let getCoin = SafeCalc.sub(total, tax);
    let userBalance = SafeCalc.add(user.balance || 0, getCoin);
    let userTax = SafeCalc.add(user.tax || 0, tax);
    await userDao.updateUserBalanceAndTax(id, userBalance, userTax, t);
    // 添加钱包交易记录
    await addBillForMERC_Sys(user.id, createtime, earningTypes.MINT, getCoin, tax, t);
    // 记录收益账单
    await userEarningsDao.add(user.id, earningTypes.MINT, getCoin, tax, createtime, t);
    // 删除用户挖矿在线团队
    await userOnlineDao.closeUserInviteeOnline(user.id, t);
    await t.commit();
    console.log(`用户:${id} 结算挖矿成功：${getNow() - startTime}`);
    return {
      result: true,
      balance: userBalance,
    };
  } catch (e) {
    await t.rollback();
    // console.log(e, '结算挖矿失败');
    errorHandle(e, '结算挖矿失败');
  }
}

// 更新挖矿总量和挖矿基础速率 并且锁住总量这个数据库
export async function updateMintTotal(id, totalRate, t) {
  let mintTotal = SafeCalc.mul(totalRate, config.PER_MINT_TIME);
  await addMintTotal(mintTotal, t);
}

// 计算税收
export async function getTax(total) {
  let taxTableNow = await taxTableDao.getAll();
  // console.log(taxTableNow, 'taxTableNow');
  let tax = "0";
  for (let i = taxTableNow.length - 1; i >= 1; i--) {
    if (total >= (Number(taxTableNow[i - 1].mint_output) || 0)) {
      let curRateCoin = SafeCalc.sub(total, Number(taxTableNow[i - 1].mint_output));
      // console.log(total)
      total = SafeCalc.sub(total, curRateCoin);
      let taxTemp = SafeCalc.mul(curRateCoin, taxTableNow[i].tax_ratio);
      // console.log(taxTemp, 'taxTemp');
      tax = SafeCalc.add(tax, taxTemp);
    }
  }
  tax = SafeCalc.div(tax, 100, 2);
  // console.log(tax)
  return tax;
}

