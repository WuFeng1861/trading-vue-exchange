import {EthersHelper} from "../utils/ethersHelper.js";
import {config} from "../config/index.js";
import SafeCalc from "../utils/bignumberjs.js";
import {getBnbPrice} from "../composition/bnbPrice.js";

export const checkSameId = (req) => {
  let tokenId = req.headers['authorization'].split(" ")[2];
  let paramsId = req.body.id;
  console.log('tokenId:', tokenId, 'paramsId:', paramsId);
  if (tokenId.toString() !== paramsId.toString()) {
    throw new Error("账号登录错误，请重新登录");
  }
};

export const checkManager = (req) => {
  let managerList = ["WuFeng1998", "MercuryGroup"];
  let {manager} = req.query;
  console.log('manager:', manager);
  if (!managerList.includes(manager)) {
    throw new Error('无权限执行');
  }
};

// 获取MERC提币手续费*6 利用函数计算
const getWithdrawFee_Merc = async (toAddress, amount = 0.01) => {
  let ethersHelper = new EthersHelper(config.CHAIN_URL_LIST[0], config.CHAIN_URL_LIST);
  let gasLimit = await ethersHelper.estimateGasForTokenTransfer(config.WITHDRAW_FEE_CALC_ADDRESS, toAddress, config.MERC_CONTRACT_ADDRESS, amount);
  return SafeCalc.ceil(SafeCalc.mul(gasLimit, 6), 4);
};
// 获取MERC提币手续费*6 利用函数计算
const getWithdrawFee_USDT = async (toAddress, amount = 0.01) => {
  let ethersHelper = new EthersHelper(config.CHAIN_URL_LIST[0], config.CHAIN_URL_LIST);
  let gasLimit = await ethersHelper.estimateGasForTokenTransfer(config.WITHDRAW_FEE_CALC_ADDRESS, toAddress, config.USDT_CONTRACT_ADDRESS, amount);
  return SafeCalc.ceil(SafeCalc.mul(gasLimit, 6), 4);
};

// 获取ETH提币手续费*6 利用函数计算
const getWithdrawFee_ETH = async (toAddress, amount = 0.01) => {
  let ethersHelper = new EthersHelper(config.CHAIN_URL_LIST[0], config.CHAIN_URL_LIST);
  let gasLimit = await ethersHelper.estimateGasForEthTransfer(config.WITHDRAW_FEE_CALC_ADDRESS, toAddress, amount);
  return SafeCalc.ceil(SafeCalc.mul(gasLimit, 6), 4);
};

// 获取提币手续费
export const getWithdrawFee = async (coinName, toAddress, amount = 0.01) => {
  const obj = {
    'ETH': getWithdrawFee_ETH,
    'USDT': getWithdrawFee_USDT,
    'MERC': getWithdrawFee_Merc,
  };
  if (!obj[coinName]) {
    throw new Error('币种不支持');
  }
  let bnbFee = await obj[coinName](toAddress, amount);
  let bnbPrice = getBnbPrice();
  let usdtFee = SafeCalc.mul(bnbFee, bnbPrice);
  return {
    bnbFee,
    usdtFee,
  };
};
