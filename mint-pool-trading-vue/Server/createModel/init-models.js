var DataTypes = require("sequelize").DataTypes;
var _active_invite = require("./active_invite");
var _active_stratch = require("./active_stratch");
var _chain_log = require("./chain_log");
var _contract_height = require("./contract_height");
var _mint_rate = require("./mint_rate");
var _mq_bind_address = require("./mq_bind_address");
var _mq_email_user = require("./mq_email_user");
var _rate_table = require("./rate_table");
var _tax_table = require("./tax_table");
var _transfer_record = require("./transfer_record");
var _user = require("./user");
var _user_contribute = require("./user_contribute");
var _user_contribute_bill = require("./user_contribute_bill");
var _user_earnings = require("./user_earnings");
var _user_eth = require("./user_eth");
var _user_eth_bill = require("./user_eth_bill");
var _user_now = require("./user_now");
var _user_online = require("./user_online");
var _xxx = require("./xxx");

function initModels(sequelize) {
  var active_invite = _active_invite(sequelize, DataTypes);
  var active_stratch = _active_stratch(sequelize, DataTypes);
  var chain_log = _chain_log(sequelize, DataTypes);
  var contract_height = _contract_height(sequelize, DataTypes);
  var mint_rate = _mint_rate(sequelize, DataTypes);
  var mq_bind_address = _mq_bind_address(sequelize, DataTypes);
  var mq_email_user = _mq_email_user(sequelize, DataTypes);
  var rate_table = _rate_table(sequelize, DataTypes);
  var tax_table = _tax_table(sequelize, DataTypes);
  var transfer_record = _transfer_record(sequelize, DataTypes);
  var user = _user(sequelize, DataTypes);
  var user_contribute = _user_contribute(sequelize, DataTypes);
  var user_contribute_bill = _user_contribute_bill(sequelize, DataTypes);
  var user_earnings = _user_earnings(sequelize, DataTypes);
  var user_eth = _user_eth(sequelize, DataTypes);
  var user_eth_bill = _user_eth_bill(sequelize, DataTypes);
  var user_now = _user_now(sequelize, DataTypes);
  var user_online = _user_online(sequelize, DataTypes);
  var xxx = _xxx(sequelize, DataTypes);


  return {
    active_invite,
    active_stratch,
    chain_log,
    contract_height,
    mint_rate,
    mq_bind_address,
    mq_email_user,
    rate_table,
    tax_table,
    transfer_record,
    user,
    user_contribute,
    user_contribute_bill,
    user_earnings,
    user_eth,
    user_eth_bill,
    user_now,
    user_online,
    xxx,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
