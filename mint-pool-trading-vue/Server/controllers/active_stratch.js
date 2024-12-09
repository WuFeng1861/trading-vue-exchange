import {addBillForETH_Sys, addBillForMERC_Sys, addMintTotal, queryCheckId} from "./utils.js";
import activeStratchDao from "../Dao/activeStratch.js";
import {errorHandle, errorTip, getNow, getTodayZero, httpResult, randomNum, sleep} from "../utils/utils.js";
import sequelize from "../models/init.js";
import userDao from "../Dao/user.js";
import SafeCalc from "../utils/bignumberjs.js";
import userEarningsDao from "../Dao/userEarnings.js";
import {earningTypes, ethBillTypes} from "../types/index.js";
import {config} from "../config/index.js";
import userEthDao from "../Dao/userEth.js";
import userEthBillDao from "../Dao/userEthBill.js";
import contractHeightDao from "../Dao/contractHeight.js";

export const getStratchReward = async (req, res) => {
  let {id} = req.body;
  queryCheckId(id);
  // 判断用户今天是否获取过
  const userStratch = await activeStratchDao.get(id);
  if (userStratch && Number(userStratch.finish) === 1) {
    throw new Error("已经达到开启上限");
  }
  const getCoin = randomNum(500, 2500);
  const t = await sequelize.transaction();
  try {
    let user = await userDao.getUserLock(id, t);
    // 判断eth数量是否足够
    let user_eth = await userEthDao.findLock(id, t);
    if (!user_eth || SafeCalc.compare(user_eth.amount, config.OPEN_BOX_FEE) === '-1') {
      errorTip('余额不足');
    }
    let createtime = getNow();
    // 添加钱包交易记录ETH
    await addBillForETH_Sys(id, createtime, ethBillTypes.BLINDBOX_CONSUME, SafeCalc.mul(-1, config.OPEN_BOX_FEE), null, t);
    // 添加钱包交易记录MERC
    await addBillForMERC_Sys(id, createtime, earningTypes.SCRATCH, getCoin, 0, t);
    // 减少eth
    await userEthDao.update(id, SafeCalc.sub(user_eth.amount, config.OPEN_BOX_FEE), t);
    // 记录eth账单
    await userEthBillDao.create(user.id, -1 * config.OPEN_BOX_FEE, ethBillTypes.BLINDBOX_CONSUME, null, createtime, t);
    // 增加余额
    let userBalance = SafeCalc.add(user.balance || 0, getCoin);
    await userDao.updateUserBalance(id, userBalance, t);
    // 增加可用余额
    let userUnlockBalance = SafeCalc.add(user.unlock_balance || 0, getCoin);
    await userDao.updateUserUnlockBalance(id, userUnlockBalance, t); ``;
    // 记录账单
    await userEarningsDao.add(user.id, earningTypes.SCRATCH, getCoin, 0, createtime, t);
    // 更新开盲盒数据
    if (!userStratch) {
      await activeStratchDao.add(id, 0, 1, t);
    } else {
      console.log(userStratch.times, config.OPEN_BOX_TIMES);
      await activeStratchDao.update(id, (userStratch.times + 1) >= config.OPEN_BOX_TIMES ? 1 : 0, userStratch.times + 1, t);
    }
    // 更新总产出
    await addMintTotal(getCoin, t);
    await t.commit();
  } catch (e) {
    // console.log(e)
    await t.rollback();
    errorHandle(e, '领取邀请奖励失败');
  }
  res.json(httpResult.success({result: true, coin: getCoin}));
};
