import sequelize from "../models/init.js";
import mintRateDao from "../Dao/mintRate.js";
import SafeCalc from "../utils/bignumberjs.js";
import rateTableDao from "../Dao/rateTable.js";
import {Transaction} from "sequelize";
import userEarningsDao from "../Dao/userEarnings.js";
import userDao from "../Dao/user.js";
import {EthersHelper} from "../utils/ethersHelper.js";
import {config} from "../config/index.js";
import userNowDao from "../Dao/userNow.js";
import userContributeDao from "../Dao/userContribute.js";
import userContributeBillDao from "../Dao/userContributeBill.js";
import {earningTypes, ethBillTypes, userContributeTypes} from "../types/index.js";
import userEthDao from "../Dao/userEth.js";
import userEthBillDao from "../Dao/userEthBill.js";
import {errorTip, sha256} from "../utils/utils.js";
import transferRecordDao from "../Dao/transferReocrd.js";
import {LRUCache} from "../utils/utilClass/LRUCache.js";
// 检查id是否为空 并且报错
export function queryCheckId(id) {
  if (!id) {
    throw new Error('id is required');
  }
}
// 判断page和pageSize
export function queryCheckPage(page, pageSize) {
  if(page < 1) {
    errorTip('page不能小于1');
  }
  if(!pageSize) {
    pageSize = 10;
  }
  return pageSize;
}

// 检查签名地址是不是该用户的地址
export async function checkSignAddress(id, signRes) {
  if (!signRes) {
    throw new Error('请先进行签名');
  }
  // 根据id获取用户地址
  let user = await getUserData(id);
  if (!user || !user.address) {
    throw new Error('签名地址与用户地址不匹配');
  }
  // 解析出签名地址
  let address = EthersHelper.getAddressFromSignature(config.SIGN_WORD, signRes);
  // 如果不匹配直接报错
  if (address.toUpperCase() !== user.address.toUpperCase()) {
    throw new Error('签名地址与用户地址不匹配');
  }
}

// 验证签名是否是该地址的
export function checkSignAddressByAddress(word, address, signRes) {
  if (!signRes) {
    throw new Error('请先进行签名');
  }
  // 解析出签名地址
  let signAddress = EthersHelper.getAddressFromSignature(word, signRes);
  // 如果不匹配直接报错
  if (signAddress.toUpperCase() !== address.toUpperCase()) {
    throw new Error('签名地址与用户地址不匹配');
  }
  return true;
}

// 检查发起人是该用户
export function queryCheckTransferId(req, id) {
  let user_id = req.headers['authorization'].split(" ")[2];
  if (user_id.toString() !== id.toString()) {
    throw new Error('用户不匹配');
  }
}

// 检查用户密码
export function queryCheckPassword(id, password) {
  if (!password) {
    throw new Error('密码不能为空');
  }
  let user = userNowDao.getUserLock(id);
  if (!user || !user.password) {
    throw new Error('用户不存在');
  }
  if (user.password !== password) {
    throw new Error('密码错误');
  }
}

// 获取用户数据
export async function getUserData(id) {
  let userData = await userDao.getUserLock(id);
  if (!userData) {
    throw new Error('用户不存在');
  }
  return userData;
}

// 获取用户数据通过邮箱、用户名、地址中的一个
export async function getUserDataByEmailOrUsernameOrAddress(email, username, address, t) {
  if(email) {
    return await userDao.getUserByEmail(email, t);
  }
  if(username) {
    return await userDao.getUserByUserName(username, t);
  }
  if(address) {
    return await userDao.getUserByAddress(address, t);
  }
  throw new Error('参数错误');
}
// 获取用户数据通过邮箱、用户名、地址中的一个
export async function getUserDataByEmailOrUsernameOrAddressLock(email, username, address, t) {
  if(address) {
    return await userDao.getUserByAddressLock(address, t);
  }
  if(email) {
    return await userDao.getUserByEmailLock(email, t);
  }
  if(username) {
    return await userDao.getUserByUserNameLock(username, t);
  }
  throw new Error('参数错误');
}

// 获取用户eth余额
export async function getUserEth(id) {
  let result = {ethBalance: 0};
  let userEthData = await userEthDao.findLock(id);
  if (!userEthData) {
    return result;
  }
  result.ethBalance = userEthData.amount;
  return result;
}

/**
 *  增加挖矿总量和更新挖矿速率
 * @param amount {Number | String}
 * @param t {Transaction}
 * @returns {Promise<void>}
 */
export async function addMintTotal(amount, t) {
  let total = (await mintRateDao.getOutputLock(t)).output;
  let curTotal = SafeCalc.add(total, amount);
  let curMintRate = (await rateTableDao.getMintRate(curTotal)).mint_rate;
  await mintRateDao.updateCurMintRate(curMintRate, curTotal, t);
}

// 新增或者修改用户贡献
export async function addUserContribution(id, amount, inviterId, t) {
  let userContribute = await userContributeDao.getLock(id, t);
  if (!userContribute) {
    // 没有创建过用户贡献数据
    await userContributeDao.create(id, amount, inviterId, t);
  } else {
    let curContribution = SafeCalc.add(userContribute.contribution_value || 0, amount);
    await userContributeDao.update(id, curContribution, t);
  }
  // 记录用户贡献账单
  await userContributeBillDao.create(id, amount, userContributeTypes.miningSpeedUp, inviterId, t);

}

// 修正总产量
export async function fixMintTotal(t) {
  // 锁住产量数据
  let total = (await mintRateDao.getOutputLock(t)).output;
  // 获取所有用户的总余额
  let userTotal = await userDao.getUserBalanceSum(t);
  console.log('userTotal', userTotal);
  // 重新计算产量
  // mysql sum函数 这是获取已经挖矿的产出
  let totalData = await userEarningsDao.getTotalEarnings(t);
  // 获取所有的税收
  let taxTotal = await userEarningsDao.getTotalTax(t);
  // 获取正在挖矿的产出
  // 1. 锁定userNow这个表 获取userNowDao中正在挖矿的用户和对应的速率
  let userNowList = await userNowDao.getAllUserOnlineLock(t);
  // 2. 计算出对应的产出
  let onlineTotal = 0;
  for (let i = 0; i < userNowList.length; i++) {
    let userNowItem = userNowList[i];
    let rateAll = SafeCalc.add(userNowItem.base_mint_rate, userNowItem.group_mint_rate);
    // 这里不用计算税收因为税收也要算在总产出中
    onlineTotal = SafeCalc.add(onlineTotal, SafeCalc.mul(rateAll, config.PER_MINT_TIME));
  }
  // 3.计算总产出
  console.log("totalData：", totalData);
  console.log("onlineTotal: ", onlineTotal);
  console.log('taxTotal', taxTotal);
  totalData = SafeCalc.add(totalData, taxTotal);
  totalData = SafeCalc.add(totalData, onlineTotal);
  console.log("fixMintTotal totalData:", totalData);
  // 获取产量对应的挖矿速率
  let curMintRate = (await rateTableDao.getMintRate(totalData)).mint_rate;
  console.log("fixMintTotal curMintRate:", curMintRate);
  // 更新产量和挖矿速率
  // await mintRateDao.updateCurMintRate(curMintRate, totalData, t);
  return totalData;
}

// 修复用户贡献账单
export async function fixUserContributionBill(t) {
  let result = await userContributeBillDao.getAllUserContribute(t);
  for (let i = 0; i < result.length; i++) {
    let item = result[i];
    let userContribute = await userContributeDao.getLock(item.user_id, t);
    if (!userContribute) {
      // 获取用户邀请者的id
      let user = await userDao.getUserLock(item.user_id);
      // 不存在则创建
      await userContributeDao.create(item.user_id, item.contribute_value, user.inviter_id, t);
    }
    // 存在则更新
    await userContributeDao.update(item.user_id, item.contribute_value, t);
  }
  return result;
}

// 修复用户可使用的币量（解锁）
// 盲盒开启的币量
// 转账
export async function fixUserUnlock(id, t) {
  // 先锁住整张user表，防止进行入币/出币
  await sequelize.query('LOCK TABLES `user` WRITE, `user_earnings` WRITE', {transaction: t});
  // 获取earnings中的解锁币量根据userid分类
  let usersUnlock = await userEarningsDao.getAllUserUnlock([earningTypes.TRANSFER_OUT, earningTypes.TRANSFER_IN, earningTypes.SCRATCH], t);
  // 更新user的可使用币量
  for (let i = 0; i < usersUnlock.length; i++) {
    let item = usersUnlock[i];
    await userDao.updateUserUnlockBalance(item.user_id, item.earnings_sum, t);
  }
  // 完成所有操作 解锁表
  await sequelize.query('UNLOCK TABLES', {transaction: t});
  return usersUnlock;
}

// 修复用户的账单 从user_earnings和user_eth_bill中获取
export async function fixTransferRecord(t) {
  let count = 0;
  // 获取user_earnings的总条数
  let countUserEarnings = await userEarningsDao.getCount(t);
  // 循环获取user_earnings表的1000条数据

  for (let lastId = 0; ; ) {
    let earnings = await userEarningsDao.getPaginationWithId(lastId, 1000, t);
    // 每一条生成对应的数据填入transfer_record表中
    for (let j = 0; j < earnings.length; j++) {
      let item = earnings[j];
      lastId = item.id;
      await addBillForMERC_Sys(item.user_id, item.createtime, item.type, item.earnings, item.tax, t);
      count++;
    }
    // 小于1000说明到达最后一条break
    if (earnings.length < 1000) {
      break;
    }
  }
  // 获取user_eth_bill的总条数
  let countUserEthBill = await userEthBillDao.getCount(t);
  // 循环获取user_eth_bill表的1000条数据
  for (let lastId = 0; ; ) {
    let ethBills = await userEthBillDao.findByPageWithId(lastId, 1000, t);
    // 每一条生成对应的数据填入transfer_record表中
    for (let j = 0; j < ethBills.length; j++) {
      let item = ethBills[j];
      lastId = item.id;
      // console.log('id:', item.id);
      await addBillForETH_Sys(item.user_id, item.created_at, item.type, item.amount, item.chain_hash, t);
      count++;
    }
    // 到达最后一条break
    if (ethBills.length < 1000) {
      break;
    }
  }
  return count;
}

// MERC币添加账单
let userAddressCache = new LRUCache(10000);
const getAddressFromCache = async (id) => {
  if (userAddressCache.has(id)) {
    return userAddressCache.get(id);
  }
  let address = (await userDao.getUserAddress(id)).address;
  if(!address) {
    return "";
  }
  userAddressCache.set(id, address);
  return address;
};
export async function addBillForMERC_Sys(user_id, createtime, type, earnings, tax, t) {
  const coinName = "MERC";
  // sender""空字符串
  const sender = "";
  // 从user_id 获取address就是receiver
  let receiver = await getAddressFromCache(user_id);
  if(!receiver) {
    // 如果没有获取到receiver的地址，就不记录了
    // console.log(`user_id:${user_id} has no address`);
    return;
  }
  // 然后使用createtime-sender-receiver-type-earnings-tax生成hash
  const hash = sha256(`${createtime}-${sender}-${receiver}-${type}-${earnings}-${tax}`);
  const amount = earnings;
  const create_time = createtime;
  const fee = tax;
  const remark = '';
  // 添加记录
  try {
    await transferRecordDao.create(hash, coinName, type, sender, receiver, amount, create_time, fee, remark, t);
  }catch(e) {
    let hashEqual = await transferRecordDao.queryByHash(hash, t);
    console.log('hashEqual:', JSON.stringify(hashEqual), create_time);
    // throw e;
  }
}
export async function addBillForMERC_Transfer(sender_id, receiver_id, createtime, amount, t) {
  const coinName = "MERC";
  const type = earningTypes.TRANSFER_IN_OUT;
  const tax = 0;
  let sender = await getAddressFromCache(sender_id);
  let receiver = await getAddressFromCache(receiver_id);
  if(!sender || !receiver) {
    errorTip('接收方未绑定钱包地址，暂不允许转账');
  }
  // 然后使用createtime-sender-receiver-type-earnings-tax生成hash
  const hash = sha256(`${createtime}-${sender}-${receiver}-${type}-${amount}-${tax}`);
  // 添加记录
  await transferRecordDao.create(hash, coinName, type, sender, receiver, amount, createtime, tax, '', t);
}
// todo 直接添加user_earnings和transfer_reocrd账单
export async function createBillMerc_Sys(){}
export async function createBillMerc_Transfer(){}
// BNB添加账单
export async function addBillForETH_Sys(user_id, created_at, type, amount, chain_hash, t) {
  const coinName = "BNB";
  // sender""空字符串
  let sender = "";
  // 从user_id 获取address就是receiver
  let receiver = await getAddressFromCache(user_id);
  if(!receiver) {
    // 如果没有获取到receiver的地址，就不记录了
    // console.log(`user_id:${user_id} has no address`);
    return;
  }
  // 然后使用created_at-sender-receiver-type-amount-chain_hash生成hash
  const hash = sha256(`${created_at}-${sender}-${receiver}-${type}-${Math.abs(Number(amount))}-${chain_hash}`);
  if(hash === '8edb025819edf1e13b68cbcd6f9bb147f3c1889d84eae5966f3400422f719697') {
    console.warn('hash:', `${created_at}-${sender}-${receiver}-${type}-${Math.abs(Number(amount))}-${chain_hash}`);
  }
  const create_time = created_at;
  const fee = 0;
  const remark = '';
  // 添加记录
  if(Number(amount) < 0) {
    sender = receiver;
    receiver = "";
  }
  // console.log('receiver:', receiver);
  // console.log('sender:', sender);
  try {
    await transferRecordDao.create(hash, coinName, type, sender, receiver, Math.abs(Number(amount)), create_time, fee, remark, t);
  }catch(e) {
    let hashEqual = await transferRecordDao.queryByHash(hash, t);
    console.log('hashEqual:', JSON.stringify(hashEqual), create_time);
    // throw e;
  }
}
export async function addBillForETH_Transfer(sender_id, receiver_id, createtime, amount, t) {
  const coinName = "BNB";
  // 从sender_id 获取address就是sender
  let sender = await getAddressFromCache(sender_id);
  let receiver = await getAddressFromCache(receiver_id);
  if(!sender || !receiver) {
    errorTip('接收方未绑定钱包地址，暂不允许转账');
  }
  const chain_hash = '';
  const type = ethBillTypes.TRANSFER_IN_OUT;
  const hash = sha256(`${createtime}-${sender}-${receiver}-${type}-${amount}-${chain_hash}`);
  const create_time = createtime;
  const fee = 0;
  const remark = '';
  // 添加记录
  await transferRecordDao.create(hash, coinName, type, sender, receiver, amount, create_time, fee, remark, t);
}
// todo 直接添加user_eth_bill和transfer_record账单
export async function createBillETH_Sys(){}
export async function createBillETH_Transfer(){}

