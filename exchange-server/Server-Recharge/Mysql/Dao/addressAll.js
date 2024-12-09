import db from "../models/index.js";

let addressAll = db.addressAll;
let addressAllDao = {};

// 添加一个地址
addressAllDao.create = async (t_address, t_privatekey, t_init_balance, t) => {
  return addressAll.create({t_address, t_privatekey, t_init_balance}, {transaction: t});
};

// 查询这个地址是否存在
addressAllDao.find = async(address) => {
  return addressAll.findOne({where: {t_address: address}, raw: true});
};

export default addressAllDao;
