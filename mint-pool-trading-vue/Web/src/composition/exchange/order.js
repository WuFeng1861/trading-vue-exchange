import {
  cancelOrderLP,
  createOrderLP,
  getOrderGroup,
  getOrderGroupGap,
  getPairPrice,
  getTradeOrderList, getUserOrderList, getUserOrderFinishList
} from "@/api/exchange/order.js";
import {ORDER_TYPES} from "@/composition/exchange/Types/orderTypes.js";
import {elTip, getListPropertyMax} from "@/utils/index.js";
import {useUserAssetsRef} from "@/composition/exchange/asset.js";
import SafeCalc from "@/utils/bignumberjs.js";
import {pairList} from "@/config/pairList.js";
import {changePriceSocketData} from "@/websocket/Socket/PriceSocket.js";
import {changeOrderGroupSocketData} from "@/websocket/Socket/orderGroupSocket.js";

// ----------交易对名称相关----------
const pairName = ref(pairList[0]);
const pairNameList = ref(pairList[0].split('-'));
// 更新当前页面的交易对名称
export const useUpdatePairName = (newPairName) => {
  if (newPairName === pairName.value) return;
  pairName.value = newPairName;
};
// 获取交易对名称
export const usePairNameListRef = () => {
  return pairNameList;
};
// 更新交易对名称列表
export const useUpdatePairNameList = () => {
  if (pairName.value === pairNameList.value.join('-')) return;
  pairNameList.value = pairName.value.split('-');
};

// ------------------------------订单列表相关----------

// 订单列表
const orderListBuy = ref([]);
const orderListSell = ref([]);

// 订单列表初始化
export const useInitOrderList = async () => {
  let id = localStorage["id"];
  if (!id) {
    return;
  }
  let orderGroupGapNow = useOrderGroupGapNowRef()?.value || null;
  console.log("useInitOrderList", orderGroupGapNow)
  let result = await getOrderGroup(id, pairName.value, orderGroupGapNow);
  if (!result.result) {
    return;
  }
  orderListBuy.value = result.buy; // 这个数据默认从价格低到高排序
  orderListSell.value = result.sell; // 这个数据默认从价格低到高排序
  // 更换websocket监听对象
  if(!pairName.value || !useOrderGroupGapNowRef()?.value) {
    return;
  }
  changeOrderGroupSocketData(pairName.value, useOrderGroupGapNowRef()?.value);
};

// 修改订单列表
export const useUpdateOrderListValue = (pair, buyList, sellList) => {
  if (pair === pairName.value) {
    orderListBuy.value = buyList;
    orderListSell.value = sellList;
  }
};

// 获取订单购买列表
export const useOrderListBuyRef = () => {
  return orderListBuy;
};

// 获取订单卖出列表
export const useOrderListSellRef = () => {
  return orderListSell;
};

// 获取订单购买列表后多少位
let buyLenCache = {};
export const useOrderListBuyNumberRef = (len) => {
  if(buyLenCache[len]) {
    return buyLenCache[len];
  }
  const result = ref([]);
  // 利用watch 监听订单列表变化
  watch(orderListBuy, (newVal) => {
    let valueTemp = newVal.slice(0, len);
    let amountMax = getListPropertyMax(valueTemp, "total_remain_amount", (a, b) => {
      return Number(a) - Number(b);
    });

    result.value = valueTemp.map((item) => {
      item.percent = (Number(item.total_remain_amount) / amountMax).toFixed(2);
      return item;
    });
  });
  buyLenCache[len] = result;
  return result;
};

// 获取订单卖出列表后多少位
let sellLenCache = {};
export const useOrderListSellNumberRef = (len) => {
  if(sellLenCache[len]) {
    return sellLenCache[len];
  }
  const result = ref([]);
  // 利用watch 监听订单列表变化
  watch(orderListSell, (newVal) => {
    let valueTemp = newVal.slice(0, len).reverse();
    let amountMax = getListPropertyMax(valueTemp, "total_remain_amount", (a, b) => {
      return Number(a) - Number(b);
    });
    result.value = valueTemp.map((item) => {
      // console.log(item.total_remain_amount, amountMax, 'useOrderListSellNumberRef')
      item.percent = (Number(item.total_remain_amount) / amountMax).toFixed(2);
      return item;
    });
    console.log('useOrderListSellNumberRef', result.value, orderListSell.value);
  });
  sellLenCache[len] = result;
  return result;
};

// -----------购买相关----------

// 创建限价购买订单
export const useCreateBuyLimitPriceOrder = async (price, amount) => {
  let id = localStorage["id"];
  if (!id) {
    return;
  }
  // todo: 检查用户的余额是否够创建这个订单的
  let userAsset = await useUserAssetsRef();
  // 购买要消耗pair[1]的资产 所以获取pair[1]的余额和需要的消耗比较
  const pair1 = usePairNameListRef().value[1];
  const balance = userAsset.value[pair1];
  if (!balance || SafeCalc.compare(balance, SafeCalc.mul(amount, price)) === '-1') {
    return elTip("余额不足，请充值后再试", 'error');
  }
  let result = await createOrderLP(id, ORDER_TYPES.BUY, price, amount, pairName.value);
  elTip(result.result? "创建订单成功" : "创建订单失败", result.result? "success" : "error");
  return result.result;
};

// 创建限价卖出订单
export const useCreateSellLimitPriceOrder = async (price, amount) => {
  let id = localStorage["id"];
  if (!id) {
    return;
  }
  // todo: 检查用户的余额是否够创建这个订单的
  let userAsset = await useUserAssetsRef();
  // 卖出要消耗pair[0]的资产 所以获取pair[0]的余额和需要的消耗比较
  const pair0 = usePairNameListRef().value[0];
  const balance = userAsset.value[pair0];
  if (!balance || SafeCalc.compare(balance, amount) === '-1') {
    return elTip("余额不足，请充值后再试", 'error');
  }
  let result = await createOrderLP(id, ORDER_TYPES.SELL, price, amount, pairName.value);
  elTip(result.result? "创建订单成功" : "创建订单失败", result.result? "success" : "error");
  return result.result;
};

// 撤销订单
export const useCancelOrder = async (orderId) => {
  let id = localStorage["id"];
  if (!id) {
    return;
  }
  let result = await cancelOrderLP(id, orderId);
  return result.result;
};


// -----------订单间隙相关----------
const orderGroupGap = ref([]);
const orderGroupGapNow = ref(null);

const useUpdateOrderGroupGap = async () => {
  let id = localStorage["id"];
  if (!id) {
    return;
  }
  let result = await getOrderGroupGap(id, pairName.value);
  if (!result.result) {
    return;
  }
  orderGroupGap.value = result.pairGroupList;
  orderGroupGapNow.value = result.pairGroupList[result.pairGroupList.length - 1];
};

export const useOrderGroupGapRef = () => {
  return orderGroupGap;
};

export const useOrderGroupGapNowRef = () => {
  return orderGroupGapNow;
};

// -----------获取交易对价格相关----------
const pairPrice = ref(0);

export const usePairPriceRef = () => {
  return pairPrice;
};

const useUpdatePairPrice = async () => {
  let id = localStorage["id"];
  if (!id) {
    return;
  }
  let result = await getPairPrice(id, pairName.value);
  if (!result.result) {
    return;
  }
  pairPrice.value = result.price;
  changePriceSocketData(pairName.value);
};

export const useUpdatePairPriceValue = (pair, price) => {
  console.log('useUpdatePairPriceValue', pair, price, pairName.value, pair === pairName.value);
  if(pair === pairName.value) {
    pairPrice.value = Number(price);
  }
};


// -----------最新成交订单相关----------
const tradeList = ref([]);

export const useTradeListRef = () => {
  return tradeList;
};

export const useUpdateTradeList = async () => {
  let id = localStorage["id"];
  if (!id) {
    return;
  }
  let result = await getTradeOrderList(id, pairName.value);
  if (!result.result) {
    return;
  }
  let tradeListTemp = [...tradeList.value];
  result.tradeList.forEach((item) => {
    let index = tradeList.value.findIndex((itemTemp) => {
      return itemTemp.id === item.id;
    });
    if (index === -1) {
      tradeListTemp.push(item);
    }
  });
  // 根据id从大到小排序
  tradeListTemp.sort((a, b) => {
    return b.id - a.id;
  });
  tradeList.value = tradeListTemp.slice(0, 13);
};

export const useUpdateTradeListValue = (pair, list) => {
  if(pair === pairName.value) {
    tradeList.value = list.slice(0, 13);
  }
};

// 获取用户挂单数据
const userOrderList = ref([]);

export const useUserOrderListRef = () => {
  return userOrderList;
};

export const useUpdateUserOrderList = async () => {
  let id = localStorage["id"];
  if (!id) {
    return;
  }
  let result = await getUserOrderList(id);
  if (!result.result) {
    return;
  }
  userOrderList.value = result.orderList;
};

// 获取用户历史完成的订单
const userOrderFinishList = ref([]);
let lastId = Number.MAX_SAFE_INTEGER;
let count = Number.MAX_SAFE_INTEGER;
export const useUserOrderFinishListRef = () => {
  return userOrderFinishList;
};

export const useUpdateUserOrderFinishList = async () => {
  let id = localStorage["id"];
  if (!id) {
    return;
  }
  if (userOrderFinishList.value.length >= count) {
    return;
  }
  let result = await getUserOrderFinishList(id, lastId);
  if (!result.result) {
    return;
  }
  if (result.orderFinishList.count === 0) {
    return;
  }
  lastId = result.orderFinishList.rows[result.orderFinishList.rows.length - 1].id;
  count = result.orderFinishList.count;
  let userOrderFinishListTemp = [...userOrderFinishList.value, ...result.orderFinishList.rows];
  userOrderFinishListTemp.sort((a, b) => {
    return b.id - a.id;
  });
  // 过滤掉重复的id订单
  let idList = [];
  userOrderFinishListTemp = userOrderFinishListTemp.filter((item) => {
    if (idList.includes(item.id)) {
      return false;
    }
    idList.push(item.id);
    return true;
  });
  userOrderFinishList.value = userOrderFinishListTemp;
  console.log(userOrderFinishList.value.length, count, 'useUpdateUserOrderFinishList', userOrderFinishList.value[userOrderFinishList.value.length - 1])
};

useUpdateOrderGroupGap();
useInitOrderList();
useUpdatePairPrice();
useUpdateTradeList();
useUpdateUserOrderList();
useUpdateUserOrderFinishList();
// watch 交易对名称，更新订单列表
watch(pairName, async () => {
  useUpdatePairNameList();
  await useUpdateOrderGroupGap();
  await useInitOrderList();
  await useUpdatePairPrice();
  await useUpdateTradeList();
});
