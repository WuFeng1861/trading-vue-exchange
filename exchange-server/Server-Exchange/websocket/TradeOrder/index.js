import {getSockets} from "../socketCollection.js";
import {SOCKET_COLLECTION_CONSTANTS} from "../socketString.js";
import {socketEmit} from "../utils.js";
import {SOCKET_EMITS} from "../socketEmits.js";
import {getNow, sleep, websocketResult} from "../../utils/utils.js";
import tradeTableDao from "../../Mysql/Dao/tradeTable.js";
import {addTask} from "../coroutine/index.js";

const emitPairTradeOrder = (coinPair, data) => {
  let sockets = getSockets(SOCKET_COLLECTION_CONSTANTS.PAIR_TRADE_COLLECTION + coinPair);
  for (let i = 0; i < sockets.length; i++) {
    let socket = sockets[i];
    socketEmit(socket, SOCKET_EMITS.PAIR_TRADE, websocketResult.success('pairTradeOrder', {coinPair, data}));
  }
};

const pairList = ['MERC-USDT'];

const getPairTradeOrder = async (coinPair) => {
  // 获取最新20个的订单数据
  let data = await tradeTableDao.getLatestTrade(coinPair);
  emitPairTradeOrder(coinPair, data);
};

// 启动定时任务，每隔1秒钟取一次最新订单数据
let interval = 1000;

async function tradeOrderCoroutine() {
  let now = getNow();
  for (let i = 0; i < pairList.length; i++) {
    await getPairTradeOrder(pairList[i]);
  }
  let sleepTime = interval - (getNow() - now);
  if (sleepTime > 0) {
    await sleep(sleepTime);
  }
}

addTask(tradeOrderCoroutine);
