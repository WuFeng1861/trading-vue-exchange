<script setup>
import { ref } from 'vue';
import TradingForm from './TradingForm.vue';
import OrderBook from './OrderBook.vue';
import RecentTrades from './RecentTrades.vue';

const activeTab = ref('trade');
</script>

<template>
  <div class="bg-trading-dark rounded-lg">
    <div class="flex border-b border-gray-700">
      <button 
        v-for="(tab, name) in {
          trade: '交易',
          orderbook: '订单簿',
          trades: '最新成交'
        }"
        :key="name"
        @click="activeTab = name"
        class="flex-1 py-3 text-sm transition-colors border-b-2"
        :class="[
          activeTab === name 
            ? 'text-trading-green border-trading-green' 
            : 'text-gray-400 border-transparent hover:text-white'
        ]"
      >
        {{ tab }}
      </button>
    </div>

    <div class="h-[600px]">
      <TradingForm v-if="activeTab === 'trade'" />
      <OrderBook v-else-if="activeTab === 'orderbook'" />
      <RecentTrades v-else-if="activeTab === 'trades'" />
    </div>
  </div>
</template>