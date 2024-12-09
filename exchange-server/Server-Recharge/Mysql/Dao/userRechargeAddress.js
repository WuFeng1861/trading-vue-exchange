import db from "../models/index.js";
import {getNow} from "../../utils/utils.js";

let userRechargeAddress = db.userRechargeAddress;
let userRechargeAddressDao = {};

// 创建一个用户地址
userRechargeAddressDao.create = async (user_id, t_address, t ) => {
  const create_time = getNow();
  return userRechargeAddress.create({user_id, t_address, create_time}, {transaction: t});
};

// 根据用户id查询用户地址 根据id从小到大排序
userRechargeAddressDao.findByUserId = async (user_id) => {
  return userRechargeAddress.findAll({
    where: {
      user_id
    },
    raw: true,
    order: [
      ['id', 'ASC']
    ]
  });
};

// 根据地址查询用户的id
userRechargeAddressDao.findByAddress = async (t_address) => {
  return userRechargeAddress.findOne({
    where: {
      t_address
    },
    raw: true
  });
};

// 获取所有用户地址
userRechargeAddressDao.findAll = async () => {
  return userRechargeAddress.findAll({
    raw: true,
    order: [
      ['id', 'ASC']
    ]
  });
};
export default userRechargeAddressDao;
