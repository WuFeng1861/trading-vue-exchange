<template>
  <div class="record">
    <div class="record-logo">
      <img :src="useCoinIcon(coinName)">
      <p class="coin-balance">{{ Number(coinRef?.balance) }} {{ coinName }}</p>
      <p class="coin-value">≈ ${{ coinRef && SafeCalc.mul(coinRef.unitPrice, coinRef.balance) }}</p>
    </div>
    <p style="align-self: flex-start;font-size: 12px; line-height: 2">交易记录</p>
    <div class="record-list" v-infinite-scroll="vScrollNext">
      <div class="record-item infinite-list-item" v-for="item in recordListRef[coinName]" @click="handleRecordClick(item)">
        <img v-if="item.sender === mybalance.address" :src="getImagePath('Wallet-Transfer-Out.png')">
        <img v-if="item.sender !== mybalance.address" :src="getImagePath('Wallet-Transfer-In.png')">
        <div class="record-item-data">
          <p class="record-address">
            {{ formatOtherAddress(item) }}
          </p>
          <p class="record-time">
            {{ dayjs(Number(item.create_time)).format('YYYY-MM-DD HH:mm:ss') }}
          </p>
        </div>
        <div style="flex: 1"/>
        <div :class="{
          'record-item-balance': true,
          'is-out': item.sender === mybalance.address,
          'is-in': item.sender !== mybalance.address
        }">
          {{ item.sender === mybalance.address ? '-' : '+' }}{{Math.abs(Number(item.amount))}} {{ coinName }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {useRoute} from "vue-router";
import bus from "@/bus/mitt.js";
import {useCoinIcon, useWalletCoinRef} from "@/composition/mint/wallet/useWalletCoinList.js";
import SafeCalc from "@/utils/bignumberjs.js";
import {getImagePath, handleAddress, routerToParamsQuery} from "@/utils/index.js";
import dayjs from "dayjs";
import {
  getNextTransferRecordData,
  initTransferRecordTotal,
  useTransferRecordObjRef, useTransferRecordRef
} from "@/composition/mint/wallet/useWalletRecord.js";
import {useMyBalanceRef} from "@/composition/mint/useMyBalance.js";
import {setRouteParams} from "@/route/routeParams.js";

const route = useRoute()
const coinName = route.params.coinName;
const coinRef = useWalletCoinRef(coinName);
// const recordListRef = useTransferRecordRef(coinName);
const recordListRef = useTransferRecordObjRef(coinName);
const mybalance = useMyBalanceRef();
const formatOtherAddress = (item) => {
  let otherAddress = item.sender === mybalance.value.address ? item.receiver : item.sender;
  if(otherAddress === '') {
    return handleAddress(mybalance.value.address);
  }
  return handleAddress(otherAddress);
}
const vScrollNext = () => {
  getNextTransferRecordData(coinName);
}
const handleRecordClick = (item) => {
  setRouteParams(item.hash, item);
  routerToParamsQuery('record-detail', {
    hash: item.hash
  })
}
onMounted(() => {
  bus.$emit('updateWalletTitle', coinName);
  initTransferRecordTotal(coinName);
})

</script>

<style scoped lang="scss">
.record {
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


  .record-logo {
    display: flex;
    flex-direction: column;
    width: 100%;
    margin: 20px;
    align-items: center;

    .coin-balance {
      font-size: 20px;
      font-weight: bold;
      line-height: 1.5;
      margin-top: 10px;
    }

    .coin-value {
      font-size: 15px;
      color: var(--wallet-mobile-grey-font);
    }

    img {
      width: 60px;
    }
  }

  .record-list {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: var(--wallet-mobile-grey-bg);
    width: 100%;
    border-radius: 7px;
    margin-bottom: 50px;

    .record-item {
      background-color: var(--wallet-mobile-grey-bg);
      width: 100%;
      padding: 15px;
      display: flex;
      flex-direction: row;
      align-items: center;
      border: 1px solid transparent;

      .record-item-data {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        height: 100%;

        .record-address {
          font-size: 15px;
        }

        .record-time {
          font-size: 12px;
          color: var(--wallet-mobile-grey-font);
          // 不换行
          white-space: nowrap;
        }
      }

      &:hover {
        border-radius: 7px;
        border: 1px solid var(--color-dashboard-green);
      }
      &:first-child {
        border-radius: 7px 7px 0 0;
      }
      &:last-child {
        border-radius: 0 0 7px 7px;
      }

      img {
        width: 30px;
        margin-right: 10px;
      }
      .record-item-balance {
        // 不换行
        white-space: nowrap;
      }
    }
  }
}
</style>
