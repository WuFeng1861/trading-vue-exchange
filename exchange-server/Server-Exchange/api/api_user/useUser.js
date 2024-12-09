import {checkToken, getEmail, login} from "./user_api.js";
import {md5} from "../../utils/utils.js";
import {LRUCache} from "../../utils/LRUCache.js";

// 使用Map缓存token和id，减少请求次数
const tokenMap = new LRUCache(10000);

export const useCheckToken = async (token, id) => {
  // console.log(token, id);
  // todo: 校验token是否有效
  if(tokenMap.has(token) && tokenMap.get(token) === id) {
    return true;
  }
  try {
    let result = await checkToken(token, id);
    // console.log(result.data);
    let data = result.data;
    let success =  data.code !== 400;
    if(success) {
      tokenMap.set(token, id);
    }
    return success;
  } catch (error) {
    console.warn(error.message);
    return false;
  }

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
