import express from "express";
import {
  createLimitPriceOrder,
  cancelLimitPriceOrder,
  getOrderGroup,
  getOrderGroupGap,
  getPairPrice, getTradeOrderList, getUserOrderList, getUserOrderFinishList, getKLineData, getPairDayInfo
} from "../controllers/order.js";

let router = express.Router();

router.post('/createOrderLP', createLimitPriceOrder);
router.post('/cancelOrderLP', cancelLimitPriceOrder);
router.post('/getOrderGroup', getOrderGroup);
router.post('/getOrderGroupGap', getOrderGroupGap);
router.post('/getPairPrice', getPairPrice);
router.post('/getTradeOrderList', getTradeOrderList);
router.post('/getUserOrderList', getUserOrderList);
router.post('/getUserOrderFinishList', getUserOrderFinishList);
router.post('/getKLineData', getKLineData);
router.post('/getPairDayInfo', getPairDayInfo);
export default router;


