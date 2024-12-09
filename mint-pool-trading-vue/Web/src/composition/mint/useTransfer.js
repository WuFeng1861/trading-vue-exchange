import {elTip, explainAccount} from "@/utils/index.js";
import {transfer} from "@/api/mintPool/transfer.js";
import {useMyBalanceRef, useRefreshMyBalance} from "@/composition/mint/useMyBalance.js";
import {useNewEarns} from "@/composition/mint/useMyEarns.js";
import SafeCalc from "@/utils/bignumberjs.js";

// 转账
export const useTransfer = async (toStr, amount) => {
  const {username, email} = explainAccount(toStr);
  // 调用转账逻辑
  await transfer(localStorage['id'], username, email, amount);
  // 更新余额
  await useRefreshMyBalance();
  // 更新账单
  await useNewEarns();
}

// 检查余额是否大于转账金额
export const checkBalance = (amount) => {
  const myBalanceRef = useMyBalanceRef();
  if (!myBalanceRef.value || !myBalanceRef.value.balance || SafeCalc.compare(myBalanceRef.value.balance, amount) === '-1') {
    return elTip('余额不足', 'warning');
  }
  return true;
}
