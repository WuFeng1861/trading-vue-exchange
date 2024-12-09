import express from "express";
import {addChainTransaction, finishRecharge} from "../controllers/recharge.js";

let router = express.Router();

router.post('/addChainTransaction', addChainTransaction);
// router.post('/finishRecharge', finishRecharge);

export default router;

