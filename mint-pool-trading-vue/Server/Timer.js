import {EthersHelper} from "./utils/ethersHelper.js";

const timer = async () => {
  let etherHelper = new EthersHelper(EthersHelper.OptimismUrl[0]);
  let hashs = await etherHelper.getContractTransactions('0xec792593498B12F39416a452C7F444d36469ee42', 117936811-100, 217936811);
  console.log(hashs);
};
timer();

