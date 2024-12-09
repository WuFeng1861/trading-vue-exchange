import orderTableDao from "../Mysql/Dao/orderTable.js";
import sequelize from "../Mysql/models/init.js";
import coinPairTableDao from "../Mysql/Dao/coinPairTable.js";
import priceTableDao from "../Mysql/Dao/priceTable.js";
import {errorHandle, getNow} from "../utils/utils.js";
import priceUpdateTableDao from "../Mysql/Dao/priceUpdateTable.js";

const coin_pair = 'MERC-USDT';

// 生成随机数据
const generateRandomData = async (num) => {
  const t = await sequelize.transaction();
  try {
    for (let i = 0; i < num; i++) {
      const user_id = 1;
      const price = (Math.random() * 1.5 + 1).toFixed(4); // 随机在1-1.5之间的小数，保留4位小数
      const amount = Math.floor(Math.random() * 10000) + 100; // 随机100-10000的整数
      const type = Math.floor(Math.random() * 2); // 随机0或1
      await orderTableDao.create(user_id, type, price, amount, coin_pair, t);
    }
    await t.commit();
  } catch (error) {
    await t.rollback();
    console.log(error);
  }
  console.log('生成随机数据完成');
};

// 创建新的交易对
const createNewCoinPair = async (coin_data) => {
  let {coinFirst, coinSecond, price} = coin_data;
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
    console.log('创建交易对成功');
  } catch (error) {
    await t.rollback();
    console.log('创建交易对失败', error.message);
    errorHandle(error, '创建交易对失败');
  }
};

// 批量插入数据
// generateRandomData(1000);

// 创建新的交易对
// createNewCoinPair({
//     coinFirst: 'MERC',
//     coinSecond: 'USDT',
//     price: 1
//   });



