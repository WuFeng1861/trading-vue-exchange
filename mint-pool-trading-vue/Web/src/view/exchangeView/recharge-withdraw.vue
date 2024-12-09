<template>
  <div class="recharge-withdraw">
    <div class="recharge-withdraw-cintainer">
      <div class="recharge-withdraw-title">
        <h2>{{ titleName }}</h2>
      </div>
      <el-form class="recharge-withdraw-step">
        <el-steps :active="step" finish-status="success" direction="vertical" v-if="option ==='recharge'">
          <el-step title="选择币种" :status="rwData.coinName ? 'success' : 'wait'">
            <template #description>
              <el-select v-model="rwData.coinName" placeholder="请选择币种" process-status="error" clearable>
                <!--<template #label="{ label, value }">-->
                <!--  <span>{{ label }}: </span>-->
                <!--  <span style="font-weight: bold">{{ value }}</span>-->
                <!--</template>-->
                <el-option label="MERC" value="MERC">
                  <div style="display: flex; align-items: center;">
                    <img :src="getImagePath('MLogo.png')" alt="MERC"
                         style="width: 20px; height: 20px;margin-right: 10px;">
                    <span>MERC</span>
                  </div>
                </el-option>
                <el-option label="USDT" value="USDT">
                  <div style="display: flex; align-items: center;">
                    <img src="/src/assets/image/Wallet-USDT.png" alt="USDT"
                         style="width: 20px; height: 20px;margin-right: 10px;">
                    <span>USDT</span>
                  </div>
                </el-option>
              </el-select>
            </template>
          </el-step>
          <el-step title="选择地址" :status="rwData.address ? 'success' : 'wait'">
            <template #description>
              <el-select v-model="rwData.address" placeholder="请选择地址" clearable filterable>
                <el-option v-for="item in rechargeAddressList" :key="item" :label="item" :value="item"/>
                <el-option label="添加一个新地址"
                           value="null"
                           @click="addNewRechargeAddress"
                />
              </el-select>
              <div class="address-show-container" v-if="rwData.address">
                <my-qrcode style="width: 200px; height: 200px;" :data="rwData.address" v-if="rwData.address"/>
                <div>{{ rwData.address }}</div>
                <el-button size="mini" @click="copyToClipboard(rwData.address)">复制</el-button>
              </div>
            </template>
          </el-step>
        </el-steps>
        <el-steps :active="step" finish-status="success" direction="vertical" v-if="option ==='withdraw'">
          <el-step title="选择币种" :status="rwData.coinName ? 'success' : 'wait'">
            <template #description>
              <el-select v-model="rwData.coinName" placeholder="请选择币种" process-status="error" clearable>
                <el-option label="MERC" value="MERC">
                  <div style="display: flex; align-items: center;">
                    <img :src="getImagePath('MLogo.png')" alt="MERC"
                         style="width: 20px; height: 20px;margin-right: 10px;">
                    <span>MERC</span>
                  </div>
                </el-option>
                <el-option label="USDT" value="USDT">
                  <div style="display: flex; align-items: center;">
                    <img src="/src/assets/image/Wallet-USDT.png" alt="USDT"
                         style="width: 20px; height: 20px;margin-right: 10px;">
                    <span>USDT</span>
                  </div>
                </el-option>
              </el-select>
            </template>
          </el-step>
          <el-step title="地址" :status="rwData.address ? 'success' : 'wait'">
            <template #description>
              <el-input v-model="rwData.address" placeholder="请输入提币地址" clearable></el-input>
            </template>
          </el-step>
          <el-step title="输入数量" :status="rwData.amount ? 'success' : 'wait'">
            <template #description>
              <!--<el-input-->
              <!--    v-model="transferData.amount"-->
              <!--    type="number"-->
              <!--    placeholder="请输入转账金额"-->
              <!--    clearable-->
              <!--    :controls="false"-->
              <!--    @input="limitDecimal4(transferData, 'amount', $event)"-->
              <!--/>-->
              <el-input
                  v-model="rwData.amount"
                  type="number"
                  placeholder="请输入提币数量"
                  clearable
                  :controls="false"
                  @input="limitDecimal8(rwData, $event, 'amount')"
                  />
            </template>
          </el-step>
          <el-step title="确认提币" :status="rwData.address && rwData.amount ? 'success' : 'wait'">
            <template #description>
              <el-button type="primary" @click="handleWithdraw" :disabled="!rwData.address || !rwData.amount">确认提币</el-button>
            </template>
          </el-step>
        </el-steps>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import {useRoute} from "vue-router";
import MyQrcode from "@/components/my-components/my-qrcode.vue";
import {copyToClipboard, elTip, getImagePath, limitDecimal8} from "@/utils/index.js";
import {
  useAddNewRechargeAddress,
  useInitRechargeAddress,
  useRechargeAddressRef
} from "@/composition/exchange/recharge.js";
import EthWallet from "@/utils/ethersHelper.js";
const route = useRoute();
const option = route.params.type;
const titleName = ref('');
const step = ref(0);
// const coinName = ref('');
// const address = ref('');
// const amount = ref(undefined);
const rwData = ref({
  coinName: '',
  address: '',
  amount: 0,
});
const rechargeAddressList = useRechargeAddressRef();
const addNewRechargeAddress = async () => {
  let addressNew = await useAddNewRechargeAddress();
  await nextTick();
  rwData.value.address = addressNew;
}
onMounted(() => {
  useInitRechargeAddress();
})
let ethWallet = new EthWallet();
const handleWithdraw = () => {
  console.log('handleWithdraw', rwData.value.coinName, rwData.value.address, rwData.value.amount, typeof rwData.value.amount)
  // 检查coinName, address, amount是否合法
  if (!rwData.value.coinName) {
    return elTip('请选择币种', 'warning');
  }
  if (!rwData.value.address || !ethWallet.isAddress(rwData.value.address)) {
    return elTip('请输入正确的提币地址', 'warning');
  }
  if (!rwData.value.amount) {
    return elTip('请输入正确的提币数量', 'warning');
  }
  // 提币操作
};

// 监听option变化
watchEffect(() => {
  if (option === 'recharge') {
    titleName.value = '充币';
    step.value = 0;
  } else if (option === 'withdraw') {
    titleName.value = '提币';
    step.value = 0;
  }
});
</script>

<style scoped lang="scss">
.recharge-withdraw {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: var(--exchange-black);
  padding: 0 10px 10px 0;
  color: var(--color-dashboard-white);

  .address-show-container {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
}
</style>
