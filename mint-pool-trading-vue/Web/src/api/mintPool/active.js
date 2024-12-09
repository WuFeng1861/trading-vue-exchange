import {createInstance} from "./createInstance.js";

const instance = createInstance('active');

// 领取邀请奖励
export const getInviteReward = (id, step) => {
  return instance.post("/getInviteReward", { id, step });
};
// 领取每日刮一刮奖励
export const getStratchReward = (id) => {
  return instance.post("/getStratchReward", { id });
};
