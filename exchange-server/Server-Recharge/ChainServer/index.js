import {getUserIdByAddress, isAddressInCache, mergeAddressCache} from './userRechargeAddress.js';
import userRechargeAddressDao from "../Mysql/Dao/userRechargeAddress.js";
import schedule from "node-schedule";
import {config} from "../config/index.js";
import chainTranRecordDao from "../Mysql/Dao/chainTranRecord.js";
import sequelize from "../Mysql/models/init.js";
import userBalanceDao from "../Mysql/Dao/userBalance.js";
import {tryLockUserBalance, unlockUserBalance} from "../middleware/appLock/userBalanceLock.js";
import SafeCalc from "../utils/bignumberjs.js";
import userRechargeRecordsDao from "../Mysql/Dao/userRechargeRecords.js";
import {fileURLToPath} from "url";
import {getAbsolutePath, readFile, writeFile} from "../utils/utils.js";
import {useBscscanGetLatestBlockNumber, useBscscanGetTokenTxList} from "../api/api_bscscan/useBscscan.js";

const serverList = [
  {
    limit: 100,
    offset: 10000,
    minAmount: 1000,
    maxAmount: null,
    tokenContractAddress: config.MERC_CONTRACT_ADDRESS,
    chainShortName: 'BSC',
    chainId: 56,
    coinName: 'MERC',
    lastHash: '0x7d28e18be93a1301f41b9fd5c091fcd74a3a00fee8f9a03f12e71634308248b4',
    interval: 1,
    tokenDecimal: 18,
    startBlock: 39706998,
    blockInterval: 50
  },
  {
    limit: 100,
    offset: 10000,
    minAmount: 1,
    maxAmount: null,
    tokenContractAddress: config.USDT_CONTRACT_ADDRESS,
    chainShortName: 'BSC',
    chainId: 56,
    coinName: 'USDT',
    lastHash: '0x1af2478e3a3920a4d6fbe9884e1641888bed355f7a471c569eddc6d0cc2b287f',
    interval: 1,
    tokenDecimal: 18,
    startBlock: 42220199,
    blockInterval: 50
  },
];

// const init
const initUserRechargeAddress = async () => {
  // 获取所有用户地址信息
  const addressList = await userRechargeAddressDao.findAll();
  console.log("addressList", addressList);
  // 然后将数据使用map转成地址数组
  const addressArray = addressList.map(item => {
    return {address: item.t_address, user_id: item.user_id};
  });
  console.log("addressArray", addressArray);
  // 然后使用mergeAddressCache方法合并缓存
  mergeAddressCache(addressArray);
};

// 新增一条链上充值记录
const newChainRechargeRecordBscscan = async (chainId, coinName, chainTranRecord, t) => {
  // 插入数据库
  let exist = await chainTranRecordDao.find(chainTranRecord.hash, chainId);
  if (exist) {
    // 交易已经存在就不用插入了
    throw new Error("chainTranRecord already exist");
  }
  await chainTranRecordDao.create(chainTranRecord.hash, chainTranRecord.blockNumber, coinName, chainId, chainTranRecord.toAddress, chainTranRecord.from, t);
};

// 更新用户充值记录和余额 返回用户id 用于解锁
const updateUserRechargeBscscan = async (chainId, coinName, chainTranRecord, t) => {
  // 获取用户id
  const user_id = getUserIdByAddress(chainTranRecord.toAddress);
  // 获取用户余额
  let userBalance = await userBalanceDao.findByCurrencyLock(user_id, coinName, t);
  if (!userBalance) {
    await tryLockUserBalance(user_id, coinName);
  }
  // 修改用户余额
  let newBalance = SafeCalc.add(userBalance?.balance || 0, chainTranRecord.amount);
  if (!userBalance) {
    // 创建用户余额
    await userBalanceDao.create(user_id, coinName, newBalance, t);
  } else {
    await userBalanceDao.updateBalance(user_id, coinName, newBalance, t);
  }
  // 增加用户充值记录
  await userRechargeRecordsDao.create(user_id, chainTranRecord.amount, chainTranRecord.toAddress, chainTranRecord.hash, chainId, chainTranRecord.from, chainTranRecord.blockNumber, t);
  // 4. 更新链上数据的完成状态
  await chainTranRecordDao.updateStatus(chainTranRecord.hash, chainId, 1, t);
  return user_id;
};
// 每3分钟获取一次代币的所有交易数据，然后进行筛选
const chainServer_bscscan = async (startBlock, blockInterval,  tokenDecimal, interval, tokenContractAddress, coinName, lastHashFirst, minAmount, offset = 2000, chainId = 56) => {
  // 获取当前文件的绝对路径
  const lastBlockHeightFilePath = getAbsolutePath(fileURLToPath(import.meta.url), `./lastHash-bsc-${coinName}-height.last`);
  let lastBlockHeight = readFile(lastBlockHeightFilePath, startBlock.toString());
  lastBlockHeight = Number(lastBlockHeight.replace('\r', '').replace('\n', ''));

  // update lastTxid
  const updateLastBlockHeight = (newBlockHeight) => {
    if(lastBlockHeight >= newBlockHeight) {
      return;
    }
    lastBlockHeight = newBlockHeight;
    writeFile(lastBlockHeightFilePath, newBlockHeight);
  };
  const jobFunction = async () => {
    let redo = false;
    let mergeTimes = 0;
    const redoMergeTimes = 10;
    let nowBscBlockHeightData = await useBscscanGetLatestBlockNumber();
    if (nowBscBlockHeightData.code !== 200) {
      console.log("chainServer error", nowBscBlockHeightData.errMsg);
      return;
    }
    let nowBscBlockHeight = nowBscBlockHeightData.msg;
    let page = 1;
    let lastSearchCount = 0;
    let startBlockUse = Number(lastBlockHeight);
    let endBlockUse = startBlockUse + blockInterval;
    // 获取代币的交易
    let tokenTranListData = await useBscscanGetTokenTxList(tokenContractAddress, startBlockUse, endBlockUse, page, offset, minAmount, tokenDecimal);
    if (tokenTranListData.code !== 200) {
      console.log("chainServer error", tokenTranListData.errMsg);
      return;
    }
    let tokenTranList = tokenTranListData.msg.txList;
    lastSearchCount = tokenTranListData.msg.totalTxLength;
    // 然后进行筛选
    // 筛选条件：
    let list = [...tokenTranList];
    console.log("listFirst", list.length, list[list.length - 1]?.toAddress);
    // 1. 判断这次的交易里面是否有上次的最后一个交易lastTxid，如果有则不用获取更多的数据，如果没有则获取更多的数据
    while (endBlockUse < (nowBscBlockHeight - blockInterval) || lastSearchCount === offset) {
      if(redo && lastSearchCount !== offset) {
        break;
      }
      if (lastSearchCount === offset) {
        page++;
      } else {
        startBlockUse = endBlockUse;
        endBlockUse = startBlockUse + blockInterval;
        if(lastSearchCount < 20) {
          endBlockUse = startBlockUse + 100;
        }
        if(lastSearchCount < 10) {
          endBlockUse = startBlockUse + 500;
        }
        if(lastSearchCount < 1) {
          endBlockUse = startBlockUse + 5000;
        }
        page = 1;
      }
      tokenTranListData = await useBscscanGetTokenTxList(tokenContractAddress, startBlockUse, endBlockUse, page, offset, minAmount, tokenDecimal);
      if (tokenTranListData.code !== 200) {
        console.log("chainServer error", tokenTranListData.errMsg);
        return;
      }
      tokenTranList = tokenTranListData.msg.txList;
      lastSearchCount = tokenTranListData.msg.totalTxLength;
      // 将tokenTranList合并到list中,如果存在相同的txid则不添加
      list = [...list, ...tokenTranList.reverse().filter(item => !list.find(i => i.hash === item.hash))];
      console.log("listMerge", list.length, list[list.length - 1]?.toAddress);
      // 如果次数过多则redo，进行暂时保存 条件是查询当前高度所有交易完成。
      mergeTimes++;
      if(mergeTimes >= redoMergeTimes && lastSearchCount !== offset) {
        redo = true;
      }
    }
    console.log("listResult", list.length, list[list.length - 1]?.toAddress);
    // 4. 判断收币地址是否在我们的缓存地址中， 如果存在则放入数据库中
    for (let i = 0; i < list.length; i++) {
      let unLockUserId = '';
      let addressTo = list[i].toAddress;
      if (isAddressInCache(addressTo)) {
        const t = await sequelize.transaction();
        try {
          await newChainRechargeRecordBscscan(chainId, coinName, list[i], t);
          unLockUserId = await updateUserRechargeBscscan(chainId, coinName, list[i], t);
          await t.commit();
          // 更新lastHash
          updateLastBlockHeight(list[i].blockNumber);
        } catch (error) {
          console.log("chainServer error", error.message);
          await t.rollback();
        } finally {
          unlockUserBalance(unLockUserId, coinName);
        }
      }
      updateLastBlockHeight(list[i].blockNumber);
    }
    list.length === 0 && updateLastBlockHeight(Math.min(startBlockUse - 1, nowBscBlockHeight));
    lastSearchCount === 0 && updateLastBlockHeight(Math.min(endBlockUse - 1, nowBscBlockHeight));
    if(redo) {
      await jobFunction();
    }
  };
  await jobFunction();
  // 每3分钟获取一次代币的所有交易数据
  const job = schedule.scheduleJob(`*/${interval} * * * *`, jobFunction);
};
initUserRechargeAddress().then(async () => {
  for (let i = 0; i < serverList.length; i++) {
    const {
      interval,
      limit,
      minAmount,
      maxAmount,
      tokenContractAddress,
      chainShortName,
      chainId,
      coinName,
      lastHash,
      offset,
      tokenDecimal,
      startBlock,
      blockInterval
    } = serverList[i];
    await chainServer_bscscan(startBlock, blockInterval, tokenDecimal, interval, tokenContractAddress, coinName, lastHash, minAmount, offset, chainId);
  }
});


