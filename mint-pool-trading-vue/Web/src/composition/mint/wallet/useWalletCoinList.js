import {getBalance} from "@/api/mintPool/wallet.js";
import SafeCalc from "@/utils/bignumberjs.js";
import {getImagePath} from "@/utils/index.js";

// 现有币种BNB、MERC、USDT（暂时无用）
const walletCoinList = ref([]);

export const useWalletTotalValueRef = () => {
  return computed(() => {
    let totalValue = 0;
    walletCoinList.value.forEach((item) => {
      let itemValue = SafeCalc.mul(item.unitPrice, item.balance);
      totalValue = SafeCalc.add(totalValue, itemValue);
    })
    return totalValue;
  })
};

export const useWalletCoinListRef = () => walletCoinList;

const walletCoinRefCache = {};
export const useWalletCoinRef = (coinName) => {
  if(walletCoinRefCache[coinName]) {
    return walletCoinRefCache[coinName];
  }
  let coinRef = computed(() => {
    return walletCoinList.value.find((item) => item.name === coinName);
  })
  walletCoinRefCache[coinName] = coinRef;
  return coinRef;
}

export const initWalletCoinList = async () => {
  let id = localStorage['id'];
  if(!id) {
    return;
  }
  let res = await getBalance(id);
  res.coinList.forEach((item) => {
    item.totalValue = SafeCalc.mul(item.unitPrice, item.balance);
  })
  walletCoinList.value = res.coinList;
}

// -------------------------------------------------------------------------------
const coinIcon = ref({
  BNB: getImagePath('Wallet-BNB.png'),
  MERC: getImagePath('Wallet-MERC.png'),
  USDT: getImagePath('Wallet-USDT.png'),
});

export const useCoinIcon = (coinName) => {
  return coinIcon.value[coinName];
};

initWalletCoinList();
