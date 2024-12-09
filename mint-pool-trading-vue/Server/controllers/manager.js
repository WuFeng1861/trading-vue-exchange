import {fixMintTotal, fixTransferRecord, fixUserContributionBill, fixUserUnlock} from "./utils.js";
import {httpResult} from "../utils/utils.js";
import userDao from "../Dao/user.js";
import userNowDao from "../Dao/userNow.js";
import sequelize from "../models/init.js";
import {getTotalDataInfo} from "../timerGlobalData/totalData.js";

// 修复总量
export const updateTotal = async (req, res) => {
  console.log('开始更新总量...');
  checkManager(req);
  let total = 0;
  const t = await sequelize.transaction();
  try {
    total = await fixMintTotal(t);
    await t.commit();
  } catch (e) {
    console.log(e);
    await t.rollback();
  }
  console.log('更新总量完成...', total);
  res.json(httpResult.success({
    result: true,
    total: total
  }));
};
// 修复贡献数据
export const updateContribution = async (req, res) => {
  console.log('开始更新贡献数据...');
  checkManager(req);
  let total = 0;
  const t = await sequelize.transaction();
  try {
    total = await fixUserContributionBill(t);
    await t.commit();
  } catch (e) {
    console.log(e);
    await t.rollback();
  }
  console.log('更新贡献数据完成...');
  res.json(httpResult.success({
    result: true,
    total: total
  }));
};
// 修复贡献数据
export const updateUserUnlock = async (req, res) => {
  console.log('开始更新用户未锁定币数据...');
  checkManager(req);
  let total = 0;
  const t = await sequelize.transaction();
  try {
    total = await fixUserUnlock(t);
    await t.commit();
  } catch (e) {
    console.log(e);
    await t.rollback();
  }
  console.log('更新用户未锁定币数据完成...', total);
  res.json(httpResult.success({
    result: true,
    total: total
  }));
};

// 修复新交易记录
export const updateTransferRecord = async (req, res) => {
  console.log('开始更新交易记录数据...');
  checkManager(req);
  let total = 0;
  const t = await sequelize.transaction();
  try {
    total = await fixTransferRecord(t);
    await t.commit();
  } catch (e) {
    console.log(e);
    await t.rollback();
  }
  console.log('更新交易记录数据完成...', total);
  res.json(httpResult.success({
    result: true,
    total: total
  }));
};

// 获取总用户数
export const getTotalUser = async (req, res) => {
  console.log('开始获取总用户数...');
  checkManager(req);
  const total = getTotalDataInfo();
  console.log('获取总用户数完成...', total);
  res.json(httpResult.success({
    result: true,
    total: total.userCount
  }));
  return total;
};

// 获取用户三代邀请人数
export const getUserInviteCount = async (req, res) => {
  console.log('开始获取用户三代邀请人数...');
  checkManager(req);
  const {username, email} = req.query;
  if (!username && !email) {
    throw new Error('参数错误');
  }
  let user = await userDao.getUserLockByEmailOrName(username, email);
  let inviteNumber_1 = await userNowDao.getInviteCount(user.id);
  let userList_1 = await userNowDao.getInviteList(user.id);
  userList_1 = userList_1.map(it => it.id);
  let inviterNumber_2 = await userNowDao.getUsersInviteCount(userList_1);
  let userList_2 = (await userNowDao.getUsersInviteList(userList_1)).map(it => it.id);
  let inviterNumber_3 = await userNowDao.getUsersInviteCount(userList_2);
  let total = inviteNumber_1 + inviterNumber_2 + inviterNumber_3;
  console.log('获取用户三代邀请人数完成...', user.username, user.email);
  res.json(httpResult.success({
    result: true,
    total: total,
    inviteNumber_1,
    inviterNumber_2,
    inviterNumber_3
  }));
  return total;
};

const checkManager = (req) => {
  let managerList = ["WuFeng1998", "MercuryGroup"];
  let {manager} = req.query;
  console.log('manager:', manager);
  if (!managerList.includes(manager)) {
    throw new Error('无权限执行');
  }
};
