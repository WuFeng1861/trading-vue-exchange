<template>
  <div class="deposit-container">
    <!-- 表单部分 -->
    <el-form :model="form" :rules="rules" ref="depositForm" label-width="100px" size="large" class="deposit-form">
      <!-- 选择币种 -->
      <el-form-item label="选择币种" prop="coin">
        <el-select v-model="form.coin" placeholder="请选择币种">
          <el-option label="USDT" value="USDT"></el-option>
          <!-- 可以根据需要添加更多选项 -->
        </el-select>
      </el-form-item>

      <!-- 选择网络 -->
      <el-form-item label="选择网络" prop="network">
        <el-select v-model="form.network" placeholder="请选择网络">
          <el-option label="Optimism" value="Optimism"></el-option>
          <!-- 可以根据需要添加更多选项 -->
        </el-select>
      </el-form-item>
    </el-form>

    <!-- 充币详情部分 -->
    <div class="deposit-details">
      <div class="deposit-qr">
        <!-- 二维码展示 (替换为实际二维码生成方式) -->
        <img src="https://via.placeholder.com/150" alt="QRCode" class="qr-code" />
      </div>
      <div class="deposit-info">
        <p>充币地址: 0x7afa2b4d30cbcf4f18c7865c0814916a8713dd0d</p>
        <el-button type="primary" size="small" @click="copyAddress">复制</el-button>
        <p>最小充币量: 0.00000001 USDT</p>
        <p>预计到账: 32 次网络确认</p>
        <p>充币进度: 96 次网络确认</p>
        <p>合约信息: 居号为 831ec7</p>
      </div>
    </div>

    <!-- 充币记录部分 -->
    <el-table :data="depositRecords" border style="width: 100%" class="deposit-table">
      <el-table-column prop="time" label="时间" width="180"></el-table-column>
      <el-table-column prop="address" label="充币地址"></el-table-column>
      <el-table-column prop="coin" label="币种" width="100"></el-table-column>
      <el-table-column prop="amount" label="充币数量" width="100"></el-table-column>
      <el-table-column prop="progress" label="充币进度" width="150"></el-table-column>
      <el-table-column prop="status" label="充币状态" width="100"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import {elTip} from "@/utils/index.js";

export default {
  data() {
    return {
      form: {
        coin: '',
        network: '',
      },
      rules: {
        coin: [{ required: true, message: '请选择币种', trigger: 'change' }],
        network: [{ required: true, message: '请选择网络', trigger: 'change' }],
      },
      depositRecords: [
        {
          time: '2024/07/13 03:41:03',
          address: '0xe85034f5207e772bb0a3e3b8682e1801ba7b36c (Optimism)',
          coin: 'USDT',
          amount: 400,
          progress: '2/2 次 bundle 验证',
          status: '已进入',
        },
        // 更多的记录可以在这里添加
      ],
    };
  },
  methods: {
    // 复制地址功能
    copyAddress() {
      navigator.clipboard.writeText("0x7afa2b4d30cbcf4f18c7865c0814916a8713dd0d");
      elTip("复制成功");
    },
  },
};
</script>

<style scoped>
.deposit-container {
  max-width: 800px;
  margin: 50px auto;
  padding: 20px;
  background-color: #fff;
  border: 1px solid #ebebeb;
  border-radius: 10px;
}

.deposit-form {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.deposit-form .el-form-item {
  flex: 1;
  margin-right: 20px;
}

.deposit-details {
  display: flex;
  padding: 20px;
  border: 1px solid #f0f0f0;
  border-radius: 10px;
  background-color: #fafafa;
}

.deposit-qr {
  margin-right: 20px;
}

.qr-code {
  width: 150px;
  height: 150px;
}

.deposit-info {
  flex: 1;
}

.deposit-info p {
  margin: 5px 0;
}

.deposit-table {
  margin-top: 20px;
}

.deposit-table .el-table__body-wrapper {
  border-radius: 10px;
}
</style>
