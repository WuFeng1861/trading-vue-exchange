<template>
  <div class="mySvg iconContainer" v-if="outContainer !== undefined && outContainer !== null &&  outContainer !== false">
    <el-icon :size="sizeNew">
      <img :src="getSvgPath(svgName)" alt=""/>
    </el-icon>
  </div>
  <el-icon :size="sizeNew" v-else>
    <img :src="getSvgPath(svgName)" alt=""/>
  </el-icon>
</template>

<script setup>
import {getSvgPath} from "@/utils/index.js";

// props svgName size
const props = defineProps(['svgName', 'size', "outContainer"]);
const { svgName, size, outContainer } = toRefs(props);

const sizeNew = ref(size.value || 24);

// console.log(outContainer)


</script>

<style scoped lang="scss">

</style>
