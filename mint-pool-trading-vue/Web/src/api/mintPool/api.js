import {createInstance} from "./createInstance.js";

const instance = createInstance('user');

// 同步注册信息
export const syncRegister = (id, email, invitation_code, inviter_id, user_name) => {
  return instance.post("/syncRegister", { id, email, invitation_code, inviter_id, user_name });
};

// 检查信息同步
export const checkRegister = (id) => {
  return instance.post("/checkRegister", { id });
};

// 设置绑定地址
export const setBindAddress = (id, address, code, signRes) => {
  return instance.post("/setBindAddress", { id, address, code, signRes });
};

// 获取用户信息
export const getUserInfo = (id) => {
  return instance.post("/getUserInfo", { id });
};

// 设置用户手机号
export const setUserMobile = (id, mobile) => {
  return instance.post("/setUserMobile", { id, mobile });
};
