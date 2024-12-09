<template>
  <div class="layOut">
    <div class="container">
      <img :src="getLayoutPath(`Merc_${item}.jpg`)" alt="Mercury Next" v-for="item in 5">
    </div>
  </div>
</template>

<script setup>
import {getLayoutPath} from "@/utils/index.js";
</script>

<style scoped lang="scss">
.layOut {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-wrap: wrap;
  width: 100%;
  height: calc(100% - $header-height);
  overflow: auto;
  position: relative;
  .container {
    //max-width: 768px;
    width: 100%;
    overflow: auto;
    position: relative;
  }
  img {
    width: 100%;
  }
}
@media screen and (max-width: 768px) {
  .layOut {
    height: calc(100% - $mobile-nav-height);
  }
}
</style>
