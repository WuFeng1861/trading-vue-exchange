import {queryCheckTransferId} from "./routerUtils.js";
import userBalanceDao from "../Mysql/Dao/userBalance.js";
import {errorTip, getNow, httpResult} from "../utils/utils.js";
import {addUserCoinBalance} from "./utils.js";
import sequelize from "../Mysql/models/init.js";
import {LRUCache} from "../utils/LRUCache.js";
import userFaucetDao from "../Mysql/Dao/userFaucet.js";

const initAssetList = ['MERC', 'USDT'];
export const getUserAssets = async (req, res) => {
  const {id} = req.body;
  queryCheckTransferId(req, id);
  let userAssets = await userBalanceDao.findAll(id);
  if (userAssets.length === 0) {
    userAssets = [{
      user_id: id,
      currency: 'MERC',
      balance: '0'
    }, {
      user_id: id,
      currency: 'USDT',
      balance: '0'
    }];
  }
  for (let j = 0; j < initAssetList.length; j++) {
    let asset = initAssetList[j];
    for (let i = 0; i < userAssets.length; i++) {
      if (userAssets[i].currency === asset) {
        break;
      }
      if (i === userAssets.length - 1) {
        userAssets.push({
          user_id: userAssets[0].user_id,
          currency: asset,
          balance: '0'
        });
      }
    }
  }
  let result = {
    result: true,
    userAssets
  };
  res.json(httpResult.success(result));
};

// 水龙头领取MERC、USDT
const userWaterDropCache = new LRUCache(10000);
// 获取水龙头
export const getWaterDrop = async (req, res) => {
  const {id} = req.body;
  queryCheckTransferId(req, id);
  const waterDropCoinList = [
    {
      currency: 'USDT',
      amount: '100'
    },
    {
      currency: 'MERC',
      amount: '100000'
    }
  ];
  if (userWaterDropCache.has(id) && userWaterDropCache.get(id) > getNow()) {
    errorTip('您今日已领取水龙头，请明天再来领取');
    return;
  }
  const t = await sequelize.transaction();
  try {
    let userFaucet = await userFaucetDao.getByUserId(id);
    if(userFaucet && userFaucet.nexttime > getNow()){
      errorTip('您今日已领取水龙头，请明天再来领取');
      return;
    }
    for (let i = 0; i < waterDropCoinList.length; i++) {
      let waterDropCoin = waterDropCoinList[i].currency;
      let addAmount = waterDropCoinList[i].amount;
      await addUserCoinBalance(id, waterDropCoin, addAmount, t);
    }
    // 修改用户获取水龙头的下次时间
    if (userFaucet) {
      await userFaucetDao.update(id, t);
    } else {
      await userFaucetDao.create(id, t);
    }
    await t.commit();
    userWaterDropCache.set(id, getNow() + 24 * 60 * 60 * 1000);
    res.json(httpResult.success({result: true}));
    return;
  } catch (e) {
    await t.rollback();
    console.log(e.message, 'getWaterDrop error');
    res.json(httpResult.error(e.message));
  }
};

// 获取下次水龙头领取时间
export const getWaterDropTime = async (req, res) => {
  const {id} = req.body;
  queryCheckTransferId(req, id);
  const nextTime = userWaterDropCache.get(id);
  if (nextTime) {
    res.json(httpResult.success({result: true, nextTime}));
  } else {
    // mysql
    const userFaucet = await userFaucetDao.getByUserId(id);
    if (userFaucet) {
      res.json(httpResult.success({result: true, nextTime: userFaucet.nexttime}));
      return;
    }
    res.json(httpResult.success({result: true, nextTime: null}));
  }
};



