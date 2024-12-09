<template>
  <div class="recharge-page">
    <!-- 选择币种和网络的表单 -->
    <form @submit.prevent="validateForm">

      <!-- 选择币种 -->
      <div class="step">
        <label for="currency" class="label">选择币种</label>
        <div class="select-wrapper">
          <select id="currency" v-model="selectedCurrency" class="styled-select" required>
            <option value="USDT">USDT</option>
            <!-- 其他币种可以添加 -->
          </select>
        </div>
      </div>

      <!-- 选择网络 -->
      <div class="step">
        <label for="network" class="label">选择网络</label>
        <div class="select-wrapper">
          <select id="network" v-model="selectedNetwork" class="styled-select" required>
            <option value="Ethereum">Ethereum</option>
            <!-- 其他网络可以添加 -->
          </select>
        </div>
      </div>

      <!-- 充币详情 -->
      <div class="step recharge-details-section">
        <label class="label">充币详情</label>
        <div class="recharge-details">
          <img src="@/assets/1qrcode.png" alt="QRCode" class="qrcode" />
          <div class="address-section">
            <p class="detail-label">充币地址</p>
            <div class="select-wrapper">
              <select v-model="selectedAddress" class="styled-select" required @change="handleAddressChange">
                <option v-for="(address, index) in addresses" :key="index" :value="address">{{ address }}</option>
                <option value="new">添加新地址</option>
              </select>
            </div>
            <button type="submit" class="copy-btn" :disabled="isLoading">
              {{ isLoading ? '加载中...' : '复制' }}
            </button>
          </div>
        </div>
        <div class="recharge-info">
          <p><strong>最小充币量:</strong> 0.00000001 USDT</p>
          <p><strong>预计到账:</strong> 32 次网络确认</p>
          <p><strong>充币进度:</strong> 96 次网络确认</p>
          <p><strong>合约信息:</strong> 尾号为 831ec7</p>
        </div>
      </div>
    </form>

    <!-- USDT 充币记录 -->
    <div class="recharge-history">
      <h3>USDT 充币记录</h3>
      <table>
        <thead>
        <tr>
          <th>时间</th>
          <th>充币地址</th>
          <th>币种</th>
          <th>充币数量</th>
          <th>充币进度</th>
          <th>充币状态</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(record, index) in rechargeRecords" :key="index">
          <td>{{ record.time }}</td>
          <td>{{ record.address }}</td>
          <td>{{ record.currency }}</td>
          <td>{{ record.amount }}</td>
          <td>{{ record.progress }}</td>
          <td>{{ record.status }}</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedCurrency: 'Null',
      selectedNetwork: 'Null',
      addresses: [
        '0x7afa2b4d30cbcf4f18c7865c0814916a8713dd0d',
        '0xe85034f5207e772bb0a3e3b8682e1801ba7b36c',
      ],
      selectedAddress: '0x7afa2b4d30cbcf4f18c7865c0814916a8713dd0d',
      isLoading: false,
      rechargeRecords: [
        {
          time: '2024/07/13 03:41:03',
          address: '0xe85034f5207e772bb0a3e3b8682e1801ba7b36c (Optimism)',
          currency: 'USDT',
          amount: 400,
          progress: '2/2 次 bundle 验证',
          status: '已进入',
        },
      ],
    };
  },
  methods: {
    // 表单验证方法
    validateForm() {
      if (this.selectedCurrency && this.selectedNetwork && this.selectedAddress) {
        this.copyAddress();
      } else {
        alert('请确保所有必填项已填写');
      }
    },
    // 复制地址
    copyAddress() {
      if (this.isLoading) return;
      navigator.clipboard.writeText(this.selectedAddress);
      alert('充币地址已复制');
    },
    addAddress() {
      this.isLoading = true;
      // 模拟异步添加地址
      setTimeout(() => {
        const newAddress = '0x' + Math.random().toString(16).substr(2, 40);
        this.addresses.push(newAddress);
        this.selectedAddress = newAddress;
        this.isLoading = false;
      }, 2000); // 模拟2秒的加载时间
    },
    handleAddressChange() {
      if (this.selectedAddress === 'new') {
        this.addAddress();
      }
    },
  },
};
</script>

<style scoped>
/* 页面整体布局 */
.recharge-page {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  font-family: 'Arial', sans-serif;
  color: #333;
}

/* 标题样式 */
.label {
  font-size: 1.1rem;
  font-weight: bold;
  margin-bottom: 8px;
  display: block;
}

/* 每一个步骤的外边距 */
.step {
  margin-bottom: 30px;
}

/* select 组件的样式 */
.select-wrapper {
  position: relative;
  width: 100%;
}

.styled-select {
  width: 100%;
  padding: 12px 32px 12px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fff;
  appearance: none; /* 去掉默认箭头 */
  font-size: 1rem;
  font-weight: 500;
  color: #333;
  outline: none;
  cursor: pointer;
  transition: border-color 0.3s ease;
  white-space: nowrap; /* 强制单行显示 */
  overflow: hidden; /* 超出部分隐藏 */
  text-overflow: ellipsis; /* 超出部分用省略号显示 */
  direction: rtl; /* 文字从右到左显示 */
  text-align: left; /* 文字对齐到左侧 */
}

.styled-select:hover {
  border-color: #4caf50;
}

.styled-select:focus {
  border-color: #4caf50;
}

.select-wrapper::after {
  content: '▼';
  font-size: 0.8rem;
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
  pointer-events: none;
}

/* 添加省略号的效果 */
option {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
}


/* 充币详情 */
.recharge-details-section {
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.recharge-details {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.qrcode {
  width: 150px;
  height: 150px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.address-section {
  margin-left: 20px;
}

.detail-label {
  font-size: 1rem;
  font-weight: bold;
  margin-bottom: 5px;
  color: #333;
}

.copy-btn, .add-btn {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;
  margin-top: 10px;
}

.copy-btn:hover, .add-btn:hover {
  background-color: #45a049;
}

.copy-btn:disabled, .add-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.recharge-info p {
  margin: 8px 0;
  font-size: 0.9rem;
  color: #666;
}

.recharge-info p strong {
  color: #333;
}

/* 表格样式 */
.recharge-history {
  margin-top: 40px;
}

.recharge-history h3 {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 15px;
  text-align: left;
}

.recharge-history table {
  width: 100%;
  border-collapse: collapse;
}

.recharge-history th,
.recharge-history td {
  border: 1px solid #ddd;
  padding: 12px 16px;
  font-size: 0.9rem;
}

.recharge-history th {
  background-color: #f7f7f7;
  text-align: left;
}

.recharge-history tr:nth-child(even) {
  background-color: #f9f9f9;
}
</style>
