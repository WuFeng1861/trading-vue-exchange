import express from "express";
import {getInviteReward} from "../controllers/active_invite.js";
import {getStratchReward} from "../controllers/active_stratch.js";

let router = express.Router();

router.post('/getInviteReward', getInviteReward);
router.post('/getStratchReward', getStratchReward);

export default router;


