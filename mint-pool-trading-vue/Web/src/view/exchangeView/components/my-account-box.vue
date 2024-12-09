<template>
  <div class="my-account-box">
    <el-tabs v-model="myAccountBoxTab" class="my-account-box-tabs" @tab-change="tabClick">
      <el-tab-pane label="当前委托" name="account-current-orders"/>
      <el-tab-pane label="历史委托" name="account-history-orders"/>
      <el-tab-pane label="我的资产" name="account-assets"/>
    </el-tabs>
    <my-table
        title="1"
        class="my-account-box-table"
        :table-data="userOrderListData"
        :table-header="currentOrdersTableHeader"
        :action-column="actionColumn"
        v-show="myAccountBoxTab === 'account-current-orders'"
        :row-class-name-fn="rowClassNameFn_UserOrderList"
    >
      <template v-slot:default="scope">
        <el-popconfirm
            width="220"
            confirm-button-text="确定"
            cancel-button-text="取消"
            :icon="RemoveFilled"
            icon-color="red"
            title="确定要同意该提币请求吗?"
            @confirm="cancelOrder(scope.$index, scope.row)"
        >
          <template #reference>
            <el-button class="table-action-btn">撤销</el-button>
          </template>
        </el-popconfirm>
      </template>
    </my-table>
    <my-table
        title="2"
        class="my-account-box-table"
        :table-data="userTradeListData"
        :table-header="userTradeTableHeader"
        :action-column="actionColumn"
        v-if="myAccountBoxTab === 'account-history-orders'"
        :row-class-name-fn="rowClassNameFn_UserOrderList"
        :on-infinite-scroll="useUpdateUserOrderFinishList"
    >
      <el-button class="table-action-btn">查看详情</el-button>
    </my-table>
    <my-table
        title="3"
        class="my-account-box-table"
        :table-data="tableData"
        :table-header="tableHeader"
        :action-column="actionColumn"
        v-if="myAccountBoxTab === 'account-assets'"
        :row-class-name-fn="rowClassNameFn"
    >
      <el-button class="table-action-btn">充币</el-button>
    </my-table>
  </div>
</template>

<script setup>
import MyTable from "@/components/my-components/my-table.vue";
import {useUserAssetsList} from "@/composition/exchange/asset.js";
import {
  useCancelOrder,
  useUserOrderListRef,
  useUserOrderFinishListRef,
  useUpdateUserOrderFinishList
} from "@/composition/exchange/order.js";
import dayjs from "dayjs";
import SafeCalc from "@/utils/bignumberjs.js";
import config from "@/config/api.js";
import {elTip} from "@/utils/index.js";
import {RemoveFilled} from "@element-plus/icons-vue";

const myAccountBoxTab = ref('account-current-orders');
function tabClick(tabName) {
  myAccountBoxTab.value = tabName;
}
const tableData = useUserAssetsList();
const tableHeader = [
  {
    prop: 'currency',
    label: '资产',
    width: 200
  },
  {
    prop: 'balance',
    label: '余额',
  },
];
const actionColumn = {
  label: '操作',
  width: 180,
}
const rowClassNameFn = (rowData) => {
  const {row, rowIndex} = rowData;
  if (rowIndex % 2 === 0) {
    return 'table-row-odd';
  } else {
    return 'table-row-even';
  }
};

const userOrderList = useUserOrderListRef();
const userOrderListData = computed(() => {
  let pair = userOrderList.value[0]?.order_currency_pair.replace('-', '/');
  return userOrderList.value.map(order => {
    return {
      order_currency_pair: pair,
      order_time: dayjs(Number(order.order_time)).format('YYYY-MM-DD HH:mm:ss'),
      order_type: Number(order.order_type) % 2 === 0 ? '买入' : '卖出',
      order_price: Number(order.order_type) > 1 ? '--' : Number(order.order_price),
      order_amount: Number(order.order_type) > 1 ? '--' : Number(order.order_amount),
      order_completed_amount: Number(order.order_type) > 1 ? '--' : Number(SafeCalc.sub(order.order_amount, order.order_remain_amount)),
      order_id: config.ORDER_ID_PREFIX + order.id,
      trade_avg_price: Number(order.trade_avg_price),
      real_order_id: order.id,
    }
  });
});
const currentOrdersTableHeader = [
  {
    prop: 'order_currency_pair',
    label: '交易类别',
    width: 120
  },
  {
    prop: 'order_time',
    label: '委托时间',
    width: 180
  },
  {
    prop: 'order_type',
    label: '委托方向',
    width: 80
  },
  {
    prop: 'order_price',
    label: '委托价格',
    width: 120
  },
  {
    prop: 'order_amount',
    label: '委托数量',
    width: 120
  },
  {
    prop: 'order_completed_amount',
    label: '成交数量',
    width: 120
  },
  {
    prop: 'trade_avg_price',
    label: '成交均价',
    width: 120
  },
  {
    prop: 'order_id',
    label: '订单编号',
  },
];
const rowClassNameFn_UserOrderList = (rowData) => {
  const {row, rowIndex} = rowData;
  if (row.order_type === '买入' || row.trade_type === '买入') {
    return 'table-row-order-buy';
  } else {
    return 'table-row-order-sell';
  }
};
// 取消订单
const cancelOrder = async (index, row) => {
  console.log('cancelOrder', index, row);
  let result = await useCancelOrder(row.real_order_id);
  if (result) {
    return elTip('撤单成功');
  }
  return elTip('撤单失败', 'error');
};

const userTradeList = useUserOrderFinishListRef();
const userTradeListData = computed(() => {
  let pair = userTradeList.value[0]?.order_currency_pair.replace('-', '/');
  let coins = userTradeList.value[0]?.order_currency_pair.split('-');
  return userTradeList.value.map(trade => {
    return {
      trade_currency_pair: pair,
      trade_time: dayjs(Number(trade.order_time)).format('YYYY-MM-DD HH:mm:ss'),
      trade_type: Number(trade.order_type) % 2 === 0 ? '买入' : '卖出',
      trade_price: Number(Number(trade.trade_avg_price).toFixed(8)),
      trade_amount: Number(trade.trade_amount),
      trade_fee: `${Number(trade.trade_fee)} ${Number(trade.order_type) % 2 === 0 ? coins[0]  : coins[1]}`,
      trade_id: config.ORDER_ID_PREFIX + trade.id,
      real_order_id: trade.id,
    }
  });
});
const userTradeTableHeader = [
  {
    prop: 'trade_currency_pair',
    label: '交易类别',
    width: 120
  },
  {
    prop: 'trade_time',
    label: '成交时间',
    width: 180
  },
  {
    prop: 'trade_type',
    label: '成交方向',
    width: 80
  },
  {
    prop: 'trade_price',
    label: '成交价格',
    width: 120
  },
  {
    prop: 'trade_amount',
    label: '成交数量',
    width: 120
  },
  {
    prop: 'trade_fee',
    label: '手续费',
    width: 120
  },
  {
    prop: 'trade_id',
    label: '订单编号',
  },
];
</script>

<style scoped lang="scss">
.my-account-box {
  width: 100%;
  height: 100%;
  padding-left: 10px !important;

  .my-account-box-tabs {
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

  .my-account-box-table {
    flex: 1;

    .table-action-btn {
      background-color: var(--exchange-grey);
      border-radius: 16px;
      outline: 0;
      border: 0;
      color: var(--color-dashboard-white);

      &:hover {
        background-color: var(--exchange-grey-highlight);
      }
    }
  }

  :deep(.table-row-odd) {
    background-color: var(--exchange-grey);
  }

  :deep(.table-row-even) {
    background-color: var(--exchange-grey-highlight);
  }


  :deep(.table-row-order-buy) {
    color: var(--exchange-buy-color);
  }

  :deep(.table-row-order-sell) {
    color: var(--exchange-sell-color);
  }
}

</style>
