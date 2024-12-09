<template>
  <el-config-provider :locale="zhCN">
    <router-view/>
  </el-config-provider>
</template>

<script setup>
import zhCN from "element-plus/es/locale/lang/zh-cn";
import {useCheckToken} from "./composition/useUser.js";

useCheckToken();



</script>

<style lang="scss">
body {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;

  #app {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
}
</style>
