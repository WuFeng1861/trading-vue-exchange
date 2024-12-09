import coinPairTableDao from "../../Mysql/Dao/coinPairTable.js";
import {getNow, sleep} from "../../utils/utils.js";
import {useKLineIntervalList} from "../../Types/kLineDataTypes.js";
import priceTableDao from "../../Mysql/Dao/priceTable.js";
import {generateKLines, getPairKLines} from "./generateKline.js";
import {addTask} from "../coroutine/index.js";

const pairList = ['MERC-USDT'];
const pairDataCache = {};
// 每间隔1s去找一次数据库，将价格变化和交易量变化写入到缓存中
const interval = 1000;
let lastTime = 0;

export const getKLineDataByPairAndGap = (pair, gap) => {
  // console.log(`获取${pair}K线数据，间隔${gap}`);
  // console.log(kLineCache);
  // 截取后300条数据
  let result = getPairKLines(pair, gap).slice(-300);
  // console.log(result[result.length - 1]);
  return result;
};

// 获取交易对的数据
const getPairData = async () => {
  for (let i = 0; i < pairList.length; i++) {
    const pair = pairList[i];
    const coinPair = await coinPairTableDao.findOne(pair);
    const coinPrice = await priceTableDao.findOne(pair);
    pairDataCache[pair] = {...coinPair, ...coinPrice};
    console.log(`获取${pair}数据成功`, coinPair);
  }
};

const getKLineData = async () => {
  // 首先获取当前时间
  const now = getNow();
  if (now - lastTime < interval) {
    // 如果间隔时间小于1s，则跳过
    await sleep(interval - (now - lastTime));
    return;
  }
  let kLineInterval = useKLineIntervalList();
  let intervals = kLineInterval.map(item => item['value']);
  // 循环遍历交易对列表，获取每个交易对的K线数据
  for (let i = 0; i < pairList.length; i++) {
    let pair = pairList[i];
    await generateKLines(pair, intervals);
    // console.log(`生成${pair}K线数据成功`);
  }
  lastTime = now;
};

// 启动协程任务
addTask(getKLineData);


