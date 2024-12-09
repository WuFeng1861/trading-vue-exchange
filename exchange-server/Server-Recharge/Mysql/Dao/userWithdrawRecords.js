import db from "../models/index.js";

let userWithdrawRecords = db.userWithdrawRecords;
let userWithdrawRecordsDao = {};

// 添加一笔用户的提币记录
userWithdrawRecordsDao.create = (user_id, to_address, amount, coin_name, chain_id, t) => {
  return userWithdrawRecords.create({user_id, to_address, amount, coin_name, chain_id, t_finish: 0}, {transaction: t});
};

// 根据用户ID查询提币记录
userWithdrawRecordsDao.findByUserId = (user_id) => {
  return userWithdrawRecords.findAll({
    where: {
      user_id
    },
    order: [
      ['id', 'DESC']
    ],
    raw: true
  });
};

// 查询未完成的提币记录
userWithdrawRecordsDao.findUnfinished = () => {
  return userWithdrawRecords.findAll({
    where: {
      t_finish: 0
    },
    order: [
      ['id', 'DESC']
    ],
    raw: true
  });
};

// 使用hash根据id修改提币记录完成状态
userWithdrawRecordsDao.updateFinishStatus = (id, t_hash, t_finish, t) => {
  return userWithdrawRecords.update({
    t_finish: t_finish,
    t_hash: t_hash,
  }, {
    where: {
      id
    },
    transaction: t
  });
};

export default userWithdrawRecordsDao;
