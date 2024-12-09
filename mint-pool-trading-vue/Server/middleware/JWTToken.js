import {useCheckToken} from "../api/api_user/useUser.js";
// 不需要权限校验的请求
const non_auth_req = {
  '/user/*': true,
  '/manager/*': true,
};

function validateString(str) {
  if(non_auth_req[str]){
    return true;
  }
  for (const route in non_auth_req) {
    const regex = new RegExp(`^${route.replace('*', '.*')}$`);
    if (regex.test(str)) {
      return true;
    }
  }
  return false;
}

// 请求拦截进行token验证
export const authToken = async (req, res, next) => {
  // 跨域请求不做验证
  if (req.method === 'OPTIONS') {
    next();
    return;
  }
  // 检查是否需要验证权限
  // console.log(req.url, validateString(req.url));
  if (validateString(req.url)) {
    next();
    return;
  }
  // 验证token
  if (!req.headers['authorization']) {
    throw new Error("请重新登录账号");
  }
  const token = req.headers['authorization'].split(" ")[1];
  let user_id = req.headers['authorization'].split(" ")[2];
  const tokenResult = await useCheckToken(token, user_id);

  if (!tokenResult) {
    throw new Error("请重新登录账号");
  }
  next();
};
