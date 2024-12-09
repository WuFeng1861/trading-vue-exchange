<template>
  <div class="my-exchange-header">
    <img src="@/assets/startMintLogo.png" alt="logo" class="my-exchange-header__logo" />
    <div class="my-exchange-header__title">
      <h1>MERC</h1>
    </div>
    <el-divider direction="vertical" style="margin-right: 10px; border-color: var(--exchange-grey-highlight)"/>
    <el-dropdown>
      <span class="el-dropdown-link">
        币币交易
        <el-icon class="el-icon--right">
          <arrow-down />
        </el-icon>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item>Action 1</el-dropdown-item>
          <el-dropdown-item>Action 2</el-dropdown-item>
          <el-dropdown-item>Action 3</el-dropdown-item>
          <el-dropdown-item disabled>Action 4</el-dropdown-item>
          <el-dropdown-item divided>Action 5</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <el-dropdown>
      <span class="el-dropdown-link">
        充币/提币
        <el-icon class="el-icon--right">
          <arrow-down />
        </el-icon>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item>充币</el-dropdown-item>
          <el-dropdown-item>提币</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <div style="flex: 1"/>
    <my-radio :btn-list="myRadioBtnList" @change="myRadioBtnChange"/>
  </div>
</template>

<script setup>
import MyRadio from "@/components/my-components/my-radio.vue";
import {routerTo} from "@/utils/index.js";
import {ArrowDown} from "@element-plus/icons-vue";
const myRadioBtnList = ref([
  {
    value: '交易所',
    label: '交易所'
  },
  {
    value: '返回钱包',
    label: '返回钱包'
  },
  {
    value: '返回首页',
    label: '返回首页'
  }
]);
const myRadioBtnChange = (value) => {
  if(value.value === '返回钱包') {
    // 跳转到钱包页面
    routerTo('asset')
  }
  if(value.value === '返回首页') {
    // 跳转到首页
    routerTo('dashboard')
  }
};
onMounted(() => {
  // 屏幕宽度大于768时，隐藏返回钱包选项
  if(window.innerWidth > 768) {
    myRadioBtnList.value = myRadioBtnList.value.filter(item => item.value!== '返回钱包');
  }
});
</script>

<style scoped lang="scss">
$height-header: 50px;
.my-exchange-header {
  width: 100%;
  height: $height-header;
  min-height: $height-header;
  max-height: $height-header;
  display: flex;
  align-items: center;
  overflow: hidden;
  padding: 10px 10px 0;
  background-color: var(--exchange-main-bg);
  margin-bottom: 10px;
  .my-exchange-header__title {
    font-size: 15px;
    font-weight: bold;
    color: var(--color-dashboard-white);
    margin-right: 10px;
  }
  .my-exchange-header__logo  {
    height: 40px;
    margin-right: 10px;
  }
}
.el-dropdown-link {
  color: var(--color-dashboard-white);
  .el-icon--right {
    margin-right: 10px;
  }
}


</style>
