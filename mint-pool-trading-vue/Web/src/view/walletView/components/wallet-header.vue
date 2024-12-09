<template>
  <div class="wallet-header">
    <!--<img v-if="$route.name === 'asset'" :src="getImagePath('Wallet-LeftNav.png')">-->
    <img :src="getImagePath('Wallet-Back-White.png')" @click="routerBack">
    <div style="flex: 1;"/>
    <img v-if="$route.name === 'asset'" :src="getImagePath('Wallet-Scan.png')" class="right-icon" @click="toScanView">
    <p class="title">{{title}}</p>
  </div>
</template>

<script setup>
import {elTipComingSoon, getImagePath, routerBack} from "@/utils/index.js";
import {useRoute} from "vue-router";
import bus from "@/bus/mitt.js";
const toScanView = () => {
  console.log('todo toScanView');
  elTipComingSoon();
}
const title = ref('');
const route = useRoute();
const updateTitleFn = (text) => {
  console.log('updateTitleFn', text)
  title.value = text || '';
};
onMounted(() => {
  bus.$on('updateWalletTitle', updateTitleFn);
})
onUnmounted(() => {
  bus.$off('updateWalletTitle', updateTitleFn)
})
</script>

<style scoped lang="scss">
.wallet-header {
  width: 100%;
  height: $wallet-header-height;
  background-color: var(--wallet-mobile-main-bg);
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 $wallet-padding;
  color: var(--color-dashboard-white);
  font-size: 20px;
  position: relative;
  border-bottom: 1px solid var(--wallet-mobile-grey-bg);
  img {
    width: 20px;
    height: 20px;
    z-index: 2;
  }

  .right-icon {
    width: 23px;
    height: 23px;
  }
  .title {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 0;
  }
}
</style>
