import userDao from "../Dao/user.js";
import sequelize from "../models/init.js";
import {httpResult, randomCaptchaNum} from "../utils/utils.js";
import userNowDao from "../Dao/userNow.js";
import {getUserData} from "./utils.js";
import mqBindAddressDao from "../Dao/mqBindAddress.js";

// 同步注册信息
export const syncRegister = async (req, res) => {
  let {id, email, invitation_code, inviter_id, user_name} = req.body;
  console.log(id, email, invitation_code, inviter_id, user_name);
  if (!id || !email || !invitation_code || Number(inviter_id) < 0 || !user_name) {
    throw new Error('注册数据不正确');
  }
  // 同步注册消息，然后生成验证码写入数据库，然后将发送验证码的消息放入mq
  // mysql事务
  const t = await sequelize.transaction();
  try {
    // 添加用户信息
    await syncUserInfo(id, email, invitation_code, inviter_id, user_name, t);
    // 生成验证码10位数字
    let captcha = randomCaptchaNum(10);
    // 将验证码写入mysql
    await mqBindAddressDao.create(id, captcha, email, t);
    // 将发送验证码的消息放入mq
    // const mqData = {
    //   id,
    //   code: captcha,
    //   email,
    //   complete: false
    // };
    // await addEmailMq(mqData);
    // 提交事务
    await t.commit();
    console.log('注册成功', id, email, invitation_code, inviter_id, user_name, captcha);
  } catch (e) {
    console.log(e, '注册失败');
    await t.rollback();
    throw new Error('注册失败');
  }
  res.json(httpResult.success({result: true}));
};

// 检查注册信息
export const checkRegister = async (req, res) => {
  let {id} = req.body;
  if (!id) {
    throw new Error('用户id错误');
  }
  let result = await getUserData(id);
  if (result) {
    res.json(httpResult.success({result: true}));
    return;
  }
  res.json(httpResult.success({result: false}));
};

async function syncUserInfo(id, email, invitation_code, inviter_id, user_name, t) {
  // 添加用户信息
  await userDao.addUser(id, email, invitation_code, inviter_id, user_name, t);
  // 添加用户在线数据
  await userNowDao.add(id, null, null, null, null, inviter_id, t);
}
