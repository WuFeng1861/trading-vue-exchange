import {createInstance} from "./createInstance.js";

const instance = createInstance('asset');

// 获取用户资产
export const getUserAssets = (id) => {
  return instance.post('/getUserAssets', {id});
}
