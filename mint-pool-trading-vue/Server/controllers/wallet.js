import {getUserData, getUserEth, queryCheckId, queryCheckPage, queryCheckTransferId} from "./utils.js";
import {errorHandle, errorTip, httpResult} from "../utils/utils.js";
import SafeCalc from "../utils/bignumberjs.js";
import {useCoinPrice} from "../timerGlobalData/priceData.js";
import {
  getTransferRecords_ETH,
  getTransferRecords_Merc, getTransferRecordsCount_ETH,
  getTransferRecordsCount_Merc,
  transfer_ETH,
  transfer_Merc
} from "./transfer.js";
import {useCheckPassword} from "../api/api_user/useUser.js";
import transferRecordDao from "../Dao/transferReocrd.js";

// 钱包获取所有的币种余额
export const getBalance = async (req, res) => {
  let {id} = req.body;
  queryCheckId(id);
  // 获取MERC的钱包数据
  let mercCoinData = await getMERCWalletData(id);
  // 获取BNB的钱包数据
  let bnbCoinData = await getBNBWalletData(id);
  // 获取USDT的钱包数据
  let usdtCoinData = await getUSDTWalletData(id);
  res.json(httpResult.success({
    result:true,
    coinList: [
      bnbCoinData,
      mercCoinData,
      usdtCoinData
    ]
  }));
};

// 转账
export const transfer = async (req, res) => {
  let {id, username, email, address, amount, coinName, password} = req.body;
  // 转账功能暂未开放
  // errorTip('转账功能暂未开放');
  const transferFuncObj = {
    MERC: transfer_Merc,
    BNB: transfer_ETH,
    // USDT: transfer_USDT
  };
  queryCheckId(id);
  // 判断转账币种是不是在transferFuncObj中
  if (!transferFuncObj[coinName]) {
    errorTip('该币暂时暂未开启转账');
  }
  // 判断转账者和发起请求是否是同一个人
  queryCheckTransferId(req, id);
  // 检查密码
  let userData = await useCheckPassword(id, password);
  if (!userData) {
    errorTip('密码错误');
  }
  // 调用转账方法
  await transferFuncObj[coinName](id, amount, username, email, address);
  res.json(httpResult.success({result: true}));
};

// 获取交易记录
export const getTransferRecord = async (req, res) => {
  let {id, coinName, startId, pageSize} = req.body;
  queryCheckId(id);
  if(!startId) {
    // todo 后续考虑这里优化 这个数值可能不是那么完美 目前使用的是mysql int的最大值+1

    startId = 2147483648;
  }
  if(!pageSize) {
    pageSize = 10;
  }
  const transferRecordFuncObj = {
    MERC: getTransferRecords_Merc,
    BNB: getTransferRecords_ETH,
    // USDT: transfer_USDT
  };
  // 判断币种是不是在transferFuncObj中
  if (!transferRecordFuncObj[coinName]) {
    errorTip('参数错误');
  }
  // 调用转账方法
  let list = await transferRecordFuncObj[coinName](id, startId, pageSize);
  res.json(httpResult.success({result: true, list}));
};

// 获取交易记录总数
export const getTransferRecordTotal = async (req, res) => {
  let {id, coinName} = req.body;
  queryCheckId(id);
  const transferRecordCountFuncObj = {
    MERC: getTransferRecordsCount_Merc,
    BNB: getTransferRecordsCount_ETH,
    // USDT: transfer_USDT
  };
  // 判断币种是不是在transferFuncObj中
  if (!transferRecordCountFuncObj[coinName]) {
    errorTip('参数错误');
  }
  // 调用转账方法
  let total = await transferRecordCountFuncObj[coinName](id);
  res.json(httpResult.success({result: true, total}));
};

// 获取交易记录详情
export const getTransferRecordDetail = async (req, res) => {
  let {hash} = req.body;
  let record = await transferRecordDao.queryByHash(hash);
  if (!record) {
    errorTip('交易记录不存在');
  }
  res.json(httpResult.success({result: true, record}));
};

async function getMERCWalletData(id) {
  let userData = await getUserData(id);
  return {
    balance: userData.balance || 0,
    unitPrice: 0.001,
    name: "MERC",
    lockBalance: SafeCalc.sub(userData.balance || 0, userData.unlock_balance || 0),
    unlockBalance: userData.unlock_balance || 0
  };
}

async function getBNBWalletData(id) {
  let balance = (await getUserEth(id)).ethBalance || 0;
  let unitPrice = await useCoinPrice("BNB");
  return {
    balance,
    unitPrice,
    name: "BNB",
    lockBalance: 0
  };
}

async function getUSDTWalletData(id) {
  let balance = 0;
  let unitPrice = await useCoinPrice("USDT");
  // console.log(unitPrice);
  return {
    balance,
    unitPrice,
    name: "USDT",
    lockBalance: 0
  };
}
