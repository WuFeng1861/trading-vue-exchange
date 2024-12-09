import db from "../models/index.js";
import {Op} from "sequelize";
import sequelize from "sequelize";

let priceUpdateTable = db.priceUpdateTable;
let priceUpdateTableDao = {};

// 价格变化
priceUpdateTableDao.create = async (price, currency_pair, time, t) => {
  return priceUpdateTable.create({price, currency_pair, time}, {transaction: t});
};

// 查询价格变化
priceUpdateTableDao.findOne = async (currency_pair, fromTime) => {
  return priceUpdateTable.findOne({
    where:
      {
        currency_pair,
        time: sequelize.literal(`\`time\` + 0 > ${fromTime} + 0`)
      }
  });
};

// 查询价格变化
priceUpdateTableDao.findAll = async (currency_pair, fromTime, toTime) => {
  return priceUpdateTable.findAll({
    where:
      {
        currency_pair,
        // [Op.gte]: sequelize.literal(`\`time\` + 0 > ${fromTime} + 0`)
        [Op.and]: [
          sequelize.literal(`\`time\` + 0 >= ${fromTime} + 0`),
          sequelize.literal(`\`time\` + 0 < ${toTime} + 0`)
        ]
      },
    order: [["id", "ASC"]],
    raw: true,
  });
};

// 获取交易对某个时间的价格 time<searchTime的一条数据
priceUpdateTableDao.findOneByTime = async (currency_pair, searchTime) => {
  return priceUpdateTable.findOne({
    where: {
      currency_pair,
      time:  sequelize.literal(`\`time\` + 0 > ${searchTime} + 0`)
    },
    order: [["id", "DESC"]],
    limit: 1,
    raw: true,
  });
};
export default priceUpdateTableDao;
