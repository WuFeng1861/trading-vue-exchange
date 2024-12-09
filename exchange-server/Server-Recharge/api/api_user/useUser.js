import {checkToken, getEmail, login, verifyPassword} from "./user_api.js";
import {md5} from "../../utils/utils.js";

export const useCheckToken = async (token, id) => {
  // console.log(token, id);
  let result = await checkToken(token, id);
  // console.log(result.data);
  let data = result.data;
  return data.code !== 400;
};

export const useGetEmail = async (id) => {
  let result = await getEmail(id);
  let data = result.data;
  if(data.code !== 200) {
    return "";
  }
  return data.msg.email;
};

export const useLoginByName = async (username, passwordStr) => {
  let password = md5(passwordStr);
  let result = await login(username, null, password);
  if(result.data.code !== 200) {
    throw new Error(result.data.msg);
  }
  return result.data.msg;
};
export const useLoginByEmail = async (email, password) => {
  let result = await login(null, email, password);
  if(result.data.code !== 200) {
    throw new Error(result.data.msg);
  }
  return result.data.msg;
};

// 验证密码
export const useCheckPassword = async (id, password) => {
  // console.log(id, password, 'useCheckPassword');
  let result = await verifyPassword(id, password);
  // console.log(result.data, 'useCheckPassword');
  let data = result.data;
  return data.code !== 400 && data.msg.result;
};
