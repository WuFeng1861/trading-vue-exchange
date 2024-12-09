import db from "../models/index.js";
import {getNow} from "../../utils/utils.js";

let coinPairTable = db.coinPairTable;
let coinPairTableDao = {};

// 创建一个交易对
coinPairTableDao.create = async (coin_first, coin_second, t) => {
  let time = getNow();
  let start_time = time - time % 1000;
  const coin_pair = `${coin_first}-${coin_second}`;
  return await coinPairTable.create({coin_pair, coin_first, coin_second, start_time}, {transaction: t});
};

// 获取订单的消耗币种如果是购买则返回后面的币种，如果是卖出则返回前面的币种 0 购买 1 卖出
coinPairTableDao.getConsumedCoin = async (coin_pair, type) => {
  const coin_pair_info = await coinPairTable.findOne({where: {coin_pair}, raw: true});
  return type === 0? coin_pair_info.coin_second : coin_pair_info.coin_first;
};

// 根据交易对名称获取交易对信息
coinPairTableDao.findOne = async (coin_pair) => {
  return await coinPairTable.findOne({where: {coin_pair}, raw: true});
};

// 根据交易对id获取交易对信息
coinPairTableDao.findById = async (id) => {
  return await coinPairTable.findOne({where: {id}, raw: true});
};

// 获取所有交易对信息
coinPairTableDao.findAll = async () => {
  return await coinPairTable.findAll({raw: true});
};

export default coinPairTableDao;
