<template>
  <notice-bar left-icon="volume-o" background="#212121" color="#fff" wrapable :scrollable="false" mode="link" click="noticeBarClick" class="mobileOnly">
    <swipe
        vertical
        class="notice-swipe"
        :autoplay="3000"
        :touchable="false"
        :show-indicators="false"
    >
      <swipe-item v-for="(item, index) in textlist" @click="item.click">{{item.text}}</swipe-item>
    </swipe>
  </notice-bar>
</template>

<script setup>
import {NoticeBar, Swipe, SwipeItem} from "vant";
import 'vant/lib/index.css';

const props = defineProps(["textlist"]);
const {textlist} = props;
</script>

<style scoped lang="scss">
</style>
