// 初始化一些数据
// 税收阶梯
import taxTableDao from "./taxTable.js";
import rateTableDao from "./rateTable.js";
import mintRateDao from "./mintRate.js";

// 税收阶梯
let taxLadder = [
  {level: 0, rate: 0, output: 20},
  {level: 1, rate: 1, output: 50},
  {level: 2, rate: 2, output: 100},
  {level: 3, rate: 3, output: 200},
  {level: 4, rate: 5, output: 300},
  {level: 5, rate: 10, output: 500},
  {level: 6, rate: 15, output: 1000},
  {level: 7, rate: 20, output: 100*100000000},
];
// 挖矿算力与总产量阶梯
let mintRateLadder = [
  {level: 0, mintRate: 32, output: 1000000},
  {level: 1, mintRate: 16, output: 10000000},
  {level: 2, mintRate: 8, output:  50000000},
  {level: 3, mintRate: 4, output: 100000000},
  {level: 4, mintRate: 2, output: 10*100000000},
  {level: 5, mintRate: 1, output: 100*100000000},
  {level: 5, mintRate: 0, output: 1000*100000000},
];
// 当前算力数据
let currentData = {
  total: 100*100000000,
  output: 0,
  curMintRate: mintRateLadder[0].mintRate
};

// 判断taxTable数据是否写入过了
const isInitDataTaxTable = async () => {
  let res = await taxTableDao.getAll();
  return  res.length !== 0;
};

// 判断rateTable数据是否写入了
const isInitDataRateTable = async () => {
  let res = await rateTableDao.getAll();
  return  res.length !== 0;
};

// 判断mintRate数据是否写入了
const isInitDataMintRate = async () => {
  let res = await mintRateDao.getMintRate();
  return !!res;
};

const initData = async () => {
  if(!await isInitDataTaxTable()) {
    // 初始化税收数据
    for (let i = 0; i < taxLadder.length; i++) {
      let data = taxLadder[i];
      await taxTableDao.add(data.output, data.rate);
    }
  }
  console.log(`初始化税收数据完成`);
  if(!await isInitDataRateTable()) {
    // 初始化挖矿基础速度数据
    for (let i = 0; i < mintRateLadder.length; i++) {
      let data = mintRateLadder[i];
      await rateTableDao.add(data.output, data.mintRate);
    }
  }
  console.log(`初始化挖矿基础速度数据完成`);

  if(!await isInitDataMintRate()) {
    // 初始化当前算力数据
    await mintRateDao.add(currentData.total, currentData.output, currentData.curMintRate);
  }
  console.log(`初始化当前算力数据完成`);
};
initData();
