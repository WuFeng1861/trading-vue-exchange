import {errorHandle, errorTip, httpResult} from "../utils/utils.js";
import {checkManager, checkSameId, getWithdrawFee} from "./utils.js";
import {EthersHelper} from "../utils/ethersHelper.js";
import addressAllDao from "../Mysql/Dao/addressAll.js";
import SafeCalc from "../utils/bignumberjs.js";
import userRechargeAddressDao from "../Mysql/Dao/userRechargeAddress.js";
import sequelize from "../Mysql/models/init.js";
import chainTranRecordDao from "../Mysql/Dao/chainTranRecord.js";
import {config} from "../config/index.js";
import userBalanceDao from "../Mysql/Dao/userBalance.js";
import {tryLockUserBalance, unlockUserBalance} from "../middleware/appLock/userBalanceLock.js";
import userRechargeRecordsDao from "../Mysql/Dao/userRechargeRecords.js";
import {addAddressToCache} from "../ChainServer/userRechargeAddress.js";
import userWithdrawRecordsDao from "../Mysql/Dao/userWithdrawRecords.js";
import {useCheckPassword} from "../api/api_user/useUser.js";

let ethersHelper = new EthersHelper(config.CHAIN_URL_LIST[0], config.CHAIN_URL_LIST);
// post: 添加充值地址 id
export const addRechargeAddress = async (req, res) => {
  let {id} = req.body;
  checkSameId(req);
  const t = await sequelize.transaction();
  let address = null;
  try {
    address = await getNewZeroValueAddress(id, t);
    addAddressToCache(address, id);
    await t.commit();
  } catch (e) {
    console.log(e);
    await t.rollback();
    errorHandle(e, '创建充值地址错误');
  }
  res.json(httpResult.success({result: true, address}));
};

// post: 获取充值地址列表 id
export const getRechargeAddress = async (req, res) => {
  let {id} = req.body;
  let userRechargeAddress = await userRechargeAddressDao.findByUserId(id);
  // 遍历userRechargeAddress数组，将t_address替换成address
  for (let i = 0; i < userRechargeAddress.length; i++) {
    userRechargeAddress[i].address = userRechargeAddress[i].t_address;
    delete userRechargeAddress[i].t_address;
  }
  res.json(httpResult.success({result: true, userRechargeAddress}));
};

// post: 链上有交易存入数据库中
export const addChainTransaction = async (req, res) => {
  let {hash, height, coinName, chainId, toAddress, fromAddress} = req.body;
  checkManager(req);
  // 查询这个chainId和hash的组合是否存在
  let exist = await chainTranRecordDao.find(hash, chainId);
  if (exist) {
    res.json(httpResult.success({result: false, message: '交易已存在'}));
    return;
  }
  await chainTranRecordDao.create(hash, height, coinName, chainId, toAddress, fromAddress);
  res.json(httpResult.success({result: true}));
};

// post: 完成充值 给他加余额和添加充值记录
export const finishRecharge = async (req, res) => {
  let {hash, chainId, amount, coinName} = req.body;
  console.log('finishRecharge', hash, chainId, amount, coinName);
  checkManager(req);
  let unLockUserId = '';
  const t = await sequelize.transaction();
  try {
    // 1. 查询用户的充值地址
    // 查询这个chainId和hash的组合是否存在
    let chainRecordData = await chainTranRecordDao.find(hash, chainId);
    if (!chainRecordData) {
      res.json(httpResult.success({result: false, message: '交易不存在'}));
      return;
    }
    // 判断这个交易是否已经使用过了
    if (chainRecordData.finish.toString() === '1') {
      res.json(httpResult.success({result: false, message: '交易已完成'}));
      return;
    }
    // 通过 chainRecordData的to_address和coin_name 查询user_recharge_address表 获取用户的user_id
    let userRechargeAddress = await userRechargeAddressDao.findByAddress(chainRecordData.to_address, coinName);
    if (!userRechargeAddress) {
      res.json(httpResult.success({result: false, message: '充值地址不存在'}));
      return;
    }
    // 通过用户id 查询用户的余额
    let userBalance = await userBalanceDao.findByCurrencyLock(userRechargeAddress.user_id, coinName, t);
    if (!userBalance) {
      await tryLockUserBalance(userRechargeAddress.user_id, coinName);
      unLockUserId = userRechargeAddress.user_id;
    }
    // 2. 给用户加余额
    let newBalance = SafeCalc.add(userBalance?.balance || 0, amount);
    if (!userBalance) {
      // 创建用户余额
      await userBalanceDao.create(userRechargeAddress.user_id, coinName, newBalance, t);
    } else {
      await userBalanceDao.updateBalance(userRechargeAddress.user_id, coinName, newBalance, t);
    }
    // 3. 新增用户充值记录
    await userRechargeRecordsDao.create(userRechargeAddress.user_id, amount, chainRecordData.to_address, hash, chainId, chainRecordData.from_address, chainRecordData.height, t);
    // 4. 更新链上数据的完成状态
    await chainTranRecordDao.updateStatus(hash, chainId, 1, t);
    await t.commit();
    res.json(httpResult.success({result: true}));
  } catch (e) {
    console.log(e);
    await t.rollback();
    errorHandle(e, '充值失败');
  } finally {
    unlockUserBalance(unLockUserId, coinName);
  }
};

// 获取一个新的且没有余额充值地址
const getNewZeroValueAddress = async (id, t) => {
  // 生成一个地址
  let wallet = await ethersHelper.createNewWalletWithBalance();
  // 判断地址是否已经存在
  let exist = await addressAllDao.find(wallet.address);
  if (exist) {
    // 存在则递归调用这个函数
    return await getNewZeroValueAddress(id, t);
  }
  // 判断地址是否有余额
  let balance = await ethersHelper.getBalance(wallet.address);
  let MERCBalance = await ethersHelper.getTokenBalance(wallet.address, config.MERC_CONTRACT_ADDRESS);
  let USDTBalance = await ethersHelper.getTokenBalance(wallet.address, config.USDT_CONTRACT_ADDRESS);
  // 没有余额则
  if (SafeCalc.compare(balance, 0) === '0' && SafeCalc.compare(MERCBalance, 0) === '0' && SafeCalc.compare(USDTBalance, 0) === '0') {
    // 1. 写入mysql地址 和 私钥
    await addressAllDao.create(wallet.address, wallet.privateKey, balance, t);
    await userRechargeAddressDao.create(id, wallet.address, t);
    return wallet.address;
  }
  // 有余额则
  if (SafeCalc.compare(balance, 0) === '1' || SafeCalc.compare(MERCBalance, 0) === '1' || SafeCalc.compare(USDTBalance, 0) === '1') {
    let balanceTemp = balance;
    let tokenName = '';
    // 判断那个币种有余额 balance就等于哪个
    if (SafeCalc.compare(balance, 0) === '1') {
      balanceTemp = balance;
      tokenName = 'BNB';
    } else if (SafeCalc.compare(MERCBalance, 0) === '1') {
      balanceTemp = MERCBalance;
      tokenName = 'MERC';
    } else if (SafeCalc.compare(USDTBalance, 0) === '1') {
      balanceTemp = USDTBalance;
      tokenName = 'USDT';
    }
    // 1. 记录日志
    console.log(`地址 ${wallet.address} 有${tokenName}余额: ${balanceTemp}`);
    await addressAllDao.create(wallet.address, wallet.privateKey, balanceTemp, t);
    // 2. 递归调用直到获取到一个没有余额且未保存的地址
    return await getNewZeroValueAddress(id, t);
  }
};

// post: 充值记录列表
export const getRechargeRecords = async (req, res) => {
  let {id, coinName} = req.body;
  let userRechargeRecords = await userRechargeRecordsDao.findByUserId(id, coinName);
  for (let i = 0; i < userRechargeRecords.length; i++) {
    // 删除一些属性 id, t_height t_finish_time
    delete userRechargeRecords[i].id;
    delete userRechargeRecords[i].t_height;
    // delete userRechargeRecords[i].t_finish_time;
    // // 根据hash和chainId查询交易记录，获取充值币种
    // let chainRecordData = await chainTranRecordDao.find(userRechargeRecords[i].t_hash, userRechargeRecords[i].t_chain_id);
    userRechargeRecords[i].coin_name = coinName;
  }
  res.json(httpResult.success({result: true, userRechargeRecords}));
};

// post: 提币请求
export const withdrawRequest = async (req, res) => {
  let {id, coinName, address, amount, chainId, password} = req.body;
  checkManager(req);
  // 检查密码
  let userData = await useCheckPassword(id, password);
  if (!userData) {
    errorTip('密码错误');
  }
  let unLockUserId = '';
  const t = await sequelize.transaction();
  try {
    // 1. 查询用户的余额
    let userBalance = await userBalanceDao.findByCurrencyLock(id, coinName, t);
    if (!userBalance) {
      errorTip('用户余额不足');
      return;
    }
    // 2. 判断余额是否足够
    if (SafeCalc.compare(userBalance.balance, amount) === '1') {
      errorTip('用户余额不足');
      return;
    }
    // 3. todo: 将消息写入mq，后续考虑怎么转账
    // 4. 获取提币手续费
    let {bnbFee, usdtFee} = await getWithdrawFee(coinName, address);
    // 查询用户USDT的余额
    let userUsdtBalance = await userBalanceDao.findByCurrencyLock(id, 'USDT', t);
    if (!userUsdtBalance) {
      errorTip('用户手续费USDT余额不足');
      return;
    }
    // 5. 判断USDT余额是否足够
    let usdtNeed = coinName === 'USDT' ? SafeCalc.add(amount, usdtFee) : usdtFee;
    if (SafeCalc.compare(usdtNeed, userUsdtBalance.balance) === '1') {
      errorTip('用户USDT余额不足');
      return;
    }
    // 6. 扣除所有费用
    if(coinName === 'USDT') {
      await userBalanceDao.updateBalance(id, 'USDT', SafeCalc.sub(userUsdtBalance.balance, usdtNeed), t);
    } else {
      await userBalanceDao.updateBalance(id, 'USDT', SafeCalc.sub(userUsdtBalance.balance, usdtNeed), t);
      await userBalanceDao.updateBalance(id, coinName, SafeCalc.sub(userBalance.balance, amount), t);
    }
    // 7. 记录提币记录
    await userWithdrawRecordsDao.create(id, address, amount, coinName, chainId, t);
    await t.commit();
    res.json(httpResult.success({result: true}));
  } catch (e) {
    console.log(e);
    await t.rollback();
    errorHandle(e, '提币失败');
  } finally {
    unlockUserBalance(unLockUserId, coinName);
  }
};

// post: 获取提币手续费
export const getWithdrawFeeRequest = async (req, res) => {
  let {coinName, address} = req.body;
  let {bnbFee, usdtFee} = await getWithdrawFee(coinName, address);
  res.json(httpResult.success({result: true, feeUsdt: usdtFee, feeBnb: bnbFee}));
};
