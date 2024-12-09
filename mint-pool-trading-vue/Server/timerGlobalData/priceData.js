import {getPrice} from "../api/api_coin_price/useCoinPrice.js";

const coinPrice = {};
const coinList = ["BNB", "BTC", "ETH", "USDT", "OKB", "SOL", "ORDI", "DOGE", "MATIC"];

const getCoinPrice = async (name) => {
  let res = await getPrice(name);
  if (!res) {
    return "";
  }
  // console.log(name, res.price, 'getCoinPrice');
  coinPrice[name] = res.price; // 存储价格
};

const getCoinsPrice = async () => {
  for (let i = 0; i < coinList.length; i++) {
    let name = coinList[i];
    await getCoinPrice(name);
  }
  // 每2分钟获取一次
  setTimeout(getCoinsPrice, 1000 * 60 * 2);
};

getCoinsPrice();

/**
 * 异步获取币种价格
 * @param name {CoinType}
 * @returns {Promise<*|number>}
 */
export const useCoinPrice = async (name) => {
  // 判断name是不是在coinList中，不在就直接报错
  if (!coinList.includes(name)) {
    throw new Error("Invalid coin name");
  }
  // 判断coinPrice中是否有name对应的值，没有就获取一次
  // console.log("coinPrice", coinPrice);
  if (!coinPrice[name]) {
    await getCoinPrice(name);
  }
  // 返回name对应的值
  return coinPrice[name] || 0;
};

/**
 * 同步获取币种价格
 * @param name {CoinType}
 * @returns {*|number}
 */
export const useCoinsPriceSync = (name) => {
  if (!coinList.includes(name)) {
    throw new Error("Invalid coin name");
  }
  return coinPrice[name] || 0;
};
