import {getCoinPrice} from "./coin_price_api.js";
/**
 * @typedef {'BNB'|'BTC'|'ETH'|'USDT'|'OKB'|'SOL'|'ORDI'|'DOGE'|'MATIC'} CoinType
 * @global
 */
/**
 *
 * @param name {CoinType}
 * @returns {Promise<string|{name: string, price: string}>}
 */
export const getPrice = async (name) => {
  try {
    let result = await getCoinPrice(name);
    let data = result.data;
    if (data.code !== 200) {
      return "";
    }
    return {
      name,
      price: data.msg.price
    };
  }catch (e) {
    console.error(e.message);
    return "";
  }
};
