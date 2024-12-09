import db from "../models/index.js";

let userBalance = db.userBalance;
let userBalanceDao = {};

// 添加一个地址
userBalanceDao.create = async (user_id, currency, balance, t) => {
  return userBalance.create({user_id, currency, balance}, {transaction: t});
};

// 查询这个用户的所有余额信息
userBalanceDao.find = async(user_id) => {
  return userBalance.findOne({where: {user_id}, raw: true});
};

// 查询用户的这个币种的余额信息
userBalanceDao.findByCurrency = async(user_id, currency) => {
  return userBalance.findOne({where: {user_id, currency}, raw: true});
};

// 查询用户的这个币种的余额信息并锁住这一行
userBalanceDao.findByCurrencyLock = async(user_id, currency, t) => {
  return userBalance.findOne({
    where: {user_id, currency},
    raw: true,
    transaction: t,
    lock: 'UPDATE'
  });
};

// 更新用户的余额信息
userBalanceDao.updateBalance = async(user_id, currency, balance, t) => {
  return userBalance.update({balance}, {where: {user_id, currency}, transaction: t});
};

export default userBalanceDao;
