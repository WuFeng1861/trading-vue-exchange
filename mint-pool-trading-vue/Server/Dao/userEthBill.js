import db from "../models/index.js";
import {getNow} from "../utils/utils.js";
import sequelize from "../models/init.js";
import {Op} from "sequelize";

let userEthBill = db.userEthBill;
let userEthBillDao = {};

// 创建用户eth的记录
userEthBillDao.create = (user_id, amount, type, chain_hash, created_at, t) => {
  return userEthBill.create({
    user_id, amount, type, chain_hash, created_at
  }, {transaction: t});
};

// 查询用户eth的记录
userEthBillDao.findByUserId = (user_id, t) => {
  return userEthBill.findAll({
    where: {
      user_id
    },
    raw: true,
    order: [[sequelize.literal('created_at + 0'), 'DESC']],
    transaction: t
  });
};

// 获取这张表的条数
userEthBillDao.getCount = () => {
  return userEthBill.count();
};

// 翻页获取数据 根据id游标查询指定条数
userEthBillDao.findByPageWithId = (id, size, t) => {
  return userEthBill.findAll({
    where: {
      id: {
        [Op.gt]: id
      }
    },
    limit: size,
    order: [['id', 'ASC']],
    raw: true,
    transaction: t
  });
};

export default userEthBillDao;

