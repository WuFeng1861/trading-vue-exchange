<template>
  <div class="blindbox">
    <div>
      <div class="boxContainer">
        <img :src="getImagePath('BlindBox.png')"/>
        <img class="openBox" :src="getImagePath('OpenBlindBox.png')" @click="openBox"/>
      </div>
    </div>
    <p class="tips">*每打开一个盲盒将燃烧{{ config.OPEN_BOX_FEE }}枚BNB</p>
  </div>
</template>

<script setup>
import bus from "@/bus/mitt.js";
import config from "@/config/api.js";
import {getImagePath} from "@/utils/index.js";

const openBox = () => {
  bus.$emit('showStratch', null);
}

</script>

<style scoped lang="scss">
.blindbox {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
  height: calc(100% - $header-height);
  overflow: auto;
  padding: 20px;
  position: relative;
  .boxContainer {
    max-width: 768px;
    display: flex;
    justify-content: center;
    position: relative;
    .openBox {
      position: absolute;
      bottom: 17.58%;
      left: 50%;
      width: 34.88%;
      transform: translateX(-50%);
      cursor: pointer;
    }
  }

  .tips {
    position: absolute;
    bottom: 10px;
    width: 100%;
    text-align: center;
    font-size: 12px;
    color: #999;
    line-height: 16px;
    white-space: nowrap;
  }
}

@media screen and (max-width: 768px) {
  .blindbox {
    height: calc(100% - $mobile-nav-height);
    padding: 10px;
  }
}

</style>
