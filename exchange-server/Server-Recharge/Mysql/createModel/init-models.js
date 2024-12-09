var DataTypes = require("sequelize").DataTypes;
var _address_all = require("./address_all");
var _chain_tran_record = require("./chain_tran_record");
var _coin_pair_table = require("./coin_pair_table");
var _fee_table = require("./fee_table");
var _order_table = require("./order_table");
var _price_table = require("./price_table");
var _price_update_table = require("./price_update_table");
var _trade_table = require("./trade_table");
var _user_balance = require("./user_balance");
var _user_recharge_address = require("./user_recharge_address");
var _user_recharge_records = require("./user_recharge_records");
var _user_withdraw_records = require("./user_withdraw_records");

function initModels(sequelize) {
  var address_all = _address_all(sequelize, DataTypes);
  var chain_tran_record = _chain_tran_record(sequelize, DataTypes);
  var coin_pair_table = _coin_pair_table(sequelize, DataTypes);
  var fee_table = _fee_table(sequelize, DataTypes);
  var order_table = _order_table(sequelize, DataTypes);
  var price_table = _price_table(sequelize, DataTypes);
  var price_update_table = _price_update_table(sequelize, DataTypes);
  var trade_table = _trade_table(sequelize, DataTypes);
  var user_balance = _user_balance(sequelize, DataTypes);
  var user_recharge_address = _user_recharge_address(sequelize, DataTypes);
  var user_recharge_records = _user_recharge_records(sequelize, DataTypes);
  var user_withdraw_records = _user_withdraw_records(sequelize, DataTypes);


  return {
    address_all,
    chain_tran_record,
    coin_pair_table,
    fee_table,
    order_table,
    price_table,
    price_update_table,
    trade_table,
    user_balance,
    user_recharge_address,
    user_recharge_records,
    user_withdraw_records,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
