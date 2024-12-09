import express from "express";
import {
  getBalance,
  getTransferRecord,
  getTransferRecordDetail,
  getTransferRecordTotal,
  transfer
} from "../controllers/wallet.js";
let router = express.Router();

router.post('/getBalance', getBalance);
router.post('/transfer', transfer);
router.post('/getTransferRecord', getTransferRecord);
router.post('/getTransferRecordTotal', getTransferRecordTotal);
router.post('/getTransferRecordDetail', getTransferRecordDetail);
export default router;


