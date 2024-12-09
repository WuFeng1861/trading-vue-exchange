import db from "../models/index.js";
import {Sequelize} from "sequelize";

let activeStratch = db.activeStratch;
let activeStratchDao = {};

// 获取
activeStratchDao.get = function (id) {
  return activeStratch.findOne({
    where: {
      id: id
    },
    raw: true
  });
};

// 创建
activeStratchDao.add = function (id, finish, times, t) {
  return activeStratch.create({
    id, finish, times
  }, {transaction: t});
};

// 更新
activeStratchDao.update = function (id, finish, times, t) {
  return activeStratch.update({finish, times}, {
    where: {
      id: id
    },
    transaction: t
  });
};

// 更新所有用户的finish和times
activeStratchDao.updateAll = function (finish, times, t) {
  return activeStratch.update({finish, times}, {
    transaction: t
  });
};

export default activeStratchDao;
