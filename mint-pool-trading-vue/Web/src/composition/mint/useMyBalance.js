import {getbalance} from "@/api/mintPool/mint.js";
import {getNowTimeStamp} from "@/utils/index.js";
import SafeCalc from "@/utils/bignumberjs.js";
import {useStopMint} from "@/composition/mint/useMint.js";

// 我的数据
const myBalance = ref({});

const initMyBalance = async () => {
  if(!localStorage['id']) {
    return;
  }
  const balance = await getbalance(localStorage['id']);
  console.log(balance)
  myBalance.value = balance;
};

// 获取我的数据
export const useMyBalanceRef = () => {
  return myBalance;
};

// 刷新我的数据
export const useRefreshMyBalance = () => {
  return initMyBalance();
};

// 更新我的数据
export const useUpdateMyBalance = (data) => {
  console.log(myBalance.value, data)
  myBalance.value = {
    ...myBalance.value,
    ...data
  };
};

const isMining = computed(() => {
  return Number(myBalance.value.nexttime) > getNowTimeStamp();
});

// 是否在挖矿
export const useIsMiningRef = () => {
  return isMining;
};
// 挖矿剩余时间
const mintTime = ref('');
// 挖矿剩余百分比 用于展示波纹 在刚开始时这个数据最大80% 结束时最小0%
const mintRemainPercent = ref('0%');
const updateMintTime = () => {
  // console.log('updateMintTime', isMining.value)
  if(!isMining.value) {
    requestIdleCallback(updateMintTime);
    return;
  }
  if(myBalance.value.nexttime - getNowTimeStamp() > 0) {
    // 剩余时间
    let moreTime = myBalance.value.nexttime - getNowTimeStamp();
    const h = Math.floor(moreTime / 3600000);
    const m = Math.floor(moreTime % 3600000 / 60000);
    const s = Math.floor(moreTime % 3600000 % 60000 / 1000);
    // 更新剩余时间
    const newTime = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    if(newTime !== mintTime.value){
      mintTime.value = newTime;
    }
    let remainPercent = (moreTime / (24 * 60 *  60 * 1000)) * 100;
    if(remainPercent > 80) {
      remainPercent = 80;
    }
    if(remainPercent < 0) {
      remainPercent = 0;
    }
    if(remainPercent !== mintRemainPercent.value) {
      mintRemainPercent.value = remainPercent + '%';
    }
  }
  else {
    const newTime = '00:00:00';
    if(newTime !== mintTime.value){
      mintTime.value = newTime;
    }
    isMining.value = false;
    mintRemainPercent.value = 0 + '%';
    // 结算挖矿
    useStopMint();
  }
  requestIdleCallback(updateMintTime);
}
export const useMintTimeRef =  () => {
  return mintTime;
};

export const useMintRemainPercentRef =  () => {
  return mintRemainPercent;
}

const mintEarnsNow = computed(() => {
  mintTime.value;
  let moreTime = myBalance.value.nexttime - getNowTimeStamp();
  if(moreTime < 0){
    return 0;
  }
  // 更新这次获得的数量
  let mybanlance = useMyBalanceRef();
  const mintRateNow = SafeCalc.add(mybanlance.value.groupMintRate, mybanlance.value.baseMintRate);
  const getEarnsTimeNow = SafeCalc.sub(24*60*60*1000, moreTime);
  const perTimeEarns = SafeCalc.div(mintRateNow, 60*60*1000);
  return SafeCalc.mul(getEarnsTimeNow, perTimeEarns, 2);
});
export const useMintEarnsNowRef =  () => {
  return mintEarnsNow;
};

requestIdleCallback(updateMintTime);

initMyBalance();
