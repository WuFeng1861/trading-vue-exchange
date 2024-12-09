import {createInstance} from "./createInstance.js";

const instance = createInstance('transfer');

// 转账
export const transfer = async (fromId, username, email, amount) => {
  return instance.post('/transfer', {fromId, username, email, amount});
}
