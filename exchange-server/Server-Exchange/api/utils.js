//封装第一层返回统一格式
export const useResult = (resultCode, msg, errMsg) => {
  let res = {
    code: resultCode,
  };
  if (msg) {
    res.msg = msg;
  }
  if (errMsg) {
    res.errMsg = errMsg;
  }
  return res;
};
useResult.success = (msg) => {
  return {
    code: 200,
    msg
  };
};
useResult.error = (errMsg) => {
  return {
    code: 400,
    errMsg
  };
};
