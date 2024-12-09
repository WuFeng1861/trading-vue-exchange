import {errorHandle, errorTip, getNow, httpResult} from "../utils/utils.js";
import sequelize from "../models/init.js";
import userDao from "../Dao/user.js";
import SafeCalc from "../utils/bignumberjs.js";
import userEarningsDao from "../Dao/userEarnings.js";
import {earningTypes, ethBillTypes} from "../types/index.js";
import {
  addBillForETH_Transfer,
  addBillForMERC_Transfer,
  getUserDataByEmailOrUsernameOrAddress,
  getUserDataByEmailOrUsernameOrAddressLock,
  queryCheckTransferId
} from "./utils.js";
import userEthDao from "../Dao/userEth.js";
import userEthBillDao from "../Dao/userEthBill.js";
import transferRecordDao from "../Dao/transferReocrd.js";

// todo 后续考虑添加转账hash 防止重入问题这样处理更为方便 或者叫做订单号
export async function transfer_Merc(fromId, amount, username, email, address) {
  // 判断转账金额是否大于0
  if (SafeCalc.compare(amount, 0) !== '1') {
    throw new Error('转账金额必须大于0');
  }
  if (!username && !email && !address) {
    throw new Error('请输入正确转账对象');
  }
  let balance = null;
  const t = await sequelize.transaction();
  try {
    // 获取转账接受人
    let userTo = await getUserDataByEmailOrUsernameOrAddressLock(email, username, address, t);
    if (!userTo) {
      errorTip('转账对象不存在');
    }
    // 获取转账人信息
    let userFrom = await userDao.getUserLock(fromId, t);
    if (!userFrom) {
      errorTip('转账用户不存在');
    }
    // 判断转账者和被转帐者是否是同一个人
    if (userFrom.id === userTo.id) {
      errorTip('不能转账给自己');
    }
    // 判断转账人的余额是否足够
    if (SafeCalc.compare(userFrom.balance, amount) === '-1') {
      errorTip('余额不足');
    }
    // 判断转账人是否有足够的余额
    if (SafeCalc.compare((userFrom.unlock_balance || 0), amount) === '-1') {
      errorTip('余额不足');
    }
    // 执行转账操作
    // 增加钱包交易记录
    let createtime = getNow();
    await addBillForMERC_Transfer(userFrom.id, userTo.id, createtime, amount, t);

    // 减少转账人的余额
    const newBalanceFrom = SafeCalc.sub(userFrom.balance, amount);
    balance = newBalanceFrom;
    await userDao.updateUserBalance(fromId, newBalanceFrom, t);
    // 减少转账人的可用余额
    const newUnlockBalanceFrom = SafeCalc.sub((userFrom.unlock_balance || 0), amount);
    await userDao.updateUserUnlockBalance(fromId, newUnlockBalanceFrom, t);
    // 增加转账人的账单
    await userEarningsDao.add(userFrom.id, earningTypes.TRANSFER_OUT, SafeCalc.mul(-1, amount), 0, createtime, t);

    // 增加接收人的余额
    const newBalanceTo = SafeCalc.add(userTo.balance || 0, amount);
    await userDao.updateUserBalanceAndTax(userTo.id, newBalanceTo, 0, t);
    // 增加接收人的可用余额
    const newUnlockBalanceTo = SafeCalc.add(userTo.unlock_balance || 0, amount);
    await userDao.updateUserUnlockBalance(userTo.id, newUnlockBalanceTo, t);
    // 增加接收人的账单
    await userEarningsDao.add(userTo.id, earningTypes.TRANSFER_IN, amount, 0, createtime, t);
    // 提交事务
    await t.commit();
    return true;
  } catch (e) {
    await t.rollback();
    errorHandle(e, '转账失败');
    return false;
  }
}

export async function transfer_ETH(fromId, amount, username, email, address) {
  // 判断转账金额 > 0
  if (SafeCalc.compare(amount, 0) !== '1') {
    throw new Error('转账金额必须大于0');
  }
  // 判断接收人信息不能全部为空
  if (!username && !email && !address) {
    throw new Error('请输入正确转账对象');
  }
  // 开启一个事务
  const t = await sequelize.transaction();
  try {
    // 获取接收人用户ETH数据并锁住
    let userToId = (await getUserDataByEmailOrUsernameOrAddress(email, username, address, t))?.id;
    if (!userToId) {
      errorTip('转账对象不存在');
    }
    let userToEth = await userEthDao.findLock(userToId, t);
    // 获取转账人用户ETH数据并锁住
    let userFromEth = await userEthDao.findLock(fromId, t);
    // 判断转账人和接收人是否是同一个人
    if (userFromEth.userId === userToId) {
      errorTip('不能转账给自己');
    }
    // 判断转账人的余额是否足够
    if (SafeCalc.compare(userFromEth.amount, amount) === '-1') {
      errorTip('余额不足');
    }
    let createtime = getNow();
    // 增加钱包交易记录
    await addBillForETH_Transfer(fromId, userToId, createtime, amount, t);
    // 减少转账人的余额
    let newBalanceFrom = SafeCalc.sub(userFromEth.amount, amount);
    await userEthDao.update(fromId, newBalanceFrom, t);
    // 增加转账人的账单
    await userEthBillDao.create(fromId, SafeCalc.mul('-1', amount), ethBillTypes.TRANSFER_OUT, null, createtime, t);
    // 判断接收人是否存在，增加接收人的余额
    if (!userToEth) {
      // 创建接收人用户ETH数据
      await userEthDao.create(userToId, amount, t);
    } else {
      // 增加接收人的余额
      let newBalanceTo = SafeCalc.add(userToEth.amount, amount);
      await userEthDao.update(userToId, newBalanceTo, t);
    }
    // 增加接收人的账单
    await userEthBillDao.create(userToId, amount, ethBillTypes.TRANSFER_IN, null, createtime, t);
    // 提交事务
    await t.commit();
    return true;
  } catch (e) {
    // 错误处理
    await t.rollback();
    errorHandle(e, '转账失败');
    return false;
  }
}

// 获取MERC的交易记录
export async function getTransferRecords_Merc(id, startId, pageSize){
  console.log('getTransferRecords_Merc', id, startId, pageSize);
  const coinName = 'MERC';
  let user = await userDao.getUserLock(id);
  if(!user.address) {
    throw new Error('请先绑定地址');
  }
  let list = await transferRecordDao.queryByUser(user.address, coinName, startId, pageSize);
  return list;
}
// 获取ETH的交易记录
export async function getTransferRecords_ETH(id, startId, pageSize) {
  let start = getNow();
  const coinName = 'BNB';
  let user = await userDao.getUserLock(id);
  if (!user.address) {
    throw new Error('请先绑定地址');
  }
  let list = await transferRecordDao.queryByUser(user.address, coinName, startId, pageSize);
  console.log('spend time : ' + (getNow() - start));
  // console.log(list.length, list.map(it => it.id), 'getTransferRecords_ETH');
  return list;
}

// 获取MERC的交易记录数
export async function getTransferRecordsCount_Merc(id) {
  const coinName = 'MERC';
  let user = await userDao.getUserLock(id);
  if (!user.address) {
    throw new Error('请先绑定地址');
  }
  let count = await transferRecordDao.queryCountByUser(user.address, coinName);
  return count;
}
// 获取ETH的交易记录数
export async function getTransferRecordsCount_ETH(id) {
  const coinName = 'BNB';
  let user = await userDao.getUserLock(id);
  if (!user.address) {
    throw new Error('请先绑定地址');
  }
  let count = await transferRecordDao.queryCountByUser(user.address, coinName);
  return count;
}


export const transfer = async (req, res) => {
  // 获取请求参数
  const {fromId, username, email, amount, address} = req.body;
  // 判断转账者是否是同一个人
  queryCheckTransferId(req, fromId);
  await transfer_Merc(fromId, amount, username, email, address);
  // 返回转账结果
  res.json(httpResult.success({result: true}));
};
