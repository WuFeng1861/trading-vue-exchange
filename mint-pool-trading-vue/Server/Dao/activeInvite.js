import db from "../models/index.js";
import {Sequelize} from "sequelize";

let activeInvite = db.activeInvite;
let activeInviteDao = {};

// 获取用户的邀请活动数据
activeInviteDao.getUserActiveInvite = async (id, t) => {
  return activeInvite.findOne({
    where: {
      id: id
    },
    transaction: t,
    raw: true
  });
};
// 创建用户的邀请活动数据
activeInviteDao.add = (id, invite_step, t) => {
  return activeInvite.create({
    id: id,
    invite_step: invite_step
  }, {
    transaction: t
  });
};

// 更新用户邀请活动的领奖阶段
activeInviteDao.update = (id, invite_step, t) => {
  return activeInvite.update({
    invite_step: invite_step
  }, {
    where: {
      id: id
    },
    transaction: t
  });
};

export default activeInviteDao;
