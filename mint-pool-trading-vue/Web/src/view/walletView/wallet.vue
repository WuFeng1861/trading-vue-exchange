<template>
  <div class="wallet">
    <wallet-header/>
    <router-view></router-view>
    <!-- 转账password弹窗 -->
    <my-dialog
        v-model:visible="passwordDialogVisible"
        title="转账"
        @cancel="resetPasswordForm"
        :width="320"
    >
      <el-form label-width="60px" :rules="passwordRules" :model="passwordFormData" ref="form"
               @submit="passwordHandleConfirm"
               v-loading="showPasswordLoading"
      >
        <el-form-item label="密码" prop="password">
          <el-input
              v-model="passwordFormData.password"
              placeholder="请输入密码"
              type="password"
              show-password
              ref="passwordInputRef"
          />
        </el-form-item>
        <el-form-item>
          <el-button class="copyLink" native-type="submit">确认</el-button>
          <el-button class="copyLink2" @click="hidePasswordDialog">关闭</el-button>
        </el-form-item>
      </el-form>
    </my-dialog>
    <!-- 转账详情抽屉 -->
    <el-drawer
        :with-header="false"
        v-model="drawerVisible"
        class="transfer-drawer"
        direction="btt"
        size="430px"
    >
      <div class="transfer-detail">
        <div class="transfer-detail-title">交易详情</div>
        <div class="transfer-detail-amount">{{ transferDetail.amount }} {{transferDetail.coinName}}</div>
        <div class="transfer-detail-content">
          <div class="transfer-detail-item">
            <div class="transfer-detail-item-label">付款地址</div>
            <div class="transfer-detail-item-value">{{ transferDetail.senderAddress }}</div>
            <div class="transfer-detail-line"/>
          </div>
          <div class="transfer-detail-item">
            <div class="transfer-detail-item-label">收款地址</div>
            <div class="transfer-detail-item-value">{{ transferDetail.receiveAddress }}</div>
            <div class="transfer-detail-line"/>
          </div>
          <div class="transfer-detail-item">
            <div class="transfer-detail-item-label">矿工费</div>
            <div class="transfer-detail-item-value">{{ transferDetail.fee }}</div>
            <div class="transfer-detail-line"/>
          </div>
        </div>
        <div class="transfer-detail-btn">
          <el-button type="primary" style="width: 100%" @click="confirmPayment">确认支付</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup>
import WalletHeader from "./components/wallet-header.vue";
import bus from "@/bus/mitt.js";

// -----------------------------------------
const form = ref(null);
const passwordInputRef = ref(null);
const passwordDialogVisible = ref(false);
const showPasswordLoading = ref(false);
const passwordFormData = ref({
  password: '',
});
const passwordRules = reactive({
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ],
});
const passwordHandleConfirm = (e) => {
  e.preventDefault();
  form.value.validate(async (valid) => {
    if (!valid) {
      return;
    }
    showPasswordLoading.value = true;
    try {
      await passwordEnding();
      hidePasswordDialog();
    } finally {
      showPasswordLoading.value = false;
    }
  });
}
const passwordEnding = async () => {
  // 通知转账密码输入完成进行请求处理
  bus.$emit('passwordCheck', passwordFormData.value.password);
  return new Promise((resolve, reject) => {
    const passwordEnding = () => {
      resolve();
      bus.$off('passwordEnding', passwordEnding);
    }
    bus.$on('passwordEnding', passwordEnding);
  });
};
const showPasswordDialog = () => {
  passwordDialogVisible.value = true;
  clearErrorTip();
  setTimeout(() => {
    passwordInputRef.value && passwordInputRef.value.select();
    setTimeout(() => {
      clearErrorTip()
    }, 0);
  }, 0);
}
const hidePasswordDialog = () => {
  passwordDialogVisible.value = false
  resetPasswordForm();
}
const resetPasswordForm = () => {
  passwordFormData.value = {
    toStr: '',
    amount: null
  }
}

const clearErrorTip = () => {
  form.value && form.value.clearValidate();
};
// -----------------------------------------
const drawerVisible = ref(false);
const transferDetail = ref({});
const confirmPayment = () => {
  bus.$emit('transferDetailNext', null);
}
const showTransferDetail = (detail) => {
  transferDetail.value = detail;
  drawerVisible.value = true;
}
const hideTransferDetail = () => {
  drawerVisible.value = false;
}


// -----------------------------------------
onMounted(() => {
  // bus监听限制密码弹窗
  bus.$on('showPasswordDialog', showPasswordDialog);
  // bus监听转账详情
  bus.$on('showTransferDetail', showTransferDetail);
  // bus监听关闭转账详情抽屉
  bus.$on('closeTransferDetail', hideTransferDetail);
});
// 关闭监听
onBeforeUnmount(() => {
  bus.$off('showPasswordDialog', showPasswordDialog);
  bus.$off('showTransferDetail', showTransferDetail);
  bus.$off('closeTransferDetail', hideTransferDetail);
});

</script>

<style scoped lang="scss">
.wallet {
  width: 100%;
  height: 100%;
}
:deep(.transfer-drawer) {
  .transfer-detail {
    background-color: #fff;
    .transfer-detail-title {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 45px;
      font-size: 16px;
      font-weight: bold;
      color: var(--wallet-mobile-black-font);
      border-bottom: 1px solid var(--wallet-mobile-grey-line);
    }
    .transfer-detail-amount {
      font-size: 24px;
      font-weight: bold;
      color: var(--wallet-mobile-black-font);
      margin-top: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
    }
    .transfer-detail-content {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 100%;
      padding: 0 20px;
      .transfer-detail-item {
        width: 100%;
        display: flex;
        align-items: flex-start;
        padding: 20px 0;
        overflow: hidden;
        position: relative;
        //border-bottom: 1px solid var(--wallet-mobile-grey-line);
        .transfer-detail-item-label {
          font-size: 14px;
          color: var(--wallet-mobile-grey-font);
          width: 80px;
          flex-shrink: 0;
        }
        .transfer-detail-item-value {
          display: flex;
          word-break: break-all;
          font-size: 14px;
          line-height: 1.5;
          color: var(--wallet-mobile-black-font);
          width: calc(100% - 80px);
          margin-right: 10px;
        }
        .transfer-detail-line {
          position: absolute;
          left: 0;
          bottom: 0;
          width: 100%;
          height: 1px;
          background-color: var(--wallet-mobile-grey-line);
          transform: scaleY(0.5);
        }
      }
    }
    .transfer-detail-btn {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      margin-top: 40px;
      padding: 0 20px;
    }
  }
  .el-drawer__body {
    padding: 0;
  }
}

</style>
