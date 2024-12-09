let DataTypes = require("sequelize").DataTypes;
let _address_all = require("./address_all");
let _chain_tran_record = require("./chain_tran_record");
let _coin_pair_table = require("./coin_pair_table");
let _fee_table = require("./fee_table");
let _order_table = require("./order_table");
let _trade_table = require("./trade_table");
let _user_balance = require("./user_balance");
let _user_recharge_address = require("./user_recharge_address");
let _user_recharge_records = require("./user_recharge_records");

function initModels(sequelize) {
  let address_all = _address_all(sequelize, DataTypes);
  let chain_tran_record = _chain_tran_record(sequelize, DataTypes);
  let coin_pair_table = _coin_pair_table(sequelize, DataTypes);
  let fee_table = _fee_table(sequelize, DataTypes);
  let order_table = _order_table(sequelize, DataTypes);
  let trade_table = _trade_table(sequelize, DataTypes);
  let user_balance = _user_balance(sequelize, DataTypes);
  let user_recharge_address = _user_recharge_address(sequelize, DataTypes);
  let user_recharge_records = _user_recharge_records(sequelize, DataTypes);


  return {
    address_all,
    chain_tran_record,
    coin_pair_table,
    fee_table,
    order_table,
    trade_table,
    user_balance,
    user_recharge_address,
    user_recharge_records,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
