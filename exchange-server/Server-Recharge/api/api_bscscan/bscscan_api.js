import bscscan_instance from "./bscscan_instance.js";
import {apiRateLimit} from "../apiRateLimit.js";
import {getNow} from "../../utils/utils.js";

const rateLimit = apiRateLimit(2, 1000);
const API_KEY = 'Q2DYXJRUGJKS5TYF6PW7SCGM7KNCPPUZXV';
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

// https://api.bscscan.com/api
//    ?module=stats
//    &action=bnbprice
//    &apikey=YourApiKeyToken

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
