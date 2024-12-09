import bscscan_instance from "./bscscan_instance.js";
import {apiRateLimit} from "../apiRateLimit.js";
import {getNow} from "../../utils/utils.js";

const rateLimit = apiRateLimit(2, 1000);
const API_KEY = 'Q2DYXJRUGJKS5TYF6PW7SCGM7KNCPPUZXV';

// 获取BSC代币交易列表
export const getBSCTokenTransferList = async (address, startBlock, endBlock, page, offset = 2000) => {
  let obj = {
    module: 'account',
    action: 'txlist',
    sort: 'desc',
    apikey: API_KEY,
    address,
    page,
    offset,
    startblock: startBlock,
    endblock: endBlock
  };
  if (!page) {
    delete obj.page;
  }
  if (!startBlock) {
    delete obj.startblock;
  }
  if (!endBlock) {
    delete obj.endblock;
  }
  console.log(obj, "getBSCTokenTransferList");
  await rateLimit.waitPermission();
  return bscscan_instance.get('', {
    params: obj
  });
};

// 获取BSC块高
export const getBSCBlockNumber = async () => {
  let obj = {
    module: 'block',
    action: 'getblocknobytime',
    timestamp: Math.floor(getNow() / 1000),
    closest: 'before',
    apikey: API_KEY
  };
  await rateLimit.waitPermission();
  return bscscan_instance.get('', {
    params: obj
  });
};

// 获取BNB价格
export const getBNBPrice = async () => {
  let obj = {
    module: 'stats',
    action: 'bnbprice',
    apikey: API_KEY
  };
  await rateLimit.waitPermission();
  return bscscan_instance.get('', {
    params: obj
  });
};


// 获取交易的状态
export const getTransactionStatus = async (txHash) => {
  let obj = {
    module: 'transactions',
    action: 'gettxreceiptstatus',
    txhash: txHash,
    apikey: API_KEY
  };
  await rateLimit.waitPermission();
  return bscscan_instance.get('', {
    params: obj
  });
};