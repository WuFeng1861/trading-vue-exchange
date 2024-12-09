import apiConfig from '../../config/api.js';
import axios from "axios";
import {elTip} from "../../utils/index.js";

let {USER_URL, RETRY_DELAY, RETRY_TIMES, TIME_OUT} = apiConfig;

const instance = axios.create({
  baseURL: USER_URL,
  timeout: TIME_OUT,
});

//拦截器 -- 请求拦截
instance.interceptors.request.use(config => {
  return config;
}, error => {
  console.log("request err");
  return Promise.reject(error);
});

//拦截器 -- 响应拦截
instance.interceptors.response.use(res => {
  if (res.data && res.data.code !== 200) {
    elTip(res.data.errMsg, 'error');
    throw new Error(res.data.errMsg);
  }
  return res.data.msg;
}, err => {
  return Promise.reject(err);
});
export default instance;
