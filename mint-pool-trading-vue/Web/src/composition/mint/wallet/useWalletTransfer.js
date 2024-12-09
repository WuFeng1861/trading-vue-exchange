import {transferWithAddress} from "@/api/mintPool/wallet.js";
import {getMd5} from "@/utils/index.js";

// 转账
export const useWalletTransfer = async (coinName, toAddress, amount, password) => {
  let id = localStorage['id'];
  if (!id) {
    return;
  }
  try {
    await transferWithAddress(id, toAddress, amount, coinName, getMd5(password));
    return true;
  } catch (error) {
    console.log(error.message);
    return false;
  }
}
