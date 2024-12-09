import db from "../models/index.js";
import {Op} from "sequelize";

let rateTable = db.rateTable;
let rateTableDao = {};

// 添加算力与产出对应表数据
rateTableDao.add = (output, mint_rate) => {
  return rateTable.create({ output, mint_rate });
};

// 获取算力与产出对应表数据 刚好大于等于产出的一个数据
rateTableDao.getMintRate = (output) => {
  return rateTable.findOne({
    attributes: ["mint_rate"],
    where: {
      output: {
        [Op.gte]: output
      }
    },
    raw: true
  });
};

// 获取所有数据
rateTableDao.getAll = () => {
  return rateTable.findAll({
    raw: true
  });
};

export default rateTableDao;
