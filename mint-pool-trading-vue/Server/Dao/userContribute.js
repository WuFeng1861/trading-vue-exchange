import db from "../models/index.js";
import {Sequelize} from "sequelize";
import {clearObject} from "../utils/utils.js";
import SafeCalc from "../utils/bignumberjs.js";

let userContribute = db.userContribute;
let userContributeDao = {};

// 创建用户贡献
userContributeDao.create = async (id, contribution_value, inviter_id, t) => {
  return await userContribute.create({
    id: id,
    contribute_value: contribution_value,
    inviter_id: inviter_id
  }, {transaction: t});
};

// 获取用户贡献
userContributeDao.getLock = async (id, t) => {
  return userContribute.findOne({
    where: {
      id: id
    },
    raw: true,
    transaction: t,
    lock: "UPDATE"
  });
};

// 获取用户邀请者的贡献列表
userContributeDao.getInviterContributes = async (inviter_id, t) => {
  return userContribute.findAll({
    where: {
      inviter_id: inviter_id
    },
    raw: true,
    transaction: t
  });
};

// 更新用户贡献
userContributeDao.update = async (id, contribution_value, t) => {
  return userContribute.update({
    contribution_value
  }, {
    where: {
      id: id
    },
    transaction: t
  });
};

// 获取用户的锁定贡献值
userContributeDao.getLockContribute = async (inviter_id, t) => {
  let res = 0;
  let users = await userContribute.findAll({
    where: {
      inviter_id,
      is_lock: 1
    },
    raw: true,
    transaction: t
  });
  users.forEach(item => {
    res = SafeCalc.add(res, item.contribution_value);
  });
  return res;
};
export default userContributeDao;
