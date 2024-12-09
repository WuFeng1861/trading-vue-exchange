import db from "../models/index.js";
import {Op, Sequelize} from "sequelize";
import {clearObject} from "../utils/utils.js";
import sequelize from "../models/init.js";

let transferRecord = db.transferRecord;
let transferRecordDao = {};
// 创建交易记录
transferRecordDao.create = async (hash, coin_name, type, sender, receiver, amount, create_time, fee, remark, t) => {
  return transferRecord.create({
    hash, coin_name, type, sender, receiver, amount, create_time, fee, remark
  }, {transaction: t});
};

// 查询交易记录根据user是sender或者receiver中的任意一个， 排序根据create_time + 0 倒序
transferRecordDao.queryByUser = async (user, coinName, startId, pageSize, t) => {
  return transferRecord.findAll({
    where: {
      [Op.or]: [
        {sender: user},
        {receiver: user}
      ],
      coin_name: coinName,
      id: {[Op.lt]: startId}
    },
    // offset: startId,
    limit: pageSize,
    order: [[sequelize.literal('create_time + 0'), 'DESC']],
    transaction: t,
    raw: true,
    // 打印sql
    // logging: true
  });
};

// 查询交易记录的总条数
transferRecordDao.queryCountByUser = async (user, coinName, t) => {
  return transferRecord.count({
    where: {
      [Op.or]: [
        {sender: user},
        {receiver: user}
      ],
      coin_name: coinName
    },
    transaction: t,
    raw: true
  });
};

// 查询交易记录根据hash
transferRecordDao.queryByHash = async (hash, t) => {
  return transferRecord.findOne({
    where: {
      hash: hash
    },
    transaction: t,
    raw: true
  });
};

export default transferRecordDao;
