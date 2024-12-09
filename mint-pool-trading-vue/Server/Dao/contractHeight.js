import db from "../models/index.js";

let contractHeight = db.contractHeight;
let contractHeightDao = {};

// 添加合约高度记录
contractHeightDao.create = async (height, t) => {
  return contractHeight.create({
    height
  }, {transaction: t});
};

// 查询合约高度
contractHeightDao.findLock = async (t) => {
  return contractHeight.findOne({
    raw: true,
    transaction: t,
    lock: 'UPDATE'
  });
};
// 更新合约高度
contractHeightDao.update = async (height, t) => {
  return contractHeight.update({
    height,
  }, {
    where: {},
    transaction: t
  });
};

export default contractHeightDao;

