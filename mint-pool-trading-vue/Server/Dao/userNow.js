import db from "../models/index.js";
import {getNow} from "../utils/utils.js";
import {Op} from "sequelize";
import sequelize from "../models/init.js";

let userNow = db.userNow;
let userNowDao = {};

// 增加用户的在线信息
userNowDao.add = (id, nexttime, lastsettletime, base_mint_rate, group_mint_rate, inviter_id, t) => {
  if (!t) {
    return userNow.create({
      id, nexttime, lastsettletime, base_mint_rate, inviter_id, group_mint_rate
    });
  }
  return userNow.create({
    id, nexttime, lastsettletime, base_mint_rate, inviter_id, group_mint_rate
  }, {transaction: t});
};

// 更新用户的最终在线时间和基础速率和团队速率
userNowDao.updateMintData = (id, nexttime, base_mint_rate, group_mint_rate, t) => {
  if (!t) {
    return userNow.update({nexttime, base_mint_rate, group_mint_rate}, {where: {id}});
  }
  return userNow.update({nexttime, base_mint_rate, group_mint_rate}, {where: {id}, transaction: t});
};

// 更新用户的上次结算时间
userNowDao.updateLastsettletime = (id, lastsettletime, t) => {
  return userNow.update({lastsettletime}, {where: {id}, transaction: t});
};

// 更新用户的邀请人id
userNowDao.updateInviterId = (id, inviter_id, t) => {
  if (!t) {
    return userNow.update({inviter_id}, {where: {id}});
  }
  return userNow.update({inviter_id}, {where: {id}, transaction: t});
};

// 获取用户在线信息
userNowDao.getLock = (id, t) => {
  if (!t) {
    return userNow.findOne({where: {id}, raw: true});
  }
  return userNow.findOne({where: {id}, raw: true, transaction: t, lock: 'UPDATE'});
};

// 获取用户邀请的在线人数
userNowDao.getInviteOnlineCount = (id) => {
  return userNow.count({where: {inviter_id: id, nexttime: {[Op.gt]: getNow()}}});
};

// 获取用户邀请的在线人
userNowDao.getInviteOnline = (id) => {
  return userNow.findAll({
    attributes: ["id", "nexttime"],
    where: {
      inviter_id: id,
      nexttime: {[Op.gt]: getNow()}
    },
    raw: true
  });
};

// 获取用户邀请的人数
userNowDao.getInviteCount = (id) => {
  return userNow.count({where: {inviter_id: id}});
};

// 获取多个用户邀请的人数
userNowDao.getUsersInviteCount = (ids) => {
  return userNow.count({where: {inviter_id: {[Op.in]: ids}}});
};

// 获取用户邀请人的信息
userNowDao.getInviteList = (id) => {
  return userNow.findAll({
    attributes: ["id", "nexttime"],
    where: {inviter_id: id},
    raw: true
  });
};

// 获取用户邀请人的信息 带分页
userNowDao.getInviteListPage = (id, pageNumber, pageSize) => {
  const offset = (pageNumber - 1) * pageSize;
  return userNow.findAndCountAll({
    attributes: ["id", "nexttime"],
    where: {inviter_id: id},
    raw: true,
    offset,
    limit: pageSize,
    order: [[sequelize.literal('nexttime + 0'), 'DESC']],
  });
};

// 获取多个用户邀请人的信息
userNowDao.getUsersInviteList = (ids) => {
  return userNow.findAll({
    attributes: ["id", "nexttime"],
    where: {inviter_id: {[Op.in]: ids}},
    raw: true
  });
};

// 获取整张表正在挖矿的用户数据
userNowDao.getAllUserOnlineLock = (t) => {
  return userNow.findAll({
    where: {
      [Op.gt]: sequelize.literal(`\`nexttime\` + 0 > ${getNow()}`)
    },
    raw: true,
    lock: t ? t : "UPDATE"
  });
};

export default userNowDao;
