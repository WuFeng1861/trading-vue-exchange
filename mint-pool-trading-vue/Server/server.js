import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import {exceptionHandle} from './exception/exception.js';
import {config} from "./config/index.js";
import mintRouter from "./routes/mintRoute.js";
import userRouter from "./routes/userRoute.js";
import activeRouter from "./routes/activeRoute.js";
import transferRouter from "./routes/transferRoute.js";
import managerRouter from "./routes/managerRoute.js";
import walletRouter from "./routes/walletRoute.js";
import emailRouter from "./routes/emailRoute.js";
import './Dao/initData.js';
import './test/index.js';
import './timerGlobalData/index.js';
import {authToken} from "./middleware/JWTToken.js";


let app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
const HTTP_PORT = config.HTTP_PORT;

// 路由
app.use(authToken);
app.use('/mint', mintRouter);
app.use('/user', userRouter);
app.use('/active', activeRouter);
app.use('/transfer', transferRouter);
app.use('/manager', managerRouter);
app.use('/wallet', walletRouter);
app.use('/email', emailRouter);


// 这个异常处理需要放后面
app.use(exceptionHandle);

app.listen(HTTP_PORT, () => {
  console.log(`服务启动! ${HTTP_PORT}端口`);
});
