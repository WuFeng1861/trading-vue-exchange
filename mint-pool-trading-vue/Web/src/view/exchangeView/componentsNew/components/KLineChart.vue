<script setup>
import * as echarts from 'echarts';
import {useKLineDataList} from "@/composition/exchange/Types/kLineDataTypes.js";
import {usePairNameListRef, usePairPriceRef} from "@/composition/exchange/order.js";
import {useKlineDataYRef, useKlineTypeRef, useUpdateKLineType} from "@/composition/exchange/kLineData.js";

const chartRef = ref(null);
const chart = ref(null);
const isMobile = ref(false);

const coinList = usePairNameListRef();
const currentPrice = usePairPriceRef();
const selectedPeriod = useKlineTypeRef();
const historicalData = useKlineDataYRef();


// 时间周期列表
const periods = useKLineDataList();

const getChartOptions = (start=0, end=100, isInit=false) => {
  const data = historicalData.value.map(item => ({
    time: item.time,
    values: [item.open, item.close, item.low, item.high],
    volume: item.volume
  }));
  if (isInit) {
    if(data.length > 30) {
      start = Math.floor((data.length - 30)/data.length*100) ;
      end = 100;
    }
  }

  console.log(start, end, 'getChartOptions', isInit, data.length);

  // const option = {
  //   backgroundColor: '#1E222D',
  //   animation: false,
  //   tooltip: {
  //     trigger: 'axis',
  //     axisPointer: {
  //       type: 'cross'
  //     },
  //     backgroundColor: '#13151A',
  //     borderColor: '#2B2B43',
  //     borderWidth: 1,
  //     textStyle: {
  //       color: '#DDD',
  //     },
  //     formatter: function (params) {
  //       const candlestickData = params.find(param => param.seriesName === 'K线');
  //       const volumeData = params.find(param => param.seriesName === '成交量');
  //
  //       if (!candlestickData) return '';
  //
  //       const values = candlestickData.data.values;
  //       return `
  //         <div style="font-size: 12px">
  //           <div>时间：${candlestickData.data.time}</div>
  //           <div>开盘价：${values[0]}</div>
  //           <div>收盘价：${values[1]}</div>
  //           <div>最低价：${values[2]}</div>
  //           <div>最高价：${values[3]}</div>
  //           <div>成交量：${volumeData ? volumeData.data.volume : ''}</div>
  //         </div>
  //       `;
  //     }
  //   },
  //   axisPointer: {
  //     link: {xAxisIndex: 'all'},
  //     label: {
  //       backgroundColor: '#777'
  //     }
  //   },
  //   grid: [{
  //     left: '4%',
  //     right: '4%',
  //     height: '60%'
  //   }, {
  //     left: '4%',
  //     right: '4%',
  //     top: '75%',
  //     height: '15%'
  //   }],
  //   xAxis: [{
  //     type: 'category',
  //     data: data.map(item => item.time),
  //     scale: true,
  //     boundaryGap: false,
  //     axisLine: {lineStyle: {color: '#2B2B43'}},
  //     splitLine: {show: false},
  //     min: 'dataMin',
  //     max: 'dataMax',
  //     axisLabel: {
  //       color: '#DDD',
  //       formatter: (value) => value.substring(5)
  //     }
  //   }, {
  //     type: 'category',
  //     gridIndex: 1,
  //     data: data.map(item => item.time),
  //     scale: true,
  //     boundaryGap: false,
  //     axisLine: {lineStyle: {color: '#2B2B43'}},
  //     axisTick: {show: false},
  //     splitLine: {show: false},
  //     axisLabel: {show: false},
  //     min: 'dataMin',
  //     max: 'dataMax'
  //   }],
  //   yAxis: [{
  //     scale: true,
  //     splitNumber: 6,
  //     axisLine: {lineStyle: {color: '#2B2B43'}},
  //     splitLine: {lineStyle: {color: '#2B2B43'}},
  //     axisLabel: {
  //       color: '#DDD',
  //       formatter: (value) => value.toFixed(4)
  //     }
  //   }, {
  //     scale: true,
  //     gridIndex: 1,
  //     splitNumber: 2,
  //     axisLine: {lineStyle: {color: '#2B2B43'}},
  //     axisTick: {show: false},
  //     splitLine: {show: false},
  //     axisLabel: {show: false}
  //   }],
  //   dataZoom: [{
  //     type: 'inside',
  //     xAxisIndex: [0, 1],
  //     start: start,
  //     end: end,
  //   }],
  //   series: [{
  //     name: 'K线',
  //     type: 'candlestick',
  //     data: data.map(item => ({
  //       time: item.time,
  //       values: item.values,
  //       value: item.values
  //     })),
  //     itemStyle: {
  //       color: '#ef5350',
  //       color0: '#26a69a',
  //       borderColor: '#ef5350',
  //       borderColor0: '#26a69a'
  //     }
  //   }, {
  //     name: '成交量',
  //     type: 'bar',
  //     xAxisIndex: 1,
  //     yAxisIndex: 1,
  //     data: data.map(item => ({
  //       time: item.time,
  //       volume: item.volume,
  //       value: item.volume,
  //       itemStyle: {
  //         color: item.values[1] >= item.values[0] ? '#26a69a' : '#ef5350'
  //       }
  //     }))
  //   }]
  // };
  const option = {
    backgroundColor: '#1E222D',
    animation: false,
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      },
      backgroundColor: '#13151A',
      borderColor: '#2B2B43',
      borderWidth: 1,
      textStyle: {
        color: '#DDD',
      },
      formatter: function (params) {
        const candlestickData = params.find(param => param.seriesName === 'K线');
        const volumeData = params.find(param => param.seriesName === '成交量');

        if (!candlestickData) return '';

        const values = candlestickData.data.values;
        return `
          <div style="font-size: 12px">
            <div>时间：${candlestickData.data.time}</div>
            <div>开盘价：${values[0]}</div>
            <div>收盘价：${values[1]}</div>
            <div>最低价：${values[2]}</div>
            <div>最高价：${values[3]}</div>
            <div>成交量：${volumeData ? volumeData.data.volume : ''}</div>
          </div>
        `;
      }
    },
    axisPointer: {
      link: { xAxisIndex: 'all' },
      label: {
        backgroundColor: '#777'
      }
    },
    grid: isMobile.value ? [{
      left: '10%',
      right: '4%',
      top: '5%',
      bottom: '15%'
    }] : [{
      left: '6%',
      right: '4%',
      height: '60%'
    }, {
      left: '6%',
      right: '4%',
      top: '75%',
      height: '15%'
    }],
    xAxis: isMobile.value ? [{
      type: 'category',
      data: data.map(item => item.time),
      scale: true,
      boundaryGap: false,
      axisLine: { lineStyle: { color: '#2B2B43' } },
      splitLine: { show: false },
      min: 'dataMin',
      max: 'dataMax',
      axisLabel: {
        color: '#DDD',
        formatter: (value) => value.substring(5)
      }
    }] : [{
      type: 'category',
      data: data.map(item => item.time),
      scale: true,
      boundaryGap: false,
      axisLine: { lineStyle: { color: '#2B2B43' } },
      splitLine: { show: false },
      min: 'dataMin',
      max: 'dataMax',
      axisLabel: {
        color: '#DDD',
        formatter: (value) => value.substring(5)
      }
    }, {
      type: 'category',
      gridIndex: 1,
      data: data.map(item => item.time),
      scale: true,
      boundaryGap: false,
      axisLine: { lineStyle: { color: '#2B2B43' } },
      axisTick: { show: false },
      splitLine: { show: false },
      axisLabel: { show: false },
      min: 'dataMin',
      max: 'dataMax'
    }],
    yAxis: isMobile.value ? [{
      scale: true,
      splitNumber: 6,
      axisLine: { lineStyle: { color: '#2B2B43' } },
      splitLine: { lineStyle: { color: '#2B2B43' } },
      axisLabel: {
        color: '#DDD',
        formatter: (value) => value
      }
    }] : [{
      scale: true,
      splitNumber: 6,
      axisLine: { lineStyle: { color: '#2B2B43' } },
      splitLine: { lineStyle: { color: '#2B2B43' } },
      axisLabel: {
        color: '#DDD',
        formatter: (value) => value
      }
    }, {
      scale: true,
      gridIndex: 1,
      splitNumber: 2,
      axisLine: { lineStyle: { color: '#2B2B43' } },
      axisTick: { show: false },
      splitLine: { show: false },
      axisLabel: { show: false }
    }],
    dataZoom: [{
      type: 'inside',
      xAxisIndex: isMobile.value ? [0] : [0, 1],
      start: start,
      end: end,
    }],
    series: isMobile.value ? [{
      name: 'K线',
      type: 'candlestick',
      data: data.map(item => ({
        time: item.time,
        values: item.values,
        value: item.values
      })),
      itemStyle: {
        color: '#ef5350',
        color0: '#26a69a',
        borderColor: '#ef5350',
        borderColor0: '#26a69a'
      }
    }] : [{
      name: 'K线',
      type: 'candlestick',
      data: data.map(item => ({
        time: item.time,
        values: item.values,
        value: item.values
      })),
      itemStyle: {
        color: '#ef5350',
        color0: '#26a69a',
        borderColor: '#ef5350',
        borderColor0: '#26a69a'
      }
    }, {
      name: '成交量',
      type: 'bar',
      xAxisIndex: 1,
      yAxisIndex: 1,
      data: data.map(item => ({
        time: item.time,
        volume: item.volume,
        value: item.volume,
        itemStyle: {
          color: item.values[1] >= item.values[0] ? '#26a69a' : '#ef5350'
        }
      }))
    }]
  };
  return option;
}

const initChart = () => {
  if (!chartRef.value) return;

  const mediaQuery = window.matchMedia('(max-width: 768px)');
  isMobile.value = mediaQuery.matches;

  if (chart.value) {
    chart.value.dispose();
  }

  chart.value = markRaw(echarts.init(chartRef.value));

  chart.value.setOption(getChartOptions(0, 100,true));
};

const updateChart = (start=0, end=100, isInit=false) => {
  if (!chart.value) return;
  chart.value.setOption(getChartOptions(start, end, isInit));
}

// watch historicalData =>updateChart
watch(historicalData, (_, oldValue) => {
  if (!chart.value) return;
  if(oldValue.length === 0) {
    updateChart(0, 100, true);
    return;
  }
  let {start, end} = chart.value.getOption().dataZoom[0];
  console.log(start, end, 'watch');
  updateChart(start, end);
})

const handleResize = () => {
  if (!chartRef.value || !chart.value) return;

  const mediaQuery = window.matchMedia('(max-width: 768px)');
  const newIsMobile = mediaQuery.matches;

  // 如果移动端状态发生变化，需要重新初始化图表
  if (newIsMobile !== isMobile.value) {
    isMobile.value = newIsMobile;
    nextTick(() => {
      initChart();
    });
    return;
  }

  chart.value.resize();
};

// 切换时间周期
const changePeriod = (period) => {
  selectedPeriod.value = period;
  useUpdateKLineType(period);
  updateChart(0, 100, true);
};

onMounted(() => {
  nextTick(() => {
    initChart();
    window.addEventListener('resize', handleResize);
  });
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  if (chart.value) {
    chart.value.dispose();
  }
});
</script>

<template>
  <div class="bg-trading-dark rounded-lg p-6">
    <div class="mb-4 pb-4 border-b border-gray-700">
      <div class="flex justify-between items-center flex-wrap gap-4">
        <span class="text-2xl font-bold"
              :class="currentPrice > historicalData[historicalData.length - 1]?.open ? 'text-trading-green' : 'text-trading-red'">
          {{coinList && coinList[0] }}
        </span>
        <div class="w-full lg:w-auto overflow-x-auto whitespace-nowrap pb-2 lg:pb-0">
          <div class="inline-flex space-x-2">
            <button
                v-for="period in periods"
                :key="period.value"
                @click="changePeriod(period.value)"
                class="px-3 py-1 rounded text-sm transition-colors"
                :class="[
                selectedPeriod === period.value
                  ? 'bg-trading-green text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              ]"
            >
              {{ period.label }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="relative">
      <div
          ref="chartRef"
          class="rounded-lg overflow-hidden"
          :style="{ height: isMobile ? '250px' : '500px' }"
      ></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "@/styles/tailwind/exchange";
/* 移动端滚动优化 */
.whitespace-nowrap {
  -webkit-overflow-scrolling: touch;
}

/* 隐藏滚动条但保持功能 */
.whitespace-nowrap::-webkit-scrollbar {
  display: none;
}
</style>