<template>
  <div class="receive-code">
    <div class="receive-code-container">
      <p class="receive-code-Tips">
        该地址为您绑定的BSC链地址，请勿使用在其他平台转账。
      </p>
      <div class="code-qrcode" ref="qrcodeOutRef">
        <canvas ref="qrcodeRef" class="qrcode"/>
      </div>
      <el-button type="primary" style="width: 100%;" @click="copyToClipboard(mybalance.address)">复制地址</el-button>
    </div>
  </div>
</template>

<script setup>
import qrcode from 'qrcode';
import {useMyBalanceRef} from "@/composition/mint/useMyBalance.js";
import bus from "@/bus/mitt.js";
import {copyToClipboard} from "@/utils/index.js";

const mybalance = useMyBalanceRef();
const qrcodeRef = ref(null);
const qrcodeOutRef = ref(null);

const initQrcode = () => {
  if(!mybalance.value?.address || !qrcodeRef.value) {
    console.log('before initQrcode', mybalance.value?.address, qrcodeRef.value)
    setTimeout(() => {
      initQrcode();
    }, 200);
    return;
  }
  // 获取qrcodeOutRef的宽高
  const qrcodeOutWidth = qrcodeOutRef.value.offsetWidth;
  const qrcodeOutHeight = qrcodeOutRef.value.offsetHeight;
  // 设置qrcode的宽高
  const qrcodeWidth = qrcodeOutWidth - 20;
  const qrcodeHeight = qrcodeOutHeight - 20;
  // 生成二维码
  qrcode.toCanvas(qrcodeRef.value, mybalance.value.address, {
    width: qrcodeWidth,
    height: qrcodeHeight,
    margin: 1,
    color: {
      dark: '#000000',
      light: '#ffffff'
    }
  }, (error) => {
    if (error) console.error(error);
  });
}
onMounted(() => {
  // 设置标题
  bus.$emit('updateWalletTitle', '收款');
  initQrcode();
});
</script>

<style scoped lang="scss">
.receive-code {
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
  .receive-code-container {
    display: flex;
    width: 100%;
    flex-direction: column;
    align-items: center;
    margin-top: 50px;
    border-radius: 10px;
    background-color: var(--wallet-mobile-grey-bg);
    padding: 20px;
    .receive-code-Tips {
      font-size: 12px;
      background-color: var(--wallet-mobile-main-bg);
      color: var(--color-dashboard-white);
      padding: 10px;
      border-radius: 5px;
      margin-bottom: 20px;
      text-align: center;
      width: 100%;
      max-width: 300px;
      box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
      position: relative;
      z-index: 1;
    }
    .code-qrcode {
      width: 100%;
      padding-top: 100%;
      position: relative;
      canvas {
        position: absolute;
        top: 0;
        left: 10px;
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
