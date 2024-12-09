import db from "../models/index.js";
import sequelize from "../models/init.js";
import {getNow} from "../../utils/utils.js";
import {Op, where} from "sequelize";

let orderTable = db.orderTable;
let orderTableDao = {};

// 创建订单
orderTableDao.create = async (user_id, order_type, order_price, order_amount, order_currency_pair, t) => {
  const order_time = getNow();
  const order_finish = 0;
  const order_delete = 0;
  const order_remain_amount = order_amount;
  return await orderTable.create(
    {
      user_id,
      order_type,
      order_price,
      order_amount,
      order_currency_pair,
      order_finish,
      order_delete,
      order_remain_amount,
      order_time
    },
    {transaction: t}
  );
};

// 创建购买订单
orderTableDao.createBuyOrder = async (user_id, order_price, order_amount, order_currency_pair, t) => {
  const order_time = getNow();
  const order_type = 0;
  const order_finish = 0;
  const order_delete = 0;
  const order_remain_amount = order_amount;
  return await orderTable.create(
    {
      user_id,
      order_type,
      order_price,
      order_amount,
      order_currency_pair,
      order_finish,
      order_delete,
      order_remain_amount,
      order_time
    },
    {transaction: t}
  );
};

// 创建卖出订单
orderTableDao.createSellOrder = async (user_id, order_price, order_amount, order_currency_pair, t) => {
  const order_time = getNow();
  const order_type = 1;
  const order_finish = 0;
  const order_delete = 0;
  const order_remain_amount = order_amount;
  return await orderTable.create(
    {
      user_id,
      order_type,
      order_price,
      order_amount,
      order_currency_pair,
      order_finish,
      order_delete,
      order_remain_amount,
      order_time
    },
    {transaction: t}
  );
};

// 创建市价购买订单
orderTableDao.createMarketBuyOrder = async (user_id, order_amount, order_currency_pair, t) => {
  const order_time = getNow();
  const order_type = 2;
  const order_finish = 0;
  const order_delete = 0;
  const order_remain_amount = order_amount;
  return await orderTable.create(
    {
      user_id,
      order_type,
      order_price: 0,
      order_amount,
      order_currency_pair,
      order_finish,
      order_delete,
      order_remain_amount,
      order_time
    },
    {transaction: t}
  );
};

// 创建市价卖出订单
orderTableDao.createMarketSellOrder = async (user_id, order_amount, order_currency_pair, t) => {
  const order_time = getNow();
  const order_type = 3;
  const order_finish = 0;
  const order_delete = 0;
  const order_remain_amount = order_amount;
  return await orderTable.create(
    {
      user_id,
      order_type,
      order_price: 0,
      order_amount,
      order_currency_pair,
      order_finish,
      order_delete,
      order_remain_amount,
      order_time
    },
    {transaction: t}
  );
};

// 查询该交易对的所有未完成交易订单
orderTableDao.findCurrencyPairUnfinishedOrder = async (currency_pair) => {
  return await orderTable.findAll({
    where: {order_currency_pair: currency_pair, order_finish: 0, order_delete: 0},
    raw: true
  });
};

// 查询该交易对最近的未完成交易订单
orderTableDao.findCurrencyPairLatestUnfinishedOrder = async (currency_pair) => {
  return await orderTable.findOne({
    where: {order_currency_pair: currency_pair, order_finish: 0, order_delete: 0},
    order: [["id", "DESC"]],
    raw: true,
    logging: console.log
  });
};

// 查询该交易对最新的订单
orderTableDao.findCurrencyPairLatestOrder = async (currency_pair) => {
  return await orderTable.findOne({
    where: {order_currency_pair: currency_pair},
    order: [["id", "DESC"]],
    raw: true,
  });
};

// 查询用户未完成订单
orderTableDao.findUserUnfinishedOrder = async (user_id) => {
  return await orderTable.findAll({
    where: {user_id, order_finish: 0, order_delete: 0},
    order: [["id", "DESC"]],
    raw: true
  });
};

// 查询用户完成订单
orderTableDao.findUserFinishedOrder = async (user_id) => {
  return await orderTable.findAll({
    where: {user_id, order_finish: 1, order_delete: 0},
    order: [["id", "DESC"]],
    raw: true
  });
};

// 查询用户完成订单带分页 根据last_id查询
orderTableDao.findUserFinishedOrderWithPage = async (user_id, last_id = Number.MAX_SAFE_INTEGER, limitSize = 10) => {
  let where1 = {user_id, order_finish: 1, order_delete: 0, id: {[Op.lt]: last_id}};
  // 添加where条件 当order_remain_amount!=自己的order_amount 并且 order_delete=1时，表示订单部分已成交并且撤销,这个单子算是完成的
  let where2 = {user_id, order_delete: 1, order_remain_amount: {[Op.ne]: {[Op.col]: "order_amount"}}};
  return await orderTable.findAndCountAll({
    where: {
      [Op.or]: [
        where1,
        where2
      ]
    },
    order: [["id", "DESC"]],
    limit: limitSize,
    raw: true
  });
};

// 根据id查询订单并锁住
orderTableDao.findByIdLock = async (order_id, t) => {
  return await orderTable.findOne({
    where: {id: order_id},
    transaction: t,
    lock: t.LOCK.UPDATE
  });
};

// 修改订单剩余数量
orderTableDao.updateRemainAmount = async (order_id, remain_amount, t) => {
  return await orderTable.update(
    {order_remain_amount: remain_amount},
    {where: {id: order_id}, transaction: t}
  );
};

// 修改订单状态 order_finish = 1 完成 0 未完成
orderTableDao.updateOrderStatus = async (order_id, order_finish, t) => {
  return await orderTable.update(
    {order_finish},
    {where: {id: order_id}, transaction: t}
  );
};

// 修改订单的状态和剩余数量 order_finish = 1 完成 0 未完成
orderTableDao.updateOrderStatusAndRemainAmount = async (order_id, order_finish, remain_amount, t) => {
  return await orderTable.update(
    {order_finish, order_remain_amount: remain_amount},
    {where: {id: order_id}, transaction: t}
  );
};

// 撤销订单
orderTableDao.deleteOrder = async (order_id, t) => {
  return await orderTable.update(
    {order_delete: 1},
    {where: {id: order_id}, transaction: t}
  );
};

// 获取倒数的价格订单总量
orderTableDao.getPriceOrderTotal = async (currency_pair, type, gap = 0.0001, limitSize = 10) => {
  let roundLen = gap.toString().split(".")[1]?.length || 0;
  const params = {
    gap,
    currency_pair,
    limitSize,
    type
  };
  const sql = `
    SELECT
      SUM(order_remain_amount) AS total_remain_amount,
      ${type === 1 ? 'CEILING' : 'FLOOR'}(ROUND(order_price / :gap, ${roundLen})) * :gap AS price_range
    FROM
      order_table
    WHERE
      order_type = :type AND
      order_finish = 0 AND
      order_delete = 0 AND
      order_currency_pair = :currency_pair
    GROUP BY
      price_range
    ORDER BY
      price_range ${type === 1 ? "ASC" : "DESC"}
    LIMIT
      :limitSize
  `;
  return await sequelize.query(sql, {
    replacements: params,
    type: sequelize.QueryTypes.SELECT,
    // logging: console.log
  });
};

// 获取一个未完成且购买订单价格最高的订单 排序方式为价格降序和id升序
orderTableDao.getBuyOrderHighestPrice = async (currency_pair) => {
  return await orderTable.findOne({
    where: {
      order_currency_pair: currency_pair,
      order_type: 0,
      order_finish: 0,
      order_delete: 0
    },
    order: [["order_price", "DESC"], ["id", "ASC"]],
    raw: true
  });
};

// 获取一个未完成且市价购买订单
orderTableDao.getMarketBuyOrder = async (currency_pair) => {
  return await orderTable.findOne({
    where: {
      order_currency_pair: currency_pair,
      order_type: 2,
      order_finish: 0,
      order_delete: 0
    },
    order: [["id", "ASC"]],
    raw: true
  });
};

// 获取一个未完成且卖出订单价格最低的订单
orderTableDao.getSellOrderLowestPrice = async (currency_pair) => {
  return await orderTable.findOne({
    where: {
      order_currency_pair: currency_pair,
      order_type: 1,
      order_finish: 0,
      order_delete: 0
    },
    order: [["order_price", "ASC"], ["id", "ASC"]],
    raw: true
  });
};

// 获取一个未完成且市价卖出订单
orderTableDao.getMarketSellOrder = async (currency_pair) => {
  return await orderTable.findOne({
    where: {
      order_currency_pair: currency_pair,
      order_type: 3,
      order_finish: 0,
      order_delete: 0
    },
    order: [["id", "ASC"]],
    raw: true
  });
};

export default orderTableDao;
