<template>
  <div id="echarts-bar" class="barCharts" ref="echartsDom">
  </div>
</template>

<script setup>
import * as echarts from "echarts";
import bus from "@/bus/mitt.js";
import {getThemeColor, getThemeColor2} from "@/styles/theme/index.js";

const props = defineProps(['xdata', 'ydata1', 'ydata2']);
const {xdata, ydata1, ydata2} = toRefs(props);

const echartsDom = ref(null);
let myChartRef = null;

let option = () => {
  const screenWidth = window.innerWidth;
  let isMobile = screenWidth <= 768;
  return {
    color: [getThemeColor(), getThemeColor2()],
    // 标题
    title: {
      text: '收益统计',
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
      data: ['收益', '税收'],
      textStyle: {
        color: '#fff'  // 设置 legend 文字颜色
      }
    },
    // 位置
    grid: {
      left: isMobile?'18%':'8%',
      right: isMobile?'14%':'8%',
      bottom: '15%',
      containLabel: false, // 刻度标签
    },
    // x轴
    xAxis: {
      name: '时间',
      type: 'category',
      boundaryGap: true, // 与边轴是否有间隙
      data: xdata.value,
    },
    // y轴
    yAxis: {
      name: '金额',
      type: 'value',
      axisLine: {
        show: false // 隐藏 y 轴线
      },
      splitLine: {
        show: false
      }
    },
    // 数据
    series: [
      {
        name: '收益',
        type: 'bar',
        data: ydata1.value,
        lineStyle: {
          color: getThemeColor() // 设置线的颜色
        },
        label: {
          show: true, // 显示标签
          position: 'top', // 在顶部显示标签
          valueAnimation: true, // 开启标签数值的动画效果
          formatter: function (params) {
            // 判断数据值是否为0，如果是则不显示标签
            if (params.value.toString() === '0') {
              return '';
            }
            return params.value; // 显示非0数据的标签
          },
          textStyle: {
            color: getThemeColor() // 设置 label 的文本颜色为红色
          },
        },
        labelLayout: {
          hideOverlap: true,  // 设置hideOverlap为true
          // moveOverlap: 'shiftY', // 设置moveOverlap为shiftY
        },
      },
      {
        name: '税收',
        type: 'bar',
        data: ydata2.value,
        lineStyle: {
          color: '#fff' // 设置线的颜色
        },
        label: {
          show: true, // 显示标签
          position: 'top', // 在顶部显示标签
          valueAnimation: true, // 开启标签数值的动画效果
          formatter: function (params) {
            // 判断数据值是否为0，如果是则不显示标签
            if (params.value.toString() === '0') {
              return '';
            }
            return params.value; // 显示非0数据的标签
          },
          textStyle: {
            color: getThemeColor2() // 设置 label 的文本颜色为红色
          },
        },
        labelLayout: {
          hideOverlap: true,  // 设置hideOverlap为true
          // moveOverlap: 'shiftY', // 设置moveOverlap为shiftY
        },
      },
    ]
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
      myChartRef && myChartRef.setOption(option());
      myChartRef && myChartRef.resize();
    }, 100)
  })
})
// 数据变化监控
watch([() => xdata.value, () => ydata1.value, () => ydata2.value], () => {
  // console.log(2, xdata, ydata1, ydata2)
  myChartRef && myChartRef.setOption(option());
}, {immediate: true, deep: true});

</script>

<style scoped lang="scss">
</style>
