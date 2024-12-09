<script setup>
import {useTradeListRef} from "@/composition/exchange/order.js";
import dayjs from "dayjs";

const trades = useTradeListRef();
// const trades = ref([
//   { time: '10:30:15', price: '1.7995', amount: '234.56', type: 'buy' },
//   { time: '10:30:12', price: '1.7990', amount: '567.89', type: 'sell' },
//   { time: '10:30:08', price: '1.7995', amount: '123.45', type: 'buy' },
//   { time: '10:30:05', price: '1.7985', amount: '345.67', type: 'sell' },
//   { time: '10:30:01', price: '1.7980', amount: '789.12', type: 'sell' },
//   { time: '10:29:58', price: '1.7975', amount: '456.78', type: 'buy' },
//   { time: '10:29:55', price: '1.7970', amount: '234.56', type: 'buy' },
//   { time: '10:29:52', price: '1.7965', amount: '678.90', type: 'sell' },
// ]);
</script>

<template>
  <div class="flex-1 flex flex-col h-full">
    <div class="text-xs flex-1 overflow-hidden">
      <div class="grid grid-cols-3 px-3 py-2 text-gray-400 border-b border-gray-700">
        <div>价格</div>
        <div class="text-right">数量</div>
        <div class="text-right">时间</div>
      </div>
      
      <div class="flex-1 overflow-y-auto">
        <div v-for="(trade, index) in trades" :key="index" 
             class="grid grid-cols-3 px-3 py-2 hover:bg-gray-800">
          <div :class="trade.trade_type.toString() === '0' ? 'text-trading-green' : 'text-trading-red'">
            {{ Number(trade.trade_price) }}
          </div>
          <div class="text-right">{{ Number(trade.trade_amount) }}</div>
          <div class="text-right text-gray-400">{{dayjs(Number(trade.trade_time)).format('HH:mm:ss')}}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
@import "@/styles/tailwind/exchange";
</style>