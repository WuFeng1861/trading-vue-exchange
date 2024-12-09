import mqUtil from "./index.js";
import {MQ_PRODUCER_CONFIG_EMAIL_DIRECT, MQ_PRODUCER_CONFIG_NOWEMAIL_DIRECT} from "../config/mq-producer.js";

const {exchange, routingKey} = MQ_PRODUCER_CONFIG_EMAIL_DIRECT;
const {exchange: exchange_now, routingKey: routingKey_now} = MQ_PRODUCER_CONFIG_NOWEMAIL_DIRECT;
// 写入mq要发送的邮件
export const addEmailMq_EmailDirect = async (data) => {
  await mqUtil.sendMessageToExchange(exchange, data, routingKey);
  console.log(`写入rabbitmq成功,id: ${data.id},message: ${JSON.stringify(data)}`);
};

// 写入mq现在要发送的邮件
export const addEmailMq_NowEmailDirect = async (data) => {
  await mqUtil.sendMessageToExchange(exchange_now, data, routingKey_now);
  console.log(`写入rabbitmq成功,id: ${data.id},message: ${JSON.stringify(data)}`, `addEmailMq_EmailDirect_Now`);
};
