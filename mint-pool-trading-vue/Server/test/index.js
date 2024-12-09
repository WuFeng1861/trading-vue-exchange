import './interface.js';
import {getTax} from "../controllers/mint.js";
import {fixMintTotal, fixTransferRecord} from "../controllers/utils.js";
import sequelize from "../models/init.js";
import {getTransferRecords_ETH, getTransferRecords_Merc} from "../controllers/transfer.js";

// getTax(1500*24)
// updateTransferRecord();
// // 测试生成交易记录
// async function updateTransferRecord() {
//   console.log('开始更新记录...');
//   let total = 0;
//   const t = await sequelize.transaction();
//   try {
//     total = await fixTransferRecord(t);
//     await t.commit();
//   } catch (e) {
//     console.log(e);
//     await t.rollback();
//   }
//   console.log('记录数：', total);
// }

// getTransferRecords_Merc(1, 1, 10);
// getTransferRecords_ETH(1, 243, 10);
