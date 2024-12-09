import userDao from "../Dao/user.js";
import mintRateDao from "../Dao/mintRate.js";

let data = {
  userCount: 0,
  releaseTotal: 0,
  taxTotal: null,
};
const initTotalData = async () => {
  try {
    // 获取用户重量
    data.userCount = await userDao.getUserCount();
    // 获取释放总量
    data.releaseTotal = Number((await mintRateDao.getOutputLock()).output);
  } catch (e) {
    console.log('获取总量数据出错：', e);
  } finally {
    setTimeout(initTotalData, 1000 * 60 * 10);
  }
};

export const getTotalDataInfo = () => {
  return data;
};

initTotalData();


