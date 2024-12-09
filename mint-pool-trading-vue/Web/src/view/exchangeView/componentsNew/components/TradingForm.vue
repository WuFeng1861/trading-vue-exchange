<script setup>
import { ref, computed } from 'vue';
import {
  useCreateBuyLimitPriceOrder, useCreateSellLimitPriceOrder,
  useOrderListBuyNumberRef,
  useOrderListSellNumberRef, useUpdateUserOrderList
} from "@/composition/exchange/order.js";
import {useInitUserAssets, useUserAssetsRef} from "@/composition/exchange/asset.js";
import SafeCalc from "@/utils/bignumberjs.js";
import {elTip, elTipComingSoon, limitDecimal4} from "@/utils/index.js";

const userAssets = useUserAssetsRef();
const price = ref('');
const amount = ref('');
const type = ref('buy');
const sliderValue = ref(0);

const totalValue = computed(() => {
  const numPrice = parseFloat(price.value) || 0;
  const numAmount = parseFloat(amount.value) || 0;
  return SafeCalc.mul(numPrice , numAmount);
});

const percentages = [25, 50, 75, 100];

const handlePercentageClick = (percentage) => {
  if (sliderValue.value === percentage) {
    sliderValue.value = 0;
    amount.value = '';
    return;
  }
  sliderValue.value = percentage;
  let maxAmount = 0;
  if (type.value === 'buy') {
    maxAmount = Number(userAssets.value['USDT'])/Number(price.value);
  } else {
    maxAmount = Number(userAssets.value['MERC']);
  }
  amount.value = (Math.floor(maxAmount * percentage * 100) / 100).toString();
};


const handleBlurPrice = () => {
  price.value = (Math.floor(price.value * 10000) / 10000).toString();
}
const handleBlurAmount = (event) => {
  amount.value = (Math.floor(amount.value * 10000) / 10000).toString();
}
const handleTrade = async () => {
  if (!price.value || !amount.value) {
    alert('请输入价格和数量');
    return;
  }
  if (!price.value || SafeCalc.compare(price.value, 0) === '-1' || SafeCalc.compare(price.value, 0) === '0') {
    return elTip('请输入正确的价格', 'error');
  }
  if (!amount.value || SafeCalc.compare(amount.value, 0) === '-1' || SafeCalc.compare(amount.value, 0) === '0') {
    return elTip('请输入正确的数量', 'error');
  }
  if (type.value === 'buy' ) {
    // 创建限价买单
    console.log('创建限价买单')
    await useCreateBuyLimitPriceOrder(price.value, amount.value);
  } else if (type.value === 'sell' ) {
    // 创建限价卖单
    console.log('创建限价卖单')
    await useCreateSellLimitPriceOrder(price.value, amount.value);
  }
  // 更新余额数据
  await useInitUserAssets();
  // 更新当前委托
  await useUpdateUserOrderList();
  // reset form
  amount.value = '';
  sliderValue.value = 0;
};

const asks = useOrderListSellNumberRef(7);
const bids = useOrderListBuyNumberRef(7);

const handleUpdateOrderType = (value) => {
  console.log(value, 'TradingForm Page');
  type.value = value;
  if (value === 'sell') {
    price.value = Number(bids.value[0].price_range).toString();
  } else {
    price.value = Number(asks.value[asks.value.length - 1].price_range).toString();
  }
}
</script>

<template>
  <div class="bg-trading-dark rounded-lg h-full">
    <div class="flex border-b border-gray-700">
      <button 
        v-for="orderType in ['buy', 'sell']" 
        :key="orderType"
        @click="handleUpdateOrderType(orderType)"
        class="flex-1 py-3 text-center transition-colors"
        :class="[
          type === orderType ? 
            orderType === 'buy' ? 'text-trading-green border-b-2 border-trading-green' : 'text-trading-red border-b-2 border-trading-red'
            : 'text-gray-400'
        ]"
      >
        {{ orderType === 'buy' ? '买入' : '卖出' }}
      </button>
    </div>

    <div class="p-4 space-y-4">
      <div>
        <label class="block text-sm text-gray-400 mb-2">价格 (USDT)</label>
        <input
          v-model="price"
          type="number"
          class="w-full bg-gray-800 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-trading-green text-white"
          placeholder="输入价格"
          step="0.0001"
          min="0"
          @blur="handleBlurPrice"
        >
      </div>

      <div>
        <label class="block text-sm text-gray-400 mb-2">数量 (MERC)</label>
        <input 
          type="number"
          v-model="amount"
          class="w-full bg-gray-800 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-trading-green text-white"
          placeholder="输入数量"
          step="0.0001"
          min="0"
          @blur="handleBlurAmount"
        >
        <div class="flex gap-2 mt-2">
          <button 
            v-for="percentage in percentages" 
            :key="percentage"
            @click="handlePercentageClick(percentage)"
            class="flex-1 py-1 text-sm rounded transition-colors"
            :class="[
              sliderValue === percentage ? 'bg-trading-green text-white' : 'bg-gray-800 text-gray-400'
            ]"
          >
            {{ percentage }}%
          </button>
        </div>
      </div>

      <div class="bg-gray-800 rounded p-3 flex justify-between">
        <span class="text-gray-400">预计交易额</span>
        <span class="font-medium text-white">{{ totalValue }} USDT</span>
      </div>

      <button 
        @click="handleTrade"
        class="w-full py-3 rounded font-medium transition-opacity hover:opacity-90"
        :class="type === 'buy' ? 'bg-trading-green' : 'bg-trading-red'"
      >
        {{ type === 'buy' ? '买入 MERC' : '卖出 MERC' }}
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "@/styles/tailwind/exchange";
</style>