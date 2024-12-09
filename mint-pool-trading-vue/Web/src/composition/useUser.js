import {getMd5, getUrlQuery, routerTo, routerToParams, routerToQuery, validateEmail} from "../utils/index.js";
import {checkInviterCode, getNewToken, login, register} from "../api/user/api.js";
import router from "../route/index.js";
import {clearStorage} from "../utils/storage.js";
import {checkRegister, syncRegister} from "@/api/mintPool/api.js";

/**
 * 用户登录
 * @param account
 * @param passwordStr
 * @returns {Promise<void>}
 */
export const useLogin = async (account, passwordStr) => {
  let password = getMd5(passwordStr);
  // 判断登录账户的是名称还是邮箱
  let isEmail = validateEmail(account);
  let username;
  let email;
  isEmail ? email = account : username = account;
  // 这里应该向后端发起请求
  let result = await login(username, email, password);
  // 检查是否同步信息
  try {
    // 检查发现未同步信息
    // 同步用户信息
    let res = (await checkRegister(result.id)).result;
    if (!res) {
      await syncRegister(result.id, result.email, result.invitation_code, result.inviter_id, result.username);
    }
  } catch (e) {
    await syncRegister(result.id, result.email, result.invitation_code, result.inviter_id, result.username);
  }
  // 保存用户信息和token
  useSaveUserInfo(result);
  // 路由跳转
  routerTo('exchange', 1);
};

/**
 * 用户注册
 * @param email
 * @param username
 * @param passwordStr
 * @param code
 * @param verifyCode
 * @returns {Promise<void>}
 */
export const useRegister = async (email, username, passwordStr, code, verifyCode) => {
  let result = await register(username, getMd5(passwordStr), email, code, verifyCode);
  await syncRegister(result.id, result.email, result.invitation_code, result.inviter_id, result.username);
  useSaveUserInfo(result);
  // 进入系统
  useCheckToken();
};

/**
 * 用户退出
 */
export const useExit = () => {
  clearStorage();
  router.push('/').then(() => {
    // 清除ESM的缓存
    window.location.reload();
  });
};

/**
 * 用户检查验证码
 * @param code
 * @returns {Promise<boolean>}
 */
export const useCheckCode = async (code) => {
  let result = await checkInviterCode(code);
  return !!(result && result.result);

};

/**
 * 检查token是否过期，如果过期但是没过长时间直接获取新的token， 如果超过设定时间，则需要重新登录
 * @returns {Promise<void>}
 */
export const useCheckToken = async () => {
  let token = localStorage["token"];
  let refreshToken = localStorage["refreshToken"];
  if (!token && !refreshToken) {
    return;
  }
  let user = JSON.parse(decodeURIComponent(escape(window.atob(token.split('.')[1]))));
  if (user.exp > Math.floor(Date.now() / 1000)) {
    // 直接进入页面
    // 路由跳转
    let path = window.location.pathname.split('/');
    let query = getUrlQuery();
    // 获取参数一并传过去
    // if (path.includes('wallet')) {
    //   console.log(path, query)
    //   let toRouteName = 'asset';
    //   if(path.includes('record')) {
    //     toRouteName = 'record';
    //     const toRouteCoinName = path[path.length - 1];
    //     routerToParams(toRouteName, {coinName: toRouteCoinName});
    //     return;
    //   }
    //   if(path.includes('transfer')) {
    //     toRouteName = 'transfer';
    //     const toRouteCoinName = path[path.length - 1];
    //     routerToParams(toRouteName, {coinName: toRouteCoinName});
    //     return;
    //   }
    //   if(path.includes('record-detail')) {
    //     toRouteName ='record-detail';
    //     const hash = path[path.length - 1];
    //     routerToParams(toRouteName, {hash: hash});
    //     return;
    //   }
    //   routerToQuery(toRouteName, query);
    //   return;
    // }
    // if (path.includes('Home')) {
    //   routerToQuery((path[path.length - 1]) || 'dashboard', query);
    //   return;
    // }
    if (path.includes('exchange')) {
      if(path.includes('rwview')) {
        let toRouteName = 'rwview';
        const toRouteType = path[path.length - 1];
        routerToParams(toRouteName, {type: toRouteType});
        return;
      }
      routerToQuery((path[path.length - 1]) || 'main', query);
      return;
    }
    routerToQuery('exchange', query);
  }
  let refreshUser = JSON.parse(decodeURIComponent(escape(window.atob(refreshToken.split('.')[1]))));
  if (refreshUser.exp > Math.floor(Date.now() / 1000)) {
    // 发起请求获取新的token
    let result = await getNewToken();
    console.log(result, '获取新的token')
    if (!result) {
      return;
    }
    localStorage["token"] = result.token;
    localStorage["refreshToken"] = result.refreshToken;
    await useCheckToken();
    return;
  }
  clearStorage();
  router.push('/');
};

/**
 * 获取登录用户信息
 * @returns {any}
 */
export const useGetUserInfo = () => {
  if (!localStorage["user"]) {
    return null;
  }
  console.log(atob(decodeURIComponent(localStorage["user"])))
  return JSON.parse(decodeURIComponent(atob(localStorage["user"])));
};

/**
 * 保存用户数据
 * @param result
 */
const useSaveUserInfo = (result) => {
  let user = {
    id: result.id,
    create_time: result.create_time,
    invitation_code: result.invitation_code,
    username: result.username
  };
  localStorage["id"] = result.id;
  localStorage["token"] = result.token;
  localStorage["refreshToken"] = result.refreshToken;
  console.log(JSON.stringify(user))
  localStorage["user"] = btoa(encodeURIComponent(JSON.stringify(user)));
};





