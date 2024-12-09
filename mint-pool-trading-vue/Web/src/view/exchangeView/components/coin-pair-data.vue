<template>
  <div class="coin-pair-data">
    <img src="@/assets/startMintLogo.png" alt="logo" class="coin-logo"/>
    {{ pairRef }}
    <el-divider direction="vertical" style="margin: 0 10px;"/>
    <span style="margin-right: 10px">2906.6365</span>
    <div class="coinPriceItem" v-for="item in priceData">
      <el-divider direction="vertical" style="margin: 0 10px;"/>
      <span class="coinPriceItemTitle">{{ item.title }}</span>
      <span class="coinPriceItemValue">{{ item.value }}</span>
    </div>
  </div>
</template>

<script setup>
import {usePairDayDataRef} from "@/composition/exchange/dayData.js";
import {useKlinePairRef} from "@/composition/exchange/kLineData.js";
import {usePairPriceRef} from "@/composition/exchange/order.js";

const priceData = ref([
  {
    title: '美元价格',
    value: '$1.0000',
  },
  {
    title: '24小时最低',
    value: '1.0000',
  },
  {
    title: '24小时最高',
    value: '1.0000',
  },
  {
    title: '24小时交易量',
    value: '1.0000',
  },
  {
    title: '24小时交易额（USDT）',
    value: '1.0000',
  }
]);

let dayRef = usePairDayDataRef();

const pairRef = useKlinePairRef();

const priceRef = usePairPriceRef();

// watch dayRef to update priceData
watch([() => dayRef.value, () => priceRef.value], () => {
  priceData.value = [
    {
      title: '美元价格',
      value: `$${Number(priceRef.value || 0)}`,
    },
    {
      title: '24小时最低',
      value: `$${Number(dayRef.value?.minPrice)}`,
    },
    {
      title: '24小时最高',
      value: `$${Number(dayRef.value?.maxPrice)}`,
    },
    {
      title: '24小时交易量',
      value: `${Number(dayRef.value?.volume)}`,
    },
    {
      title: '24小时交易额（USDT）',
      value: `$${Number(dayRef.value?.value)}`,
    }
  ];
});

</script>

<style scoped lang="scss">
$coinPairDataHeight: 50px;
.coin-pair-data {
  width: 100%;
  height: $coinPairDataHeight;
  min-height: $coinPairDataHeight;
  max-height: $coinPairDataHeight;
  margin-bottom: 10px;
  background-color: var(--exchange-main-bg);
  color: var(--color-dashboard-white);
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 10px 10px 0;

  .coin-logo {
    width: 30px;
    height: 30px;
    margin-right: 10px;
  }

  .coinPriceItem {
    height: 40px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-right: 10px;

    .coinPriceItemTitle {
      font-size: 15px;
      color: #ffffff94;
    }

    .coinPriceItemValue {
      font-size: 12px;
      color: var(--color-dashboard-white);
    }
  }
}
</style>
