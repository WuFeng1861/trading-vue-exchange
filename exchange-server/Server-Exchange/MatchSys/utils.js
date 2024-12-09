import orderTableDao from "../Mysql/Dao/orderTable.js";
import {config} from "../config/index.js";
import feeTableDao from "../Mysql/Dao/feeTable.js";

// 获取当前最应该匹配的购买订单
export const getCurrentMatchBuyOrder = async(pair) => {
  // 获取一个市价订单
  let order = await orderTableDao.getMarketBuyOrder(pair);
  // 如果存在
  if (order) {
    return order;
  }
  // 则获取一个限价订单
  order = await orderTableDao.getBuyOrderHighestPrice(pair);
  // 如果存在
  if (order) {
    return order;
  }
  // 则返回null
  return null;
};

// 获取当前最应该匹配的卖出订单
export const getCurrentMatchSellOrder = async (pair) => {
  // 获取一个市价订单
  let order = await orderTableDao.getMarketSellOrder(pair);
  // 如果存在
  if (order) {
    return order;
  }
  // 则获取一个限价订单
  order = await orderTableDao.getSellOrderLowestPrice(pair);
  // 如果存在
  if (order) {
    return order;
  }
  // 则返回null
  return null;
};

// 获取用户成交的手续费比例 todo: 后续redis缓存
export const getTradeFee = async (id) => {
  let feeResult = config.DEFAULT_EXCHANGE_FEE;
  let userTradeFee = await feeTableDao.findOne(id);
  if (userTradeFee && userTradeFee.fee_receive) {
    feeResult = userTradeFee.fee_receive;
  }
  return feeResult;
};
