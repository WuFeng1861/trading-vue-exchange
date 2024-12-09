import express from "express";
import {checkRegister, syncRegister} from '../controllers/user.js';
import {setBindAddress} from "../controllers/mint.js";
let router = express.Router();

router.post('/syncRegister', syncRegister);
router.post('/checkRegister', checkRegister);
router.post('/setBindAddress', setBindAddress);
export default router;


