<template>
  <div class="withdraw-container">
    <!-- 步骤指引 -->
    <el-steps :active="currentStep" finish-status="success" class="withdraw-steps">
      <el-step title="选择币种" />
      <el-step title="选择收款人" />
      <el-step title="输入提币数量" />
    </el-steps>

    <!-- 提币表单 -->
    <el-form :model="form" :rules="rules" ref="withdrawForm" label-width="100px" size="large" class="withdraw-form">
      <!-- 提币步骤 1: 选择币种 -->
      <el-form-item label="选择币种" prop="coin">
        <el-select v-model="form.coin" placeholder="请选择币种" @change="updateStep">
          <el-option label="USDT" value="USDT"></el-option>
        </el-select>
      </el-form-item>

      <!-- 提币步骤 2: 选择收款人 -->
      <el-form-item label="选择收款人" prop="receiver">
        <el-radio-group v-model="form.receiver" class="receiver-radio" @change="updateStep">
          <el-radio label="链上提币">链上提币</el-radio>
          <el-radio label="内部转账">内部转账</el-radio>
        </el-radio-group>
      </el-form-item>

      <!-- 网络 -->
      <el-form-item label="网络" prop="network">
        <el-select v-model="form.network" placeholder="请选择网络" @change="updateStep">
          <el-option label="Optimism" value="Optimism"></el-option>
        </el-select>
      </el-form-item>

      <!-- 地址 -->
      <el-form-item label="地址" prop="address">
        <el-input v-model="form.address" placeholder="请输入收款地址" @input="updateStep"></el-input>
        <span v-if="addressError" class="error-text">{{ addressError }}</span>
      </el-form-item>

      <!-- 提币步骤 3: 提币数量 -->
      <el-form-item label="提币数量" prop="amount">
        <el-input v-model="form.amount" placeholder="请输入提币数量" type="number" @input="updateStep">
          <template #append>USDT</template>
        </el-input>
        <div class="amount-info">
          <span class="available-amount">可用：0 USDT</span>
          <el-link class="link" type="primary">全部</el-link>
        </div>
      </el-form-item>

      <!-- 网络费用和到账数量 -->
      <el-row class="fees">
        <el-col :span="12" class="fee-item">网络费用: 0.15 USDT</el-col>
        <el-col :span="12" class="fee-item">到账数量: {{ form.amount || 0 }} USDT</el-col>
      </el-row>

      <!-- 下一步按钮 -->
      <el-button type="primary" @click="submitForm" class="submit-button">下一步</el-button>
    </el-form>
  </div>
</template>

<script>
import { ethers } from 'ethers';

export default {
  data() {
    return {
      form: {
        coin: '',
        receiver: '链上提币',
        network: '',
        address: '0x7afa2b4d30cbcf4f18c7865c0814916a8713dd0d',
        amount: '',
      },
      currentStep: 0, // 初始步骤为0
      addressError: '',
      rules: {
        coin: [{ required: true, message: '请选择币种', trigger: 'change' }],
        network: [{ required: true, message: '请选择网络', trigger: 'change' }],
        address: [{ required: true, validator: this.validateAddress, trigger: 'blur' }],
        amount: [{ required: true, message: '请输入提币数量', trigger: 'blur' }],
      },
    };
  },
  methods: {
    // 动态更新当前步骤
    updateStep() {
      if (this.form.coin) {
        this.currentStep = 1;
      }
      if (this.form.network && this.form.address && ethers.isAddress(this.form.address)) {
        this.currentStep = 2;
      }
      if (this.form.amount > 0) {
        this.currentStep = 3;
      }
    },

    // 校验地址是否合法
    validateAddress(rule, value, callback) {
      if (!value) {
        callback(new Error('请输入地址'));
      } else if (!ethers.isAddress(value)) {
        callback(new Error('请输入有效的地址'));
      } else {
        callback();
      }
    },

    // 提交表单
    submitForm() {
      this.$refs.withdrawForm.validate((valid) => {
        if (valid) {
          console.log('表单验证成功！');
        } else {
          console.log('表单验证失败');
          return false;
        }
      });
    },
  },
};
</script>

<style scoped>
.withdraw-container {
  max-width: 600px;
  margin: 50px auto;
  padding: 20px;
  background-color: #fff;
  border: 1px solid #ebebeb;
  border-radius: 10px;
}

.withdraw-steps {
  margin-bottom: 30px;
}

.withdraw-form {
  padding: 20px;
}

.receiver-radio {
  display: flex;
  gap: 20px;
}

.fee-item {
  font-size: 14px;
  color: #606266;
  margin-bottom: 10px;
}

.amount-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.available-amount {
  color: #909399;
  font-size: 12px;
}

.submit-button {
  width: 100%;
  margin-top: 20px;
}

.error-text {
  color: red;
  font-size: 12px;
  margin-top: 5px;
}

.link {
  font-size: 12px;
  cursor: pointer;
}
</style>
