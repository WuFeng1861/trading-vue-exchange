<script setup>
import {useCoinIcon} from "@/composition/mint/wallet/useWalletCoinList.js";
import {useUserAssetsList} from "@/composition/exchange/asset.js";
import SafeCalc from "../../../../utils/bignumberjs.js";
import {usePairPriceRef} from "@/composition/exchange/order.js";

const assets = useUserAssetsList();
const priceRef = usePairPriceRef();

const handleDeposit = (currency) => {
  console.log(`Deposit ${currency}`);
};

const handleWithdraw = (currency) => {
  console.log(`Withdraw ${currency}`);
};
</script>

<template>
  <div class="overflow-x-auto">
    <table class="w-full">
      <thead>
        <tr class="text-gray-400 text-sm border-b border-gray-700">
          <th class="text-left py-4 px-4">资产</th>
          <th class="text-right py-4 px-4">总额</th>
          <th class="text-right py-4 px-4 hidden lg:table-cell">估值 (USDT)</th>
          <th class="text-center py-4 px-4">操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="asset in assets" 
            :key="asset.currency" 
            class="border-b border-gray-700 hover:bg-gray-800/50 transition-colors text-white">
          <td class="py-4 px-4">
            <div class="flex items-center space-x-2">
              <img class="w-6" :src="useCoinIcon(asset.currency)" :alt="asset.currency">
              <span class="font-medium">{{ asset.currency }}</span>
            </div>
          </td>
          <td class="text-right py-4 px-4">{{ asset.balance }}</td>
          <td class="text-right py-4 px-4 hidden lg:table-cell">{{ asset.currency === 'USDT' ? asset.balance : SafeCalc.mul(asset.balance, priceRef) }}</td>
          <td class="py-4 px-4">
            <div class="flex justify-center space-x-2">
              <button
                @click="handleDeposit(asset.currency)"
                class="px-3 py-1 text-sm bg-trading-green text-white rounded hover:bg-opacity-90 transition-colors"
              >
                充币
              </button>
              <button
                @click="handleWithdraw(asset.currency)"
                class="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-opacity-90 transition-colors"
                :disabled="parseFloat(asset.balance) <= 0"
                :class="{ 'opacity-50 cursor-not-allowed': parseFloat(asset.balance) <= 0 }"
              >
                提币
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.overflow-x-auto {
  -webkit-overflow-scrolling: touch;
}

.overflow-x-auto::-webkit-scrollbar {
  height: 6px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: #1E222D;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #4A4A4A;
  border-radius: 3px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>

<style scoped lang="scss">
@import "@/styles/tailwind/exchange";
</style>