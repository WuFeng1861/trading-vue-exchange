import schedule from "node-schedule";
import {getNow} from "../utils/utils.js";

// const times = [
//   '*/1 * * * * *', // 每1秒
//   '0 * * * * *', // 每分钟
//   '0 */5 * * * *', // 每5分钟
//   '0 */3 * * * *', // 每15分钟
//   '0 0 * * * *', // 每小时
//   '0 0 */2 * * *', // 每天
//   '0 0 0 * * *', // 每周
//   '0 0 0 * * 0', // 每月
// ];

const times = [
  '*/1 * * * * *',        // every second
  // '0 */1 * * * *',       // every minute
  // '*/5 * * * *',         // every 5 minutes
  // '*/15 * * * *',        // every 15 minutes
  // '0 * * * *',           // every hour
  // '0 0 * * *',           // every day at midnight
  // '0 0 * * 0',           // every Sunday at midnight
  // '0 0 1 * *',           // every 1st day of the month at midnight
];

const jobs = [];
const klineScheduledTasks = [];
export const addKlineScheduledTask = (name, task, socket) => {
  klineScheduledTasks.push({name, task, socket});
};
export const changeKlineScheduledTask = (name, task, socket) => {
  const index = klineScheduledTasks.findIndex((task) => task.name === name);
  if (index >= 0) {
    klineScheduledTasks[index].task = task;
  } else {
    addKlineScheduledTask(name, task, socket);
  }
};
export const removeKlineScheduledTask = (name) => {
  const index = klineScheduledTasks.findIndex((task) => task.name === name);
  if (index >= 0) {
    klineScheduledTasks.splice(index, 1);
  }
};
times.forEach((time, index) => {
  const job = schedule.scheduleJob(time, () => {
    for (let i = 0; i < klineScheduledTasks.length; i++) {
      const {task} = klineScheduledTasks[i];
      task();
    }
  });
  jobs.push(job);
});


