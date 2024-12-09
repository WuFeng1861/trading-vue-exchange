import apiConfig from '../../config/api.js';
import axios from "axios";
import {elTip} from "@/utils/index.js";

let {MINT_POOL_URL, TIME_OUT} = apiConfig;

const instance = axios.create({
  baseURL: `${MINT_POOL_URL}/email`,
  timeout: TIME_OUT,
});

//拦截器 -- 请求拦截
instance.interceptors.request.use(config => {
  // 添加token实例
  let token = localStorage["token"];
  let id = localStorage['id'];
  if(token && id)
  {
    config.headers["Authorization"] = `Bearer ${token} ${id}`;
    config.headers["Content-Type"] = "application/json";
  }
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
