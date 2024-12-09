import apiConfig from '../../config/api.js';
import axios from "axios";
import {elTip} from "@/utils/index.js";
import {useToLogin} from "@/composition/useRouter.js";

let {USER_URL, RETRY_DELAY, RETRY_TIMES, TIME_OUT} = apiConfig;

const instance = axios.create({
  baseURL: USER_URL,
  timeout: TIME_OUT,
  retry: RETRY_TIMES,
  retryDelay: RETRY_DELAY
});

//拦截器 -- 请求拦截
instance.interceptors.request.use(config => {
  config.headers["Content-Type"] = "application/json";
  return config;
}, error => {
  // return config;
  console.log("request err");
  return Promise.reject(error);
});

//拦截器 -- 响应拦截
instance.interceptors.response.use(res => {
  if (res.data?.code === 401) {
    useToLogin(res.data.errMsg);
    return;
  }
  if (res.data && res.data.code !== 200) {
    elTip(res.data.errMsg, 'error');
    throw new Error(res.data.errMsg);
  }
  return res.data.msg;
}, err => {
  //出错重发，间隔一秒
  let config = err.config;
  // If config does not exist or the retry option is not set, reject
  if (!config || !config.retry) return Promise.reject(err);

  // Set the variable for keeping track of the retry count
  config.__retryCount = config.__retryCount || 0;

  // Check if we've maxed out the total number of retries
  if (config.__retryCount >= config.retry) {
    // Reject with the error
    return Promise.reject(err);
  }

  // Increase the retry count
  config.__retryCount += 1;

  // Create new promise to handle exponential backoff
  let backoff = new Promise(function (resolve) {
    setTimeout(function () {
      resolve();
    }, config.retryDelay || 1);
  });

  // Return the promise in which recalls axios to retry the request
  return backoff.then(function () {
    return instance(config);
  });
});
export default instance;
