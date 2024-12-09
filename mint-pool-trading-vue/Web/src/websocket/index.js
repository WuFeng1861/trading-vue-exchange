import config from '@/config/api.js';
import { io } from "socket.io-client";
import {elTip} from "@/utils/index.js";
import {SOCKET_EVENTS} from "@/websocket/socketEvents.js";
import {SOCKET_EMITS} from "@/websocket/socketEmits.js";

const URL = config.WEBSOCKET_URL;
console.log("websocket url:", URL)
const socket = io(URL, {
  path: "/ws/mercury",
});

const state = ref({
  connected: false,
});
let socketOnList = [];
export const useSocketOn = (name, callback) => {
  if(!state.value.connected) {
    requestIdleCallback(() => {
      useSocketOn(name, callback);
    });
    return;
  }
  socket.on(name, callback);
  // for(let i = 0; i < socketOnList.length; i++) {
  //   if(socketOnList[i].name === name) {
  //     socketOnList[i].callback = callback;
  //     return;
  //   }
  //   if(i === socketOnList.length - 1) {
  //     socketOnList.push({name, callback});
  //     return;
  //   }
  // }
  // if(socketOnList.length === 0) {
  //   socketOnList.push({name, callback});
  // }
};

export const useSocketEmit = (name, data) => {
  if(!state.value.connected) {
    return false;
  }
  socket.emit(name, data);
  return true;
};

let socketEmitList = [];
export const useSocketEmitSave = (name, data) => {
  if(!state.value.connected) {
    return false;
  }
  socket.emit(name, data);
  for(let i = 0; i < socketEmitList.length; i++) {
    if(socketEmitList[i].name === name) {
      socketEmitList[i].data = data;
    }
    if(i === socketEmitList.length - 1) {
      socketEmitList.push({name, data});
      return true;
    }
  }
  if(socketEmitList.length === 0) {
    socketEmitList.push({name, data});
  }
  return true;
};

// 连接上了发送自己的token，让服务器验证
const connectedMethod = () => {
  let token = localStorage["token"];
  let id = localStorage['id'];
  if(!token ||! id) {
    requestIdleCallback(connectedMethod);
    return;
  }
  console.log("socket connectedMethod")
  socket.emit(SOCKET_EMITS.JWT_LOGIN, { token, id });
}

socket.on(SOCKET_EVENTS.LOGIN_RESULT, (data) => {
  console.log("socket login result:", data)
  if(data.code === 200) {
    state.value.connected = true;
    // 将所有的socket事件监听都注册到socket上
    console.log("socket on list:", socketOnList)
    for(let i = 0; i < socketOnList.length; i++) {
      socket.on(socketOnList[i].name, socketOnList[i].callback);
    }
    // 将所有的socket事件发送都保存到socketEmitList中
    console.log("socket emit list:", socketEmitList)
    for(let i = 0; i < socketEmitList.length; i++) {
      socket.emit(socketEmitList[i].name, socketEmitList[i].data);
    }
    return;
  }
  state.value.connected = false;
  elTip(data.errMsg, 'error');
});

socket.on("connect", () => {
  console.log("socket connected")
  connectedMethod();
});

socket.on("disconnect", () => {
  state.value.connected = false;
  elTip("网络连接断开，请刷新重试", 'error');
});
