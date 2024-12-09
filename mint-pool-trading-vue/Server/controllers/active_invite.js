import userNowDao from "../Dao/userNow.js";
import activeInviteDao from "../Dao/activeInvite.js";
import sequelize from "../models/init.js";
import userDao from "../Dao/user.js";
import SafeCalc from "../utils/bignumberjs.js";
import userEarningsDao from "../Dao/userEarnings.js";
import {getNow, httpResult} from "../utils/utils.js";
import {addBillForMERC_Sys, addMintTotal, queryCheckId} from "./utils.js";
import {earningTypes} from "../types/index.js";

export const getInviteReward = async (req, res) => {
  let {id, step} = req.body;
  queryCheckId(id);
  step = Number(step);
  if (step <= 0) {
    throw new Error('参数错误');
  }
  // 邀请条件
  let stepNeed = [10, 20, 50, 100];
  let stepReward = [1000, 2000, 5000, 10000];
  if (step > stepNeed.length) {
    throw new Error('参数错误');
  }
  let result = await userNowDao.getInviteCount(id);
  // 判断邀请人数
  if (stepNeed[step - 1] > result + 3) {
    throw new Error('邀请人数不足');
  }
  const getCoin = stepReward[step - 1];
  // 给用户发送奖励并且修改用户领奖阶段
  const t = await sequelize.transaction();
  try {
    let user = await userDao.getUserLock(id, t);
    // 查询用户是否已经领取过奖励
    await checkUserGet(id, step);
    let createtime = getNow();
    // 添加钱包交易记录
    await addBillForMERC_Sys(user.id, createtime, earningTypes.INVITE, getCoin, 0, t);
    // 增加余额
    let userBalance = SafeCalc.add(user.balance || 0, getCoin);
    await userDao.updateUserBalance(id, userBalance, t);
    // 记录账单
    await userEarningsDao.add(user.id, earningTypes.INVITE, getCoin, 0, createtime, t);
    // 更新总产出
    await addMintTotal(getCoin, t);
    // 修改用户领奖阶段
    await updateUserInvitedActiveStep(id, step, t);
    await t.commit();
  } catch (e) {
    console.log(e);
    await t.rollback();
    throw new Error('领取邀请奖励失败');
  }
  res.json(httpResult.success({result: true}));
};


async function checkUserGet(id, step) {
  let result = await activeInviteDao.getUserActiveInvite(id);
  if (result && result.invite_step >= step) {
    throw new Error('已经领取过奖励');
  }
  if (!result) {
    return;
  }
  if (result && result.invite_step < (step - 1)) {
    throw new Error('请先领取上一级奖励');
  }
}

function updateUserInvitedActiveStep(id, step, t) {
  if (step === 1) {
    // 创建新的用户领奖数据
    return activeInviteDao.add(id, step, t);
  }
  // 更新用户领奖阶段
  return activeInviteDao.update(id, step, t);

}
