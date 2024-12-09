import axios from 'axios';
import {getNow} from "../utils/utils.js";

// BscScan API Key
const API_KEY = 'Q2DYXJRUGJKS5TYF6PW7SCGM7KNCPPUZXV';
const CONTRACT_ADDRESS = '0x55d398326f99059fF775485246999027B3197955';
const MethodID = ['0xa9059cbb', '0x23b872dd'];
const toStartIndex = {
  '0xa9059cbb': 10,
  '0x23b872dd': 10 + 64,
};

// BscScan API URL
// const url = `https://api.bscscan.com/api?module=account&action=tokentx&contractaddress=${CONTRACT_ADDRESS}&sort=desc&apikey=${API_KEY}&page=1&offset=1000`;
const url = `https://api.bscscan.com/api?module=account&action=txlist&address=${CONTRACT_ADDRESS}&sort=desc&apikey=${API_KEY}&page=1&offset=2000`;

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

async function getRecentTransactionCount() {
  try {
    // 发起请求
    let start = getNow();
    const response = await axios.get(url);
    const data = response.data;
    let otherTxs = data.result.filter(tx => !MethodID.includes(tx.methodId));
    data.result = data.result.filter(tx => MethodID.includes(tx.methodId));
    console.log(`共有${data.result.length}笔交易，其中${otherTxs.length}笔非法交易`);
    console.log(data.result.length, data.result[0], extractRecipientAddress(data.result[0].input, data.result[0].methodId));
    console.log(otherTxs.length, otherTxs[0], extractRecipientAddress(otherTxs[0].input, otherTxs[0].methodId));

    // 获取当前时间和10分钟前的时间
    const now = new Date();
    const tenMinutesAgo = new Date(now.getTime() - 3 * 60 * 1000); // 10分钟前的时间

    let lastHeight = data.result[0].blockNumber;
    let lastHeightTxCount = 0;
    // 统计最近10分钟的交易数量
    let recentTxCount = 0;
    for (const tx of data.result) {
      const txTime = new Date(parseInt(tx.timeStamp) * 1000); // 转换时间戳为日期对象
      if (txTime >= tenMinutesAgo) {
        recentTxCount += 1;
      }
      if (tx.blockNumber === lastHeight) {
        lastHeightTxCount += 1;
      }
    }
    console.log(`最近3分钟的交易数量: ${recentTxCount}`);
    console.log(`上一区块${lastHeight}的交易数量: ${lastHeightTxCount}`);
    console.log(`请求耗时: ${getNow() - start}ms`);
  } catch (error) {
    console.error('Error fetching transaction data:', error);
  }
}

getRecentTransactionCount();
// console.log(extractRecipientAddress('0xa9059cbb000000000000000000000000b369e0a4b785bc64f589263ec145b4c25447bcc0000000000000000000000000000000000000000000000000000665fffd3d9000'));
