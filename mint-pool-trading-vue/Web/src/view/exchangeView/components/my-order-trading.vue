<template>
  <div class="my-order-trading" v-loading="loading">
    <el-tabs v-model="orderTradingType" class="order-trading-type-tabs" @tab-change="tabClick"
             :before-leave="tabBeforeLeave">
      <el-tab-pane label="买入" name="order-trading-buy"/>
      <el-tab-pane label="卖出" name="order-trading-sell"/>
    </el-tabs>
    <el-radio-group v-model="orderTradingContractTypeRadio" class="order-trading-contract-type">
      <el-radio-button label="限价委托" value="LimitPrice"/>
      <!--<el-radio-button label="市价委托" value="MarketPrice"/>-->
    </el-radio-group>
    <el-form class="order-trading-form">
      <el-form-item v-for="item in orderTradingInputsRef" class="order-trading-form-item">
        <div class="order-trading-input">
          <span>{{ item.label }}</span>
          <el-input
              v-model="orderTradingData[item.name]"
              :type="item.type"
              @input="item.inputLimit($event)"
          />
        </div>
      </el-form-item>
      <el-form-item class="order-trading-form-item">
        <div class="order-trading-canuse">
          <span>可用余额: {{btnName === '买入' ? Number(userAssets[coinPair[1]]) : Number(userAssets[coinPair[0]])}} {{btnName === '买入' ? coinPair[1]: coinPair[0]}}</span>
        </div>
      </el-form-item>
      <el-form-item class="order-trading-form-item">
        <el-button class="order-trading-submit-btn" type="primary" @click="debouncedOrderTradingSubmit">{{ btnName }}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>

import {elTip, elTipComingSoon, limitDecimalNumber, useDebounceFn} from "@/utils/index.js";
import SafeCalc from "@/utils/bignumberjs.js";
import {
  useCreateBuyLimitPriceOrder,
  useCreateSellLimitPriceOrder,
  usePairNameListRef, usePairPriceRef,
  useUpdateUserOrderList
} from "@/composition/exchange/order.js";
import {useInitUserAssets, useUserAssetsRef} from "@/composition/exchange/asset.js";

const loading = ref(false);
const coinPair = usePairNameListRef();
const coinPrice = usePairPriceRef();
const userAssets = useUserAssetsRef();
// todo 后续通过api获取
const priceLimitDecimal = 4;
const amountLimitDecimal = 4;

const orderTradingData = ref({
  price: undefined,
  amount: undefined,
  total: undefined,
  type: 'LimitPrice',
  side: 'order-trading-buy'
});

const initOrderTradingPrice = () => {
  if(!coinPrice.value) {
    requestIdleCallback(initOrderTradingPrice);
  }
  if(coinPrice.value) {
    orderTradingData.value.price = Number(coinPrice.value);
  }
};

// orderTradingType
const orderTradingType = ref('order-trading-buy');
const tabClick = (name) => {
  orderTradingType.value = name;
  orderTradingData.value.side = name;
}
const tabBeforeLeave = (name, oldName) => {
  console.log(name, oldName, 'tabBeforeLeave')
}

// orderTradingContractType
const orderTradingContractTypeRadio = ref('LimitPrice');

// orderTradingInputsRef
const orderTradingLimitBuyInputs = () => [
  {
    label: `价格(${coinPair.value[1]})`,
    name: 'price',
    type: 'number',
    inputLimit: ($event) => {
      console.log('price input')
      limitDecimalNumber(orderTradingData, $event, priceLimitDecimal, 'price');
      if (orderTradingData.value.amount) {
        limitDecimalNumber(orderTradingData, SafeCalc.mul(orderTradingData.value.price, orderTradingData.value.amount), priceLimitDecimal, 'total')
      }
      console.log(orderTradingData.value)
    },
  },
  {
    label: `数量(${coinPair.value[0]})`,
    name: 'amount',
    type: 'number',
    inputLimit: ($event) => {
      console.log('amount input')
      limitDecimalNumber(orderTradingData, $event, amountLimitDecimal, 'amount');
      if (orderTradingData.value.price) {
        limitDecimalNumber(orderTradingData, SafeCalc.mul(orderTradingData.value.price, orderTradingData.value.amount), priceLimitDecimal, 'total')
      }
      console.log(orderTradingData.value)
    },
  },
  {
    label: `金额(${coinPair.value[1]})`,
    name: 'total',
    type: 'number',
    inputLimit: ($event) => {
      console.log('total input')
      limitDecimalNumber(orderTradingData, $event, priceLimitDecimal, 'total');
      if (orderTradingData.value.price) {
        limitDecimalNumber(orderTradingData, SafeCalc.div(orderTradingData.value.total, orderTradingData.value.price), amountLimitDecimal, 'amount');
      }
      console.log(orderTradingData.value)
    },
  }
];
const orderTradingLimitSellInputs = () => [
  {
    label: `价格(${coinPair.value[1]})`,
    name: 'price',
    type: 'number',
    inputLimit: ($event) => {
      console.log('price input')
      limitDecimalNumber(orderTradingData, $event, priceLimitDecimal, 'price');
      if (orderTradingData.value.amount) {
        limitDecimalNumber(orderTradingData, SafeCalc.mul(orderTradingData.value.price, orderTradingData.value.amount), priceLimitDecimal, 'total')
      }
      console.log(orderTradingData.value)
    },
  },
  {
    label: `数量(${coinPair.value[0]})`,
    name: 'amount',
    type: 'number',
    inputLimit: ($event) => {
      console.log('amount input')
      limitDecimalNumber(orderTradingData, $event, amountLimitDecimal, 'amount');
      if (orderTradingData.value.price) {
        limitDecimalNumber(orderTradingData, SafeCalc.mul(orderTradingData.value.price, orderTradingData.value.amount), priceLimitDecimal, 'total')
      }
      console.log(orderTradingData.value)
    },
  },
  {
    label: `金额(${coinPair.value[1]})`,
    name: 'total',
    type: 'number',
    inputLimit: ($event) => {
      console.log('total input')
      limitDecimalNumber(orderTradingData, $event, priceLimitDecimal, 'total');
      if (orderTradingData.value.price) {
        limitDecimalNumber(orderTradingData, SafeCalc.div(orderTradingData.value.total, orderTradingData.value.price), amountLimitDecimal, 'amount');
      }
      console.log(orderTradingData.value)
    },
  }
];
const orderTradingMarketBuyInputs = () => [];
const orderTradingMarketSellInputs = () => [];

const orderTradingInputsRef = ref([]);

onMounted(() => {
  orderTradingInputsRef.value = orderTradingLimitBuyInputs();
  initOrderTradingPrice();
});

// watch orderTradingType 改变orderTradingInputsRef
watch(orderTradingType, (newVal, oldVal) => {
  if (newVal === 'order-trading-buy') {
    orderTradingInputsRef.value = orderTradingContractTypeRadio.value === 'LimitPrice' ? orderTradingLimitBuyInputs() : orderTradingMarketBuyInputs();
  } else if (newVal === 'order-trading-sell') {
    orderTradingInputsRef.value = orderTradingContractTypeRadio.value === 'LimitPrice' ? orderTradingLimitSellInputs() : orderTradingMarketSellInputs();
  }
});

// watch orderTradingContractTypeRadio 改变orderTradingInputsRef
watch(orderTradingContractTypeRadio, (newVal, oldVal) => {
  orderTradingData.value.type = newVal;
  if (orderTradingType.value === 'order-trading-buy') {
    orderTradingInputsRef.value = newVal === 'LimitPrice' ? orderTradingLimitBuyInputs() : orderTradingMarketBuyInputs();
  } else if (orderTradingType.value === 'order-trading-sell') {
    orderTradingInputsRef.value = newVal === 'LimitPrice' ? orderTradingLimitSellInputs() : orderTradingMarketSellInputs();
  }
});

const btnName = ref('买入');
// watch orderTradingType 改变btnName
watch(orderTradingType, (newVal, oldVal) => {
  console.log(newVal, oldVal, 'orderTradingType')
  if (newVal === 'order-trading-buy') {
    btnName.value = '买入';
  } else if (newVal === 'order-trading-sell') {
    btnName.value = '卖出';
  }
});

// orderTradingSubmit 提交订单 防抖1s
const orderTradingSubmit = async () => {
  loading.value = true;
  try {
    let {price, amount, type, side} = orderTradingData.value;
    if (!price || SafeCalc.compare(price, 0) === '-1' || SafeCalc.compare(price, 0) === '0') {
      return elTip('请输入正确的价格', 'error');
    }
    if (!amount || SafeCalc.compare(amount, 0) === '-1' || SafeCalc.compare(amount, 0) === '0') {
      return elTip('请输入正确的数量', 'error');
    }
    if (type === 'LimitPrice' && side === 'order-trading-buy') {
      // 创建限价买单
      console.log('创建限价买单')
      await useCreateBuyLimitPriceOrder(price, amount);
    } else if (type === 'LimitPrice' && side === 'order-trading-sell') {
      // 创建限价卖单
      console.log('创建限价卖单')
      await useCreateSellLimitPriceOrder(price, amount);
    } else if (type === 'MarketPrice' && side === 'order-trading-buy') {
      // 创建市价买单
      console.log('创建市价买单')
      elTipComingSoon();
    } else if (type === 'MarketPrice' && side === 'order-trading-sell') {
      // 创建市价卖单
      console.log('创建市价卖单')
      elTipComingSoon();
    }
  } finally {
    loading.value = false;
    // 更新余额数据
    await useInitUserAssets();
    // 更新当前委托
    await useUpdateUserOrderList();
  }
};

const debouncedOrderTradingSubmit = useDebounceFn(orderTradingSubmit, 1000);


</script>

<style scoped lang="scss">
.my-order-trading {
  width: 100%;
  height: 100%;
  padding: 0 10px;
  background-color: var(--exchange-main-bg);
  display: flex;
  flex-direction: column;
  align-items: center;

  .order-trading-type-tabs {
    margin-top: 10px;
    width: 100%;

    :deep(.el-tabs__header) {
      margin-bottom: 0;
    }

    :deep(.el-tabs__active-bar) {
      background-color: var(--color-dashboard-white);
    }

    :deep(.el-tabs__nav-wrap) {
      &:after {
        height: 1px;
        transform: scaleY(0.1);
      }
    }

    :deep(.el-tabs__item) {
      color: var(--wallet-mobile-grey-font);
      padding-left: 0;

      &.is-active {
        color: var(--color-dashboard-white);
      }
    }
  }

  .order-trading-contract-type {
    margin-top: 20px;
    width: 100%;
    justify-content: center;

    :deep(.el-radio-button) {
      width: calc(100% - 10px);

      .el-radio-button__inner {
        width: 100%;
      }
    }

    :deep(.el-radio-button__original-radio:checked+.el-radio-button__inner) {
      background-color: var(--exchange-active-button);
      border-color: var(--exchange-active-button);
    }
  }

  .order-trading-form {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    .order-trading-form-item {
      width: 100%;
      padding: 10px 0 0 0;
      .order-trading-input {
        width: 100%;
        :deep(.el-input) {
          .el-input__wrapper {
            background-color: var(--exchange-input-bg);
            border: 1px solid var(--exchange-input-border);
            box-shadow: none;
            outline: none;
            &.is-focus {
              border: 1px solid var(--color-dashboard-white);
            }
          }
          .el-input__inner {
            color: var(--color-dashboard-white);
          }
        }
      }
    }
  }

  .order-trading-submit-btn {
    background-color: var(--exchange-active-button);
    border-color: var(--exchange-active-button);
    width: 100%;
  }
}
</style>
