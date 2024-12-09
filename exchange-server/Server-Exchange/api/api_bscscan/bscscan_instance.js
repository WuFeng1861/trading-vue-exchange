import axios from "axios";

const instance_bscscan = axios.create({
  baseURL: 'https://api.bscscan.com/api',
  timeout: 30 * 1000,
});
// 请求拦截器
instance_bscscan.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  // 打印url
  // console.log(baseUrl + config.url);
  config.headers['Content-Type'] = 'application/json';
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 响应拦截器
instance_bscscan.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  return response;
}, function (error) {
  console.log(error, 'error bscscan_instance api');
  // 对响应错误做点什么
  return Promise.reject(error);
});

export default instance_bscscan;
