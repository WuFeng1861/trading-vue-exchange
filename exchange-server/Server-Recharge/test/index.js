import {EthersHelper} from "../utils/ethersHelper.js";
import {config} from "../config/index.js";
import {get_token_transfer_list} from "../api/api_okx_okLink/okx_okLink_api.js";
import {useOkxOkLinkGetTokenTranListData} from "../api/api_okx_okLink/useOkxOkLink.js";
import {getNow} from "../utils/utils.js";
import {useBscscanGetLatestBlockNumber, useBscscanGetTokenTxList} from "../api/api_bscscan/useBscscan.js";

// let ethersHelper = new EthersHelper(config.CHAIN_URL_LIST[0], config.CHAIN_URL_LIST);
// 备用方案，效率奇差无比
// let transactionList = [];
// ethersHelper.watchAllTransactions(async (transactions) => {
//     if (transactions.length > 0) {
//         transactionList = transactionList.concat(transactions);
//     }
// });
//
// // 处理数组内的交易hash
// const handleTransaction = async () => {
//     if (transactionList.length === 0) {
//         setTimeout(handleTransaction, 1000);
//         return;
//     }
//     console.log("handling transaction: ", transactionList.length);
//     let list = transactionList.slice(0, 10);
//     transactionList = transactionList.slice(10);
//     for (let i = 0; i < list.length; i++) {
//         let hash = list[i];
//         let transaction = await ethersHelper.getTransaction(hash);
//         let confirmations = await ethersHelper.confirmTransaction(hash);
//         if (transaction.type !== 0) {
//             continue;
//         }
//         console.log({
//             hash: hash,
//             from: transaction.from,
//             to: transaction.to,
//             value: transaction.value,
//             type: transaction.type,
//             confirm: confirmations,
//             height: transaction.blockNumber
//         });
//     }
//     setTimeout(handleTransaction, 1000);
// };
// handleTransaction();
// await ethersHelper.watchAddressTransactions(config.MERC_CONTRACT_ADDRESS, async (log) => {
//   console.log(log);
// });

// 监控地址的所有交易
// const watchAddress = async (lastRechargeChainHeight) => {
//   // setTimeout(watchAddress, 1000);
//   let nowHeight = ethersHelper.latestBlock;
//   // 如果高度小于传入的高度，则直接进行下一次监控
//   if (nowHeight < lastRechargeChainHeight) {
//     console.log('没有新的高度', lastRechargeChainHeight, nowHeight);
//     setTimeout(() => {
//       watchAddress(lastRechargeChainHeight);
//     }, config.GET_TX_INTERVAL);
//     return;
//   }
//   // 如果nowHeight大于lastRechargeChainHeight+config.MAX_HEIGHT_INTERVAL，则取lastRechargeChainHeight+config.MAX_HEIGHT_INTERVAL 小于则取nowHeight
//   let newHeight = lastRechargeChainHeight + config.MAX_HEIGHT_INTERVAL;
//   if (nowHeight < newHeight) {
//     newHeight = nowHeight;
//   }
//   let newTransactions = await ethersHelper.getAddressTokenTransactions(
//     null,
//     null,
//     config.MERC_CONTRACT_ADDRESS,
//     lastRechargeChainHeight,
//     newHeight
//   );
//   console.log("newTransactions: ", newTransactions.length);
//   console.log(newTransactions);
//   //
//   setTimeout(() => {
//     watchAddress(newHeight + 1);
//   }, config.GET_TX_INTERVAL);
// };
// watchAddress(41884452);
// get_token_transfer_list('BSC', config.MERC_CONTRACT_ADDRESS, null, null, null, 4).then(res => {
//   console.log(res.data);
//   let list = res.data.data[0].transactionList;
//   for (let i = 0; i < list.length; i++) {
//     console.log(list[i]);
//   }
// });
// let time = getNow();
// useOkxOkLinkGetTokenTranListData('BSC', config.USDT_CONTRACT_ADDRESS, null, 1, 1, 100).then(res => {
//   console.log(res);
//   console.log(getNow() - time);
// });
useBscscanGetTokenTxList('0x55d398326f99059fF775485246999027B3197955');
// useBscscanGetLatestBlockNumber();
