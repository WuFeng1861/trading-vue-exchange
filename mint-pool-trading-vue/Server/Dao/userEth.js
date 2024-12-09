import db from "../models/index.js";

let userEth = db.userEth;
let userEthDao = {};

// 创建用户的eth余额信息
userEthDao.create = async (id, amount, t) => {
  return userEth.create({
    id, amount
  }, {transaction: t});
};

// 更新用户的eth余额信息
userEthDao.update = async (id, amount, t) => {
  return userEth.update(
    {amount},
    {where: {id}, transaction: t}
  );
};

// 查询用户的eth余额信息
userEthDao.findLock = async (id, t) => {
  return userEth.findOne({
    where: {id},
    raw: true,
    transaction: t,
    lock: 'UPDATE'
  });
};

export default userEthDao;

