import {httpResult} from "../utils/utils.js";
import {StringConstants} from "../constant/string.js";

/**
 * 异常处理函数
 */
export const exceptionHandle = (err, req, res, next) => {
  if(err.message.indexOf(StringConstants.LOGIN_FAILED_MESSAGE) >= 0 ) {
    res.json(httpResult(401, null,  err.message));
    return;
  }
  res.json(httpResult.error(err.message));
};
