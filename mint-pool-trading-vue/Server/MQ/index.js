import {MQ_CONFIG} from "../config/mq.js";
import {MQUtil} from "./mqUtil/index.js";

const {host, username, password, virtualHost} = MQ_CONFIG;
// 连接rabbitmq
const mqUtil = new MQUtil({
  hostname: host,
  username,
  password,
  vhost: virtualHost,
  port: 5672,
});
await mqUtil.connect();



export default mqUtil;
