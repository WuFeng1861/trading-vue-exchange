// 撮合交易系统
import {getCurrentMatchBuyOrder, getCurrentMatchSellOrder, getTradeFee} from "./utils.js";
import {ORDER_TYPES, TRADE_TYPES} from "../Types/orderTypes.js";
import priceTableDao from "../Mysql/Dao/priceTable.js";
import {errorTip, getNow, sleep} from "../utils/utils.js";
import SafeCalc from "../utils/bignumberjs.js";
import sequelize from "../Mysql/models/init.js";
import orderTableDao from "../Mysql/Dao/orderTable.js";
import tradeTableDao from "../Mysql/Dao/tradeTable.js";
import {addUserCoinBalance} from "../controllers/utils.js";
import coinPairTableDao from "../Mysql/Dao/coinPairTable.js";
import priceUpdateTable from "../Mysql/Dao/priceUpdateTable.js";

// 交易对价格数据缓存
let priceCache = {};
let pairDayDataCache = {};

// 更新交易对价格缓存 返回是否有更新
const updatePriceCache = (pair, price, minPrice = null, maxPrice = null) => {
  if (!priceCache[pair]) {
    priceCache[pair] = {
      price: price,
      minPrice: minPrice || 0,
      maxPrice: maxPrice || 0,
    };
    return false;
  }
  let hasUpdate = SafeCalc.compare(priceCache[pair].price, price) !== '0';
  if (hasUpdate) {
    priceCache[pair].price = price;
    if (SafeCalc.compare(price, priceCache[pair].minPrice) === '-1') {
      priceCache[pair].minPrice = price;
    }
    if (SafeCalc.compare(price, priceCache[pair].maxPrice) === '1') {
      priceCache[pair].maxPrice = price;
    }
  }
  return hasUpdate;
};

let intervalLog = 2000;
let lastLogTime = 0;
// 匹配交易系统 传入交易对的名称 基于mysql 所以qps 应该不会太高 但是不重要后续处理
const MatchSys = async (pair) => {
  // 获取交易对中未完成购买方的最低价位订单
  let buyOrder = await getCurrentMatchBuyOrder(pair);
  // 获取交易对中未完成卖出方的最高价位订单
  let sellOrder = await getCurrentMatchSellOrder(pair);
  // 如果上面两种订单任意一个不存在则直接返回
  if (!buyOrder || !sellOrder) {
    console.log(!buyOrder ? '没有未完成的买单' : '没有未完成的卖单');
    return;
  }
  // 判断上面的两种订单是否都是市价单 如果是获取当前价格 直接撮合
  if (buyOrder.order_type === ORDER_TYPES.MARKET_PRICE_BUY && sellOrder.order_type === ORDER_TYPES.MARKET_PRICE_SELL) {
    // 获取当前交易对价格
    let currentPriceData = await priceTableDao.findOne(pair);
    if (!currentPriceData) {
      errorTip('当前交易对价格不存在');
    }
    let currentPrice = currentPriceData.currency_price;
    await MatchOrder(buyOrder, sellOrder, currentPrice);
    return;
  }
  // 如果有一个是市价单 则直接进行撮合
  if (buyOrder.order_type === ORDER_TYPES.MARKET_PRICE_BUY || sellOrder.order_type === ORDER_TYPES.MARKET_PRICE_SELL) {
    // 撮合
    await MatchOrder(buyOrder, sellOrder, null);
    return;
  }
  // 如果都不是市价单 比较两者价格 如果购买价格小于卖出价格则直接则直接跳出不进行撮合
  if (SafeCalc.compare(buyOrder.order_price, sellOrder.order_price) === '-1') {
    let time = getNow();
    if (time - lastLogTime > intervalLog) {
      console.log('买方价格小于卖方价格', buyOrder.id, sellOrder.id, buyOrder.order_price, sellOrder.order_price);
      lastLogTime = time;
    }
    return;
  }
  // 如果都不是市价单 且买方价格大于等于卖方价格 则直接进行撮合
  await MatchOrder(buyOrder, sellOrder, null);
  // 然后继续执行这个函数 无线循环直到没有订单可以撮合为止
  return;
};

// 匹配订单 收取手续费 记录交易记录 0,1为限价单 2，3为市价单
// 1. 如果都是市价单 根据当前价格撮合
// 2. 如果有市价单 则根据另一方订单的价格撮合
// 3. 如果都是限价单 则根据卖方订单的价格进行撮合
// 3.+
// 进行撮合 同时在给币的时候结算手续费
// 首先判断购买订单和卖出订单的数量 如果购买订单剩余数量大于卖出订单剩余数量 则直接撮合卖出订单数量 并且同时减少购买订单的剩余数量、修改卖出订单的状态
// 如果卖出订单数量大于购买订单数量则直接撮合购买订单数量，并且同时减少卖出订单的剩余数量、修改购买订单的状态
// 修改交易对价格 同时记录交易记录
const MatchOrder = async (buyOrder, sellOrder, marketPrice) => {
  // 确定交易价格 price为 coin_first的价值/coin_second的价值 比如100:1 则price为0.01
  let price;
  if (buyOrder.order_type === ORDER_TYPES.MARKET_PRICE_BUY && sellOrder.order_type === ORDER_TYPES.MARKET_PRICE_SELL) {
    price = marketPrice;
  } else if (buyOrder.order_type === ORDER_TYPES.MARKET_PRICE_BUY || sellOrder.order_type === ORDER_TYPES.MARKET_PRICE_SELL) {
    price = buyOrder.order_type === ORDER_TYPES.MARKET_PRICE_BUY ? sellOrder.order_price : buyOrder.order_price;
  } else {
    price = sellOrder.order_price;
  }
  // 确定交易数量
  let buyAmount = buyOrder.order_remain_amount;
  let sellAmount = sellOrder.order_remain_amount;
  let finishAmount = 0; // 最终的交易数量 取买方数量与卖方数量小的那个
  let finishType; // 0为两边数量相等 1为买方数量大于卖方数量 2为卖方数量大于买方数量
  if (SafeCalc.compare(buyAmount, sellAmount) === '-1') {
    finishAmount = buyAmount;
    finishType = 2;
  } else if (SafeCalc.compare(buyAmount, sellAmount) === '1') {
    finishAmount = sellAmount;
    finishType = 1;
  } else {
    finishAmount = buyAmount;
    finishType = 0;
  }
  await updateOrderData(buyOrder, sellOrder, finishAmount, finishType, price);
};

// 修改mysql数据 finishAmount 最终交易数量 finishType 0为两边数量相等 1为买方数量大于卖方数量 2为卖方数量大于买方数量
const updateOrderData = async (buyOrder, sellOrder, finishAmount, finishType, price) => {
  let tradeTime = getNow();
  const t = await sequelize.transaction();
  try {
    // 修改订单状态和剩余数量
    if (finishType === 0) {
      // 修改购买订单和卖出订单状态和剩余数量0
      await orderTableDao.updateOrderStatusAndRemainAmount(buyOrder.id, 1, 0, t);
      await orderTableDao.updateOrderStatusAndRemainAmount(sellOrder.id, 1, 0, t);
      console.log('两边数量相等', buyOrder.id, sellOrder.id, finishAmount, buyOrder.order_remain_amount, sellOrder.order_remain_amount);
    } else if (finishType === 1) {
      // 修改购买订单剩余数量
      let buyOrderRemainAmount = SafeCalc.sub(buyOrder.order_remain_amount, finishAmount);
      await orderTableDao.updateRemainAmount(buyOrder.id, buyOrderRemainAmount, t);
      // 修改卖出订单状态和剩余数量
      await orderTableDao.updateOrderStatusAndRemainAmount(sellOrder.id, 1, 0, t);
      console.log('买方数量大于卖方数量', buyOrder.id, sellOrder.id, finishAmount, buyOrder.order_remain_amount, sellOrder.order_remain_amount);
    } else if (finishType === 2) {
      // 修改卖出订单剩余数量
      let sellOrderRemainAmount = SafeCalc.sub(sellOrder.order_remain_amount, finishAmount);
      await orderTableDao.updateRemainAmount(sellOrder.id, sellOrderRemainAmount, t);
      // 修改购买订单状态和剩余数量
      await orderTableDao.updateOrderStatusAndRemainAmount(buyOrder.id, 1, 0, t);
    }
    // 计算手续费 todo:先完成限价的 市价的后续完成，不知道怎么计算购买数量，可以考虑前面在获取价格之后计算购买数量，然后修改数量然后进行计算
    let tradeBuyFee = await getTradeFee(buyOrder.user_id);
    let tradeSellFee = await getTradeFee(sellOrder.user_id);
    let buyFee = SafeCalc.mul(finishAmount, tradeBuyFee); // 买方手续费 = 交易数量 * 手续费率 单位coin_first
    let sellFee = SafeCalc.mul(SafeCalc.mul(finishAmount, price), tradeSellFee); // 卖方手续费 = 交易数量 * price * 手续费率 单位coin_second
    console.log('购买方手续费', buyFee, '卖方手续费', sellFee);

    // 记录交易记录
    await tradeTableDao.create(buyOrder.id, buyOrder.user_id, tradeTime, price, finishAmount, buyFee, buyOrder.order_currency_pair, TRADE_TYPES.BUY, t);
    await tradeTableDao.create(sellOrder.id, sellOrder.user_id, tradeTime, price, finishAmount, sellFee, sellOrder.order_currency_pair, TRADE_TYPES.SELL, t);
    // 结算手续费 也就是修改币种余额
    // 获取交易对的币种信息 todo: 可以后续考虑redis或者直接内存缓存
    let pairCoinInfo = await coinPairTableDao.findOne(buyOrder.order_currency_pair);
    // 1. 买方增加first币种余额
    let buyerCoinAddAmount = SafeCalc.sub(finishAmount, buyFee);
    await addUserCoinBalance(buyOrder.user_id, pairCoinInfo.coin_first, buyerCoinAddAmount, t);
    console.log(`买方增加${pairCoinInfo.coin_first}币种余额`, buyOrder.user_id, pairCoinInfo.coin_first, buyerCoinAddAmount);
    // 2. 卖方增加second币种余额
    let sellerCoinAddAmount = SafeCalc.sub(SafeCalc.mul(finishAmount, price), sellFee);
    await addUserCoinBalance(sellOrder.user_id, pairCoinInfo.coin_second, sellerCoinAddAmount, t);
    console.log(`卖方增加${pairCoinInfo.coin_second}币种余额`, sellOrder.user_id, pairCoinInfo.coin_second, sellerCoinAddAmount);
    // 修改交易对价格和缓存
    let hasUpdatePrice = updatePriceCache(buyOrder.order_currency_pair, price);
    if (hasUpdatePrice) {
      // 价格变化修改价格
      await priceTableDao.update(buyOrder.order_currency_pair, price, t, priceCache[buyOrder.order_currency_pair].minPrice, priceCache[buyOrder.order_currency_pair].maxPrice);
      // 创建价格变化记录
      await priceUpdateTable.create(price, buyOrder.order_currency_pair, tradeTime, t);
    }
    console.log(`修改${buyOrder.order_currency_pair}价格`, price);
    await t.commit();
    console.log('撮合成功', buyOrder.id, sellOrder.id, finishAmount, buyOrder.order_remain_amount, sellOrder.order_remain_amount);
  } catch (e) {
    console.log(e.message, 'updateOrderData error -MatchSys');
    await t.rollback();
    errorTip(e.message);
  }
};

const startMatch = async (pair) => {
  while (true) {
    // 获取交易对价格数据
    let currentPriceData = await priceTableDao.findOne(pair);
    if (!currentPriceData) {
      errorTip('当前交易对价格不存在');
    }
    updatePriceCache(pair, currentPriceData.currency_price, currentPriceData.min_price, currentPriceData.max_price);
    await MatchSys(pair);
    // await sleep(1000 * 10);
  }
};
// startMatch('MERC-BNB');
startMatch('MERC-USDT');
