import db from "../models/index.js";

let mintRate = db.mintRate;
let mintRateDao = {};

// 添加挖矿算力数据
mintRateDao.add = (total, output, cur_mint_rate) => {
  return mintRate.create({
    total, output, cur_mint_rate
  });
};

// 获取当前挖矿算力数据
mintRateDao.getCurMintRate = async () => {
  return mintRate.findOne({
    attributes: ["cur_mint_rate"],
    raw: true,
    where: {}
  });
};

// 获取所有挖矿总产量 锁
mintRateDao.getOutputLock = async (t) => {
  if(!t) {
    return mintRate.findOne({
      attributes: ["output"],
      raw: true,
      where: {}
    });
  }
  return mintRate.findOne({
    attributes: ["output"],
    raw: true,
    where: {},
    lock: 'UPDATE',
    transaction: t
  });
};

// 获取所有挖矿总量
mintRateDao.getTotal = async () => {
  return mintRate.findOne({
    attributes: ["total"],
    raw: true,
    where: {}
  });
};

// 获取所有挖矿算力数据
mintRateDao.getMintRate = async () => {
  return mintRate.findOne({
    raw: true,
    where: {}
  });
};

// 更新当前挖矿算力数据
mintRateDao.updateCurMintRate = async (cur_mint_rate, output, t) => {
  if(!t) {
    return mintRate.update({
      cur_mint_rate, output
    }, {
      where: {}
    });
  }
  return mintRate.update({
    cur_mint_rate, output
  }, {
    where: {},
    transaction: t
  });
};

export default mintRateDao;
