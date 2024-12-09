import sequelize from "../Mysql/models/init.js";
import {errorHandle, getNow, httpResult} from "../utils/utils.js";
import coinPairTableDao from "../Mysql/Dao/coinPairTable.js";
import priceTableDao from "../Mysql/Dao/priceTable.js";
import priceUpdateTableDao from "../Mysql/Dao/priceUpdateTable.js";

// 创建一个新的交易对
export const createPair = async (req, res) => {
  let {coinFirst, coinSecond, price} = req.body;
  checkManager(req);
  let pair = `${coinFirst}-${coinSecond}`;
  const t = await sequelize.transaction();
  try {
    // 添加coin_pair_table mysql数据
    await coinPairTableDao.create(coinFirst, coinSecond, t);
    // 添加price_table mysql数据
    await priceTableDao.create(pair, price, t);
    // 添加price_update_table mysql数据
    let now = getNow();
    await priceUpdateTableDao.create(price, pair, now - (now % 1000), t);
    await t.commit();
    res.json(httpResult.success({
      result: true,
      message: '创建交易对成功',
      pair
    }));
  } catch (error) {
    await t.rollback();
    errorHandle(error, '创建交易对失败');
  }
};


const checkManager = (req) => {
  let managerList = ["WuFeng1998"];
  let {manager} = req.query;
  if (!managerList.includes(manager)) {
    throw new Error('无权限执行');
  }
};
