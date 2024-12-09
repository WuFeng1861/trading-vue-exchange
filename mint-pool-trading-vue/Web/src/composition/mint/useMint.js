import {settleMint, startMint} from "@/api/mintPool/mint.js";
import {useMyBalanceRef, useRefreshMyBalance, useUpdateMyBalance} from "@/composition/mint/useMyBalance.js";
import {elTip, getNowTimeStamp, handleAddress} from "@/utils/index.js";
import {refreshMyGroup} from "@/composition/mint/useMyGroup.js";
import {setBindAddress} from "@/api/mintPool/api.js";
import EthWallet from "@/utils/ethersHelper.js";
import config from "@/config/api.js";


// 开始挖矿
export const useStartMint = async () => {
  const myInfo = useMyBalanceRef();
  console.log('start Mint')
  // 判断有没有绑定地址
  if (!myInfo.value.address) {
    return elTip('请先绑定bsc链地址', 'warning')
  }
  if (!EthWallet.walletList[0] || EthWallet.walletList[0].userAddress.toUpperCase() !== myInfo.value.address.toUpperCase()) {
    return elTip('请先连接到地址：' + handleAddress(myInfo.value.address), 'warning')
  }
  // 发起签名
  let signRes = await EthWallet.walletList[0].signMessage(config.SIGN_WORD);
  if (Number(myInfo.value.nexttime) > getNowTimeStamp()) {
    return elTip('正在挖矿中', 'warning');
  }
  let mintInfo = await startMint(localStorage['id'], signRes);
  useUpdateMyBalance(mintInfo);
  refreshMyGroup();
}

// 停止挖矿
export const useStopMint = async () => {
  // console.log('停止挖矿')
  // 判断条件
  const myInfo = useMyBalanceRef();
  if (Number(myInfo.value.nexttime) > getNowTimeStamp() || Number(myInfo.value.nexttime) <= (Number(myInfo.value.lastsettletime) || 0)) {
    return requestIdleCallback(useStopMint);
  }
  console.log(Number(myInfo.value.nexttime) > getNowTimeStamp(), myInfo.value.lastsettletime, Number(myInfo.value.nexttime) > getNowTimeStamp(), Number(myInfo.value.nexttime) < (Number(myInfo.value.lastsettletime) || 0))
  let mintInfo = await settleMint(localStorage['id']);
  useUpdateMyBalance(mintInfo);
}

// 设置绑定地址
export const useBindAddress = async (code, address, signRes) => {
  await setBindAddress(localStorage['id'], address, code, signRes);
  // 刷新我的信息
  await useRefreshMyBalance();
}

requestIdleCallback(useStopMint);
