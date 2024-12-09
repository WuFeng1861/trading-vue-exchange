<template>
  <div id="echarts-line" class="lineCharts" ref="echartsDom">
  </div>
</template>

<script setup>
import * as echarts from "echarts";
import bus from "@/bus/mitt.js";
import {getThemeColor, getThemeColor2} from "@/styles/theme/index.js";

const props = defineProps(['xdata', 'ydata', 'title', 'xname', 'yname', 'showLabel']);
const { xdata, ydata, title, xname, yname, showLabel } = toRefs(props);

const echartsDom = ref(null);
let myChartRef = null;

let option = () => {
  const series = [{
    name: yname.value,
    type: 'line',
    data: ydata.value,
    lineStyle: {
      color: getThemeColor() // 设置线的颜色
    },
    label: {
      show: showLabel.value, // 显示标签
      position: 'top', // 在顶部显示标签
      textStyle: {
        color: getThemeColor() // 设置 label 的文本颜色为红色
      }
    },
    itemStyle: {
      color: getThemeColor2() // 设置点的颜色为红色
    }
  }];

  return {
    // 标题
    title: {
      text: title.value,
      textStyle: {
        //文字颜色
        color: '#fff',
      }
    },
    // 提示框
    tooltip: {
      tigger: 'axis',
    },
    //
    legend: {
      // data: ['收益', '税收'],
      textStyle: {
        color: '#fff'  // 设置 legend 文字颜色
      }
    },
    // 位置
    grid: {
      left: '10%',
      right: '10%',
      bottom: '15%',
      containLabel: false, // 刻度标签
    },
    // x轴
    xAxis: {
      name: xname.value,
      type: 'category',
      boundaryGap: true, // 与边轴是否有间隙
      data: xdata.value,
    },
    // y轴
    yAxis: {
      name: yname.value,
      type: 'value',
      axisLine: {
        show: false // 隐藏 y 轴线
      },
      splitLine: {
        show: false
      }
    },
    // 数据
    series: series
  }
}

// 初始化
onMounted(() => {
  myChartRef = echarts.init(echartsDom.value);
  myChartRef && myChartRef.setOption(option());
  let timer = null;
  bus.$on('resizeWindow', () => {
    timer && clearTimeout(timer);
    timer = setTimeout(() => {
      myChartRef && myChartRef.resize();
    }, 100)
  })
})
// 数据变化监控
watch([() => xdata.value, () => ydata.value], () => {
  myChartRef && myChartRef.setOption(option());
}, {immediate: true, deep: true});

</script>

<style scoped lang="scss">
</style>
