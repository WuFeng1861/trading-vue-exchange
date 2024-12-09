<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import OrderBook from './OrderBook.vue';
import RecentTrades from './RecentTrades.vue';

const activeTab = ref('orderbook');
const isDesktop = ref(false);
let mediaQuery;

onMounted(() => {
  mediaQuery = window.matchMedia('(min-width: 1024px)');
  isDesktop.value = mediaQuery.matches;
  
  const handleResize = (e) => {
    isDesktop.value = e.matches;
  };
  
  // Modern browsers
  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener('change', handleResize);
  }
  // Older browsers
  else if (mediaQuery.addListener) {
    mediaQuery.addListener(handleResize);
  }
});

onUnmounted(() => {
  if (mediaQuery) {
    // Modern browsers
    if (mediaQuery.removeEventListener) {
      mediaQuery.removeEventListener('change', handleResize);
    }
    // Older browsers
    else if (mediaQuery.removeListener) {
      mediaQuery.removeListener(handleResize);
    }
  }
});
</script>

<template>
  <div class="bg-trading-dark rounded-lg flex flex-col h-full">
    <div class="flex border-b border-gray-700">
      <button 
        v-for="(tab, name) in {
          orderbook: '订单簿',
          trades: '最新成交'
        }"
        :key="name"
        @click="activeTab = name"
        class="flex-1 py-3 text-sm transition-colors"
        :class="[
          activeTab === name 
            ? 'text-trading-green border-b-2 border-trading-green' 
            : 'text-gray-400 hover:text-white',
          name === 'trades' ? (isDesktop ? '' : 'hidden') : ''
        ]"
      >
        {{ tab }}
      </button>
    </div>

    <div class="flex-1">
      <OrderBook v-if="activeTab === 'orderbook'" />
      <RecentTrades v-else-if="activeTab === 'trades' && isDesktop" />
    </div>
  </div>
</template>
<style scoped lang="scss">
@import "@/styles/tailwind/exchange";
</style>