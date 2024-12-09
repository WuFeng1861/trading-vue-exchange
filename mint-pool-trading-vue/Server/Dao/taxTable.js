import db from "../models/index.js";
import {Op} from "sequelize";

let taxTable = db.taxTable;
let taxTableDao = {};

// 添加税收比例数据
taxTableDao.add = (mint_output, tax_ratio) => {
  return taxTable.create({mint_output, tax_ratio});
};

// 获取税收比例
taxTableDao.get = (mint_output) => {
  return taxTable.findOne({
    where: {
      mint_output: {
        [Op.gte]: mint_output
      }
    },
    raw: true
  });
};
// 获取所有的税收比例
taxTableDao.getAll = () => {
  return taxTable.findAll({
    raw: true,
  });
};

export default taxTableDao;
