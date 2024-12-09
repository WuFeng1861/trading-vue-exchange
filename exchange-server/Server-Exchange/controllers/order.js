import sequelize from "../Mysql/models/init.js";
import {errorHandle, errorTip, getNow, httpResult} from "../utils/utils.js";
import coinPairTableDao from "../Mysql/Dao/coinPairTable.js";
import {
  addUserCoinBalance,
  getCoinPairGroupList,
  getOrderTradeData, getPairDayInfoFromCache,
  getUserCoinBalanceLock,
  reduceUserCoinBalance
} from "./utils.js";
import SafeCalc from "../utils/bignumberjs.js";
import orderTableDao from "../Mysql/Dao/orderTable.js";
import {queryCheckTransferId} from "./routerUtils.js";
import priceTableDao from "../Mysql/Dao/priceTable.js";
import tradeTableDao from "../Mysql/Dao/tradeTable.js";
import priceUpdateTableDao from "../Mysql/Dao/priceUpdateTable.js";

// 创建限价订单 todo:后续添加市价单的操作
// todo: 可以在数据库添加两个字段来控制市价单
// todo: order_total_value 和 order_remain_value 用来控制市价买入的余额和时间买入剩余余额，时间卖出的时候就不需要控制这两个字段了。但是这样会感觉数据库数据多余字段较多
// todo: 或者说另起2个数据库用来存储市价单的相关信息，比如市价单的总量，剩余量，价格，时间等等。但是这样id就乱了，除非修改成分布式id，但是工作量就更大了。
// todo: 所以还是用order_total_value 和 order_remain_value 来控制市价买入的余额和时间买入剩余余额，时间卖出的时候就不需要控制这两个字段了。
// todo: 等测试完成限价单后再去完善市价单的操作
export const createLimitPriceOrder = async (req, res) => {
  let {id, type, price, amount, pair} = req.body;
  // 检查发起者是否是该用户
  queryCheckTransferId(req, id);
  // 进行基础的校验 todo: 后续完善数量和价格的小数位数限制
  // 1. 判断参数是否完整
  if (!id || !price || !amount || !pair || ![0, 1].includes(type)) {
    errorTip('创建订单失败,请检查参数是否正确');
    return;
  }
  const t = await sequelize.transaction();
  try {
    // 定义要消耗的数量 卖出方就是amount 买入方就是amount * price
    let reduceAmount = amount;
    // 买入的时候要计算出实际需要消耗的数量
    if(type === 0) {
      reduceAmount = SafeCalc.mul(amount, price);
    }
    // 1. 获取消耗的币种
    const consumeCoin = await coinPairTableDao.getConsumedCoin(pair, type);
    // 2. 查询用户对应币种余额并锁定该用户的这个币种交易
    const userBalance = await getUserCoinBalanceLock(id, consumeCoin, t);
    // 3. 判断用户余额是否足够
    if (SafeCalc.compare(userBalance, reduceAmount) === '-1') {
      errorTip('创建订单失败,余额不足');
      return;
    }
    // 3. 扣除用户余额
    await reduceUserCoinBalance(id, consumeCoin, reduceAmount, t);
    // 4. 创建订单
    await orderTableDao.create(id, type, price, amount, pair, t);
    // 5. 提交事务
    await t.commit();
    // 返回创建结果
    res.json(httpResult.success({result: true}));
  } catch (error) {
    console.log(error.message, 'createOrder error -orderController- -------------');
    await t.rollback();
    errorHandle(error, '创建订单失败,请稍后再试');
  }
};

// 撤销限价订单 todo:后续添加市价单的操作
export const cancelLimitPriceOrder = async (req, res) => {
  let {id, orderId} = req.body;
  // 检查发起者是否是该用户
  queryCheckTransferId(req, id);
  // 进行基础的校验
  // 1. 判断参数是否完整
  if (!id || !orderId) {
    errorTip('撤销订单失败,请检查参数是否正确');
    return;
  }
  const t = await sequelize.transaction();
  try {
    // 1. 查询订单信息
    const orderInfo = await orderTableDao.findByIdLock(orderId, t);
    // 2. 判断订单是否存在
    if (!orderInfo) {
      errorTip('撤销订单失败,订单不存在');
      return;
    }
    // 2.1 判断订单是否已经成交
    if (orderInfo.order_finish === 1 || orderInfo.order_delete === 1) {
      errorTip('撤销订单失败,订单已经成交或已撤销');
      return;
    }
    // 3. 判断订单是否属于该用户
    if (orderInfo.user_id.toString() !== id.toString()) {
      errorTip('撤销订单失败,订单不属于该用户');
      return;
    }
    // 4. 释放用户币种锁定
    const consumeCoin = await coinPairTableDao.getConsumedCoin(orderInfo.order_currency_pair, orderInfo.order_type);
    // 增加用户该币种余额 计算剩余的和已经成交的比例，然后更新用户币种余额
    if(orderInfo.order_type === 1) {
      // 卖的 直接将剩下的币返回给用户
      await addUserCoinBalance(id, consumeCoin, orderInfo.order_remain_amount, t);
    } else {
      // 买的 计算剩余的和价格，然后返回给用户
      const remainSecondAmount = SafeCalc.mul(orderInfo.order_remain_amount, orderInfo.order_price);
      await addUserCoinBalance(id, consumeCoin, remainSecondAmount, t);
    }
    // 5. 删除订单
    await orderTableDao.deleteOrder(orderId, t);
    // 6. 提交事务
    await t.commit();
    // 返回撤销结果
    res.json(httpResult.success({result: true}));
  } catch (error) {
    console.log(error.message, 'cancelOrder error -orderController- -------------');
    await t.rollback();
    errorHandle(error, '撤销订单失败,请稍后再试');
  }
};

// 获取挂单的订单列表
export const getOrderGroup = async (req, res) => {
  let {id, pair, pageSize, pageGroup} = req.body;
  // 进行基础的校验
  // 1. 判断参数是否完整
  if (!id || !pair) {
    errorTip('获取订单列表失败,请检查参数是否正确');
  }
  pageSize = pageSize || 20;
  let pairGroupList = await getCoinPairGroupList(pair);
  if (!pageGroup) {
    pageGroup = pairGroupList[pairGroupList.length - 1];
  }
  if (!pairGroupList.includes(pageGroup)) {
    errorTip('获取订单列表失败,币价分组不存在');
  }
  try {
    // 查询当前交易对的挂单数据
    let orderBuy = await orderTableDao.getPriceOrderTotal(pair, 0, pageGroup, pageSize);
    let orderSell = await orderTableDao.getPriceOrderTotal(pair, 1, pageGroup, pageSize);
    // 规整化price_range
    for (let i = 0; i < orderBuy.length; i++) {
      orderBuy[i].price_range = SafeCalc.round(orderBuy[i].price_range, pageGroup.split('.')[1]?.length || 0);
    }
    for (let i = 0; i < orderSell.length; i++) {
      orderSell[i].price_range = SafeCalc.round(orderSell[i].price_range, pageGroup.split('.')[1]?.length || 0);
    }
    // 总结返回对象
    let result = {
      result: true,
      buy: orderBuy,
      sell: orderSell
    };
    // 返回结果
    res.json(httpResult.success(result));
  } catch (error) {
    console.log(error.message, 'getOrderList error -orderController- -------------');
    errorHandle(error, '获取订单列表失败,请稍后再试');
  }
};

// 获取订单列表间隙
export const getOrderGroupGap = async (req, res) => {
  let {id, pair} = req.body;
  // 进行基础的校验
  // 1. 判断参数是否完整
  if (!id || !pair) {
    errorTip('获取订单列表失败,请检查参数是否正确');
  }
  let pairGroupList = await getCoinPairGroupList(pair);
  res.json(httpResult.success({result: true, pairGroupList: pairGroupList}));
};

// 获取交易对价格
export const getPairPrice = async (req, res) => {
  let {id, pair} = req.body;
  // 检查发起者是否是该用户
  queryCheckTransferId(req, id);
  // 进行基础的校验
  // 1. 判断参数是否完整
  if (!id || !pair) {
    errorTip('获取价格失败,请检查参数是否正确');
  }
  try {
    // 查询当前交易对的价格
    // 获取当前交易对价格
    let currentPriceData = await priceTableDao.findOne(pair);
    if (!currentPriceData) {
      errorTip('当前交易对价格不存在');
    }
    let currentPrice = currentPriceData.currency_price;
    // 总结返回对象
    let result = {
      result: true,
      price: currentPrice
    };
    // 返回结果
    res.json(httpResult.success(result));
  } catch (error) {
    console.log(error.message, 'getPrice error -orderController- -');
    errorHandle(error, '获取价格失败,请稍后再试');
  }
};

// 获取最新完成交易订单列表pageSize笔
export const getTradeOrderList = async (req, res) => {
  let {id, pair, pageSize} = req.body;
  // 检查发起者是否是该用户
  queryCheckTransferId(req, id);
  // 进行基础的校验
  // 1. 判断参数是否完整
  if (!id || !pair) {
    errorTip('获取最新完成交易订单列表失败,请检查参数是否正确');
  }
  pageSize = pageSize || 20;
  try {
    // 查询当前交易对的最新完成交易订单列表
    const tradeList = await tradeTableDao.getLatestTrade(pair, pageSize);
    // console.log(tradeList, 'tradeList');
    // 返回结果
    res.json(httpResult.success({result: true, tradeList: tradeList}));
  } catch (error) {
    console.log(error.message, 'getTradeOrderList error -orderController- -');
    errorHandle(error, '获取交易订单列表失败,请稍后再试');
  }
};

// 获取用户当前的挂单列表
export const getUserOrderList = async (req, res) => {
  let {id} = req.body;
  // 检查发起者是否是该用户
  queryCheckTransferId(req, id);
  try {
    // 查询当前用户的挂单列表
    const orderList = await orderTableDao.findUserUnfinishedOrder(id);
    // console.log(orderList[0], 'orderList');
    // 添加成交均价数据
    for (let i = 0; i < orderList.length; i++) {
      let order = orderList[i];
      let orderTradeData = await getOrderTradeData(order.id);
      order.trade_avg_price = orderTradeData.price;
    }
    // console.log(orderList[0], 'orderList');
    // 返回结果
    res.json(httpResult.success({result: true, orderList: orderList}));
  } catch (error) {
    console.log(error.message, 'getUserOrderList error -orderController- -');
    errorHandle(error, '获取用户当前的挂单列表失败,请稍后再试');
  }
};

// 获取用户完成的委托列表
export const getUserOrderFinishList = async (req, res) => {
  let {id, lastId, pageSize} = req.body;
  // 检查发起者是否是该用户
  queryCheckTransferId(req, id);
  // 进行基础的校验
  // 1. 判断参数是否完整
  if (!lastId) {
    errorTip('获取用户完成的委托列表失败,请检查参数是否正确');
  }
  pageSize = pageSize || 20;
  try {
    // 查询当前用户的完成的订单列表
    const orderFinishList = await orderTableDao.findUserFinishedOrderWithPage(id, lastId, pageSize);
    // 添加成交均价数据
    for (let i = 0; i < orderFinishList.rows.length; i++) {
      let order = orderFinishList.rows[i];
      let trade_data = await getOrderTradeData(order.id);
      order.trade_avg_price = trade_data.price;
      order.trade_amount = trade_data.amount;
      order.trade_fee = trade_data.fee;
    }
    // const tradeList = await tradeTableDao.getUserTradeListWithLastId(id, lastId, pageSize);
    // 返回结果
    res.json(httpResult.success({result: true, orderFinishList: orderFinishList}));
  } catch (error) {
    console.log(error.message, 'getUserTradeList error -orderController- -');
    errorHandle(error, '获取用户完成的委托列表失败,请稍后再试');
  }
};

// 获取分时图数据
export const getKLineData = async (req, res) => {
  let {id, pair, timeType, timeStart} = req.body;
  // 检查发起者是否是该用户
  queryCheckTransferId(req, id);
  // 进行基础的校验
  // 1. 判断参数是否完整
  if (!id || !pair || !timeType) {
    errorTip('获取分时图数据失败,请检查参数是否正确');
  }
  // 获取交易对的数据
  const pairData = await coinPairTableDao.findOne(pair);
  if (!pairData) {
    errorTip('获取分时图数据失败,币对不存在');
  }
  if(Number(pairData.start_time) > Number(timeStart)) {
    timeStart = pairData.start_time;
  }
  // 获取当前交易对价格
  let pairPriceData = await priceTableDao.findOne(pair);
  if (!pairPriceData) {
    errorTip('获取分时图数据失败,当前交易对价格不存在');
  }
  try {
    // 查询当前交易对的历史交易数据
    const tradeList = await tradeTableDao.getTradeListByPairAndTime(pair, timeStart, 0);
    console.log(tradeList.length, 'tradeList');
    if(!tradeList.length) {
      // 如果没有交易数据，则返回open、high、low、close都为当前价格的对应时间数组
      let currentPrice = Number(pairPriceData.currency_price);
      let kLineData = [];
      let timeNow = Number(timeStart);
      while(getNow() - timeNow >= timeType) {
        // 填充交易量为0的数据
        let data = {
          time: timeNow,
          volume: 0,
          open: currentPrice,
          high: currentPrice,
          low: currentPrice,
          close: currentPrice,
        };
        // 时间间隔大于时间类型，则将上一个时间段的数据放入kLineData
        kLineData.push(data);
        timeNow = timeNow + timeType;
      }
      return res.json(httpResult.success({result: true, kLineData: kLineData}));
    }
    // 然后计算分时图数据
    let kLineData = [];
    // 1. 遍历交易列表，计算每个时间段的交易量和交易额
    let timeNow = Number(timeStart);
    // 获取这个时间之前的交易价格
    let firstPrice = Number(pairPriceData.init_price);
    let firstPriceData = await priceUpdateTableDao.findOneByTime(pair, timeNow);
    if (firstPrice) {
      console.log(firstPrice, 'firstPrice', timeNow, 'timeNow');
      firstPrice = Number(firstPriceData.price);
    }
    let data = {
      time: timeNow,
      volume : 0,
      open: firstPrice,
      high: firstPrice,
      low: firstPrice,
      close: firstPrice,
    };
    for (let i = 0; i < tradeList.length; i++) {
      let trade = tradeList[i];
      let time = Number(trade.trade_time);
      let amount = Number(trade.trade_amount);
      let price = trade.trade_price;
      if(time - timeNow >= timeType) {
        // let flag = false;
        while(time - timeNow >= timeType) {
          // 时间间隔大于2倍时间类型，则将上一个时间段的数据放入kLineData
          kLineData.push(data);
          // 填充交易量为0的数据
          data = {
            time: timeNow,
            volume: 0,
            open: price,
            high: price,
            low: price,
            close: price,
          };
          // data = {
          //   time: timeNow,
          //   volume: 0,
          //   open: data.close,
          //   high: data.close,
          //   low: data.close,
          //   close: data.close,
          // };
          timeNow = timeNow + timeType;
          // flag = true;
        }
        // if(flag) {
        //   continue;
        // }
        // // 将数据放入kLineData
        // kLineData.push(data);
        // console.log(trade, 'trade');
        // // 重置当前时间段的数据
        // data = {
        //   time: time,
        //   volume: amount,
        //   open: price,
        //   high: price,
        //   low: price,
        //   close: price,
        // };
        // timeNow = time;
      } else {
        // 更新当前时间段的交易量和交易额
        data['volume'] += amount;
        if(price > data.high) {
          data.high = price;
        }
        if(price < data.low) {
          data.low = price;
        }
        data.close = price;
      }
    }
    kLineData.push(data);
    // 补充空数据
    while(getNow() - timeNow >= timeType) {
      // 填充交易量为0的数据
      data = {
        time: timeNow,
        volume: 0,
        open: data.close,
        high: data.close,
        low: data.close,
        close: data.close,
      };
      // 时间间隔大于时间类型，则将上一个时间段的数据放入kLineData
      kLineData.push(data);
      timeNow = timeNow + timeType;
    }
    // console.log(kLineData, 'kLineData');
    // 返回结果
    res.json(httpResult.success({result: true, kLineData: kLineData}));
  } catch (error) {
    console.log(error.message, 'getKLineData error -orderController- -');
    errorHandle(error, '获取分时图数据失败,请稍后再试');
  }
};

// 获取交易对24小时信息 缓存起来 每小时有新的请求就去mysql查询并缓存
export const getPairDayInfo = async (req, res) => {
  let {id, pair} = req.body;
  // 检查发起者是否是该用户
  queryCheckTransferId(req, id);
  // 进行基础的校验
  // 1. 判断参数是否完整
  if (!id || !pair) {
    errorTip('获取交易对24小时信息失败,请检查参数是否正确');
  }
  try {
    // 查询当前交易对的24小时信息
    const dayInfo = await getPairDayInfoFromCache(pair);
    // 返回结果
    res.json(httpResult.success({result: true, dayInfo: dayInfo}));
  } catch (error) {
    console.log(error.message, 'getPairDayInfo error -orderController- -');
    errorHandle(error, '获取交易对24小时信息失败,请稍后再试');
  }
};

// todo: 获取用户想查看详情的订单

