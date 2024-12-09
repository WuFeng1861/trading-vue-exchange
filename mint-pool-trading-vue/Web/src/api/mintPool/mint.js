import {createInstance} from "./createInstance.js";

const instance = createInstance('mint');

// 获取用户余额
export const getbalance = (id) => {
  return instance.post('/getbalance', {id: id});
}

// 开始挖矿
export const startMint = (id, signRes) => {
  return instance.post('/startmint', {id: id, signRes});
}

// 停止挖矿
export const settleMint = (id) => {
  return instance.post('/settlemint', {id: id});
}

// 获取历史一周的收益
export const getWeekEarnings = (id) => {
  return instance.post('/getWeekEarnings', {id: id});
}

// 设置上级 data为邀请码或者邮箱
export const setMySuperiors = (id, data) => {
  return instance.post('/setmysuperior', {id: id, data: data});
}

// 获取我上级信息
export const getMySuperior = (id) => {
  return instance.post('/getmysuperior', {id: id});
}

// 获取我的收益列表
export const getEarningsList = (id, page, pageSize) => {
  return instance.post('/getearnings', {id: id, page, pageSize});
}

// 获取我的团队信息
export const getMyGroup = (id, pageNumber) => {
  return instance.post('/getmygroup', {id: id, pageNumber});
}

// 获取用户总数和释放总量和税收总量
export const getTotalData = () => {
  return instance.post('/gettotaldata');
}
