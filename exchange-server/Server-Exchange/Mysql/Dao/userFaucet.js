import db from "../models/index.js";
import {getNow} from "../../utils/utils.js";

let userFaucet = db.userFaucet;
let userFaucetDao = {};

// create a new user faucet
userFaucetDao.create = (user_id, t) => {
  const nexttime = getNow() + 24 * 60 * 60 * 1000;
  return userFaucet.create({user_id, nexttime}, {transaction: t});
};

// get user faucet by user_id
userFaucetDao.getByUserId = (user_id) => {
  return userFaucet.findOne({where: {user_id}});
};

// update user faucet by user_id
userFaucetDao.update = (user_id, t) => {
  const nexttime = getNow() + 24 * 60 * 60 * 1000;
  return userFaucet.update({nexttime}, {where: {user_id}, transaction: t});
};
export default userFaucetDao;
