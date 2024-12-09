<script setup>
import {
  useOrderListBuyNumberRef,
  useOrderListSellNumberRef,
  usePairPriceRef
} from "@/composition/exchange/order.js";

const asks = useOrderListSellNumberRef(7);
const bids = useOrderListBuyNumberRef(7);
const orderPairPrice = usePairPriceRef();
onMounted(() => {
  console.log(asks.value, bids.value, orderPairPrice.value, 'order book mounted');
})
</script>

<template>
  <div class="flex-1 flex flex-col h-full">
    <div class="text-xs flex-1 overflow-hidden">
      <div class="grid lg:grid-cols-3 grid-cols-2 px-3 py-2 text-gray-400 border-b border-gray-700">
        <div>价格</div>
        <div class="text-right">数量</div>
        <div class="text-right hidden lg:block">累计</div>
      </div>
      
      <div class="flex-1 overflow-y-auto">
        <!-- Asks -->
        <div class="space-y-px">
          <div v-for="(ask, index) in asks" :key="'ask'+index" class="relative">
            <div class="absolute inset-0 bg-trading-red opacity-10" 
                 :style="{ width: (ask.percent * 100) + '%' }">
            </div>
            <div class="grid lg:grid-cols-3 grid-cols-2 px-3 py-2 relative">
              <div class="text-trading-red">{{ Number(ask.price_range) }}</div>
              <div class="text-right">{{ Number(ask.total_remain_amount) }}</div>
              <div class="text-right hidden lg:block">{{ (Number(ask.price_range) * Number(ask.total_remain_amount)).toFixed(2) }}</div>
            </div>
          </div>
        </div>
        
        <!-- Current Price -->
        <div class="px-3 py-2 border-y border-gray-700 flex justify-between items-center">
          <span class="text-lg font-bold text-trading-green">{{orderPairPrice && Number(orderPairPrice)}}</span>
          <span class="text-xs text-gray-400">≈ ${{orderPairPrice && Number(orderPairPrice)}}</span>
        </div>
        
        <!-- Bids -->
        <div class="space-y-px">
          <div v-for="(bid, index) in bids" :key="'bid'+index" class="relative">
            <div class="absolute inset-0 bg-trading-green opacity-10" 
                 :style="{ width: (bid.percent * 100) + '%' }">
            </div>
            <div class="grid lg:grid-cols-3 grid-cols-2 px-3 py-2 relative">
              <div class="text-trading-green">{{ Number(bid.price_range) }}</div>
              <div class="text-right">{{ Number(bid.total_remain_amount) }}</div>
              <div class="text-right hidden lg:block">{{ (Number(bid.price_range) * Number(bid.total_remain_amount)).toFixed(2) }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
@import "@/styles/tailwind/exchange";
</style>