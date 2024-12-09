<template>
  <el-dialog :modal="false" :model-value="visible" @closed="close" :show-close="false" class="my-dialog-list" width="100%">
    <template #header="{ close, titleId, titleClass }">
    </template>
    <div class="my-dialog-container">
      <header class="my-dialog-header">
        <img :src="icon"/>
        <span>{{title}}</span>
      </header>
      <div class="my-dialog-list-container">
        <div class="list-view">
          <div style="overflow: auto;display: flex;flex-direction: column" v-infinite-scroll="scrollEnd">
            <slot></slot>
          </div>
        </div>
      </div>
      <img :src="getImagePath('Close.png')" class="close" @click="close" v-if="showClose"/>
    </div>
  </el-dialog>
</template>

<script setup>
import {getImagePath} from "@/utils/index.js";

const props = defineProps(['visible', 'title', 'icon', 'showClose' ]);
const emit = defineEmits(['cancel', 'update:visible', 'scrollEnd']);
const {
  visible,
  title,
  icon,
  showClose
} = toRefs(props);
// 关闭
const close = () => {
  emit('update:visible', false);
  emit('cancel');
}
const scrollEnd = () => {
  console.log('scrollEnd')
  emit('scrollEnd');
}
</script>

<style lang="scss">
.my-dialog-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  max-width: 100%;
  width: 100%;
  height: 100%;
  padding: 10px;
  margin: 0;
  background-color: var(--color-mobile-grey-4-2);
  .my-dialog-container {
    display: flex;
    flex-direction: column;
    max-width: 748px;
    width: calc(100vw - 20px);
    border-radius: 10px;
    .my-dialog-header {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      margin-bottom: 20px;
      color: var(--color-dashboard-white);
      img {
        width: 30px;
        margin-right: 10px;
      }
      span {
        font-size: 20px;
      }
    }
    .my-dialog-list-container {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 60vh;
      border: 2px solid var(--color-dashboard-green-op);
      border-radius: 10px;
      background-color: var(--color-mobile-grey-4);
      overflow-y: auto;
      .list-view {
        display: flex;
        flex-direction: column;
        margin: 20px 10px;
        width: calc(100% - 20px);
        height: calc(100% - 40px);
        overflow: auto;
      }
    }
    .close {
      width: 40px;
      height: 40px;
      margin-top: 20px;
      align-self: center;
    }
  }
}

@media screen and (max-width: 768px){
}
</style>
