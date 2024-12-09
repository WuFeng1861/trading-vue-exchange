import {useSocketEmit, useSocketEmitSave, useSocketOn} from "@/websocket/index.js";
import {SOCKET_EVENTS} from "@/websocket/socketEvents.js";
import {SOCKET_EMITS} from "@/websocket/socketEmits.js";
import {useUpdateKLineData} from "@/composition/exchange/kLineData.js";

export const getKLineSocketData = (pair, gap) => {
  console.log('emitting kline data', pair, gap)
  let result = useSocketEmitSave(SOCKET_EMITS.KLINE_DATA, {
    pair,
    gap
  });
  if(!result) {
    setTimeout(() => {
      getKLineSocketData(pair, gap);
    }, 1000);
  }
}

const receiveKLineSocketData = () => {
  useSocketOn(SOCKET_EVENTS.KLINE_DATA, (data) => {
    // console.log('received kline data', data)
    let kLineData = data.data;
    useUpdateKLineData(kLineData);
  });
};

receiveKLineSocketData();
