import {getToken, restart} from "./utils.js";
import {getbalance} from "../api/api_self/self_api.js";

let timeInterval = 5;
let timeIntervalMin = 5;
let timeIntervalMax = 60;
export const startMonitoring = async () => {
  // 获取token
  let token = await getToken();
  if(!token) {
    setTimeout(startMonitoring, 1000 * timeIntervalMax);
    return;
  }
  // 发起请求监控
  try {
    let res = await getbalance(1, token);
    console.log(res.data, '请求监控结果???');
    timeInterval = timeIntervalMin;
  } catch (e) {
    console.log(e);
    restart(5, 'mintpool');
    timeInterval = timeIntervalMax;
  } finally {
    setTimeout(startMonitoring, 1000 * timeInterval);
  }
};
startMonitoring();
