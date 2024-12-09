import {getPairDayInfo} from "@/api/exchange/order.js";
import {useKlinePairRef} from "@/composition/exchange/kLineData.js";

const pairDayData = ref();

const pairRef = useKlinePairRef();

export const usePairDayDataRef = () => {
  return pairDayData;
};

export const initPairDayData = async (pair) => {
  let id = localStorage['id'];
  if (!id) {
    return;
  }
  // 获取交易对的一天数据
  let dayInfoRes = await getPairDayInfo(id, pair);
  let dayInfo = dayInfoRes.dayInfo;
  pairDayData.value = dayInfo;
};

initPairDayData(pairRef.value);

