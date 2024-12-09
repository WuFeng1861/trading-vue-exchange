<template>
  <div class="record-detail">
    <div class="record-detail-container">
      <img :src="getImagePath('Wallet-Finish.png')" class="record-detail-icon-success" alt="交易成功"/>
      <p class="record-detail-icon-text">交易成功</p>
      <p class="record-detail-value">{{ recordDetailRef.sender === mybalance.address ? '-' : '+' }}{{Math.abs(Number(recordDetailRef.amount))}} {{ recordDetailRef.coin_name }}</p>
      <div class="record-detail-info-item" v-for="(value, key) in recordDetailShowKeys">
        <p class="record-detail-info-label">{{ value.label }}</p>
        <div class="record-detail-info-value">
          {{ value.value(recordDetailRef) }}
          <img
            v-if="value.copy"
            class="record-detail-info-copy"
            :src="getImagePath('Wallet-Copy-White.png')"
            alt="复制"
            @click="copyToClipboard(value.copyText(recordDetailRef))"
        /></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {useRoute} from 'vue-router'
import {useTransferRecordDetail} from "@/composition/mint/wallet/useWalletRecord.js";
import {useRouteParams} from "@/route/routeParams.js";
import bus from "@/bus/mitt.js";
import {copyToClipboard, ethBlackHoleAddress, getImagePath, handleAddressLength} from "@/utils/index.js";
import dayjs from "dayjs";
import {useMyBalanceRef} from "@/composition/mint/useMyBalance.js";

const route = useRoute()
const recordHash = route.params.hash;
const recordDetail = useRouteParams(recordHash) || {};
const recordDetailRef = ref(recordDetail);
const mybalance = useMyBalanceRef();
const recordDetailShowKeys = {
  'sender': {
    label: '付款地址',
    value: (item) => `${handleAddressLength(item?.sender || ethBlackHoleAddress, 18)}`,
    copy: true,
    copyText: (item) => item ? item?.sender : ''
  },
  'receiver': {
    label: '收款地址',
    value: (item) => `${handleAddressLength(item?.receiver || ethBlackHoleAddress, 18)}`,
    copy: true,
    copyText: (item) => item ? item?.receiver : ''
  },
  'fee': {
    label: '矿工费用',
    value: (item) => `${Number(item?.fee)}`
  },
  'hash': {
    label: '哈希值',
    value: (item) => `${handleAddressLength('0x' + item?.hash, 18)}`,
    copy: true,
    copyText: (item) => item ? '0x' + item?.hash : ''
  },
  'create_time': {
    label: '交易时间',
    value: (item) => `${dayjs(Number(item?.create_time)).format('YYYY-MM-DD HH:mm:ss')}`
  }
}
onMounted(async () => {
  // 设置标题
  bus.$emit('updateWalletTitle', '交易详情');
  // 如果没有数据，则请求数据
  if (!recordDetail.hash) {
    const recordDetail = await useTransferRecordDetail(recordHash);
    recordDetailRef.value = recordDetail;
  }
  console.log(recordDetailRef.value);
})
</script>

<style scoped lang="scss">
.record-detail {
  width: 100%;
  height: calc(100% - $wallet-header-height);
  background-color: var(--wallet-mobile-main-bg);
  color: var(--color-dashboard-white);
  padding: 0 $wallet-padding;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: auto;
  overflow-x: hidden;
  .record-detail-container {
    display: flex;
    width: 100%;
    flex-direction: column;
    align-items: center;
    margin-top: 50px;
    border-radius: 10px;
    background-color: var(--wallet-mobile-grey-bg);
    padding: 0 20px 20px;
    .record-detail-icon-success {
      width: 60px;
      transform: translateY(-50%);
    }
    .record-detail-icon-text {
      font-size: 15px;
      margin-top: -20px;
      text-align: center;
      color: var(--color-dashboard-green);
    }
    .record-detail-value {
      font-size: 24px;
      margin-top: 20px;
      text-align: center;
      color: var(--color-dashboard-white);
    }
    .record-detail-info-item {
      align-self: flex-start;
      display: flex;
      flex-direction: column;
      margin-top: 20px;
      .record-detail-info-label {
        font-size: 15px;
        color: var(--wallet-mobile-grey-font);
        margin-bottom: 5px;
      }
      .record-detail-info-value {
        font-size: 15px;
        color: var(--color-dashboard-white);
        display: flex;
        align-items: center;
        img {
          width: 15px;
          margin-left: 10px;
        }
      }
    }
  }
}
</style>
