import {DataTypes} from "sequelize";
import _mint_rate from './model/mint_rate.js';
import _rate_table from './model/rate_table.js';
import _tax_table from './model/tax_table.js';
import _user from './model/user.js';
import _user_earnings from "./model/user_earnings.js";
import _user_now from "./model/user_now.js";
import _active_invite from "./model/active_invite.js";
import _active_stratch from "./model/active_stratch.js";
import _chain_log from "./model/chain_log.js";
import _user_eth from "./model/user_eth.js";
import _user_eth_bill from "./model/user_eth_bill.js";
import _contract_height from "./model/contract_height.js";
import _user_contribute from "./model/user_contribute.js";
import _user_online from "./model/user_online.js";
import _user_contribute_bill from "./model/user_contribute_bill.js";
import _transfer_record from "./model/transfer_record.js";
import _mq_bind_address from "./model/mq_bind_address.js";
import _mq_email_user from "./model/mq_email_user.js";

// 自动生成mysql 然后返回函数生成的模型
function initModels(sequelize) {
  const mintRate = _mint_rate(sequelize, DataTypes);
  const rateTable = _rate_table(sequelize, DataTypes);
  const taxTable = _tax_table(sequelize, DataTypes);
  const user = _user(sequelize, DataTypes);
  const userEarnings = _user_earnings(sequelize, DataTypes);
  const userNow = _user_now(sequelize, DataTypes);
  const activeInvite = _active_invite(sequelize, DataTypes);
  const activeStratch = _active_stratch(sequelize, DataTypes);
  const chainLog = _chain_log(sequelize, DataTypes);
  const userEth = _user_eth(sequelize, DataTypes);
  const userEthBill = _user_eth_bill(sequelize, DataTypes);
  const contractHeight = _contract_height(sequelize, DataTypes);
  const userContribute = _user_contribute(sequelize, DataTypes);
  const userOnline = _user_online(sequelize, DataTypes);
  const userContributeBill = _user_contribute_bill(sequelize, DataTypes);
  const transferRecord = _transfer_record(sequelize, DataTypes);
  const mqBindAddress = _mq_bind_address(sequelize, DataTypes);
  const mqEmailUser = _mq_email_user(sequelize, DataTypes);

  mintRate.sync();
  rateTable.sync();
  taxTable.sync();
  user.sync();
  userEarnings.sync();
  userNow.sync();
  activeInvite.sync();
  activeStratch.sync();
  chainLog.sync();
  userEth.sync();
  userEthBill.sync();
  contractHeight.sync();
  userContribute.sync();
  userOnline.sync();
  userContributeBill.sync();
  transferRecord.sync();
  mqBindAddress.sync();
  mqEmailUser.sync();

  // 移除属性id，否则不带主键的，查询会报错
  rateTable.removeAttribute('id');
  taxTable.removeAttribute('id');
  mintRate.removeAttribute('id');
  contractHeight.removeAttribute('id');
  return {
    mintRate,
    rateTable,
    taxTable,
    user,
    userEarnings,
    userNow,
    activeInvite,
    activeStratch,
    chainLog,
    userEth,
    userEthBill,
    contractHeight,
    userContribute,
    userOnline,
    userContributeBill,
    transferRecord,
    mqBindAddress,
    mqEmailUser,
  };
}

export default initModels;
