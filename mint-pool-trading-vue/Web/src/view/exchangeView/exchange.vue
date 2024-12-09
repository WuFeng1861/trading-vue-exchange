<template>
  <div class="exchange">
    <my-exchange-header></my-exchange-header>
    <router-view></router-view>
  </div>
</template>

<script setup>
import MyExchangeHeader from "./components/my-exchange-header.vue";

</script>

<style scoped lang="scss">
.exchange {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: var(--exchange-black);
  padding: 0 10px 10px 0;
}

</style>
