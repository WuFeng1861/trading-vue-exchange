import {Sequelize} from "sequelize";
import sequelize from "./init.js";
import initModels from "./initModels.js";

const db = {};
const models = initModels(sequelize, Sequelize.DataTypes);
db["init-models"] = models;
for(let key in models) {
  db[key] = models[key];
}
db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;

