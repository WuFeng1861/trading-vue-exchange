import {LRUCache} from "../utils/utilClass/LRUCache.js";
import mqBindAddressDao from "../Dao/mqBindAddress.js";
import {config} from "../config/index.js";
import {addEmailMq_NowEmailDirect} from "../MQ/mq-email.js";
import {getNow, httpResult} from "../utils/utils.js";

const userBindCodeLimitIds = new LRUCache(10000); // key: id, value: {times: 发送次数, expireTime: 过期时间}
export const sendBindCodeEmail = async (req, res) => {
  let {id} = req.body;
  checkTokenId(id, req);
  // 检查userBindCodeLimitIds缓存中是否有该id,有则报错发送次数过多
  if (userBindCodeLimitIds.has(id) && userBindCodeLimitIds.get(id).times >= config.EMAIL_SEND_TIMES_LIMIT) {
    throw new Error("发送次数过多。请联系管理员");
  }
  // 1分钟发送一次
  if (userBindCodeLimitIds.has(id) && userBindCodeLimitIds.get(id).expireTime > getNow()) {
    throw new Error("发送频率过高，请稍后再试");
  }
  // mysql 获取用户邮箱和验证码和发送次数
  let userData = await mqBindAddressDao.queryData(id);
  if (!userData) {
    throw new Error("用户不存在");
  }
  // 判断是否超过发送次数
  if (userData.send_count >= config.EMAIL_SEND_TIMES_LIMIT) {
    // 缓存该id
    userBindCodeLimitIds.set(id, {times: userData.send_count, expireTime: getNow() + 60 * 1000});
    throw new Error("发送次数过多。请联系管理员");
  }
  // 更新发送次数
  userData.send_count += 1;
  await mqBindAddressDao.updateSendCount(id, userData.send_count);
  // 缓存该id
  userBindCodeLimitIds.set(id, {times: userData.send_count, expireTime: getNow() + 60 * 1000});
  console.log("发送验证码邮件", id, userData.email, userData.send_count);
  // 发送消息到mq
  await addEmailMq_NowEmailDirect(userData);
  res.json(httpResult.success({result: true}));
};

const checkTokenId = (id, req) => {
  let tokenId = req.headers['authorization'].split(" ")[2];
  if (id.toString() !== tokenId.toString()) {
    throw new Error("账号不一致，请重新登录");
  }
};
