import db from "../models/index.js";
import {Op, Sequelize} from "sequelize";

let mqBindAddress = db.mqBindAddress;
let mqBindAddressDao = {};

// 添加用户绑定地址
mqBindAddressDao.create = async (id, code, email, t) => {
  return mqBindAddress.create({id, code, email }, {transaction: t});
};

// 查询数据
mqBindAddressDao.query = async (start) => {
  return mqBindAddress.findAndCountAll({
    where: {
      id: {
        [Op.gt]: start
      }
    },
    order: [
      ['id', 'ASC']
    ]
  });
};

// 查询用户绑定地址的代码
mqBindAddressDao.queryCode = async (id) => {
  return mqBindAddress.findOne({
    where: {
      id
    },
    attributes: ['code'],
    raw: true
  });
};
// 查询用户绑定地址的信息
mqBindAddressDao.queryData = async (id) => {
  return mqBindAddress.findOne({
    where: {
      id
    },
    raw: true
  });
};

// 修改完成状态 0-未完成 1-已完成
mqBindAddressDao.updateStatus = async (id, status, t) => {
  return mqBindAddress.update({complete: status}, {
    where: {
      id
    },
    transaction: t
  });
};

// 更新用户的发送次数
mqBindAddressDao.updateSendCount = async (id, count, t) => {
  return mqBindAddress.update({send_count: count}, {
    where: {
      id
    },
    transaction: t
  });
};
export default mqBindAddressDao;
