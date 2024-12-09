import {useResult} from "../utils.js";
import {getBNBPrice, getBSCBlockNumber, getBSCTokenTransferList, getTransactionStatus} from "./bscscan_api.js";
import SafeCalc from "../../utils/bignumberjs.js";

// 获取指定token地址的交易列表
export const useBscscanGetTokenTxList = async (tokenContractAddress, startBlock, endBlock, page = 1, offset = 2000, minAmount = 0, tokenDecimals = 18) => {
  const MethodID = ['0xa9059cbb', '0x23b872dd'];
  const toStartIndex = {
    '0xa9059cbb': 10,
    '0x23b872dd': 10 + 64,
  };

  function extractRecipientAddress(input, methodId) {
    // 目标地址的起始位置
    const addressStart = toStartIndex[methodId];

    // 目标地址的长度为 64 个字符（32 字节）
    const addressLength = 64;

    // 提取目标地址
    const recipientAddressHex = input.substring(addressStart, addressStart + addressLength);

    // 格式化为以太坊地址
    const formattedAddress = '0x' + recipientAddressHex.substring(24); // 地址前缀 '0x' + 去掉前面的 0s

    return formattedAddress;
  }

  function extractRecipientAmount(input, methodId) {
    // 目标地址的起始位置
    const addressStart = toStartIndex[methodId];
    if (!addressStart) {
      return null;
    }
    // 目标地址的长度为 64 个字符（32 字节）
    const addressLength = 64;

    // 提取目标地址
    const recipientAddressHex = input.substring(addressStart + addressLength, addressStart + addressLength + 64);

    // 格式化为数量
    // console.log(recipientAddressHex, 'extractRecipientAmount');
    const formattedAmount = SafeCalc.div(parseInt(recipientAddressHex, 16), Math.pow(10, tokenDecimals));

    return formattedAmount;
  }

  try {
    let result = await getBSCTokenTransferList(tokenContractAddress, startBlock, endBlock, page, offset);
    let data = result.data;
    if(Number(data.status) === 0 && data.message === 'No transactions found') {
      return useResult.success({
        txList: [],
        totalTxLength: 0,
      });
    }
    if (Number(data.status) !== 1) {
      console.log('获取交易列表失败，' + tokenContractAddress, data);
      return useResult.error(data);
    }
    // console.log(data.result.length, 'useBscscanGetTokenTxList', data.result[0]);
    let txList = data.result.filter(item => (!!toStartIndex[item.methodId]) && Number(item.confirmations) >= 10 && item.txreceipt_status === '1');
    txList = txList.map(item => {
      return {
        ...item,
        toAddress: extractRecipientAddress(item.input, item.methodId),
        amount: extractRecipientAmount(item.input, item.methodId),
      };
    });
    txList = txList.filter(item => SafeCalc.compare(item.amount, minAmount) !== '-1');
    // console.log(txList.length, 'useBscscanGetTokenTxList', txList[0].hash, txList[0].amount);
    // console.log(txList.length, 'useBscscanGetTokenTxList', txList[1].hash, txList[1].amount);
    // console.log(txList.length, 'useBscscanGetTokenTxList', txList[2].hash, txList[2].amount);
    return useResult.success({
      txList,
      totalTxLength: data.result.length,
    });
  } catch (e) {
    console.log(e.message, 'useBscscanGetTokenTxList Error');
    return useResult.error(e.message);
  }
};

// 获取最新区块号
export const useBscscanGetLatestBlockNumber = async () => {
  try {
    let result = await getBSCBlockNumber();
    let data = result.data;
    if (Number(data.status) !== 1) {
      console.log('获取最新区块号失败，', data);
      return useResult.error(data);
    }
    let latestBlockNumber = Number(data.result);
    console.log(latestBlockNumber, 'useBscscanGetLatestBlockNumber');
    return useResult.success(latestBlockNumber);
  } catch (e) {
    console.log(e.message, 'useBscscanGetLatestBlockNumber Error');
    return useResult.error(e.message);
  }
};

// 获取BNB价格
export const useBscscanGetBNBPrice = async () => {
  try {
    let result = await getBNBPrice();
    let data = result.data;
    if (Number(data.status) !== 1) {
      console.log('获取BNB价格失败，', data);
      return useResult.error(data);
    }
    let bnbPrice = Number(data.result.ethusd);
    console.log(bnbPrice, 'useBscscanGetBNBPrice');
    return useResult.success(bnbPrice);
  } catch (e) {
    console.log(e.message, 'useBscscanGetBNBPrice Error');
    return useResult.error(e.message);
  }
};

// 获取交易的状态
export const useBscscanGetTxStatus = async (txHash) => {
  try {
    let result = await getTransactionStatus(txHash);
    let data = result.data;
    if (Number(data.status) !== 1) {
      console.log('获取交易状态失败，', data);
      return useResult.error(data);
    }
    let txStatus = data.result.status;
    console.log(txStatus, 'useBscscanGetTxStatus txHash:' + txHash);
    return useResult.success(txStatus === '1');
  } catch (e) {
    console.log(e.message, 'useBscscanGetTxStatus Error');
    return useResult.error(e.message);
  }
};