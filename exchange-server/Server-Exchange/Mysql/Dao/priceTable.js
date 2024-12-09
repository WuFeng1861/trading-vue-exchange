import db from "../models/index.js";
import SafeCalc from "../../utils/bignumberjs.js";

let priceTable = db.priceTable;
let priceTableDao = {};

// 创建交易对价格数据
priceTableDao.create = async (currency_pair, currency_price, t) => {
  let init_price = currency_price;
  let min_price = currency_price;
  let max_price = currency_price;
  return await priceTable.create({currency_pair, currency_price, init_price, max_price, min_price}, {transaction: t});
};

// 查询交易对价格数据
priceTableDao.findOne = async (currency_pair) => {
  return await priceTable.findOne({where: {currency_pair: currency_pair}, raw: true});
};

// 更新交易对价格数据 同时更新最大最小价格
priceTableDao.update = async (currency_pair, currency_price, t, min_price = null, max_price = null) => {
  let updatePrice = {
    currency_price: currency_price
  };
  if (min_price) {
    updatePrice.min_price = min_price;
  }
  if (max_price) {
    updatePrice.max_price = max_price;
  }
  return await priceTable.update(updatePrice, {where: {currency_pair: currency_pair}, transaction: t});
};

export default priceTableDao;
