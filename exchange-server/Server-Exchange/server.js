import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import {exceptionHandle} from './exception/exception.js';
import {config} from "./config/index.js";
import orderRouter from "./routes/orderRoute.js";
import assetRouter from "./routes/assetRoute.js";
import managerRouter from "./routes/managerRoute.js";
import {authToken} from "./middleware/JWTToken.js";


let app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
const HTTP_PORT = config.HTTP_PORT;

// 路由
app.use(authToken);
app.use('/order', orderRouter);
app.use('/asset', assetRouter);
app.use('/manager', managerRouter);


// 这个异常处理需要放后面
app.use(exceptionHandle);

app.listen(HTTP_PORT, () => {
  console.log(`服务启动! ${HTTP_PORT}端口`);
});
