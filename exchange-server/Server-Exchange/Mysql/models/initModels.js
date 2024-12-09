import {DataTypes} from "sequelize";
import _address_all from "./model/address_all.js";
import _chain_tran_record from './model/chain_tran_record.js';
import _coin_pair_table from './model/coin_pair_table.js';
import _fee_table from './model/fee_table.js';
import _order_table from './model/order_table.js';
import _trade_table from './model/trade_table.js';
import _user_balance from './model/user_balance.js';
import _user_recharge_address from './model/user_recharge_address.js';
import _user_recharge_records from './model/user_recharge_records.js';
import _price_table from './model/price_table.js';
import _price_update_table from './model/price_update_table.js';
import _user_faucet from './model/user_faucet.js';

// 自动生成mysql 然后返回函数生成的模型
function initModels(sequelize) {
  const addressAll = _address_all(sequelize, DataTypes);
  const chainTranRecord = _chain_tran_record(sequelize, DataTypes);
  const coinPairTable = _coin_pair_table(sequelize, DataTypes);
  const feeTable = _fee_table(sequelize, DataTypes);
  const orderTable = _order_table(sequelize, DataTypes);
  const tradeTable = _trade_table(sequelize, DataTypes);
  const userBalance = _user_balance(sequelize, DataTypes);
  const userRechargeAddress = _user_recharge_address(sequelize, DataTypes);
  const userRechargeRecords = _user_recharge_records(sequelize, DataTypes);
  const priceTable = _price_table(sequelize, DataTypes);
  const priceUpdateTable = _price_update_table(sequelize, DataTypes);
  const userFaucet = _user_faucet(sequelize, DataTypes);

  addressAll.sync();
  chainTranRecord.sync();
  coinPairTable.sync();
  feeTable.sync();
  orderTable.sync();
  tradeTable.sync();
  userBalance.sync();
  userRechargeAddress.sync();
  userRechargeRecords.sync();
  priceTable.sync();
  priceUpdateTable.sync();
  userFaucet.sync();

  // 移除属性id，否则不带主键的，查询会报错
  return {
    addressAll,
    chainTranRecord,
    coinPairTable,
    feeTable,
    orderTable,
    tradeTable,
    userBalance,
    userRechargeAddress,
    userRechargeRecords,
    priceTable,
    priceUpdateTable,
    userFaucet,
  };
}

export default initModels;
