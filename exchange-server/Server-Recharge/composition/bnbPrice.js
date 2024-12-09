import {useBscscanGetBNBPrice} from "../api/api_bscscan/useBscscan.js";
import schedule from "node-schedule";

let bnbPrice = 700;
const getPrice = async () => {
  let priceData = await useBscscanGetBNBPrice();
  if (priceData.code !== 200) {
    console.log("Failed to get BNB price from BscScan API", priceData.errMsg);
    return;
  }
  bnbPrice = priceData.msg;
};
const initBnbPrice = async () => {
  await getPrice();
  // 间隔10分钟更新一次
  let job = schedule.scheduleJob("*/10 * * * *", getPrice);
};

// 获取BNB价格
export const getBnbPrice = () => {
  return bnbPrice;
};

initBnbPrice();
