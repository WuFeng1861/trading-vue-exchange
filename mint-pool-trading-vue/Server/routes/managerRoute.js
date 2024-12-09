import express from "express";
import {
  getTotalUser,
  updateTotal,
  getUserInviteCount,
  updateContribution,
  updateUserUnlock, updateTransferRecord
} from "../controllers/manager.js";

let router = express.Router();

router.get('/updateTotal', updateTotal);
router.get('/updateContribution', updateContribution);
router.get('/updateUserUnlock', updateUserUnlock);
router.get('/updateTransferRecord', updateTransferRecord);
router.get('/getTotalUser', getTotalUser);
router.get('/getUserInviteCount', getUserInviteCount);

export default router;

