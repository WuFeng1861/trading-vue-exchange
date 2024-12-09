const appLock = {};

export const setAppLock = (lockKey) => {
  appLock[lockKey] = true;
};

export const releaseAppLock = (lockKey) => {
  delete appLock[lockKey];
};

// 使用promise 使其等待锁释放
export const tryAcquireAppLock = async(lockKey) => {
  if (appLock[lockKey]) {
    return new Promise((resolve) => {
      const intervalId = setInterval(() => {
        if (appLock[lockKey]) {
          return;
        }
        clearInterval(intervalId);
        setAppLock(lockKey);
        resolve(true);
      }, 10);
    });
  }
  setAppLock(lockKey);
  return true;
};
