import db from "../models/index.js";
import {Op} from "sequelize";

let userOnline = db.userOnline;
let userOnlineDao = {};
// 创建用户在线
userOnlineDao.create = async (user_id, invitee_id, online, t) => {
  return userOnline.create({user_id, invitee_id, online}, {transaction: t});
};
// 获取用户在线的信息
userOnlineDao.getUserOnline = async (user_id, t) => {
  return userOnline.findAll({
    where: {
      user_id,
      online: 1
    },
    transaction: t,
    raw: true
  });
};

// 获取用户的这个邀请者在线信息
userOnlineDao.getUserInviteeOnline = async (user_id, invitee_id, t) => {
  return userOnline.findOne({
    where: {
      user_id,
      invitee_id,
      online: 1
    },
    transaction: t,
    raw: true
  });
};

// 更新用户在线的信息
userOnlineDao.updateUserOnline = async (user_id, invitee_ids, online, t) => {
  return userOnline.update({online}, {
    where: {
      user_id,
      invitee_id: {
        [Op.in]: invitee_ids
      }
    },
    transaction: t
  });
};
// 取消用户被邀请者在线的信息
userOnlineDao.closeUserInviteeOnline = async (user_id, t) => {
  return userOnline.update({online: 0}, {
    where: {
      user_id
    },
    transaction: t
  });
};
export default userOnlineDao;
