import {sendEmailGet, sendEmailPost} from "../api/api_email/email_api.js";
import { createHash } from 'node:crypto';
import path from "path";
import fs from "fs";

//http返回统一格式
export const httpResult = (resultCode, msg, errMsg) => {
  let res = {
    code: resultCode,
  };
  if (msg) {
    res.msg = msg;
  }
  if (errMsg) {
    res.errMsg = errMsg;
  }
  return res;
};
httpResult.success = (msg) => {
  return {
    code: 200,
    msg
  };
};
httpResult.error = (errMsg) => {
  return {
    code: 400,
    errMsg
  };
};


//账号验证 靓号不让直接注册
export const isPriceAccount = (account) => {
  account = account.toString();
  return account.split("").filter(item => item === account[0]).length === account.length;
};
//随机生成账号
export const getRandomAccount = () => {
  let random = Math.random().toString();
  let account = random.slice(2, randomNum(7, 10) + 2);
  while (isPriceAccount(account)) {
    random = Math.random().toString();
    account = random.slice(2, randomNum(7, 10) + 2);
  }
  return account;
};
//随机[n,m]
export const randomNum = (minNum, maxNum) => {
  return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
};
//发送邮件
export const sendEmail = async (to, content) => {
  let USER = "wufeng.1998@qq.com";
  let PASS = "irtujcfzqqlhhgae";
  let FORM = "WuFeng 无风邮件发送中心 <wufeng.1998@qq.com>";
  let TITLE = "WuFeng 邮件中心";
  if (typeof to !== "string") {
    to = to.join(",");
  }
  let sendResult = await sendEmailGet(USER, PASS, to, FORM, TITLE, content);
  return sendResult.data;
};
export const sendEmail_post = async (to, content) => {
  try {
    let USER = "wufeng.1998@qq.com";
    let PASS = "irtujcfzqqlhhgae";
    let FORM = "WuFeng 无风邮件发送中心 <wufeng.1998@qq.com>";
    let TITLE = "WuFeng 邮件中心";
    if (typeof to !== "string") {
      to = to.join(",");
    }
    let sendResult = await sendEmailPost(USER, PASS, to, FORM, TITLE, content);
    return sendResult.data;
  } catch (e) {
    console.log("邮件发送失败", e.message);
    return false;
  }

};
//随机生成验证码
export const randomCaptcha = () => {
  return randomNum(100000, 999999);
};
//现在的时间戳
export const getNow = () => {
  return new Date().getTime();
};

// 清除对象中的值为空或者null或者undefined的数据
export const clearObject = (obj) => {
  for (let key in obj) {
    if (obj[key] === null || obj[key] === undefined) {
      delete obj[key];
    }
  }
  return obj;
};

// 判断链接是否是图片或视频
export const isImageOrVideo = (url) => {
  const picTypes = /.jpg|.jpeg|.png|.gif|.mp4/i;
  const videoTypes = /.mp4|.avi|.mkv/i;

  if (picTypes.test(url)) {
    return true;
  } else {
    return videoTypes.test(url);
  }
};

// 一天的时间戳
export const ONEDAY = 24 * 60 * 60 * 1000;

// 获取今天的0点的时间戳
export const getTodayZero = () => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return today.getTime();
};

// sleep
export const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// 非系统错误爆出
export const errorTip = (message) => {
  throw {
    message,
    isMyError: true,
  };
};

// 错误处理
export const errorHandle = (error, tip) => {
  if (error.isMyError) {
    throw new Error(error.message);
  }
  console.log(error, tip);
  throw new Error(tip);
};

// 计算MD5
export const md5 = (content) => {
  const md5 = createHash('md5');
  return md5.update(content).digest('hex');
};

// 获取文件绝对路径 type=module filePath是相对路径  __filename = fileURLToPath(import.meta.url);
export const getAbsolutePath = (__filename, filePath) => {
  // 获取当前模块的目录路径
  const __dirname = path.dirname(__filename);
  const absolutePath = path.resolve(__dirname, filePath);
  return absolutePath;
};

// 同步读取文件的内容， 不存在则返回指定内容 type=module
export const readFile = (filePath, defaultContent = '') => {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    if(content === '') {
      return defaultContent;
    }
    return content;
  } catch (error) {
    return defaultContent;
  }
};

// 同步更改文件的内容，不存在则创建文件 type=module filePath是相对路径
export const writeFile = (filePath, content) => {
  // 判断content是否为字符串
  if (typeof content!=='string') {
    content = JSON.stringify(content);
  }
  return fs.writeFileSync(filePath, content, 'utf8');
};

