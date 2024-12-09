import {getSockets} from "../socketCollection.js";
import {SOCKET_COLLECTION_CONSTANTS} from "../socketString.js";
import {socketEmit} from "../utils.js";
import {SOCKET_EMITS} from "../socketEmits.js";
import {getNow, sleep, websocketResult} from "../../utils/utils.js";
import {getCoinPairGroupList} from "../../controllers/utils.js";
import orderTableDao from "../../Mysql/Dao/orderTable.js";
import SafeCalc from "../../utils/bignumberjs.js";
import {addTask} from "../coroutine/index.js";

const emitPairGapOrder = (coinPair, gap, data) => {
  let sockets = getSockets(SOCKET_COLLECTION_CONSTANTS.GAP_ORDER_COLLECTION + coinPair + gap);
  console.log(`sockets ${sockets.length}`);
  if(sockets.length !== 0) {
    console.log(`emitPairGapOrder ${sockets[0].id} ${SOCKET_COLLECTION_CONSTANTS.GAP_ORDER_COLLECTION + coinPair + gap}`);
  }
  for (let i = 0; i < sockets.length; i++) {
    let socket = sockets[i];
    socketEmit(socket, SOCKET_EMITS.GAP_ORDER, websocketResult.success('pairGapOrder', {coinPair, gap, data}));
  }
};

const pairList = ['MERC-USDT'];
const pairLastOrderId = {};

const getPairGapOrder = async (coinPair, gapList) => {
  if (!pairLastOrderId[coinPair]) {
    pairLastOrderId[coinPair] = 0;
  }
  // 获取最新订单的id
  let latestOrder = await orderTableDao.findCurrencyPairLatestOrder(coinPair);
  if (!latestOrder) {
    return;
  }
  // 如果最新订单的id大于上一次的id，则获取最新订单数据
  // console.log('latestOrder', latestOrder.id, 'pairLastOrderId', pairLastOrderId[coinPair]);
  if (SafeCalc.compare(pairLastOrderId[coinPair], latestOrder.id) === '-1') {
    for (let i = 0; i < gapList.length; i++) {
      let gap = gapList[i];
      // 获取最新订单数据
      // 查询当前交易对的挂单数据
      let orderBuy = await orderTableDao.getPriceOrderTotal(coinPair, 0, gap, 20);
      let orderSell = await orderTableDao.getPriceOrderTotal(coinPair, 1, gap, 20);
      // 规整化price_range
      for (let i = 0; i < orderBuy.length; i++) {
        orderBuy[i].price_range = SafeCalc.round(orderBuy[i].price_range, gap.split('.')[1]?.length || 0);
      }
      for (let i = 0; i < orderSell.length; i++) {
        orderSell[i].price_range = SafeCalc.round(orderSell[i].price_range, gap.split('.')[1]?.length || 0);
      }
      // 发送数据
      emitPairGapOrder(coinPair, gap, {orderBuy, orderSell});
    }
    // 更新最新订单id
    pairLastOrderId[coinPair] = latestOrder.id;
  }
};

// 启动协程任务
let interval = 300;
let lastTime = 0;
const coroutineFunc = async () => {
  let now = getNow();
  if (now - lastTime < interval) {
    return;
  }
  for (let i = 0; i < pairList.length; i++) {
    // 获取gap数组
    let gapList = await getCoinPairGroupList(pairList[i]);
    await getPairGapOrder(pairList[i], gapList);
  }
  lastTime = now;
};
addTask(coroutineFunc);
