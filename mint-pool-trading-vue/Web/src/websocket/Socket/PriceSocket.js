import {useSocketEmit, useSocketEmitSave, useSocketOn} from "@/websocket/index.js";
import {SOCKET_EMITS} from "@/websocket/socketEmits.js";
import {SOCKET_EVENTS} from "@/websocket/socketEvents.js";
import {useUpdatePairPriceValue} from "@/composition/exchange/order.js";

let pairTemp = '';
export const getPriceSocketData = (pair) => {
  console.log('emitting price socket data', pair)
  let result = useSocketEmitSave(SOCKET_EMITS.GET_ONE_COIN_PRICE, pair);
  if(!result) {
    setTimeout(() => {
      getPriceSocketData(pair);
    }, 1000);
  }
  if(result) {
    pairTemp = pair;
  }
}

export const changePriceSocketData = (newPair) => {
  useSocketEmit(SOCKET_EMITS.STOP_ONE_COIN_PRICE, pairTemp);
  setTimeout(() => {
    getPriceSocketData(newPair);
  }, 1000);
};

const receivePriceSocketData = () => {
  useSocketOn(SOCKET_EVENTS.ONE_COIN_PRICE, (data) => {
    let priceData = data.data;
    let {coinPair, price} = priceData;
    useUpdatePairPriceValue(coinPair, price);
  });
};

receivePriceSocketData();
