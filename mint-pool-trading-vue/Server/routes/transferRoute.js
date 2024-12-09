import express from "express";
import {transfer} from "../controllers/transfer.js";

let router = express.Router();

router.post('/transfer', transfer);

export default router;


