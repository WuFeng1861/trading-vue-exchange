import express from "express";
import {
  getbalance,
  getEarningsList,
  getMyGroup,
  getMySuperior, getTotalData,
  getWeekEarnings,
  setMySuperiors,
  settleMint,
  startMint
} from '../controllers/mint.js';

let router = express.Router();

router.post('/getbalance', getbalance);
router.post('/startmint', startMint);
router.post('/settlemint', settleMint);
router.post('/getweekearnings', getWeekEarnings);
router.post('/getmysuperior', getMySuperior);
router.post('/setmysuperiors', setMySuperiors);
router.post('/getearnings', getEarningsList);
router.post('/getmygroup', getMyGroup);
router.post('/getTotalData', getTotalData);

export default router;


