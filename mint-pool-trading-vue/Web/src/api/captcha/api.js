import instance from "./instance.js";

// 获取（发送）验证码
export const sendVerificationCode = async (username, email) => {
  return instance.post('/captcha/step_1', {username, email});
};

// 验证验证码
export const verifyCaptcha = async (code, username, email) => {
  return instance.post('/captcha/step_2', {code, username, email});
};

// 修改密码
export const updatePassword = async (code, username, email, password) => {
  return instance.post('/captcha/step_3', {code, username, email, password});
};

// 获取注册验证码
export const getRegisterCaptcha = async (email) => {
  return instance.post('/captcha/register', {email});
};
