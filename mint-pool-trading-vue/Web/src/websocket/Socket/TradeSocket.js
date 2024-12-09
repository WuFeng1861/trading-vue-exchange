import {useSocketEmit, useSocketEmitSave, useSocketOn} from "@/websocket/index.js";
import {SOCKET_EMITS} from "@/websocket/socketEmits.js";
import {SOCKET_EVENTS} from "@/websocket/socketEvents.js";
import {useUpdatePairPriceValue, useUpdateTradeListValue} from "@/composition/exchange/order.js";

let pairTemp = '';
export const getTradeSocketData = (pair) => {
  console.log('emitting trade socket data', pair)
  let result = useSocketEmitSave(SOCKET_EMITS.GET_PAIR_TRADE, pair);
  if(!result) {
    setTimeout(() => {
      getTradeSocketData(pair);
    }, 1000);
  }
  if(result) {
    pairTemp = pair;
  }
}

export const StopPriceSocket = (pair) => {
  useSocketEmit(SOCKET_EMITS.STOP_PAIR_TRADE, pair || pairTemp);
};

const receiveTradeSocketData = () => {
  useSocketOn(SOCKET_EVENTS.PAIR_TRADE, (data) => {
    console.log('received trade socket data', data)
    let tradeData = data.data;
    useUpdateTradeListValue(tradeData.coinPair, tradeData.data);
  });
};

receiveTradeSocketData();
