import {getKLineSocketData} from "@/websocket/Socket/kLineSocket.js";
import {
  keyKlineDataFormat,
} from "@/composition/exchange/Types/kLineDataTypes.js";
import dayjs from "dayjs";
import {pairList} from "@/config/pairList.js";

const kLineType = ref(localStorage.getItem('kLineType') || "1h");
const kLineDataX = ref([]);
const kLineDataY = ref([]);
const kLinePair = ref(pairList[0]);

export const useKlinePairRef = () => {
  return kLinePair;
}

// todo: useUpdateKLinePair
export const useUpdateKLinePair = (pair) => {
  kLinePair.value = pair;
}

export const useUpdateKLineType = (type) => {
  kLineType.value = type;
  localStorage.setItem('kLineType', type);
}

export const useKlineTypeRef = () => {
  return kLineType;
}

export const useKlineDataXRef = () => {
  return kLineDataX;
}

export const useKlineDataYRef = () => {
  return kLineDataY;
}

export const useUpdateKLineData = (kLineDataTemp) => {
  let xData = [];
  let yData = [];
  for (let i = 0; i < kLineDataTemp.length; i++) {
    let item = kLineDataTemp[i];
    if (item.volume !== '0' && item.volume !== 0) {
      console.log(item, 'kLineData update')
    }
    xData.push(item.time);
    // console.log(dayjs(item.time).format('YYYY-MM-DD HH:mm:ss'), item.time, i);
    // yData.push([item.time,item.open, item.close, item.low, item.high, item.volume]);
    yData.push({
      // time: new Date(item.time).getTime(),
      time: item.time,
      volume: Number(item.volume),
      open: Number(item.open),
      close: Number(item.close),
      low: Number(item.low),
      high: Number(item.high),
    });
    kLineDataX.value = xData;
    kLineDataY.value = yData;
  }
}

export const useInitKLineData = async () => {
  let id = localStorage['id'];
  if (!id) {
    return;
  }
  console.log('init kLineData', kLinePair.value, kLineType.value);
  getKLineSocketData(kLinePair.value, kLineType.value);
}

// 监控kLineType变化，更新kLineData
watch(kLineType, async (newVal, oldVal) => {
  if (newVal !== oldVal) {
    await useInitKLineData();
  }
});

setTimeout(() => {
  useInitKLineData();
}, 0)


