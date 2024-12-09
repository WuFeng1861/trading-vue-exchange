import express from "express";
import {createPair} from "../controllers/manager.js";

let router = express.Router();

router.post('/createPair', createPair);
router.get('/jiade', (req, res) => {
    res.send('jiade');
});
export default router;


