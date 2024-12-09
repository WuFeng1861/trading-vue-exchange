import {createInstance} from "./createInstance.js";
import {getNowTimeStamp} from "@/utils/index.js";

const instance = createInstance('order');

// 创建限价单
export const createOrderLP = (id, type, price, amount, pair) => {
  return instance.post('/createOrderLP', {id, type, price, amount, pair}, {
    timeout: 10 * 1000,
    retry: 0
  });
}

// 撤销限价单
export const cancelOrderLP = (id, orderId) => {
  return instance.post('/cancelOrderLP', {id, orderId}, {
    timeout: 10 * 1000,
    retry: 0
  });
}

// 获取订单列表
export const getOrderGroup = (id, pair, pageGroup = null, pageSize = 20) => {
  return instance.post('/getOrderGroup', {id, pair, pageSize, pageGroup});
}

// 获取订单间隙 0.1 0.01 0.001 这种
export const getOrderGroupGap = (id, pair) => {
  return instance.post('/getOrderGroupGap', {id, pair});
}

// 获取交易对价格
export const getPairPrice = (id, pair) => {
  return instance.post('/getPairPrice', {id, pair});
}

// 获取最新成交订单
export const getTradeOrderList = (id, pair, pageSize = 20) => {
  return instance.post('/getTradeOrderList', {id, pair, pageSize});
}

// 获取用户当前挂单
export const getUserOrderList = (id) => {
  return instance.post('/getUserOrderList', {id});
}

// 获取用户完成的订单数据
export const getUserOrderFinishList = (id, lastId = Number.MAX_SAFE_INTEGER) => {
  return instance.post('/getUserOrderFinishList', {id, lastId});
}

// 获取k线数据
export const getKLineData = (id, pair, timeType = 1000, timeStart = 200) => {
  return instance.post('/getKLineData', {id, pair, timeType, timeStart});
}

// 获取交易对一天的数据
export const getPairDayInfo = (id, pair) => {
  return instance.post('/getPairDayInfo', {id, pair});
}
