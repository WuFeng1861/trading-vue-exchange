import db from "../models/index.js";

let chainTranRecord = db.chainTranRecord;
let chainTranRecordDao = {};

// 添加一个链交易记录
chainTranRecordDao.create = async (hash, height, coin_name, chain_id, to_address, from_address, t) => {
  return chainTranRecord.create({hash, height, coin_name, chain_id, to_address, from_address, finish: 0}, {transaction: t});
};

// 判断链交易记录是否存在
chainTranRecordDao.find = async (hash, chain_id) => {
  return chainTranRecord.findOne({where: {hash, chain_id}, raw: true});
};

// 更新链交易记录的状态 finish=1表示交易完成 finish=0表示交易失败
chainTranRecordDao.updateStatus = async (hash, chain_id, finish, t) => {
  return chainTranRecord.update({finish}, {where: {hash, chain_id}, transaction: t});
};

export default chainTranRecordDao;
