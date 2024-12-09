import apiConfig from '../../config/api.js';
import axios from "axios";
import {elTip, getTodayZero} from "@/utils/index.js";
import {useToLogin} from "@/composition/useRouter.js";
export const createInstance = (routeName) => {
  let {MINT_POOL_URL, RETRY_DELAY, RETRY_TIMES, TIME_OUT} = apiConfig;

  const instance = axios.create({
    baseURL: `${MINT_POOL_URL}/${routeName}`,
    timeout: TIME_OUT,
    retry: RETRY_TIMES,
    retryDelay: RETRY_DELAY
  });

//拦截器 -- 请求拦截
  instance.interceptors.request.use(config => {
    // 添加token实例
    let token = localStorage["token"];
    let id = localStorage['id'];
    if(token && id)
    {
      config.headers = {
        "Authorization": `Bearer ${token} ${id}`,
        "Content-Type": "application/json"
      };
    }
    console.log(config, "config");
    return config;
  }, error => {
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
      if(res.data.errMsg === '您正在挖矿中') {
        return;
      }
      if(res.data.errMsg === '您今天已经领取过奖励了') {
        localStorage['nextStratch'] = getTodayZero() + 24 * 60 * 60 * 1000;
      }
      if(res.data.errMsg=== 'id is required') {
        console.log(res, 'id is required');
      }
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
      console.log(config.headers);
      return instance(config);
    });
  });
  return instance;
};
