<template>
  <div class="my-order-list">
    <!--todo: 后续在tabs的最右边定位一个下拉框选择加小间隙 orderGroupGap-->
    <el-tabs v-model="activeName" class="order-list-tabs" @tab-change="tabClick" :before-leave="tabBeforeLeave">
      <el-tab-pane label="订单表" name="order-list"/>
      <el-tab-pane label="最新成交" name="order-deal-latest"/>
    </el-tabs>
    <div class="order-list-container">
      <div class="order-list-title">
        <span class="order-list-title-price">价格({{ coinPair && coinPair[1] }})</span>
        <span class="order-list-title-amount">数量({{ coinPair && coinPair[0] }})</span>
        <span class="order-list-title-time" v-if="activeName === 'order-deal-latest'">时间</span>
      </div>
      <div v-if="activeName === 'order-list'" class="order-list-content">
        <div class="order-list-sell">
          <el-tooltip
              class="box-item"
              effect="dark"
              raw-content
              :content="`类型: 卖出 <br> 单价: ${Number(item.price_range)} <br> 数量: ${Number(item.total_remain_amount)} <br> 总价值: ${(Number(item.price_range) * Number(item.total_remain_amount)).toFixed(6)} (${coinPair && coinPair[1]})`"
              placement="left-start"
              v-for="(item, index) in orderListSell"
          >
            <div class="order-list-sell-item" :style="{
              '--precent': Number(item.percent) || 0
            }">
              <span class="order-list-sell-item-price">{{ Number(item.price_range) }}</span>
              <span class="order-list-sell-item-amount">{{ Number(item.total_remain_amount) }}</span>
            </div>
          </el-tooltip>
        </div>
        <div class="order-list-price-now">
          {{ orderPairPrice && Number(orderPairPrice) }} ({{ coinPair && coinPair[1] }})
        </div>
        <div class="order-list-buy">
          <el-tooltip
              class="box-item"
              effect="dark"
              raw-content
              :content="`类型: 买入 <br> 单价: ${Number(item.price_range)} <br> 数量: ${Number(item.total_remain_amount)} <br> 总价值: ${(Number(item.price_range) * Number(item.total_remain_amount)).toFixed(6)} (${coinPair && coinPair[1]})`"
              placement="left-start"
              v-for="(item, index) in orderListBuy"
          >
            <div class="order-list-buy-item" :style="{
              '--precent': Number(item.percent) || 0
            }">
              <span class="order-list-buy-item-price">{{ Number(item.price_range) }}</span>
              <span class="order-list-buy-item-amount">{{ Number(item.total_remain_amount) }}</span>
            </div>
          </el-tooltip>
        </div>
      </div>
      <div v-if="activeName === 'order-deal-latest'" class="order-list-content">
        <el-tooltip
            class="box-item"
            effect="dark"
            raw-content
            :content="`单价: ${Number(item.trade_price)} <br> 数量: ${Number(item.trade_amount)}`"
            placement="left-start"
            v-for="(item, index) in orderDealLatest"
        >
          <div class="order-deal-latest-item">
            <span class="order-deal-latest-item-price">{{Number(item.trade_price)}}</span>
            <span class="order-deal-latest-item-amount">{{Number(item.trade_amount)}}</span>
            <span class="order-deal-latest-item-time">{{dayjs(Number(item.trade_time)).format('HH:mm:ss')}}</span>
          </div>
        </el-tooltip>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  useOrderGroupGapRef,
  useOrderListBuyNumberRef,
  useOrderListSellNumberRef,
  usePairNameListRef,
  usePairPriceRef, useTradeListRef
} from "@/composition/exchange/order.js";
import dayjs from "dayjs";
import {getTradeSocketData, StopPriceSocket} from "@/websocket/Socket/TradeSocket.js";

const coinPair = usePairNameListRef();
const orderGroupGap = useOrderGroupGapRef();
const orderListBuy = useOrderListBuyNumberRef(7);
const orderListSell = useOrderListSellNumberRef(7);
const orderPairPrice = usePairPriceRef();
const orderDealLatest = useTradeListRef();


const activeName = ref('order-list');
const tabClick = (name) => {
  activeName.value = name;
  if(name !== 'order-deal-latest') {
    StopPriceSocket(coinPair.value.join('-'));
  }
  if(name === 'order-deal-latest') {
    getTradeSocketData(coinPair.value.join('-'));
  }
}
const tabBeforeLeave = (name, oldName) => {
  console.log(name, oldName, 'tabBeforeLeave')
}

// 页面销毁时，关闭socket
onBeforeUnmount(() => {
  StopPriceSocket(coinPair.value.join('-'));
})
</script>

<style scoped lang="scss">
.my-order-list {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  padding: 0 10px;
  min-width: 150px;
  background-color: var(--exchange-main-bg);
  color: var(--color-dashboard-white);
  overflow: hidden;

  .order-list-tabs {
    margin-top: 10px;
    width: 100%;

    :deep(.el-tabs__header) {
      margin-bottom: 0;
    }

    :deep(.el-tabs__active-bar) {
      background-color: var(--color-dashboard-white);
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

  .order-list-container {
    padding-top: 10px;
    width: 100%;
    flex: 1;
    display: flex;
    flex-direction: column;

    .order-list-title {
      display: flex;
      flex-direction: row;
      align-items: center;
      margin-top: 10px;

      span {
        flex: 1;
        text-align: right;
        color: var(--color-mobile-grey-3);
        font-size: 14px;
      }

      .order-list-title-price {
        text-align: left;
      }
    }

    .order-list-content {
      display: flex;
      flex-direction: column;
      flex: 1;
      font-size: 14px;

      .order-list-buy {
        display: flex;
        flex-direction: column;

        .order-list-buy-item {
          position: relative;
          display: flex;
          flex-direction: row;
          align-items: center;
          margin-top: 10px;
          //z-index: 2;
          span {
            flex: 1;
            text-align: right;
            z-index: 2;

            &:first-child {
              text-align: left;
            }
          }

          &::before {
            content: "";
            position: absolute;
            right: 0;
            top: 0;
            bottom: 0;
            width: calc(var(--precent) * 100%);
            background-color: #d22959;
            z-index: 1;
          }
          &:hover {
            // 白色虚线
            border: 1px dashed var(--color-dashboard-white) ;
          }
        }
      }

      .order-list-price-now {
        display: flex;
        flex-direction: row;
        align-items: center;
        width: 100%;
        height: 40px;
        color: red;
        font-size: 20px;
      }

      .order-list-sell {
        display: flex;
        flex-direction: column;

        .order-list-sell-item {
          position: relative;
          display: flex;
          flex-direction: row;
          align-items: center;
          margin-top: 10px;
          //z-index: 2;
          span {
            flex: 1;
            text-align: right;
            z-index: 2;

            &:first-child {
              text-align: left;
            }
          }

          &::before {
            content: "";
            position: absolute;
            right: 0;
            top: 0;
            bottom: 0;
            width: calc(var(--precent) * 100%);
            background-color: #216938;
            z-index: 1;
          }
          &:hover {
            // 白色虚线
            border: 1px dashed var(--color-dashboard-white) ;
          }
        }
      }

      .order-deal-latest-item {
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-top: 10px;
        span {
          flex: 1;
          text-align: right;
          z-index: 2;

          &:first-child {
            text-align: left;
          }
        }
        &:hover {
          // 白色虚线
          border: 1px dashed var(--color-dashboard-white) ;
        }
      }
    }
  }
}

</style>
