<template>
  <div class="header">
    <img class="logo" src="../assets/safe_logo.png"/>
    <div class="menu">
      <div class="menuItem" v-for="(item, index) in menuList" :key="index">
        <div class="title" @click="item.click">
          {{item.title}}
        </div>
        <div :class="{
          menuSplit: index !== (menuList.length - 1)
        }"/>
      </div>
    </div>
  </div>
</template>

<script setup>
import {elTip} from "../utils/index.js";
import {useRouter} from "vue-router";

const props = defineProps(["menu"]);

const {menu} = toRefs(props);
const router = useRouter();
const menuList = ref([
  {
    title: "反馈问题",
    click: () => elTip("进行中")
  },
  {
    title: "登录",
    click: () => router.push('/')
  },
  {
    title: "注册",
    click: () => router.push('/register')
  },
]);

watchEffect(() => menu, () => {
  if(menu.value && menu.value.length > 0) {
    menuList.value = menu.value;
  }
});

</script>

<style scoped lang="scss">
.header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  height: fit-content;
  width: 100%;
  padding: 12px 20px;
  font-size: 14px;
  background-color: $menu-blue;

  .logo {
    height: 35px;
    cursor: pointer;
  }

  .menu {
    display: flex;
    flex-direction: row;
    align-items: center;

    .menuItem {
      display: flex;
      flex-direction: row;
      align-items: center;
      .title {
        color: #fff;
        font-size: 12px;
        font-weight: 500;
        line-height: 33px;
        cursor: pointer;
      }
      .menuSplit {
        background-color: #fff;
        float: left;
        height: 12px;
        line-height: 33px;
        margin: 0 24px;
        width: 1px;
      }
    }
  }
}
</style>
