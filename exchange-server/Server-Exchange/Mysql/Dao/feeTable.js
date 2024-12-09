import db from "../models/index.js";

let feeTable = db.feeTable;
let feeTableDao = {};

// 创建用户手续费数据
feeTableDao.create = async (user_id, fee_receive, t) => {
  return feeTable.create({user_id, fee_receive}, {transaction: t});
};

// 查询用户手续费数据
feeTableDao.findOne = async (user_id) => {
  return feeTable.findOne({where: {user_id}});
};

// 更新用户手续费数据
feeTableDao.update = async (user_id, fee_receive, t) => {
  return feeTable.update({fee_receive}, {where: {user_id}, transaction: t});
};
export default feeTableDao;
