import schedule from "node-schedule";
import activeStratchDao from "../Dao/activeStratch.js";

export const timer_resetStratch = async () => {
  // 启动一个定时任务 每天0点执行一次
  const job = schedule.scheduleJob("0 0 * * *", async () =>{
    // 重置用户的剩余抽卡次数
    await activeStratchDao.updateAll(0, 0);
    console.log("重置用户剩余抽卡次数成功");
  });
};
