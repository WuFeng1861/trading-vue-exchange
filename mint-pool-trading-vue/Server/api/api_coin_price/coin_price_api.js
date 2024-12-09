import instance from "./coin_price_instance.js";

// 获取币种价格
export const getCoinPrice = (name) => {
  return instance.get('/getCoinPrice', {params: {name}});
};
