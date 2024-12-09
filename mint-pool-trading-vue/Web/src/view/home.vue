<template>
  <div class="homeContainer">
    <left-nav class="pcOnly"/>
    <div class="rightView">
      <right-header/>
      <vant-notice-bar :textlist="noticelist"/>
      <router-view></router-view>
      <right-nav-header class="mobileOnly"/>
    </div>
    <my-dialog
        v-model:visible="closeDialogVisible"
        title="确认关闭"
        :width="320"
    >
      <span style="color: #ffffff">确认退出账号吗？</span>
      <div style="margin-top: 10px;display: flex;justify-content: flex-end;">
        <el-button class="copyLink2" @click="hideCloseDialog" style="margin-right: 10px">取消</el-button>
        <el-button class="copyLink" @click="closeDialogConfirm">
          确定
        </el-button>
      </div>
    </my-dialog>
  </div>
</template>

<script setup>
import {useExit} from "@/composition/useUser.js";
import bus from "@/bus/mitt.js";
import MyDialog from "@/components/myDialog.vue";
import RightHeader from "@/components/rightHeader.vue";
import RightNavHeader from "@/components/rightNavHeader.vue";
import VantNoticeBar from "@/components/vant/vant-notice-bar.vue";

// 1:盲盒即将进入减半周期、随着会员增加，盲盒产量也在根据全网税收进行减半周期
// 2:MERC Token 即将开放代币提币与充值模块
// 3:新增AI大模型挖矿算法，更加系统化瓜分计算挖矿分红
const noticelist = [
  {
    text: "盲盒即将进入减半周期",
    click: () => {
    }
  },
  {
    text: "MERC Token 即将开放代币提币与充值模块",
    click: () => {
    }
  },
  {
    text: "新增AI大模型挖矿算法，瓜分计算挖矿分红",
    click: () => {
    }
  }
];

const closeDialogVisible = ref(false);
const showCloseDialog = () => {
  closeDialogVisible.value = true;
}
const hideCloseDialog = () => {
  closeDialogVisible.value = false;
}
const closeDialogConfirm = () => {
  useExit();
}
bus.$on('showCloseDialog', showCloseDialog);

</script>

<style lang="scss">
.homeContainer {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: row;
  background-color: var(--color-dashboard-bg-main);
  color: var(--color-dashboard-white);

  .rightView {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .notice-swipe {
    height: 40px;
    line-height: 40px;
  }
}

@media screen and (max-width: 768px) {
  .homeContainer {
    .rightView {
      width: 65%;
    }
  }
}
</style>
