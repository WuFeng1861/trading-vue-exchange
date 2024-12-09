<template>
  <div class="rightNavHeader">
    <div
        class="mySvg iconContainer"
        v-for="item in navList"
        :class="{
          active: $route.path === '/Home'+item.path
        }"
        @click="item.func"
    >
      <el-icon :size="item.size">
        <component :is="item.icon" v-if="typeof item.icon !== 'string'"/>
        <img :src="getSvgPath(item.icon)" v-else/>
      </el-icon>
    </div>
  </div>
</template>

<script setup>
import {elTip, getSvgPath, routerTo} from "@/utils/index.js";
import bus from "@/bus/mitt.js";
import {
  Odometer,
  Ticket,
  Bicycle
} from "@element-plus/icons-vue";
import {useMyBalanceRef} from "@/composition/mint/useMyBalance.js";

const navList = [
  {
    icon: Odometer,
    path: "/dashboard",
    size: 30,
    func: () => {
      // 路由跳转到dashboard
      routerTo("dashboard")
    }
  },
  {
    icon: Bicycle,
    path: "/recommend",
    size: 30,
    func: () => {
      routerTo("recommend")
    }
  },
  {
    icon: 'BlindBox2',
    path: "/box",
    size: 30,
    func: () => {
      routerTo("box")
    }
  },
  {
    icon: Ticket,
    path: "/reward",
    size: 30,
    func: () => {
      routerTo("reward")
    }
  },
  {
    icon: "Layout2",
    path: "/layout",
    size: 30,
    func: () => {
      routerTo("layout")
    }
  },
  {
    icon: "Wallet",
    path: "/components",
    size: 30,
    func: () => {
      // 判断是否绑定了地址
      let myBalance = useMyBalanceRef();
      if(!myBalance.value?.address) {
        elTip("请先绑定地址", "warning");
        return;
      }
      return routerTo("asset")
    }
  }
];
</script>

<style scoped lang="scss">
.rightNavHeader {
  width: 100%;
  height: $mobile-nav-height;
  background-color: var(--color-mobile-grey);
  padding: 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  .iconContainer {
    background-color: var(--color-mobile-grey-2);
  }

  .active {
    background-color: var(--color-dashboard-green);
  }
}
</style>
