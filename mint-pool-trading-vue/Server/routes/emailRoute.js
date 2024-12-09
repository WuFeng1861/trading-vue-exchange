import express from "express";
import {sendBindCodeEmail} from '../controllers/email.js';

let router = express.Router();

router.post('/sendBindCode', sendBindCodeEmail);
export default router;


