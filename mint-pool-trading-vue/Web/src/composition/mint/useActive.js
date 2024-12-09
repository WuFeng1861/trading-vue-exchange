import {useMyGroupRef} from "@/composition/mint/useMyGroup.js";
import {getInviteReward, getStratchReward} from "@/api/mintPool/active.js";
import {useRefreshMyBalance} from "@/composition/mint/useMyBalance.js";
import {getTodayZero} from "@/utils/index.js";
import {useNewEarns} from "@/composition/mint/useMyEarns.js";

// 领取邀请奖励
export const useGetInviteReward = async (step) => {
  await getInviteReward(localStorage['id'], step);
  useRefreshMyBalance();
}

export const useGetStratchReward = async () => {
  let res = await getStratchReward(localStorage['id']);
  localStorage['nextStratch'] = getTodayZero() + 24 * 60 * 60 * 1000;
  useNewEarns();
  useRefreshMyBalance();
  return res.coin;
}
