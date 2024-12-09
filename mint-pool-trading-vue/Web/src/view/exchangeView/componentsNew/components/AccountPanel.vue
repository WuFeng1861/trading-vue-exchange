<script setup>
import { ref } from 'vue';
import AssetOverview from './AssetOverview.vue';
import OrderHistory from './OrderHistory.vue';

const activeTab = ref('assets');
</script>

<template>
  <div class="bg-trading-dark rounded-lg">
    <div class="flex border-b border-gray-700">
      <button 
        v-for="(tab, name) in {
          assets: '我的资产',
          current: '当前委托',
          history: '历史委托'
        }"
        :key="name"
        @click="activeTab = name"
        class="px-6 py-3 text-sm transition-colors whitespace-nowrap"
        :class="[
          activeTab === name 
            ? 'text-trading-green border-b-2 border-trading-green' 
            : 'text-gray-400 hover:text-white'
        ]"
      >
        {{ tab }}
      </button>
    </div>

    <div class="p-4">
      <AssetOverview v-if="activeTab === 'assets'" />
      <OrderHistory 
        v-else 
        :show-type="activeTab === 'current' ? 'current' : 'history'" 
      />
    </div>
  </div>
</template>
<style scoped lang="scss">
@import "@/styles/tailwind/exchange";
</style>