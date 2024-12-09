import {getTransferRecordDetail, getTransferRecord, getTransferRecordTotal} from "@/api/mintPool/wallet.js";
import {useMyBalanceRef} from "@/composition/mint/useMyBalance.js";
import {sleep} from "@/utils/index.js";

// 现有币种BNB、MERC、USDT（暂时无用）
const transferRecordObj = ref({});
const transferRecordTotalObj = ref({});

let totalCache = {};
export const useTransferRecordTotalRef = (coinName) => {
  if (totalCache[coinName]) {
    return totalCache[coinName];
  }
  totalCache[coinName] = transferRecordTotalObj.value[coinName]
  return totalCache[coinName];
}

let recordCache = {};
export const useTransferRecordRef = (coinName) => {
  if (recordCache[coinName] && recordCache[coinName].length) {
    console.log('recordCache', coinName, recordCache[coinName])
    return recordCache[coinName];
  }
  console.log(coinName)
  recordCache[coinName] = transferRecordObj.value[coinName] || [];
  return recordCache[coinName];
}

export const useTransferRecordObjRef = () => transferRecordObj;

// 获取交易记录
const getTransferRecordData = async (coinName, startId) => {
  let id = localStorage['id'];
  if (!id) {
    return;
  }
  if (!startId) {
    // todo 后续考虑这里优化 这个数值可能不是那么完美 目前使用的是mysql int的最大值+1
    startId = 2147483648;
  }
  let res = await getTransferRecord(id, coinName, startId, 10);
  // 根据id 判断res,list中的数据是不是在transferRecordObj.value[coinName]中
  let dataTemp = (transferRecordObj.value[coinName] && [...transferRecordObj.value[coinName]]) || [];
  res.list.forEach(item => {
    let index = dataTemp.findIndex(i => i.id === item.id);
    if (index === -1) {
      dataTemp.push(item);
    }
  })
  // 根据id 倒序
  dataTemp.sort((a, b) => {
    return Number(b.id) - Number(a.id);
  });
  transferRecordObj.value[coinName] = dataTemp;
}

// 下拉获取交易数据
export const getNextTransferRecordData = async (coinName) => {
  // 有数据并且到底了，并且还有新的数据需要获取
  if(
    transferRecordObj.value[coinName] &&
    transferRecordObj.value[coinName].length >= 10 &&
    (transferRecordTotalObj.value[coinName] || 0) > transferRecordObj.value[coinName].length)  {
    let startId = transferRecordObj.value[coinName][transferRecordObj.value[coinName].length - 1].id;
    return getTransferRecordData(coinName, startId);
  }
}

// 初始化
export const initTransferRecordTotal = async (coinName) => {
  let id = localStorage['id'];
  if (!id) {
    return;
  }
  const mybalance = useMyBalanceRef();
  if(!mybalance.value.address) {
    // 获取交易记录之前需要先获取用户的数据，所以在此等待
    await sleep(100);
    return initTransferRecordTotal(coinName);
  }
  console.log('initTransferRecordTotal', coinName, id)
  let res = await getTransferRecordTotal(id, coinName);
  let lastTotal = transferRecordTotalObj.value[coinName] || 0;
  let newTotal = res.total;
  transferRecordTotalObj.value[coinName] = res.total;
  // 如果新数据过多，清空存在的数据，直接获取最新的，然后等他下滑就好了
  if(lastTotal < (newTotal - 10)) {
    transferRecordObj.value[coinName] = [];
  }
  // 如果只是有少量新数据，直接获取前10个就行了
  if(lastTotal < newTotal) {
    return getTransferRecordData(coinName, 0);
  }
}

// 根据hash获取交易详情
export const useTransferRecordDetail = async (hash) => {
  let id = localStorage['id'];
  if (!id) {
    return;
  }
  let res = await getTransferRecordDetail(hash);
  return res.record;
}
