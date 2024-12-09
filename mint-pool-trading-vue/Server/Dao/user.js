import db from "../models/index.js";
import {Op, Sequelize} from "sequelize";
import {clearObject} from "../utils/utils.js";

let user = db.user;
let userDao = {};

// 添加用户
userDao.addUser = async (id, email, invitation_code, inviter_id, user_name, t) => {
  return user.create({
    id, email, invitation_code, inviter_id, user_name
  }, {transaction: t});
};

// 获取用户数据
userDao.getUserLock = async (id, t) => {
  if (!t) {
    return user.findOne({
      where: {id},
      raw: true
    });
  }
  return user.findOne({
    where: {id},
    raw: true,
    transaction: t,
    lock: 'UPDATE'
  });
};

// 获取用户地址
userDao.getUserAddress = async (id, t) => {
  return user.findOne({
    where: {id},
    attributes: ['address'],
    raw: true,
    transaction: t
  });
};

// 获取用户通过地址
userDao.getUserByAddress = async (address, t) => {
  return user.findOne({
    where: {address},
    raw: true,
    transaction: t
  });
};

// 查询用户通过邮箱
userDao.getUserByEmail = async (email, t) => {
  return user.findOne({
    where: {email},
    raw: true,
    transaction: t
  });
};

// 查询用户通过用户名称
userDao.getUserByUserName = async (user_name, t) => {
  return user.findOne({
    where: {user_name},
    raw: true,
    transaction: t
  });
};

// 获取用户通过地址
userDao.getUserByAddressLock = async (address, t) => {
  return user.findOne({
    where: {address},
    raw: true,
    transaction: t,
    lock: 'UPDATE'
  });
};

// 查询用户通过邮箱
userDao.getUserByEmailLock = async (email, t) => {
  return user.findOne({
    where: {email},
    raw: true,
    transaction: t,
    lock: 'UPDATE'
  });
};

// 查询用户通过用户名称
userDao.getUserByUserNameLock = async (user_name, t) => {
  return user.findOne({
    where: {user_name},
    raw: true,
    transaction: t,
    lock: 'UPDATE'
  });
};

// 获取用户数量
userDao.getUserCount = async (t) => {
  return user.count({transaction: t});
};

// 获取用户数据 通过邮箱或者名称
userDao.getUserLockByEmailOrName = async (user_name, email, t) => {
  if (!t) {
    return user.findOne({
      where: clearObject({user_name, email}),
      raw: true
    });
  }
  return user.findOne({
    where: clearObject({user_name, email}),
    raw: true,
    transaction: t,
    lock: 'UPDATE'
  });
};

// 获取用户数据
userDao.getUserLockByEmailOrCode = async (data, t) => {
  if (!t) {
    return user.findOne({
      where: {
        [Sequelize.or]: [
          {invitation_code: data},
          {email: data}
        ]
      },
      raw: true
    });
  }
  return user.findOne({
    where: {
      [Sequelize.or]: [
        {invitation_code: data},
        {email: data}
      ]
    },
    raw: true,
    transaction: t,
    lock: 'UPDATE'
  });
};

// 获取用户数据根据id在ids内
userDao.getUserByIds = async (ids, t) => {
  return user.findAll({
    attributes: ['id', 'email', 'address', 'user_name'],
    where: {id: {[Op.in]: ids}},
    raw: true,
    transaction: t
  });
};

// 获取所有用户的余额总和
userDao.getUserBalanceSum = async (t) => {
  return user.sum('balance', {transaction: t});
};

// 更新用户数据余额
userDao.updateUserBalance = async (id, balance, t) => {
  if (!t) {
    return user.update({balance}, {where: {id}});
  }
  return user.update({balance}, {where: {id}, transaction: t});
};

// 更新用户可使用余额
userDao.updateUserUnlockBalance = async (id, unlock_balance, t) => {
  return user.update({unlock_balance}, {where: {id}, transaction: t});
};

// 更新用户数据交税数量
userDao.updateUserTax = async (id, tax, t) => {
  if (!t) {
    return user.update({tax}, {where: {id}});
  }
  return user.update({tax}, {where: {id}, transaction: t});
};

// 更新用户余额和交税数量
userDao.updateUserBalanceAndTax = async (id, balance, tax, t) => {
  if (!t) {
    return user.update({balance, tax}, {where: {id}});
  }
  return user.update({balance, tax}, {where: {id}, transaction: t});
};

// 更新用户的邀请人id
userDao.updateUserInviterId = async (id, inviter_id, t) => {
  if (!t) {
    return user.update({inviter_id}, {where: {id}});
  }
  return user.update({inviter_id}, {where: {id}, transaction: t});
};

// 更新用户的邀请码
userDao.updateUserInvitationCode = async (id, invitation_code, t) => {
  if (!t) {
    return user.update({invitation_code}, {where: {id}});
  }
};

// 更新用户的地址
userDao.updateUserAddress = async (id, address, t) => {
  return user.update({address}, {where: {id}, transaction: t});
};

export default userDao;
