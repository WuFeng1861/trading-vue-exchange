import {getNow} from "../utils/utils.js";

export const apiRateLimit = (RATE_LIMIT = 1, TIME_GAP = 1000) => {
  const result = {};

  let limitData = {
    count: 0,
    time: 0
  };

  const getPermission = () => {
    if (getNow() - limitData.time > TIME_GAP) {
      limitData.count = 0;
      limitData.time = getNow();
    }
    if (limitData.count >= RATE_LIMIT && getNow() - limitData.time < TIME_GAP) {
      return false;
    }
    limitData.count++;
    return true;
  };

  result.getPermission = getPermission;
  result.limitData = limitData;
  result.waitPermission = () => new Promise(resolve => setTimeout(() => {
    if (getPermission()) {
      resolve();
    } else {
      result.waitPermission().then(resolve);
    }
  }, TIME_GAP));

  return result;
};
