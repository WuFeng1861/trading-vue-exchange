import {createInstance} from "./createInstance.js";

const instance = createInstance('recharge');


// 添加充值地址
export const addRechargeAddress = (id) => {
  return instance.post('/addRechargeAddress', {id});
};

// 获取充值地址列表
export const getRechargeAddress = (id) => {
  return instance.post('/getRechargeAddress', {id});
};

// 获取充值记录
export const getRechargeRecords = (id, coinName) => {
  return instance.post('/getRechargeRecords', {id, coinName});
};

// 发起提币请求
export const withdrawRequest = (id, coinName, address, amount, password, chainId) => {
  return instance.post('/withdrawRequest', {id, coinName, address, amount, password, chainId});
};


