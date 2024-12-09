<template>
  <div class="leftNav">
    <div class="leftHeader">
      <img src="../assets/startMintLogo.png" alt="logo">
      <span>Mercury</span>
    </div>
    <!-- 这里放置左侧导航栏的代码 -->
    <el-menu
        class="navMenu"
        router
    >
      <el-menu-item :index="`${item.path}`" v-for="(item, index) in routerItems"
                    :class="$route.path === item.path?'is-active':''">
        <!-- 这里可以放置图标 -->
        <el-icon :style="{
          width: item.size + 'px',
          marginRight: item.mr + 'px',
          marginLeft: item.ml + 'px',
        }">
          <component :is="item.icon" :size="item.size" v-if="typeof item.icon !== 'string'"></component>
          <img :src="getSvgPath(item.icon)" v-else/>
        </el-icon>
        <span>{{ item.name }}</span>
      </el-menu-item>
      <div style="flex:1; flex-shrink: 0"/>
      <el-menu-item @click="toFAQ">
        <el-icon>
          <component :is="Paperclip"></component>
        </el-icon>
        <span>FAQ</span>
      </el-menu-item>
      <el-menu-item @click="showCloseDialog">
        <el-icon>
          <img src="../assets/svg/Outdoor.svg" alt=""/>
        </el-icon>
        <span>退出</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script setup>
import {
  Odometer,
  Ticket,
  Bicycle,
  Paperclip
} from "@element-plus/icons-vue";
import bus from "@/bus/mitt.js";
import {getSvgPath} from "@/utils/index.js";
import config from '@/config/api.js'

const routerItems = [
  {
    name: 'Merc Net',
    path: '/Home/dashboard',
    icon: Odometer,
    size: 30,
    mr: 8
  }, {
    index: '2',
    name: '推荐计划',
    path: '/Home/recommend',
    icon: Bicycle,
    size: 30,
    mr: 8
  }, {
    index: '3',
    name: '奖励',
    path: '/Home/reward',
    icon: Ticket,
    size: 30,
    mr: 8
  }, {
    index: '4',
    name: '盲盒',
    path: '/Home/box',
    icon: 'BlindBox2',
    size: 20,
    mr: 12,
    ml: 6
  },
  {
    index: '5',
    name: '交易所',
    path: '/exchange',
    icon: 'Layout',
    size: 30,
    mr: 8
  },
//   {
//   index: '6',
//   name: '钱包',
//   path: '',
//   icon: 'Wallet',
//   size: 20,
//   mr: 18
// },
];

const showCloseDialog = () => {
  bus.$emit("showCloseDialog", null)
}

const toFAQ = () => {
  window.open(config.FAQ_URL, '_blank')
}
</script>

<style scoped lang="scss">
.leftNav {
  max-width: 270px;
  width: 35%;
  height: 100%;
  background-color: var(--color-dashboard-bg-grey);
  overflow: hidden;
  overflow-y: auto;

  .leftHeader {
    color: white;
    display: flex;
    flex-direction: row;
    //justify-content: center;
    align-items: center;
    padding: 10px;
    width: 100%;
    height: $header-height;
    font-size: 25px;
    font-weight: 700;
    cursor: pointer;

    img {
      width: 40px;
      margin-right: 10px;
    }
  }

  .navMenu {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: calc(100% - 96px);
    background-color: var(--color-dashboard-bg-grey);
    border: 0;

    .el-menu-item {
      background-color: var(--color-dashboard-bg-grey);
      color: var(--color-dashboard-white);

      &:hover {
        background-color: var(--color-dashboard-bg-main);
      }

      &.is-active {
        background-color: var(--color-dashboard-bg-active);
      }
    }

  }
}

@media screen and (max-width: 768px) {
  .leftNav {
    .leftHeader {
      font-size: 12px;
      padding: 5px;

      img {
        width: 8vw;
      }
    }
  }
}
</style>
