import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import {exceptionHandle} from './exception/exception.js';
import {config} from "./config/index.js";
import rechargeRouter from "./routes/rechargeRoute.js";
import managerRouter from "./routes/managerRoute.js";
import {authToken} from "./middleware/JWTToken.js";
import './ChainServer/index.js'; // todo: 后续拆分出去，在使用redis后，将地址能够存储在redis中


let app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
const HTTP_PORT = config.HTTP_PORT;

// 路由
app.use(authToken);
app.use('/recharge', rechargeRouter);
app.use('/manager', managerRouter);


// 这个异常处理需要放后面
app.use(exceptionHandle);

app.listen(HTTP_PORT, () => {
  console.log(`服务启动! ${HTTP_PORT}端口`);
});
