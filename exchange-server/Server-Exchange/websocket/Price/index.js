import priceTableDao from "../../Mysql/Dao/priceTable.js";
import SafeCalc from "../../utils/bignumberjs.js";
import {SOCKET_EMITS} from "../socketEmits.js";
import {getNow, sleep, websocketResult} from "../../utils/utils.js";
import {socketEmit} from "../utils.js";
import {getSockets} from "../socketCollection.js";
import {SOCKET_COLLECTION_CONSTANTS} from "../socketString.js";
import {addTask} from "../coroutine/index.js";

const pairList = ['MERC-USDT'];
let coinPriceCache = {};

const emitPrice = (coinPair, price) => {
  let sockets = getSockets(SOCKET_COLLECTION_CONSTANTS.COIN_PAIR_PRICE_COLLECTION + coinPair);
  for (let i = 0; i < sockets.length; i++) {
    let socket = sockets[i];
    socketEmit(socket, SOCKET_EMITS.ONE_COIN_PRICE, websocketResult.success('coinPairPrice', {coinPair, price}));
  }
};

const getCoinPrice = async (coinPair) => {
  // 获取价格
  let priceData = await priceTableDao.findOne(coinPair);
  if (!priceData) {
    return null;
  }
  let price = priceData.currency_price;
  // console.log('coinPair price change1', coinPair, price, coinPriceCache[coinPair]);
  if (!price) {
    return;
  }
  if (!coinPriceCache[coinPair]) {
    coinPriceCache[coinPair] = price;
    emitPrice(coinPair, price);
    return;
  }
  if (SafeCalc.compare(price, coinPriceCache[coinPair]) === '0') {
    return;
  }
  // console.log('coinPair price change2', coinPair, price, coinPriceCache[coinPair]);
  coinPriceCache[coinPair] = price;
  emitPrice(coinPair, price);
};

let interval = 300;
async function priceCoroutine() {
  let now = getNow();
  for (let i = 0; i < pairList.length; i++) {
    await getCoinPrice(pairList[i]);
  }
  let sleepTime = interval - (getNow() - now);
  if (sleepTime > 0) {
    await sleep(sleepTime);
  }
}

addTask(priceCoroutine);



