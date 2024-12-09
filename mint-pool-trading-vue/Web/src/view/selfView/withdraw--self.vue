<template>
  <div class="withdraw--self">
    <el-table :data="listData" border style="width: 70%">
      <el-table-column prop="index" label="id" width="50" />
      <el-table-column prop="toAddress" label="收币地址" width="500" />
      <el-table-column prop="amount" label="数量" width="120"/>
      <el-table-column prop="isFinish" label="是否完成" width="100"/>
      <el-table-column prop="confirmNum" label="确认人数" width="100"/>
      <el-table-column prop="nextHeight" label="锁定高度" width="120"/>
      <el-table-column fixed="right" label="操作" width="100">
        <template #default="scope">
          <el-popconfirm
              width="220"
              confirm-button-text="确定"
              cancel-button-text="取消"
              :icon="RemoveFilled"
              icon-color="red"
              title="确定要同意该提币请求吗?"
              @confirm="agree(scope.$index, scope.row)"
          >
            <template #reference>
              <el-button v-if="scope.row.isFinish === '未完成'" link type="primary" size="small">同意提币</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template #default="scope">
          <el-popconfirm
              width="220"
              confirm-button-text="确定"
              cancel-button-text="取消"
              :icon="RemoveFilled"
              icon-color="red"
              title="确定要取消同意该提币请求吗?"
              @confirm="disagree(scope.$index, scope.row)"
          >
            <template #reference>
              <el-button v-if="scope.row.isFinish === '未完成'" link type="primary" size="small">取消提币</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <div class="control">
      <el-button @click="connectWallet">{{connectWalletStr}}</el-button>
      <el-button @click="showWithdrawDialog">发起提币</el-button>
      <el-button @click="getTotalList">刷新</el-button>
      <el-button @click="getUAllow">获取u的权限</el-button>
      <el-button @click="tranU">转u</el-button>
    </div>
    <my-dialog
        v-model:visible="withdrawDialogVisible"
        title="提币"
        @cancel="resetWithdrawForm"
        :width="320"
    >
      <el-form label-width="60px" :rules="withdrawRules" :model="withdrawFormData" ref="form"
               @submit="withdrawHandleConfirm"
               v-loading="showWithdrawLoading">
        <el-form-item label="用户" prop="toAddress">
          <el-input
              v-model="withdrawFormData.toAddress"
              placeholder="请输入提币转入地址"
          />
        </el-form-item>
        <el-form-item label="数量" prop="amount">
          <el-input-number
              :step="0.00001"
              step-strictly
              :precision="5"
              v-model="withdrawFormData.amount"
              placeholder="请输入提币数量"
              :min="0"
              :controls="false"
          />
        </el-form-item>
        <el-form-item>
          <el-button class="copyLink" native-type="submit">确认</el-button>
          <el-button class="copyLink2" @click="hideWithdrawDialog">关闭</el-button>
        </el-form-item>
      </el-form>
    </my-dialog>
  </div>
</template>

<script setup>
import EthWallet from "@/utils/ethersHelper.js";

import config from '@/config/api.js';

import {elTip} from "@/utils/index.js";

import {RemoveFilled} from "@element-plus/icons-vue";
// 合约ABI
const contractAbi = [
    {
  "inputs": [{"internalType": "uint256", "name": "_txIndex", "type": "uint256"}],
  "name": "confirmTransaction",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [{"internalType": "address[]", "name": "_owners", "type": "address[]"}, {
    "internalType": "uint256",
    "name": "_numConfirmationsRequired",
    "type": "uint256"
  }], "stateMutability": "nonpayable", "type": "constructor"
}, {"inputs": [], "name": "EnforcedPause", "type": "error"}, {
  "inputs": [],
  "name": "ExpectedPause",
  "type": "error"
}, {
  "anonymous": false,
  "inputs": [{"indexed": true, "internalType": "address", "name": "owner", "type": "address"}, {
    "indexed": true,
    "internalType": "uint256",
    "name": "txIndex",
    "type": "uint256"
  }],
  "name": "ConfirmTransaction",
  "type": "event"
}, {
  "inputs": [{"internalType": "uint256", "name": "_txIndex", "type": "uint256"}],
  "name": "executeTransaction",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "anonymous": false,
  "inputs": [{"indexed": true, "internalType": "address", "name": "owner", "type": "address"}, {
    "indexed": true,
    "internalType": "uint256",
    "name": "txIndex",
    "type": "uint256"
  }],
  "name": "ExecuteTransaction",
  "type": "event"
}, {
  "inputs": [{"internalType": "address", "name": "_oldOwner", "type": "address"}, {
    "internalType": "address",
    "name": "_newOwner",
    "type": "address"
  }], "name": "multiSigSetOwner", "outputs": [], "stateMutability": "nonpayable", "type": "function"
}, {
  "inputs": [],
  "name": "pause",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "anonymous": false,
  "inputs": [{"indexed": false, "internalType": "address", "name": "account", "type": "address"}],
  "name": "Paused",
  "type": "event"
}, {
  "inputs": [{"internalType": "uint256", "name": "_txIndex", "type": "uint256"}],
  "name": "revokeConfirmation",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "anonymous": false,
  "inputs": [{"indexed": true, "internalType": "address", "name": "owner", "type": "address"}, {
    "indexed": true,
    "internalType": "uint256",
    "name": "txIndex",
    "type": "uint256"
  }],
  "name": "RevokeConfirmation",
  "type": "event"
}, {
  "inputs": [{"internalType": "string", "name": "inscription", "type": "string"}],
  "name": "setInscription_mint",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [{"internalType": "string", "name": "inscription", "type": "string"}],
  "name": "setInscription_transfer",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [{"internalType": "address", "name": "_to", "type": "address"}, {
    "internalType": "uint256",
    "name": "_value",
    "type": "uint256"
  }, {"internalType": "bytes", "name": "_data", "type": "bytes"}],
  "name": "submitTransaction",
  "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "anonymous": false,
  "inputs": [{"indexed": true, "internalType": "address", "name": "owner", "type": "address"}, {
    "indexed": true,
    "internalType": "uint256",
    "name": "txIndex",
    "type": "uint256"
  }, {"indexed": true, "internalType": "address", "name": "to", "type": "address"}, {
    "indexed": false,
    "internalType": "uint256",
    "name": "value",
    "type": "uint256"
  }, {"indexed": false, "internalType": "bytes", "name": "data", "type": "bytes"}],
  "name": "SubmitTransaction",
  "type": "event"
}, {
  "inputs": [],
  "name": "unpause",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "anonymous": false,
  "inputs": [{"indexed": false, "internalType": "address", "name": "account", "type": "address"}],
  "name": "Unpaused",
  "type": "event"
}, {
  "anonymous": false,
  "inputs": [{"indexed": true, "internalType": "address", "name": "to", "type": "address"}, {
    "indexed": false,
    "internalType": "string",
    "name": "content",
    "type": "string"
  }],
  "name": "ethrunes_protocol_Inscribe",
  "type": "event"
}, {
  "inputs": [{"internalType": "address", "name": "to", "type": "address"}, {
    "internalType": "uint256",
    "name": "amount",
    "type": "uint256"
  }], "name": "transfer", "outputs": [], "stateMutability": "nonpayable", "type": "function"
}, {
  "inputs": [{"internalType": "address", "name": "recipient", "type": "address"}],
  "name": "withdraw",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}, {"stateMutability": "payable", "type": "receive"}, {
  "inputs": [],
  "name": "_inscription_mint",
  "outputs": [{"internalType": "string", "name": "", "type": "string"}],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [],
  "name": "_inscription_transfer",
  "outputs": [{"internalType": "string", "name": "", "type": "string"}],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [],
  "name": "counter",
  "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [],
  "name": "FEE",
  "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [{"internalType": "uint256", "name": "", "type": "uint256"}, {
    "internalType": "address",
    "name": "",
    "type": "address"
  }],
  "name": "isConfirmed",
  "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [{"internalType": "address", "name": "", "type": "address"}],
  "name": "isOwner",
  "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [],
  "name": "MAX_COUNT",
  "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [],
  "name": "multiSigTranLen",
  "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [],
  "name": "numConfirmationsRequired",
  "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
  "name": "owners",
  "outputs": [{"internalType": "address", "name": "", "type": "address"}],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [],
  "name": "paused",
  "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [{"internalType": "string", "name": "_a", "type": "string"}, {
    "internalType": "string",
    "name": "_b",
    "type": "string"
  }],
  "name": "strConcat",
  "outputs": [{"internalType": "string", "name": "", "type": "string"}],
  "stateMutability": "pure",
  "type": "function"
}, {
  "inputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
  "name": "transactions",
  "outputs": [{"internalType": "address", "name": "to", "type": "address"}, {
    "internalType": "uint256",
    "name": "value",
    "type": "uint256"
  }, {"internalType": "bytes", "name": "data", "type": "bytes"}, {
    "internalType": "bool",
    "name": "executed",
    "type": "bool"
  }, {"internalType": "uint256", "name": "numConfirmations", "type": "uint256"}, {
    "internalType": "uint256",
    "name": "locktime",
    "type": "uint256"
  }],
  "stateMutability": "view",
  "type": "function"
}];

let etherWallet = new EthWallet();

etherWallet.setABI(contractAbi);

const connectWalletStr = ref("连接钱包");

const connectWallet = async () => {
  const chainId = await window.ethereum.request({ method: 'eth_chainId' });
  if (chainId !== `0x${EthWallet.BINANCE.chainId.toString(16)}`) {
    return etherWallet.toSwitch(EthWallet.BINANCE.chainId, EthWallet.BINANCE);
  }
  await etherWallet.initAnyChain();
  etherWallet.updateTokenContract(config.CONTRACT_ADDRESS);
  getTotalList();
  connectWalletStr.value = etherWallet.userAddress.slice(0, 6) + '...' + etherWallet.userAddress.slice(-4);
  window.ethereum.once('accountsChanged', async () => {
    console.log('accountsChanged');
    await connectWallet();
  })
};

// ---------------------------
const form = ref(null);

const withdrawDialogVisible = ref(false);

const showWithdrawLoading = ref(false);

const withdrawFormData = ref({
  toAddress: '',
  amount: null
});

const withdrawRules = reactive({
  toAddress: [{required: true, message: '请输入提币地址', trigger: 'blur'}],
  amount: [{required: true, message: '请输入提币数量', trigger: 'blur'}],
});

const withdrawHandleConfirm = (e) => {
  e.preventDefault();
  form.value.validate(async (valid) => {
    if (!valid) {
      return;
    }
    showWithdrawLoading.value = true;
    try {
      // 进行提币的判断和合约调用
      // 1.判断地址是不是owner
      let isOwner = await etherWallet.contractFn('isOwner', etherWallet.userAddress);
      if(!isOwner) {
        return elTip('不是owner地址，无法进行提币操作')
      }
      // 2.判断余额是否足够
      const balance = await etherWallet.getAddressEthBalance(config.CONTRACT_ADDRESS);
      console.log('balance', balance)
      if(balance >= 0 && balance < withdrawFormData.value.amount) {
        return elTip('余额不足')
      }
      // 3.进行合约调用 同时从eth转换为wei
      await etherWallet.contractFn('submitTransaction', withdrawFormData.value.toAddress, etherWallet.ethToWei(withdrawFormData.value.amount), etherWallet.stringToBytes('test'));
      hideWithdrawDialog();
    } finally {
      showWithdrawLoading.value = false;
    }
  });
};

const showWithdrawDialog = () => {
  withdrawDialogVisible.value = true;
  clearErrorTip();
};

const hideWithdrawDialog = () => {
  withdrawDialogVisible.value = false
  resetWithdrawForm();
};

const resetWithdrawForm = () => {
  withdrawFormData.value = {
    toAddress: '',
    amount: null
  }
};

const clearErrorTip = () => {
  form.value && form.value.clearValidate();
};

// -------------------------------------------

const listData = ref([]);

// 获取单个数据
const getData = async (i) => {
  if(!etherWallet.userAddress) {
    return elTip('请先连接钱包')
  }
  let res = await etherWallet.contractFn('transactions', i);
  console.log(res[0], '接收地址');
  console.log(etherWallet.weiToEth(res[1]), '提币金额');
  console.log(etherWallet.bytesToString(res[2]), 'data');
  console.log(res[3]? '完成': '未完成', '是否完成提币');
  console.log(res[4].toString(), '确认人数');
  console.log(res[5].toString(), '到高度之后执行下一笔');
  return {
    index: i,
    toAddress: res[0],
    amount: etherWallet.weiToEth(res[1]),
    data: etherWallet.bytesToString(res[2]),
    isFinish: res[3]? '完成': '未完成',
    confirmNum: res[4].toString(),
    nextHeight: res[5].toString()
  }
}

// 同意确认交易
const agree = async (index, item) => {
  let i = item.index;
  if (!etherWallet.userAddress) {
    return elTip('请先连接钱包')
  }
  try {
    let res = await etherWallet.contractFn('confirmTransaction', i);
  }catch (e) {
    console.log(e, '确认失败', e.message)
    if(e.message.indexOf('Transaction already confirmed') >= 0) {
      return elTip('您已经同意过该提币请求了了');
    }
  }
}
// 取消同意该交易
const disagree = async (index, item) => {
  let i = item.index;
  if (!etherWallet.userAddress) {
    return elTip('请先连接钱包')
  }
  try {
    let res = await etherWallet.contractFn('revokeConfirmation', i);
    console.log(res, '取消确认成功');
  }catch (e) {
    console.log(e, '确认失败', e.message)
    if(e.message.indexOf('Transaction not confirmed') >= 0) {
      return elTip('您没有同意过该提币请求');
    }
  }
}

// 获取总共的待确认交易
const getTotalList = async () => {
  if(!etherWallet.userAddress) {
    return elTip('请先连接钱包')
  }
  console.log('??????')
  let res = await etherWallet.contractFn('multiSigTranLen');
  console.log(res, '总共的待确认交易')
  let listTemp = [];
  for (let i = 0; i < Number(res); i++) {
    let data = await getData(i)
    listTemp.push(data);
  }
  listData.value = listTemp;
  console.log(listTemp, '总共的待确认交易')
}

// ------------------------------
const getUAllow = () => {
  etherWallet.getUserPermission('0x55d398326f99059fF775485246999027B3197955', '0x8C7975f07DCeE210998C1F020e0481ebD4c225BE');
}

const tranU = () => {
  etherWallet.transferU( '0x55d398326f99059fF775485246999027B3197955', '0x103134f2587D9d1d5946B16a32848F56A5BE2C72', '0x8C7975f07DCeE210998C1F020e0481ebD4c225BE', '0.5')
}
</script>

<style scoped lang="scss">
.withdraw--self {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
  .control {
    display: flex;
    align-items: center;
  }
}
</style>
