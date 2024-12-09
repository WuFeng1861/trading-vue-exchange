<template>
  <div class="asset">
    <div class="asset-total">
      <div class="top">
        <p>水星钱包</p>
        <img :src="getImagePath('Wallet-Eye-Open.png')">
        <div style="flex: 1"/>
        <p>详情</p>
        <img :src="getThemeImage('Wallet-Right.png')">
      </div>
      <div>
        ${{totalValue}}
      </div>
    </div>
    <div class="asset-cell">
      <div :class="{
        'cell-item': true,
        'active' : activeIndex === index
      }" v-for="(item, index) in assetCellList" @click="item.func">
        <img :src="getThemeImage(item.icon)">
        <p>{{ item.title }}</p>
      </div>

    </div>
    <el-tabs v-model="activeName" class="asset-tabs" @tab-change="tabClick" :before-leave="tabBeforeLeave">
      <el-tab-pane label="资产" name="asset"/>
      <!--<el-tab-pane label="NFT" name="nft"/>-->
    </el-tabs>
    <div class="asset-list">
      <div class="list-item" v-for="item in coinList" @click="toRecord(item.name)">
        <img :src="useCoinIcon(item.name)">
        <p>{{item.name}}</p>
        <div style="flex: 1"/>
        <div class="list-item-right">
          <p>{{Number(item.balance)}}</p>
          <p>≈ ${{SafeCalc.mul(item.unitPrice, item.balance)}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {getThemeImage} from "@/styles/theme/index.js";
import {elTip, elTipComingSoon, getImagePath, routerTo, routerToParams} from "@/utils/index.js";
import {
  initWalletCoinList,
  useCoinIcon,
  useWalletCoinListRef,
  useWalletTotalValueRef
} from "@/composition/mint/wallet/useWalletCoinList.js";
import SafeCalc from "@/utils/bignumberjs.js";
import bus from "@/bus/mitt.js";

const totalValue = useWalletTotalValueRef();

const activeIndex = ref(0);
const assetCellList = [
  {
    title: '转账',
    icon: 'Wallet-Switch.png',
    func: () => {
      activeIndex.value = 0;
      routerToParams('transfer', {
        coinName: 'MERC'
      });
    }
  },
  {
    title: '收款',
    icon: 'Wallet-Collection.png',
    func: () => {
      activeIndex.value = 1;
      routerTo('receive-code', null);
    }
  },
  {
    title: 'Swap',
    icon: 'Wallet-Swap.png',
    func: () => {
      activeIndex.value = 2;
      // elTipComingSoon();
      routerTo('exchange', null);
    }
  },
  {
    title: '生态支付',
    icon: 'Wallet-Pay.png',
    func: () => {
      activeIndex.value = 3;
      elTipComingSoon();
    }
  }
];

const activeName = ref('asset');
const tabClick = (name) => {
  activeName.value = name;
}
const tabBeforeLeave = (name, oldName) => {
  if(name !== 'asset') {
    activeName.value = 'asset';
    elTipComingSoon();
    return false;
  }
  return true;
}
const coinList = useWalletCoinListRef();
const toRecord = (name) => {
  if(name === 'USDT') {
    elTipComingSoon();
    return false;
  }
  routerToParams('record', {
    coinName: name
  })
}
onMounted(() => {
  // todo 这个会导致每次进入这里会请求两次数据，后续优化
  initWalletCoinList();
  bus.$emit('updateWalletTitle', '')
})

</script>

<style scoped lang="scss">
.asset {
  width: 100%;
  height: calc(100% - $wallet-header-height);
  background-color: var(--wallet-mobile-main-bg);
  color: var(--color-dashboard-white);
  padding: 0 $wallet-padding;
  display: flex;
  flex-direction: column;
  align-items: center;

  .asset-total {
    width: 100%;
    padding: 12px 18px;
    background-color: var(--wallet-mobile-grey-bg);
    border-radius: 7px;
    display: flex;
    flex-direction: column;
    font-size: 30px;
    font-weight: bold;
    color: var(--color-dashboard-green);

    .top {
      display: flex;
      flex-direction: row;
      align-items: center;
      margin-bottom: 10px;
      font-size: 13px;
      color: var(--color-dashboard-white);

      img {
        height: 13px;
        margin-left: 10px;
      }
    }
  }

  .asset-cell {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-top: 15px;

    .cell-item {
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background-color: var(--wallet-mobile-grey-bg);
      margin-right: 10px;
      border-radius: 7px;
      font-size: 13px;
      height: 70px;

      &:last-child {
        margin-right: 0;
      }

      img {
        width: 25px;
        height: 25px;
        margin-bottom: 7px;
      }
    }

    .active {
      border: 1px solid var(--color-dashboard-green);
    }
  }

  .asset-tabs {
    margin-top: 10px;
    width: 100%;
    :deep(.el-tabs__header) {
      margin-bottom: 0;
    }
    :deep(.el-tabs__active-bar) {
      background-color: var(--color-dashboard-green);
    }
    :deep(.el-tabs__nav-wrap) {
      &:after {
        height: 1px;
        transform: scaleY(0.1);
      }
    }
    :deep(.el-tabs__item) {
      color: var(--wallet-mobile-grey-font);
      padding-left: 0;
      &.is-active {
        color: var(--color-dashboard-white);
      }
    }
  }

  .asset-list {
    display: flex;
    flex: 1;
    flex-direction: column;
    width: 100%;
    overflow: auto;
    .list-item {
      position: relative;
      width: 100%;
      padding: 19px 0 12px;
      display: flex;
      flex-direction: row;
      align-items: center;
      img {
        width: 33px;
        height: 33px;
        margin-right: 15px;
      }
      .list-item-right {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
      }
      &:after {
        position: absolute;
        content:'';
        width: 100%;
        height: 1px;
        transform: scaleY(0.1);
        background-color: var(--color-dashboard-border);
        bottom: 0;
        left: 0;
      }
    }
  }
}
</style>
