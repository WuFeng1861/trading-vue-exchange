import {DataTypes} from "sequelize";
import _address_all from "./model/address_all.js";
import _user_recharge_address from "./model/user_recharge_address.js";
import _user_recharge_records from "./model/user_recharge_records.js";
import _chain_tran_record from "./model/chain_tran_record.js";
import _user_balance from "./model/user_balance.js";
import _user_withdraw_records from "./model/user_withdraw_records.js";

// 自动生成mysql 然后返回函数生成的模型
function initModels(sequelize) {
  const addressAll = _address_all(sequelize, DataTypes);
  const userRechargeAddress = _user_recharge_address(sequelize, DataTypes);
  const userRechargeRecords = _user_recharge_records(sequelize, DataTypes);
  const chainTranRecord = _chain_tran_record(sequelize, DataTypes);
  const userBalance = _user_balance(sequelize, DataTypes);
  const userWithdrawRecords = _user_withdraw_records(sequelize, DataTypes);

  addressAll.sync();
  userRechargeAddress.sync();
  userRechargeRecords.sync();
  chainTranRecord.sync();
  userBalance.sync();
  userWithdrawRecords.sync();

  // 移除属性id，否则不带主键的，查询会报错
  return {
    addressAll,
    userRechargeAddress,
    userRechargeRecords,
    chainTranRecord,
    userBalance,
    userWithdrawRecords,
  };
}

export default initModels;
