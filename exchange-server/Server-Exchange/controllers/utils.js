import coinPairTableDao from "../Mysql/Dao/coinPairTable.js";
import orderTableDao from "../Mysql/Dao/orderTable.js";
import userBalanceDao from "../Mysql/Dao/userBalance.js";
import SafeCalc from "../utils/bignumberjs.js";
import {errorTip, getNow} from "../utils/utils.js";
import priceTableDao from "../Mysql/Dao/priceTable.js";
import BigNumber from "bignumber.js";
import tradeTableDao from "../Mysql/Dao/tradeTable.js";

// 获取用户该币种余额
export const getUserCoinBalance = async (userId, coin, createNew = false) => {
  let balance = 0;
  let userCoinBalance = await userBalanceDao.findByCurrency(userId, coin);
  // 如果没有该币种余额，并且需要创建，则创建
  if (!userCoinBalance && createNew) {
    await userBalanceDao.create(userId, coin, 0);
    return 0;
  }
  if (userCoinBalance) {
    balance = userCoinBalance.balance;
  }
  return balance;
};

// 获取用户该币种余额带锁
export const getUserCoinBalanceLock = async (userId, coin, t, createNew = false) => {
  let balance = 0;
  let userCoinBalance = await userBalanceDao.findByCurrencyLock(userId, coin, t);
  // 如果没有该币种余额，并且需要创建，则创建
  if (!userCoinBalance && createNew) {
    await userBalanceDao.create(userId, coin, 0, t);
    return 0;
  }
  if (userCoinBalance) {
    balance = userCoinBalance.balance;
  }
  return balance;
};

// 减少用户该币种余额
export const reduceUserCoinBalance = async (userId, coin, amount, t) => {
  if (SafeCalc.compare(amount, 0) !== '1') {
    errorTip(`交易金额必须大于0`);
  }
  let userCoinBalance = await getUserCoinBalanceLock(userId, coin, t);
  if (SafeCalc.compare(userCoinBalance, amount) === '-1') {
    errorTip(`余额不足，请检查账户余额是否充足`);
    return false;
  }
  let newBalance = SafeCalc.sub(userCoinBalance, amount);
  await userBalanceDao.updateBalance(userId, coin, newBalance, t);
  return true;
};

// 增加用户该币种余额
export const addUserCoinBalance = async (userId, coin, amount, t) => {
  if (SafeCalc.compare(amount, 0) !== '1') {
    errorTip(`交易金额必须大于0`);
  }
  let userCoinBalance = await getUserCoinBalanceLock(userId, coin, t, true);
  let newBalance = SafeCalc.add(userCoinBalance, amount);
  await userBalanceDao.updateBalance(userId, coin, newBalance, t);
  return true;
};

// 获取所有的交易对
export const getAllTradePairs = async () => {
  let tradePairs = await coinPairTableDao.findAll();
  return tradePairs;
};

// 获取交易对的所有挂单信息
export const getTradePairOrders = async (coinPair) => {
  let orders = await orderTableDao.findCurrencyPairUnfinishedOrder(coinPair);
  return orders;
};

// 获取用户的交易对挂单信息
export const getUserTradePairOrders = async (userId) => {
  let orders = await orderTableDao.findUserUnfinishedOrder(userId);
  return orders;
};

// 获取币种的最小group和最大group
export const getCoinPairGroupList = async (coinPair) => {
  const getGroup = (price, rate = 4) => {
    const value = new BigNumber(price);
    const log10Value = new BigNumber(Math.log10(value.toNumber())).integerValue(BigNumber.ROUND_FLOOR);
    const result = new BigNumber(10).pow(log10Value.minus(rate));
    if(SafeCalc.compare(result, 1) !== '-1') {
      return ['100', '10', '1', '0.1', '0.01'];
    }
    return [result.toFixed(), result.times(10).toFixed(), result.times(100).toFixed(), result.times(1000).toFixed()].reverse();
  };
  // 获取交易对价格
  let coinPriceData = await priceTableDao.findOne(coinPair);
  if (!coinPriceData) {
    errorTip(`币种${coinPair}不存在`);
    return false;
  }
  // 获取最小group 为价格的1/1000，然后获取科学计数法的次方数 maxGroup 为价格，然后获取科学计数法的次方数
  let groupList = getGroup(coinPriceData.currency_price);
  return groupList;
};

// 获取订单的成交均价
export const getOrderTradeData = async (order_id) => {
  let tradeList = await tradeTableDao.getTradeListByOrderId(order_id);
  if (tradeList.length === 0) {
    return {amount: 0, price: 0, fee: 0};
  }
  let totalAmount = 0;
  let totalPrice = 0;
  let totalFee = 0;
  for (let i = 0; i < tradeList.length; i++) {
    totalAmount = SafeCalc.add(totalAmount, tradeList[i].trade_amount);
    totalPrice = SafeCalc.add(totalPrice, SafeCalc.mul(tradeList[i].trade_price, tradeList[i].trade_amount));
    totalFee = SafeCalc.add(totalFee, tradeList[i].trade_fee);
  }
  return {amount: totalAmount, price: SafeCalc.div(totalPrice, totalAmount), fee: totalFee};
};

// 获取交易对24小时数据
const cache = {};
export const getPairDayInfoFromCache = async (coinPair) => {
  // 如果缓存中有数据，并且缓存时间在10分钟内，则直接返回缓存数据
  if (cache[coinPair] && cache[coinPair].time > getNow() - 1000 * 60 * 10) {
    return cache[coinPair];
  }
  // 获取交易对24小时数据
  let startTime = getNow() - 24 * 60 * 60 * 1000;
  let dayInfo = await tradeTableDao.getTradeListByPairAndTime(coinPair, startTime);
  let result = {
    volume: 0,
    value: 0,
    maxPrice: 0,
    minPrice: 0,
    time: getNow(),
  };
  if (dayInfo.length === 0) {
    // 如果没有数据，则获取币种价格
    let coinPriceData = await priceTableDao.findOne(coinPair);
    if (coinPriceData) {
      result.maxPrice = coinPriceData.currency_price;
      result.minPrice = coinPriceData.currency_price;
    }
    return result;
  }
  for (let i = 0; i < dayInfo.length; i++) {
    result.volume = SafeCalc.add(result.volume, dayInfo[i].trade_amount);
    result.value = SafeCalc.add(result.value, SafeCalc.mul(dayInfo[i].trade_price, dayInfo[i].trade_amount));
    if (i === 0) {
      result.maxPrice = dayInfo[i].trade_price;
      result.minPrice = dayInfo[i].trade_price;
    } else {
      if (dayInfo[i].trade_price > result.maxPrice) {
        result.maxPrice = dayInfo[i].trade_price;
      }
      if (dayInfo[i].trade_price < result.minPrice) {
        result.minPrice = dayInfo[i].trade_price;
      }
    }
  }
  cache[coinPair] = result;
  console.log('缓存数据', cache);
  return result;
};
