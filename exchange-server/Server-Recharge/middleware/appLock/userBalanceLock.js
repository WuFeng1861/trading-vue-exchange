import {releaseAppLock, setAppLock, tryAcquireAppLock} from "./appLock.js";

export const lockUserBalance = (user_id, currency) => {
  const lock_id = `user_balance_${user_id}_${currency}`;
  setAppLock(lock_id);
};

export const unlockUserBalance = (user_id, currency) => {
  const lock_id = `user_balance_${user_id}_${currency}`;
  releaseAppLock(lock_id);
};

export const tryLockUserBalance = async (user_id, currency) => {
  const lock_id = `user_balance_${user_id}_${currency}`;
  return await tryAcquireAppLock(lock_id);
};
