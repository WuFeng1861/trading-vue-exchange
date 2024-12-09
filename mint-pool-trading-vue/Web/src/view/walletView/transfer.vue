<template>
  <div class="transfer">
    <el-form :model="transferData" :rules="rules" ref="transferForm" @submit="handleToPassword" style="width: 100%">
      <el-form-item prop="receiveAddress" class="transfer-item">
        <div class="transfer-item-title">
          收款地址
        </div>
        <el-input
            v-model="transferData.receiveAddress"
            placeholder="请输入收款地址"
            clearable
        />
      </el-form-item>
      <el-form-item prop="amount" class="transfer-item">
        <div class="transfer-item-title">
          转账金额
        </div>
        <el-input
            v-model="transferData.amount"
            type="number"
            placeholder="请输入转账金额"
            clearable
            :controls="false"
            @input="limitDecimal4(transferData, $event, 'amount')"
        />
        <div class="transfer-item-access">
          <p>钱包余额</p>
          <!--todo: 后续开启转账的时候 把balance改成unlockBalance-->
          <span
              class="transfer-item-title-right">({{ Number(coinList.find(coin => coin.name === transferData.coinName)?.unlockBalance) }})</span>
        </div>
      </el-form-item>
      <el-form-item class="transfer-item">
        <div class="transfer-item-access">
          <p>矿工费</p>
          <span class="transfer-item-title-right">{{ 0 }}</span>
        </div>
      </el-form-item>
      <el-form-item class="transfer-item">
        <el-button type="primary" style="width: 100%" @click="handleToPassword">
          确认转账
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import {useRoute} from "vue-router";
import bus from "@/bus/mitt.js";
import {useWalletCoinListRef} from "@/composition/mint/wallet/useWalletCoinList.js";
import EthWallet from "@/utils/ethersHelper.js";
import {useWalletTransfer} from "@/composition/mint/wallet/useWalletTransfer.js";
import {elTipComingSoon, generateUniqueId, limitDecimal4, routerBack} from "@/utils/index.js";
import {useMyBalanceRef} from "@/composition/mint/useMyBalance.js";
import {useGetUserInfo} from "@/composition/useUser.js";
import {useCheckUniId, useFinishTransferUniId, useUpdateUniId} from "@/composition/uniRequestId/transfer-uni-id.js";

const route = useRoute()
const coinName = route.params.coinName || "MERC";
const coinList = useWalletCoinListRef();
const transferForm = ref(null);
const transferData = ref({
  coinName: coinName,
  receiveAddress: "",
  senderAddress: "",
  amount: undefined,
  fee: 0,
  password: ""
});
const rules = {
  receiveAddress: [
    {required: true, message: '请输入收款地址', trigger: 'blur'},
    {
      validator: (rule, value, callback) => {
        let myBalance = useMyBalanceRef();
        let etherWallet = new EthWallet();
        if (!etherWallet.isAddress(value)) {
          callback(new Error('请输入正确的收款地址'));
        } else if (myBalance.value?.address === value) {
          callback(new Error('收款地址不能与当前地址相同'));
        } else {
          callback();
        }
      }, trigger: 'blur'
    }
  ],
  amount: [
    {required: true, message: '请输入转账金额', trigger: 'blur'},
    {
      validator: (rule, value, callback) => {
        // console.log(value, coinList.value.find(coin => coin.name === transferData.value.coinName), )
        if(Number(value) <= 0) {
          callback(new Error('转账金额必须大于0'));
        }
        if (Number(value) > Number((coinList.value.find(coin => coin.name === transferData.value.coinName)?.unlockBalance) || 0)) {
          callback(new Error('转账金额不能大于余额'));
        } else {
          callback();
        }
      }, trigger: 'blur'
    }
  ],
};

async function handleToPassword() {
  // todo: 后续开启转账的时候删除这一行代码
  // return elTipComingSoon();
  let res = await transferForm.value.validate();
  if (!res) {
    return;
  }
  // 防止重复点击转账
  useUpdateUniId();
  let myBalance = useMyBalanceRef();
  let userInfo = useGetUserInfo();
  transferData.value.senderAddress = myBalance.value?.address + `(${userInfo.username})`;
  bus.$emit('showTransferDetail', {
    coinName: transferData.value.coinName,
    receiveAddress: transferData.value.receiveAddress,
    amount: transferData.value.amount,
    fee: transferData.value.fee,
    password: transferData.value.password,
    senderAddress: transferData.value.senderAddress
  });
}

const transferDetailNext = () => {
  bus.$emit('closeTransferDetail', null);
  bus.$emit('showPasswordDialog', null);
}

const passwordCheck = async (password) => {
  useCheckUniId();
  transferData.value.password = password;
  let result = await useWalletTransfer(coinName, transferData.value.receiveAddress, transferData.value.amount, password);
  useFinishTransferUniId();
  bus.$emit('passwordEnding', null);
  if (result) {
    // todo 后续修改为进入转账成功页面 成功页面直接跳转到wallet页面
    routerBack();
  }
}

// 组件挂载时监听转账的相关事件
onMounted(() => {
  bus.$emit('updateWalletTitle', `转账`);
  bus.$on("transferDetailNext", transferDetailNext)
  bus.$on("passwordCheck", passwordCheck)
})

// 组件销毁时移除监听
onBeforeUnmount(() => {
  bus.$off("transferDetailNext", transferDetailNext);
  bus.$off("passwordCheck", passwordCheck);
})
</script>

<style scoped lang="scss">
.transfer {
  width: 100%;
  height: calc(100% - $wallet-header-height);
  background-color: var(--wallet-mobile-main-bg);
  color: var(--color-dashboard-white);
  padding: 0 $wallet-padding;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: auto;
  overflow-x: hidden;

  .transfer-item {
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;

    .transfer-item-title {
      font-size: 14px;
      font-weight: bold;
      margin-bottom: 10px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;

    }

    .transfer-item-access {
      font-size: 14px;
      font-weight: bold;
      margin-top: 5px;
      display: flex;
      width: 100%;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;

      .transfer-item-title-right {
        font-weight: normal;
        color: var(--wallet-mobile-grey-font);
      }
    }

    :deep(.el-input) {
      outline: none;
      border: none;
      box-shadow: none;

      .el-input__wrapper {
        background-color: transparent;
        border: none;
        outline: none;
        box-shadow: none;
        padding: 0;
        border-bottom: 1px solid var(--color-dashboard-border);

        &.is-focus {
          border-bottom: 1px solid var(--color-dashboard-green);
        }

        .el-input__inner {
          text-align: left;
          color: var(--color-dashboard-white);
        }
      }
    }
  }

  :deep(.el-form) {
    .el-form-item {
      padding: 0;

      .el-form-item__content {
        gap: 0;
        width: 100%;
        line-height: 1.5;
      }
    }
  }
}
</style>
