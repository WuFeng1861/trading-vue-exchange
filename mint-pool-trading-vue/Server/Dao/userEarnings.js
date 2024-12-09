import db from "../models/index.js";
import {getNow} from "../utils/utils.js";
import {Op} from "sequelize";
import sequelize from '../models/init.js';

let userEarnings = db.userEarnings;
let userEarningsDao = {};

// 添加用户收益记录
userEarningsDao.add = async (user_id, type, earnings, tax, createtime, t) => {
  if (!t) {
    return userEarnings.create({
      user_id, type, earnings, createtime, tax
    });
  }
  return userEarnings.create({
    user_id, type, earnings, createtime, tax
  }, {transaction: t});
};

// 查询用户收益和税收记录 某一类型
userEarningsDao.getTypeEarnings = async (user_id, type, page, pageSize) => {
  return userEarnings.findAndCountAll({
    where: {
      user_id, type
    },
    raw: true,
    offset: (page - 1) * pageSize,
    limit: pageSize
  });
};

// 查询用户收益和税收记录
userEarningsDao.getEarnings = async (user_id, page, pageSize) => {
  return userEarnings.findAndCountAll({
    where: {
      user_id
    },
    order: [[sequelize.literal('createtime + 0'), 'DESC']],
    offset: (page - 1) * pageSize,
    limit: pageSize,
    raw: true
  });
};

// 查询用户历史7天收益
userEarningsDao.getWeekEarnings = async (user_id) => {
  // 获取当前时间
  const now = new Date();
  // 设置当前时间的小时、分钟、秒和毫秒为0，即获取当天的0时
  now.setHours(0, 0, 0, 0);
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  let weekAgoTimestamp = sevenDaysAgo.getTime();
  // 构建查询
  return userEarnings.findAll({
    attributes: [
      [sequelize.literal("FROM_UNIXTIME(createtime/1000, '%Y-%m-%d')"), 'date'],
      [sequelize.fn('SUM', sequelize.col('earnings')), 'amount']
    ],
    where: {
      createtime: {
        [Op.gte]: weekAgoTimestamp
      },
      user_id
    },
    group: ["date"],
    raw: true
  });
};

// 查询用户历史7天税收
userEarningsDao.getWeekTax = async (user_id) => {
  // 获取当前时间
  const now = new Date();
  // 设置当前时间的小时、分钟、秒和毫秒为0，即获取当天的0时
  now.setHours(0, 0, 0, 0);
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  let weekAgoTimestamp = sevenDaysAgo.getTime();
  // 构建查询
  return userEarnings.findAll({
    attributes: [
      [sequelize.literal("FROM_UNIXTIME(createtime/1000, '%Y-%m-%d')"), 'date'],
      [sequelize.fn('SUM', sequelize.col('tax')), 'amount']
    ],
    where: {
      createtime: {
        [Op.gte]: weekAgoTimestamp
      },
      user_id
    },
    group: ["date"],
    raw: true
  });
};

// 查询这张表的条数
userEarningsDao.getCount = async () => {
  return userEarnings.count();
};

// 翻页获取数据 根据id游标查询指定条数
userEarningsDao.getPaginationWithId = async (id, size, t) => {
  return userEarnings.findAll({
    raw: true,
    limit: size,
    where: {
      id: {
        [Op.gt]: id
      }
    },
    order: [['id', 'ASC']],
    transaction: t
  });
};

// 计算整张表的用户earnings总和
userEarningsDao.getTotalEarnings = async (t) => {
  return userEarnings.sum('earnings', {transaction: t});
};

// 计算整张表的用户earnings总和
userEarningsDao.getTotalTax = async (t) => {
  return userEarnings.sum('tax', {transaction: t});
};

// 计算整张表的用户可使用的币量
userEarningsDao.getAllUserUnlock = async (types, t) => {
  return userEarnings.findAll({
    attributes: ['user_id', [sequelize.fn('SUM', sequelize.col('earnings')), 'earnings_sum']],
    group: ['user_id'],
    where: {
      type: {
        [Op.in]: types
      }
    },
    raw: true,
    transaction: t
  });
};

// 获取表所有的数据
userEarningsDao.getAllData = async () => {
  return userEarnings.findAll({
    raw: true
  });
};

// 获取用户某一类型赚取的金额 type在types里面
userEarningsDao.getUserEarningsByType = async (user_id, types, t) => {
  return userEarnings.sum('earnings', {
    where: {
      user_id,
      type: {
        [Op.in]: types
      }
    },
    transaction: t
  });
};

export default userEarningsDao;
