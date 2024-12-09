import axios from "axios";

const instance_okx_okLink = axios.create({
  baseURL: 'https://www.oklink.com/',
  timeout: 30 * 1000,
});
// 请求拦截器
instance_okx_okLink.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  // 打印url
  // console.log(baseUrl + config.url);
  config.headers['Ok-Access-Key'] = '223fd0a1-163f-466c-b975-fd755f668200';
  config.headers['Content-Type'] = 'application/json';
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 响应拦截器
instance_okx_okLink.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  return response;
}, function (error) {
  console.log(error, 'error okx_okLink');
  // 对响应错误做点什么
  return Promise.reject(error);
});
export default instance_okx_okLink;

// https://www.shuidingding.com/priapi/v5/market/mult-tickers?instIds=ETH-USDT&t=1713876057424
// https://www.shuidingding.com/priapi/v5/market/mult-tickers?instIds=ETH-USDT&t=1713876360373
// https://www.caca5280.com/priapi/v5/market/mult-tickers?instIds=ETH-USDT&t=1713876057424
