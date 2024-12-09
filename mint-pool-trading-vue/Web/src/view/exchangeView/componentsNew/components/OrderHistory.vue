<script setup>
import {onMounted, onUnmounted, ref} from 'vue';
import {
  useCancelOrder,
  useUpdateUserOrderList,
  useUserOrderFinishListRef,
  useUserOrderListRef
} from "@/composition/exchange/order.js";
import dayjs from "dayjs";
import SafeCalc from "@/utils/bignumberjs.js";
import config from "@/config/api.js";
import {elTip} from "@/utils/index.js";
import {useInitUserAssets} from "@/composition/exchange/asset.js";

const props = defineProps({
  showType: {
    type: String,
    required: true,
    validator: (value) => ['current', 'history'].includes(value)
  }
});

const isMobile = ref(false);
let mediaQuery;
let handleResize;

const userTradeList = useUserOrderFinishListRef();
const userOrderList = useUserOrderListRef();
const userOrderListData = computed(() => {
  if(props.showType === 'history') {
    let pair = userTradeList.value[0]?.order_currency_pair.replace('-', '/');
    let coins = userTradeList.value[0]?.order_currency_pair.split('-');
    return userTradeList.value.map(trade => {
      return {
        order_currency_pair: pair,
        order_time: dayjs(Number(trade.order_time)).format('YYYY-MM-DD HH:mm:ss'),
        order_type: Number(trade.order_type) % 2 === 0 ? '买入' : '卖出',
        order_price: Number(Number(trade.trade_avg_price).toFixed(8)),
        order_amount: Number(trade.trade_amount),
        order_fee: `${Number(trade.trade_fee)} ${Number(trade.order_type) % 2 === 0 ? coins[0] : coins[1]}`,
        order_id: config.ORDER_ID_PREFIX + trade.id,
        real_order_id: trade.id,
      }
    });
  }
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
      order_fee: 0,
      trade_avg_price: Number(order.trade_avg_price),
      real_order_id: order.id,
    }
  });
});
onMounted(() => {
  console.log('OrderHistory mounted')
  mediaQuery = window.matchMedia('(max-width: 768px)');
  isMobile.value = mediaQuery.matches;
  
  handleResize = (e) => {
    isMobile.value = e.matches;
  };
  
  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener('change', handleResize);
  } else if (mediaQuery.addListener) {
    mediaQuery.addListener(handleResize);
  }
});

onUnmounted(() => {
  if (mediaQuery && handleResize) {
    if (mediaQuery.removeEventListener) {
      mediaQuery.removeEventListener('change', handleResize);
    } else if (mediaQuery.removeListener) {
      mediaQuery.removeListener(handleResize);
    }
  }
});

const cancelOrder = async (orderId) => {
  let result = await useCancelOrder(orderId);
  if (result) {
    // 更新余额数据
    await useInitUserAssets();
    // 更新当前委托
    await useUpdateUserOrderList();
    return elTip('撤单成功');
  }
  return elTip('撤单失败', 'error');
};

const viewDetails = (orderId) => {
  console.log('Viewing details for order:', orderId);
};

const getStatusText = (status) => {
  return {
    'pending': '待成交',
    'partial': '部分成交',
    'completed': '已完成',
    'canceled': '已取消'
  }[status];
};

const getStatusClass = (status) => {
  return {
    'pending': 'text-yellow-500',
    'partial': 'text-blue-500',
    'completed': 'text-green-500',
    'canceled': 'text-gray-500'
  }[status];
};
</script>

<template>
  <div class="overflow-x-auto">
    <table class="w-full text-sm">
      <thead>
        <tr class="text-gray-400">
          <template v-if="!isMobile">
            <th class="text-left py-3 px-4 font-medium">时间</th>
            <th class="text-left py-3 px-4 font-medium">交易对</th>
            <th class="text-left py-3 px-4 font-medium">方向</th>
            <th class="text-right py-3 px-4 font-medium">价格</th>
            <th class="text-right py-3 px-4 font-medium">数量</th>
            <th class="text-right py-3 px-4 font-medium" v-if="showType === 'current'">已成交</th>
            <th class="text-right py-3 px-4 font-medium" v-if="showType === 'history'">手续费</th>
            <th class="text-left py-3 px-4 font-medium">订单编号</th>
            <th class="text-right py-3 px-4 font-medium">操作</th>
          </template>
          <template v-else>
            <th class="text-left py-3 px-4 font-medium">交易对</th>
            <th class="text-right py-3 px-4 font-medium">价格</th>
            <th class="text-right py-3 px-4 font-medium">数量</th>
          </template>
        </tr>
      </thead>
      <tbody class="text-white">
        <tr v-if="userOrderListData.length === 0" class="border-t border-gray-700">
          <td :colspan="isMobile ? (showType === 'current' ? 4 : 3) : (showType === 'current' ? 10 : 9)" class="text-center py-8 text-gray-400">
            暂无{{ showType === 'current' ? '当前委托' : '历史委托' }}记录
          </td>
        </tr>
        <tr v-for="order in userOrderListData"
            :key="order?.order_id"
            class="border-t border-gray-700 hover:bg-gray-800/50 transition-colors">
          <template v-if="!isMobile">
            <td class="py-3 px-4">{{ order.order_time }}</td>
            <td class="py-3 px-4">{{ order.order_currency_pair }}</td>
            <td class="py-3 px-4"
                :class="order.order_type === '买入' ? 'text-trading-green' : 'text-trading-red'">
              {{ order.order_type }}
            </td>
            <td class="text-right py-3 px-4">{{ order.order_price }}</td>
            <td class="text-right py-3 px-4">{{ order.order_amount }}</td>
            <td class="text-right py-3 px-4" v-if="showType === 'current'">{{ order.order_completed_amount }}</td>
            <td class="text-right py-3 px-4" v-if="showType === 'history'">{{ order.order_fee }}</td>
            <td class="py-3 px-4 font-mono text-xs">{{ order.order_id }}</td>
            <td class="text-right py-3 px-4">
              <template v-if="showType === 'current'">
                <button
                    v-if="order.status !== 'completed'"
                    @click="cancelOrder(order.real_order_id)"
                    class="px-3 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors"
                >
                  撤销
                </button>
              </template>
              <template v-else>
                <button
                    @click="viewDetails(order.order_id)"
                    class="px-3 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors"
                >
                  详情
                </button>
              </template>
            </td>
          </template>
          <template v-else>
            <td class="py-3 px-4">{{ order.order_currency_pair }}</td>
            <td class="text-right py-3 px-4">{{ order.order_price }}</td>
            <td class="text-right py-3 px-4">{{ order.order_amount }}</td>
          </template>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.overflow-x-auto {
  -webkit-overflow-scrolling: touch;
}

.overflow-x-auto::-webkit-scrollbar {
  height: 6px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: #1E222D;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #4A4A4A;
  border-radius: 3px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>

<style scoped lang="scss">
@import "@/styles/tailwind/exchange";
</style>