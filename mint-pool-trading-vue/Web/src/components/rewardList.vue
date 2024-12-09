<template>
  <div class="rewardList">
    <div class="container" >
      <img class="fill" src="@/assets/Empty.png" v-if="earnListRef.length === 0">
      <div class="earnList" v-infinite-scroll="useMoreMyEarnList">
        <div class="earnItem infinite-list-item" v-for="(item, index) in earnListRef" >
          <div class="itemTop">
            <span>{{getEarnType(item.type)}}</span>
            <span>{{item.earnings}}</span>
          </div>
          <div class="itemButtom">
            <span class="circleIndex">{{index + 1 }}</span>
            <span>{{dayjs(Number(item.createtime)).format('YYYY-MM-DD HH:mm:ss')}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {getEarnType, useMoreMyEarnList, useMyEarnListRef} from "@/composition/mint/useMyEarns.js";
import dayjs from "dayjs";
const earnListRef = useMyEarnListRef();

</script>

<style scoped lang="scss">
.rewardList {
  background-color: var(--color-dashboard-bg-grey);
  .container {
    width: 500px !important;
    height: 500px !important;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background-color: var(--color-dashboard-black);
    .earnList {
      width: 100%;
      overflow-y: auto;
      .earnItem {
        width: 100%;
        height: 100px;
        padding: 10px;
        background-color: var(--color-dashboard-bg-grey);
        border-bottom: 1px solid var(--color-dashboard-bg-active);
        .itemTop, .itemButtom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 50%;
          width: 100%;
          .circleIndex {
            padding: 5px;
            border-radius: 5px;
            background-color: var(--color-dashboard-bg-active);
          }
        }
      }
    }
  }

}
</style>
