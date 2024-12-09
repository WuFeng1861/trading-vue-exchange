import instance_okx_okLink from "./okx_okLink_instance.js";
import {apiRateLimit} from "../apiRateLimit.js";

const rateLimit = apiRateLimit();

export const get_coin_price = async (chainId, tokenContractAddress) => {
  await rateLimit.waitPermission();
  let obj = {
    chainId,
    tokenContractAddress,
  };
  if (!tokenContractAddress) {
    delete obj.tokenContractAddress;
  }
  return instance_okx_okLink.get('/api/v5/explorer/tokenprice/market-data', {
    params: obj
  });
};

export const get_chain_all = async () => {
  await rateLimit.waitPermission();
  return instance_okx_okLink.get('/api/v5/explorer/tokenprice/chain-list');
};

export const get_coin_in_chain = async (token) => {
  await rateLimit.waitPermission();
  return instance_okx_okLink.get('/api/v5/explorer/tokenprice/token-list', {
    params: {
      token
    }
  });
};

export const get_token_transfer_list = async (chainShortName, tokenContractAddress, maxAmount, minAmount, page, limit = 100) => {
  let obj = {
    chainShortName,
    tokenContractAddress,
    maxAmount,
    minAmount,
    page,
    limit
  };
  if (!maxAmount) {
    delete obj.maxAmount;
  }
  if (!minAmount) {
    delete obj.minAmount;
  }
  if (!page) {
    delete obj.page;
  }
  console.log(obj, "get_token_transfer_list");
  await rateLimit.waitPermission();
  return instance_okx_okLink.get('/api/v5/explorer/token/transaction-list', {
    params: obj
  });
};
