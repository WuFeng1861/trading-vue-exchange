import express from "express";
import {
  addRechargeAddress,
  getRechargeAddress,
  getRechargeRecords,
  getWithdrawFeeRequest,
  withdrawRequest
} from '../controllers/recharge.js';

let router = express.Router();

router.post('/addRechargeAddress', addRechargeAddress);
router.post('/getRechargeAddress', getRechargeAddress);
router.post('/getRechargeRecords', getRechargeRecords);
router.post('/withdrawRequest', withdrawRequest);
router.post('/getWithdrawFeeRequest', getWithdrawFeeRequest);
export default router;


