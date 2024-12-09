import express from "express";
import {getUserAssets, getWaterDrop, getWaterDropTime} from "../controllers/asset.js";
let router = express.Router();

router.post('/getUserAssets', getUserAssets);
router.post('/getWaterDrop', getWaterDrop);
router.post('/getWaterDropTime', getWaterDropTime);
export default router;


