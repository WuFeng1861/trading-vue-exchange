import {Server} from 'socket.io';
import {config} from "../config/index.js";
import {SOCKET_EVENTS} from "./socketEvents.js";
import './Price/index.js';
import './TradeOrder/index.js';
import './GapOrder/index.js';
import {getKLineDataByPairAndGap} from "./kLine/index.js";
import {websocketResult} from "../utils/utils.js";
import {useCheckToken} from "../api/api_user/useUser.js";
import {SOCKET_EMITS} from "./socketEmits.js";
import {SOCKET_COLLECTION_CONSTANTS, SOCKET_STRING_CONSTANTS} from "./socketString.js";
import {addSocket, removeSocket, removeSocketInAll} from "./socketCollection.js";
import './scheduledTask.js';
import {changeKlineScheduledTask, removeKlineScheduledTask} from "./scheduledTask.js";

let io = null;
export const createSocketServer = (server) => {
  io = new Server(server, {
    path: '/ws/mercury',
    cors: {
      origin: '*',
    },
  });

  io.on('connection', (socket) => {
    console.log('a user connected', socket.id);

    socket.on('disconnect', () => {
      removeSocketInAll(socket);
      removeKlineScheduledTask(socket.id);
      console.log('user disconnected');
    });

    // kLine 相关
    socket.on(SOCKET_EVENTS.KLINE_DATA, (data) => {
      if(!socket.userAuthFinish) {
        return;
      }
      socket.userKlineData = data;
      let {pair, gap} = data;
      console.log('Kline data request received', data);
      let klineData = getKLineDataByPairAndGap(pair, gap);
      socket.emit(SOCKET_EMITS.KLINE_DATA, websocketResult.success('Kline', klineData));
      changeKlineScheduledTask(socket.id, () => {
        let klineData = getKLineDataByPairAndGap(pair, gap);
          socket.emit(SOCKET_EMITS.KLINE_DATA, websocketResult.success('Kline', klineData));
      }, socket);
    });
    // JWT 相关
    socket.on(SOCKET_EVENTS.JWT_LOGIN, async (data) => {
      const {token, id} = data;
      const tokenResult = await useCheckToken(token, id);
      // console.log("JWT_LOGIN", token, id, tokenResult);
      if (!tokenResult) {
        socket.emit(SOCKET_EMITS.LOGIN_RESULT, websocketResult.error(SOCKET_STRING_CONSTANTS.LOGIN_FAILED_MESSAGE));
        return;
      }
      socket.userAuthFinish = true;
      socket.emit(SOCKET_EMITS.LOGIN_RESULT, websocketResult.success('', null));
    });
    // Price 相关
    socket.on(SOCKET_EVENTS.GET_ONE_COIN_PRICE, (pair) => {
      if(!socket.userAuthFinish) {
        return;
      }
      addSocket(SOCKET_COLLECTION_CONSTANTS.COIN_PAIR_PRICE_COLLECTION + pair, socket);
    });
    // 不监听新的价格数据 理论上没必要 多发一点就发咯
    socket.on(SOCKET_EVENTS.STOP_ONE_COIN_PRICE, (pair) => {
      removeSocket(SOCKET_COLLECTION_CONSTANTS.COIN_PAIR_PRICE_COLLECTION + pair, socket);
    });
    // TradeOrder 相关 完成订单
    socket.on(SOCKET_EVENTS.GET_PAIR_TRADE, (pair) => {
      if(!socket.userAuthFinish) {
        return;
      }
      addSocket(SOCKET_COLLECTION_CONSTANTS.PAIR_TRADE_COLLECTION + pair, socket);
    });
      // 不监听新的订单数据
    socket.on(SOCKET_EVENTS.STOP_PAIR_TRADE, (pair) => {
      removeSocket(SOCKET_COLLECTION_CONSTANTS.PAIR_TRADE_COLLECTION + pair, socket);
    });
    // Order 相关 订单数据
    socket.on(SOCKET_EVENTS.GET_GAP_ORDER, (data) => {
      console.log('Gap order request received', data, socket.userAuthFinish);
      if(!socket.userAuthFinish) {
        return;
      }
      let {pair, gap} = data;
      console.log(`user ${socket.id} subscribe ${SOCKET_COLLECTION_CONSTANTS.GAP_ORDER_COLLECTION + pair + gap}`);
      addSocket(SOCKET_COLLECTION_CONSTANTS.GAP_ORDER_COLLECTION + pair + gap, socket);
    });
    // 不监听新的订单数据
    socket.on(SOCKET_EVENTS.STOP_GAP_ORDER, (data) => {
      let {pair, gap} = data;
      removeSocket(SOCKET_COLLECTION_CONSTANTS.GAP_ORDER_COLLECTION + pair + gap, socket);
    });
  });

  server.listen(config.WEBSOCKET_PORT, () => {
    console.log(`Websocket 服务启动 ${config.WEBSOCKET_PORT}端口`);
  });
};
