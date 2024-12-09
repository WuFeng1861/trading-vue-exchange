import db from "../models/index.js";
import {clearObject} from "../utils/utils.js";

let chainLog = db.chainLog;
let chainLogDao = {};

// 添加链上数据记录
chainLogDao.create = async (user_id, hash, amount, income, address, height, t) => {
  return chainLog.create({
    user_id, hash, amount, income, address, height
  }, {transaction: t});
};

// 获取用户的链上数据记录 根据用户id或者地址
chainLogDao.getByUserIdOrAddress = async (user_id, address) => {
  return chainLog.findAll({
    where: clearObject({user_id, address}),
    raw: true
  });
};

// 获取用户的链上数据记录 根据hash
chainLogDao.getByHash = async (hash) => {
  return chainLog.findOne({
    where: {hash},
    raw: true
  });
};

export default chainLogDao;

