// {address:user_id}
const addressMapCache = {};

// 合并数据
export const mergeAddressCache = (addressList) => {
  for (let i = 0; i < addressList.length; i++) {
    const address = addressList[i].address.toLowerCase();
    const user_id = addressList[i].user_id;
    if (!addressMapCache[address]) {
      addressMapCache[address] = user_id;
    }
  }
};

// 添加地址到缓存中
export const addAddressToCache = (address, user_id) => {
  if (!addressMapCache[address.toLowerCase()]) {
    console.log(`添加地址监听到缓存中: ${address.toLowerCase()} -> ${user_id}`);
    addressMapCache[address] = user_id;
  }
};

// 获取缓存中的地址列表
export const getAddressMapCache = () => {
  return addressMapCache;
};

// 判断地址是否在缓存中
export const isAddressInCache = (address) => {
  return !!addressMapCache[address.toLowerCase()];
};

// 获取用户id
export const getUserIdByAddress = (address) => {
  return addressMapCache[address.toLowerCase()];
};


