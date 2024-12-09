<template>
  <div class="rightHeader">
    <div class="left-pos">
      <div style="display: flex;align-items: center" @click="showDrawer">
        <el-icon class="mobileOnly" size="25" style="margin-right: 10px">
          <component :is="Operation"></component>
        </el-icon>
        <h2 class="title">{{ title }}</h2>
      </div>
      <div class="invite-link-container shadowNormal pcOnly">
        <el-icon>
          <img :src="getSvgPath('Employee')">
        </el-icon>
        <span> 邀请人数 : {{ group.length }}</span>
        <div class="copyLink" @click="copyOriginLink(userInfo.invitation_code)">
          复制推荐链接
        </div>
        <!--<el-button class="copyLink" @click="showStrachDialog">开启盲盒</el-button>-->
        <!--<el-button class="copyLink" @click="showTransferDialog">转账</el-button>-->
      </div>
    </div>
    <div class="right-pos">
      <el-button v-if="!mybalanceRef.address" class="copyLink" @click="showBindWalletDialog">绑定钱包</el-button>
      <el-button class="copyLink pcOnly" @click="changeTheme">主题换肤</el-button>
      <el-button v-if="mybalanceRef.address" class="copyLink" @click="connectWallet">{{ connectWalletStr }}</el-button>
      <el-button v-if="mybalanceRef.address" class="copyLink pcOnly" @click="showRechargeDialog">充值</el-button>
      <h3 class="pcOnly" style="margin-left: 20px;margin-right: 20px">你好，{{ userInfo.username }}</h3>
      <el-avatar :size="46" class="avatar pcOnly"> {{ userInfo.username.slice(0, 1) }}</el-avatar>
    </div>
    <strach-dialog
        v-model:visible="strachDialogVisible"
        title="盲盒"
    />
    <my-dialog
        v-model:visible="transferDialogVisible"
        title="转账"
        @cancel="resetTransferForm"
        :width="320"
    >
      <el-form label-width="60px" :rules="transferRules" :model="transferFormData" ref="form"
               @submit="transferHandleConfirm"
               v-loading="showTransferLoading">
        <el-form-item label="用户" prop="toStr">
          <el-input
              v-model="transferFormData.toStr"
              placeholder="请输入转账用户名或者邮箱"
          />
        </el-form-item>
        <el-form-item label="数量" prop="amount">
          <el-input-number
              :step="0.01"
              step-strictly
              :precision="2"
              v-model="transferFormData.amount"
              placeholder="请输入转账数量"
              :min="0"
              :controls="false"
          />
        </el-form-item>
        <el-form-item>
          <el-button class="copyLink" native-type="submit">确认</el-button>
          <el-button class="copyLink2" @click="hideTransferDialog">关闭</el-button>
        </el-form-item>
      </el-form>
    </my-dialog>
    <my-dialog
        v-model:visible="rechargeDialogVisible"
        title="充值"
        @cancel="resetRechargeForm"
        :width="320"
    >
      <el-form label-width="60px" :rules="rechargeRules" :model="rechargeFormData" ref="formRecharge"
               @submit="rechargeHandleConfirm"
               v-loading="showRechargeLoading">
        <el-form-item label="数量" prop="amount">
          <el-input-number
              :step="0.001"
              step-strictly
              :precision="3"
              v-model="rechargeFormData.amount"
              placeholder="请输入充值数量"
              :min="0.002"
              :controls="false"
          />
        </el-form-item>
        <el-form-item>
          <el-button class="copyLink" native-type="submit">确认</el-button>
          <el-button class="copyLink2" @click="hideRechargeDialog">关闭</el-button>
        </el-form-item>
      </el-form>
    </my-dialog>
    <my-dialog
        v-model:visible="bindWalletDialogVisible"
        title="绑定钱包地址"
        @cancel="resetBindWalletForm"
        :width="375"
    >
      <el-form label-width="90px" :rules="bindWalletRules" :model="bindWalletFormData" ref="formBindWallet"
               @submit="bindWalletHandleConfirm"
               v-loading="showBindWalletLoading">
        <el-form-item label="地址" prop="address">
          <el-input
              v-model="bindWalletFormData.address"
              placeholder="输入绑定地址"
          />
        </el-form-item>
        <el-form-item label="验证码" prop="code">
          <div style="display: flex;align-items: center;">
            <el-input
                v-model="bindWalletFormData.code"
                placeholder="输入绑定地址验证码"
            />
            <el-button :class="{
              copyLink: sendBindWalletCodeStr === '获取验证码',
              copyLink2: sendBindWalletCodeStr !== '获取验证码'
            }"
             style="width: 80px;"
             :disabled="sendBindWalletCodeStr !== '获取验证码'"
             @click="sendBindWalletCode">{{ sendBindWalletCodeStr }}
            </el-button>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button class="copyLink" native-type="submit">确认</el-button>
          <el-button class="copyLink2" @click="hideBindWalletDialog">关闭</el-button>
        </el-form-item>
      </el-form>
    </my-dialog>
    <el-drawer
        :with-header="false"
        class="mobileOnly leftMobileNav"
        v-model="drawerVisible"
        direction="ltr"
    >
      <div class="leftMoboleNavContainer">
        <div class="header">
          <img src="../assets/startMintLogo.png" alt="logo">
          <span>Mercury</span>
        </div>
        <div class="item" v-for="item in drawerNavList" @click="item.func">
          <img :src="item.icon"/>
          <p>{{ item.title }}</p>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup>
import {getCurRouterBreadcrumb} from "@/composition/useRouter.js";
import {useGetUserInfo} from "@/composition/useUser.js";
import {copyOriginLink, elTip, getSvgPath, handleAddress} from "@/utils/index.js";
import {useMyGroupRef} from "@/composition/mint/useMyGroup.js";
import StrachDialog from "@/components/other/StrachDialog.vue";
import MyDialog from "@/components/myDialog.vue";
import {checkBalance, useTransfer} from "@/composition/mint/useTransfer.js";
import config from '@/config/api.js'
import EthWallet from "@/utils/ethersHelper.js";
import {useMyBalanceRef} from "@/composition/mint/useMyBalance.js";
import {useBindAddress} from "@/composition/mint/useMint.js";
import SafeCalc from "@/utils/bignumberjs.js";
import bus from "@/bus/mitt.js";
import {changeTheme, getThemeImage} from "@/styles/theme/index.js";
import {Operation} from "@element-plus/icons-vue";
import {useSendBindWalletCodeEmail} from "@/composition/email/index.js";

const title = getCurRouterBreadcrumb();

let userInfo = useGetUserInfo();

let group = useMyGroupRef();

const mybalanceRef = useMyBalanceRef();

// -----------------------------------------

const strachDialogVisible = ref(false);

const showStrachDialog = () => {
  console.log(mybalanceRef.value.ethBalance, config.OPEN_BOX_FEE);
  if (!mybalanceRef.value.address || SafeCalc.compare(mybalanceRef.value.ethBalance, config.OPEN_BOX_FEE) === '-1') {
    showRechargeDialog();
    return elTip('余额不足,请先充值', 'warning');
  }
  strachDialogVisible.value = true;
}

bus.$on('showStratch', showStrachDialog);

// -----------------------------------------
const form = ref(null);
const transferDialogVisible = ref(false);
const showTransferLoading = ref(false);
const transferFormData = ref({
  toStr: '',
  amount: null
});

const transferRules = reactive({
  toStr: [{required: true, message: '请输入用户邮箱或者用户名', trigger: 'blur'}],
  amount: [{required: true, message: '请输入金额', trigger: 'blur'}],
});

const transferHandleConfirm = (e) => {
  e.preventDefault();
  form.value.validate(async (valid) => {
    if (!valid) {
      return;
    }
    showTransferLoading.value = true;
    try {
      if (!checkBalance(transferFormData.value.amount)) {
        return;
      }
      await useTransfer(transferFormData.value.toStr, transferFormData.value.amount)
      hideTransferDialog();
    } finally {
      showTransferLoading.value = false;
    }
  });
}

const showTransferDialog = () => {
  transferDialogVisible.value = true;
  clearErrorTip();
}
const hideTransferDialog = () => {
  transferDialogVisible.value = false
  resetTransferForm();
}
const resetTransferForm = () => {
  transferFormData.value = {
    toStr: '',
    amount: null
  }
}

const clearErrorTip = () => {
  form.value && form.value.clearValidate();
};
// -----------------------------------------
const connectWalletStr = ref('连接钱包');
let etherWallet = new EthWallet();
// 在绑定钱包之前连接钱包
const connectWalletBeforeAuth = async () => {
  const chainId = await window.ethereum.request({method: 'eth_chainId'});
  console.log('connectWallet', window.ethereum.chainId, chainId, `0x${EthWallet.BINANCE.chainId.toString(16)}`);
  if (chainId !== `0x${EthWallet.BINANCE.chainId.toString(16)}`) {
    return etherWallet.toSwitch(EthWallet.BINANCE.chainId, EthWallet.BINANCE);
  }
  await etherWallet.initAnyChain();
  connectWalletStr.value = etherWallet.userAddress.slice(0, 6) + '...' + etherWallet.userAddress.slice(-4);
  EthWallet.walletList = [etherWallet];
  window.ethereum.once('accountsChanged', async () => {
    console.log('accountsChanged');
    await connectWalletBeforeAuth();
  })
}
const connectWallet = async () => {
  const chainId = await window.ethereum.request({method: 'eth_chainId'});
  console.log('connectWallet', window.ethereum.chainId, chainId, `0x${EthWallet.BINANCE.chainId.toString(16)}`);
  if (chainId !== `0x${EthWallet.BINANCE.chainId.toString(16)}`) {
    return etherWallet.toSwitch(EthWallet.BINANCE.chainId, EthWallet.BINANCE);
  }
  await etherWallet.initAnyChain();
  connectWalletStr.value = etherWallet.userAddress.slice(0, 6) + '...' + etherWallet.userAddress.slice(-4);
  EthWallet.walletList = [etherWallet];
  if (etherWallet.userAddress.toLowerCase() !== mybalanceRef.value.address.toLowerCase()) {
    elTip('钱包地址错误，请切换 ' + handleAddress(mybalanceRef.value.address) + ' 钱包', 'error');
  }
  window.ethereum.once('accountsChanged', async () => {
    console.log('accountsChanged');
    await connectWallet();
  })
}
// -----------------------------------------
const formRecharge = ref(null);
const rechargeDialogVisible = ref(false);
const showRechargeLoading = ref(false);
const rechargeFormData = ref({
  toStr: config.CONTRACT_ADDRESS,
  amount: 0
});

const rechargeRules = reactive({
  amount: [{required: true, message: '请输入金额', trigger: 'blur'}],
});

const rechargeHandleConfirm = (e) => {
  e.preventDefault();
  console.log('rechargeFormData', rechargeFormData.value)
  formRecharge.value.validate(async (valid) => {
    if (!valid) {
      return;
    }
    showRechargeLoading.value = true;
    try {
      // 转账
      if (etherWallet.provider) {
        await etherWallet.sendTran(rechargeFormData.value.toStr, rechargeFormData.value.amount);
      }
      hideRechargeDialog();
    } finally {
      showRechargeLoading.value = false;
    }
  });
}

const showRechargeDialog = () => {
  if (!etherWallet.userAddress) {
    connectWallet();
    return elTip('请先连接钱包', 'warning');
  }
  if (etherWallet.userAddress.toLowerCase() !== mybalanceRef.value.address.toLowerCase()) {
    return elTip('钱包地址错误，请切换 ' + handleAddress(mybalanceRef.value.address) + ' 钱包', 'error');
  }
  rechargeDialogVisible.value = true;
  clearRechargeErrorTip();
}
const hideRechargeDialog = () => {
  rechargeDialogVisible.value = false
  resetRechargeForm();
}
const resetRechargeForm = () => {
  rechargeFormData.value.amount = 0;
}

const clearRechargeErrorTip = () => {
  formRecharge.value && formRecharge.value.clearValidate();
};

// -----------------------------------------

const formBindWallet = ref(null);
const bindWalletDialogVisible = ref(false);
const showBindWalletLoading = ref(false);
const bindWalletFormData = ref({
  address: '',
  code: ''
});
const bindWalletRules = reactive({
  code: [{required: true, message: '请输入验证码', trigger: 'blur'}],
  address: [
    {required: true, message: '请输入地址', trigger: 'blur'},
    {
      validator: (rule, value, callback) => {
        if (!etherWallet.isAddress(value)) {
          return callback("请输入正确地址");
        }
        return callback();
      }, trigger: 'blur'
    }
  ],
});
const sendBindWalletCodeStr = ref('获取验证码');
const updateSendBindWalletCodeStr = () => {
  if (!localStorage.getItem('bindWalletCodeTime')) {
    sendBindWalletCodeStr.value = '获取验证码';
    return;
  }
  let time = new Date().getTime() - localStorage.getItem('bindWalletCodeTime');
  if (time > 60000) {
    sendBindWalletCodeStr.value = '获取验证码';
    return;
  }
  let count = 60 - Math.floor(time / 1000);
  sendBindWalletCodeStr.value = `(${count}s)`;
  requestAnimationFrame(updateSendBindWalletCodeStr);
}
const sendBindWalletCode = async () => {
  console.log('sendBindWalletCode')
  // 发送验证码
  await useSendBindWalletCodeEmail();
  // 倒计时 使用requestAnimationFrame
  let count = 60;
  sendBindWalletCodeStr.value = `(${count}s)`;
  localStorage.setItem('bindWalletCodeTime', new Date().getTime().toString());
  updateSendBindWalletCodeStr();
}
updateSendBindWalletCodeStr();

const bindWalletHandleConfirm = async (e) => {
  e.preventDefault();
  formBindWallet.value.validate(async (valid) => {
    if (!valid) {
      return;
    }
    showBindWalletLoading.value = true;
    try {
      await connectWalletBeforeAuth();
      if (!EthWallet.walletList[0]) {
        return elTip('连接钱包失败，请检查您的网络', 'warning');
      }
      console.log('bindWalletFormData', bindWalletFormData.value.address, EthWallet.walletList[0].userAddress, bindWalletFormData.value.address !== EthWallet.walletList[0].userAddress)
      if (EthWallet.walletList[0].userAddress.toLowerCase() !== bindWalletFormData.value.address.toLowerCase()) {
        return elTip('输入地址与钱包地址不一致，请检查连接钱包', 'warning');
      }

      let signRes = await EthWallet.walletList[0].signMessage(config.BIND_ADDRESS_SIGN_WORD);
      // todo: 绑定地址,传入验证码和地址和签名
      await useBindAddress(bindWalletFormData.value.code, EthWallet.walletList[0].userAddress, signRes);
      hideBindWalletDialog();
    } catch (e) {
      if (e.message.indexOf('user rejected action') === 0) {
        elTip('您拒绝了签名请求', 'error');
      }
    } finally {
      showBindWalletLoading.value = false;
    }
  });
}

const showBindWalletDialog = () => {
  bindWalletDialogVisible.value = true;
  clearBindWalletErrorTip();
}
const hideBindWalletDialog = () => {
  bindWalletDialogVisible.value = false;
  resetBindWalletForm();
}
const resetBindWalletForm = () => {
  bindWalletFormData.value.address = '';
}

const clearBindWalletErrorTip = () => {
  formBindWallet.value && formBindWallet.value.clearValidate();
};

// -----------------------------------------

const drawerVisible = ref(false);
const showDrawer = () => {
  // 判断屏幕宽度小于768
  if (document.body.clientWidth < 768) {
    return drawerVisible.value = true;
  }
  drawerVisible.value = false;
};
const hideDrawer = () => {
  drawerVisible.value = false;
};
const drawerNavList = [
  {
    title: '连接钱包',
    icon: getThemeImage('walletConnect.png'),
    func: () => {
      connectWallet();
      hideDrawer();
    }
  }, {
    title: '充值',
    icon: getThemeImage('recharge.png'),
    func: () => {
      showRechargeDialog();
      hideDrawer();
    }
  }, {
    title: '切换主题',
    icon: getThemeImage('swiftTheme.png'),
    func: () => {
      changeTheme();
      hideDrawer();
    }
  }, {
    title: 'FAQ',
    icon: getThemeImage('FAQ.png'),
    func: () => {
      // 跳转gitbook
      window.open(config.FAQ_URL, '_blank');
      hideDrawer();
    }
  }, {
    title: '邀请好友',
    icon: getThemeImage('inviteLogo.png'),
    func: () => {
      copyOriginLink(userInfo.invitation_code);
      hideDrawer();
    }
  }, {
    title: '退出',
    icon: getThemeImage('logOut.png'),
    func: () => {
      bus.$emit('showCloseDialog', null);
    }
  },
];

</script>

<style scoped lang="scss">
.rightHeader {
  width: 100%;
  height: $header-height;
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  .right-pos {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    margin-right: 20px;

    .avatar {
      cursor: pointer;
      background-color: var(--color-dashboard-green);
      color: var(--color-dashboard-black);
      --el-avatar-text-size: 18px;
    }
  }

  .left-pos {
    display: flex;
    align-items: center;
    margin-left: 20px;

    & > * {
      margin-right: 20px;

      &:last-child {
        margin-right: 0;
      }
    }

    .title {
      white-space: nowrap;
    }

    .invite-link-container {
      padding: 8px 16px;
      border: 1px solid var(--color-dashboard-black);
      border-radius: 20px;
      display: flex;
      flex-wrap: wrap;
      flex-direction: row;
      align-items: center;
      background-color: var(--color-dashboard-bg-active);

      & > * {
        margin-right: 10px;

        &:last-child {
          margin-right: 0;
        }
      }
    }
  }
}

@media screen and (max-width: 768px) {
  .rightHeader {
    :deep(.leftMobileNav) {
      width: 50% !important;
      background-color: var(--color-dashboard-bg-main) !important;

      .leftMoboleNavContainer {
        width: 100%;
        height: 100%;
        overflow-x: hidden;
        overflow-y: auto;
        display: flex;
        flex-direction: column;

        .header {
          display: flex;
          padding: 0 10%;
          width: 100%;
          height: $header-height;
          align-items: center;
          white-space: nowrap;
          justify-content: space-around;
          border-bottom: 1px solid var(--color-dashboard-border);
          font-size: 25px;

          img {
            margin-right: 10px;
            width: 40px;
          }
        }

        .item {
          display: flex;
          flex-direction: row;
          align-items: center;
          white-space: nowrap;
          width: 100%;
          height: 45px;
          //background-color: red;
          padding: 0 10%;
          border-bottom: 1px solid var(--color-dashboard-border-grey);
          font-size: 12px;

          img {
            width: 20px;
            margin-right: 10px;
          }
        }
      }

      .el-drawer__body {
        padding: 0;
      }
    }

    .left-pos {
      .title {
        font-size: 20px;
      }
    }
  }
}
</style>
