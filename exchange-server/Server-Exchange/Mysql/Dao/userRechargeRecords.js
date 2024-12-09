import db from "../models/index.js";
import {getNow} from "../../utils/utils.js";

let userRechargeRecords = db.userRechargeRecords;
let userRechargeRecordsDao = {};

// 添加一笔用户的充值记录
userRechargeRecordsDao.create = (user_id, t_amount, t_address_to, t_hash, t_chain_id, t_address_from, t_height, t) => {
  const t_finish_time = getNow();
  return userRechargeRecords.create({user_id, t_amount, t_address_to, t_hash, t_chain_id, t_address_from, t_height, t_finish_time}, {transaction: t});
};

// 根据用户ID查询充值记录
userRechargeRecordsDao.findByUserId = (user_id) => {
  return userRechargeRecords.findAll({
    where: {
      user_id
    },
    order: [
      ['id', 'ASC']
    ],
    raw: true
  });
};

export default userRechargeRecordsDao;
