import {explainAccount, getMd5, validateEmail} from "../utils/index.js";
import {getRegisterCaptcha, sendVerificationCode, updatePassword, verifyCaptcha} from "../api/captcha/api.js";

// 获取验证码 step_1
export const useSendCaptcha = async (account) => {
  let {username, email} = explainAccount(account);
  await sendVerificationCode(username, email);
};

// 校验验证码 step_2
export const useVerifyCode = async (account, code) => {
  let {username, email} = explainAccount(account);
  let result = await verifyCaptcha(code, username, email);
  return result.code;
};

// 修改密码 step_3
export const useChangePassword = async (account, password, code) => {
  password = getMd5(password);
  let {username, email} = explainAccount(account);
  let result = await updatePassword(code, username, email, password);
  return result.result;
};

// 获取邮箱注册验证码
export const useSendRegisterEmailCaptcha = async (email) => {
  if (!validateEmail(email)) {
    return false;
  }
  await getRegisterCaptcha(email);
};
