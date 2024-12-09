<template>
  <div class="reward">
    <text-wave
        class="waveText"
        size="80"
        text="奖励获取"
    />
    <div class="rewardContainer shadowNormal border-black">
      <reward-list
          class="rewardItem border-black"
      />
      <line-charts
          class="rewardItem border-black pcOnly"
          title="最近收益"
          :xdata="xdata"
          xname="收益次数"
          yname="收益金额"
          :ydata="ydata"
      />
    </div>
  </div>
</template>

<script setup>

import TextWave from "@/components/textWave.vue";
import LineCharts from "@/components/echarts/lineCharts.vue";
import RewardList from "@/components/rewardList.vue";
import {useMyEarnListRef} from "@/composition/mint/useMyEarns.js";

const earnListRef = useMyEarnListRef();
const xdata = computed(() => {
  return earnListRef.value.map((_, idx) => idx + 1);
})
const ydata = computed(() => {
  return earnListRef.value.map(item => item.earnings);
})

</script>

<style scoped lang="scss">
.reward {
  width: 100%;
  height: calc(100% - $header-height);
  overflow: auto;
  padding: 20px;
  padding-top: 0;

  .waveText {
    width: 100%;
    height: 200px;
  }

  .rewardContainer {
    display: flex;
    width: 100%;
    //height: 50%;
    min-height: 590px;
    padding: 20px;
    border-radius: 20px;
    background-color: var(--color-dashboard-bg-active);
    & > * {
      margin-right: 20px;
      &:last-child {
        margin-right: 0;
      }
    }

    .rewardItem {
      display: flex;
      justify-content: center;
      align-items: center;
      width: calc(50% - 10px);
      //height: 50%;
      padding: 20px;
      border-radius: 20px;
    }
  }

}
@media (max-width: 768px) {
  .reward {
    height: calc(100% - $mobile-nav-height);
    .rewardContainer {
      flex-direction: column;
      .rewardItem {
        width: 100%;
      }
    }
  }
}

</style>
