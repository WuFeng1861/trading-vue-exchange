import instance from "./instance.js";

// 登录
export const login = (username, email, password) => {
  return instance.post("/user/login", {username, email, password});
};

// 注册
export const register = (username, password, email, invitation_code, verify_code) => {
  return instance.post('/user/register', {username, password, email, invitation_code, verify_code});
};

// 刷新token
export const getNewToken = () => {
  console.log('getNewToken', localStorage.getItem('refreshToken'), localStorage.getItem('id'))
  return instance.post('/token/updateToken', {}, {
    headers: {'Authorization': 'Bearer ' + localStorage.getItem('refreshToken') + " "+ localStorage.getItem('id')}
  });
};

// 检测用户名和邮箱是否唯一
export const checkUserData = (email, username) => {
  return instance.post('/user/checkdata', {email, username});
};

// 检查邀请码
export const checkInviterCode = (invitation_code) => {
  return instance.post('/user/checkcode', {invitation_code});
};
