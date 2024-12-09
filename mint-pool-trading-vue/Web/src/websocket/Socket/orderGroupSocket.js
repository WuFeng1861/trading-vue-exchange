import {useSocketEmit, useSocketEmitSave, useSocketOn} from "@/websocket/index.js";
import {SOCKET_EMITS} from "@/websocket/socketEmits.js";
import {SOCKET_EVENTS} from "@/websocket/socketEvents.js";
import {useUpdateOrderListValue} from "@/composition/exchange/order.js";

let pairTemp = '';
let gapTemp = null;

export const getOrderGroupSocketData = (pair, gap) => {
  console.log('emitting order group socket data', pair, gap);
  let result = useSocketEmitSave(SOCKET_EMITS.GET_GAP_ORDER, {pair, gap});
  if(!result) {
    setTimeout(() => {
      getOrderGroupSocketData(pair, gap);
    }, 1000);
  }
  if(result) {
    pairTemp = pair;
    gapTemp = gap;
  }
}

export const StopOrderGroupSocket = (pair, gap) => {
  useSocketEmitSave(SOCKET_EMITS.STOP_GAP_ORDER, {pair: pair || pairTemp, gap: gap || gapTemp});
};

export const changeOrderGroupSocketData = (pair, gap) => {
  console.log('changing order group socket data', pair, gap);
  if(pairTemp === pair && gapTemp === gap) {
    return;
  }
  StopOrderGroupSocket();
  setTimeout(() => {
    getOrderGroupSocketData(pair, gap);
  }, 1000);
};

const receiveOrderGroupSocketData = () => {
  useSocketOn(SOCKET_EVENTS.GAP_ORDER, (data) => {
    console.log('received order group socket data', data)
    let orderGroupData = data.data;
    useUpdateOrderListValue(orderGroupData.coinPair, orderGroupData.data.orderBuy, orderGroupData.data.orderSell);
  });
};

receiveOrderGroupSocketData();
