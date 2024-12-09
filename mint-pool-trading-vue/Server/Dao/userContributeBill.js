import db from "../models/index.js";
import {Sequelize} from "sequelize";
import {clearObject, getNow} from "../utils/utils.js";
import sequelize from "../models/init.js";

let userContributeBill = db.userContributeBill;
let userContributeBillDao = {};

// 创建用户贡献账单
userContributeBillDao.create = async (user_id, contribute_value, type, inviter_id, t) => {
  return userContributeBill.create({user_id, contribute_value, type, inviter_id, create_time: getNow()}, {transaction: t});
};

// 查询用户邀请者的贡献账单
userContributeBillDao.getUserInviterContributeBill = async (inviter_id, type, t) => {
  return userContributeBill.findAll({where: {inviter_id, type}, order: [[sequelize.literal('create_time + 0'), 'DESC']], transaction: t});
};

// 查询用户贡献账单
userContributeBillDao.getUserContributeBill = async (user_id, type, t) => {
  return userContributeBill.findAll({where: {user_id, type}, order: [[sequelize.literal('create_time + 0'), 'DESC']], transaction: t});
};

// 获取所有用户的贡献
userContributeBillDao.getAllUserContribute = async (type, t) => {
  return userContributeBill.findAll(
    {
      attributes: ['user_id', [sequelize.fn('sum', sequelize.col('contribute_value')), 'contribute_value']],
      group: ['user_id'],
      order: [['user_id', 'ASC']],
      transaction: t,
      raw: true
    }
  );
};
export default userContributeBillDao;
