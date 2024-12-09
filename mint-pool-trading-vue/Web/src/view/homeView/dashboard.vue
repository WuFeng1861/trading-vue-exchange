<template>
  <div class="dashboard">
    <dashboard-my-info/>
    <bar-charts
        class="shadowNormal earnsBar"
        :xdata="days"
        :ydata1="weekEarns"
        :ydata2="weekTax"
    />
    <div class="tableContainer">
      <line-charts
          title="税收比例"
          class="tableItem"
          xname="起收点"
          yname="税率(%)"
          :show-label="true"
          :ydata="useTaxList()"
          :xdata="useTaxOutputList()"
      />
      <line-charts
          title="挖矿效率"
          class="tableItem"
          xname="产量"
          yname="速率"
          :show-label="true"
          :ydata="useMintRateList()"
          :xdata="useMintRateOutputList()"
      />
    </div>
  </div>
</template>

<script setup>
import BarCharts from "@/components/echarts/barCharts.vue";
import {useWeekEarnsRef, useWeekTaxRef} from "@/composition/mint/useMyEarns.js";
import {getLastSevenDays} from "@/utils/index.js";
import {useMintRateList, useMintRateOutputList, useTaxList, useTaxOutputList} from "@/composition/mint/useTaxTable.js";
import LineCharts from "@/components/echarts/lineCharts.vue";
import DashboardMyInfo from "@/components/dashboardMyInfo.vue";

console.log('???')
const weekEarns = useWeekEarnsRef();
const weekTax = useWeekTaxRef();
const days = getLastSevenDays();


</script>

<style scoped lang="scss">
.dashboard {
  width: 100%;
  height: calc(100% - $header-height);
  overflow: auto;
  padding: 20px;
  padding-top: 0;
  .earnsBar {
    width: 100%;
    height: 30%;
    min-height: 200px;
    margin-top: 20px;
    background-color: var(--color-dashboard-bg-grey);
    padding: 20px;
    border-radius: 20px;
    border: 1px solid var(--color-dashboard-green);
  }
  .tableContainer {
    margin-top: 20px;
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 40%;
    padding: 20px;
    border: 1px solid var(--color-dashboard-green);
    border-radius: 20px;
    .tableItem {
      padding: 20px;
      width: calc(50% - 5px);
      height: 100%;
      background-color: var(--color-dashboard-bg-grey);
      border: 1px solid var(--color-dashboard-green);
      border-radius: 20px;
      overflow: hidden;
      &:first-child {
        margin-right: 10px;
      }
    }
  }
}

@media (max-width: 768px) {
  .dashboard {
    height: calc(100% - $mobile-nav-height);
    padding: 10px;
    .tableContainer {
      flex-direction: column;
      height: 100%;
      .tableItem {
        width: 100%;
        height: 50%;
        &:first-child {
          margin-right: 0;
          margin-bottom: 10px;
        }
      }
    }
  }
}

</style>
