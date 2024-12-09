import db from "../models/index.js";
import {Op} from "sequelize";
import sequelize from "sequelize";

let tradeTable = db.tradeTable;
let tradeTableDao = {};

// 新增完成订单
tradeTableDao.create = async (order_id, user_id, trade_time, trade_price, trade_amount, trade_fee, order_currency_pair, trade_type, t) => {
  return await tradeTable.create({
    order_id, user_id, trade_time, trade_price, trade_amount, trade_fee, order_currency_pair, trade_type
  }, {transaction: t});
};

// 查询用户交易对的订单列表并且翻页 根据last_id查询
tradeTableDao.getUserPairTradeListWithLastId = async (user_id, order_currency_pair, last_id = Number.MAX_SAFE_INTEGER, pageSize = 10) => {
  let where = {
    user_id,
    id: {
      [Op.lt]: last_id
    },
    order_currency_pair
  };
  return await tradeTable.findAndCountAll({
    where,
    order: [
      ['id', 'DESC']
    ],
    limit: pageSize,
  });
};

// 查询最新的成交记录
tradeTableDao.getLatestTrade = async (order_currency_pair, size = 20) => {
  let where = {
    order_currency_pair,
    // trade_type: 0
  };
  return await tradeTable.findAll({
    where,
    order: [
      ['id', 'DESC']
    ],
    raw: true,
    limit: size
  });
};

// 获取用户的完成订单列表带分页 根据last_id查询
tradeTableDao.getUserTradeListWithLastId = async (user_id, last_id = Number.MAX_SAFE_INTEGER, pageSize = 10) => {
  let where = {
    user_id,
    id: {
      [Op.lt]: last_id
    }
  };
  return await tradeTable.findAndCountAll({
    where,
    order: [
      ['id', 'DESC']
    ],
    limit: pageSize,
    raw: true
  });
};

// 获取该订单的所有成交信息
tradeTableDao.getTradeListByOrderId = async (order_id) => {
  let where = {
    order_id
  };
  return await tradeTable.findAll({
    where,
    order: [
      ['id', 'DESC']
    ],
    raw: true
  });
};

// 获取交易对的交易记录 trade_time从指定时间开始
tradeTableDao.getTradeListByPairAndTime = async (order_currency_pair, start_time, trade_type = 0) => {
  let where = {
    order_currency_pair,
    trade_time: sequelize.literal(`\`trade_time\` + 0 >= ${start_time} + 0`),
    trade_type
  };
  return await tradeTable.findAll({
    where,
    order: [
      ['id', 'asc']
    ],
    raw: true,
    // logging: console.log
  });
};

// 获取交易对的交易记录 trade_time从指定时间开始
tradeTableDao.getTradeListByPairAndTimeAllType = async (order_currency_pair, start_time) => {
  let where = {
    order_currency_pair,
    trade_time: sequelize.literal(`\`trade_time\` + 0 >= ${start_time} + 0`),
  };
  return await tradeTable.findAll({
    where,
    order: [
      ['id', 'asc']
    ],
    raw: true
  });
};

// 获取交易对的交易记录 trade_time从指定时间开始 end_time结束时间
tradeTableDao.getTradeListByPairAndTimeRange = async (order_currency_pair, start_time, end_time, trade_type = 0) => {
  let where = {
    order_currency_pair,
    // trade_time: [
    //   sequelize.literal(`\`trade_time\` + 0 >= ${start_time} + 0`),
    //   sequelize.literal(`\`trade_time\` + 0 < ${end_time} + 0`)
    // ],
    [Op.and]: [
        sequelize.literal(`\`trade_time\` + 0 >= ${start_time} + 0`),
        sequelize.literal(`\`trade_time\` + 0 < ${end_time} + 0`)
    ],
    trade_type
  };
  return await tradeTable.findAll({
    where,
    order: [
      ['id', 'asc']
    ],
    raw: true,
    // logging: console.log
  });
};

// 获取交易对的交易记录 大于last_id的记录
tradeTableDao.getTradeListByPairAndLastId = async (order_currency_pair, last_id) => {
  let where = {
    order_currency_pair,
    id: {
      [Op.gt]: last_id
    }
  };
  return await tradeTable.findAll({
    where,
    order: [
      ['id', 'asc']
    ],
    raw: true,
    // logging: console.log
  });
};

export default tradeTableDao;
