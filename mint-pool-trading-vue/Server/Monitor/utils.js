import {exec} from "child_process";
import axios from "axios";
import {useLoginByName} from "../api/api_user/useUser.js";

export const restart = (id, projectName) => {
  exec(`pm2 restart ${id}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`重启进程发成错误, PM2 id ${id}, 项目名称${projectName}`);
      console.log(error);
      return;
    }
    console.log(`重启程序：${projectName}, id: ${id}`);
    console.log(`输出: ${stdout}`);
    console.error(`错误: ${stderr}`);
  });
};

export const getToken = async () => {
  try {
    let token = await useLoginByName("WuFeng", "123456Ll");
    return token.token;
  } catch (e) {
    console.log(e, 'token获取错误');
    restart(2, "userSys");
    return false;
  }
};
