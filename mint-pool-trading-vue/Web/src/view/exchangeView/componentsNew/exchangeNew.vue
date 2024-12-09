<script setup>
import KLineChart from './components/KLineChart.vue';
import TradingForm from './components/TradingForm.vue';
import MarketData from './components/MarketData.vue';
import AccountPanel from './components/AccountPanel.vue';
import AppHeader from './components/AppHeader.vue';
import AppFooter from './components/AppFooter.vue';
</script>

<template>
  <div style="height: 100vh; overflow: auto">
    <div class="min-h-screen bg-trading-darker flex flex-col">
    <AppHeader />

    <main class="flex-1 py-4">
      <div class="px-4">
        <div class="grid grid-cols-1 gap-4">
          <!-- Trading Section -->
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <!-- Chart -->
            <div class="lg:col-span-6">
              <KLineChart />
            </div>

            <!-- Market Data & Trading Form - Desktop -->
            <div class="hidden lg:grid lg:grid-cols-6 lg:col-span-6 gap-4">
              <div class="col-span-2">
                <MarketData />
              </div>
              <div class="col-span-4">
                <TradingForm />
              </div>
            </div>

            <!-- Market Data & Trading Form - Mobile -->
            <div class="lg:hidden grid grid-cols-2 gap-4">
              <div class="col-span-1">
                <MarketData />
              </div>
              <div class="col-span-1">
                <TradingForm />
              </div>
            </div>
          </div>

          <!-- Account Panel -->
          <AccountPanel />
        </div>
      </div>
    </main>

    <AppFooter />
  </div>
  </div>
</template>

<style scoped lang="scss">
@import "@/styles/tailwind/exchange";
</style>