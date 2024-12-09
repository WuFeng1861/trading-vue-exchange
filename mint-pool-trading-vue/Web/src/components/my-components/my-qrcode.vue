<template>
  <div class="my-qrcode">
    <div class="code-qrcode" ref="qrcodeOutRef">
      <canvas ref="qrcodeRef" class="qrcode"/>
    </div>
  </div>
</template>

<script setup>
import qrcode from 'qrcode';
// props data
const props = defineProps({
  data: {
    type: String,
    required: true
  }
})

const qrcodeRef = ref(null);
const qrcodeOutRef = ref(null);

const initQrcode = () => {
  if (!props.data || !qrcodeRef.value) {
    console.log('before initQrcode', props.data, qrcodeRef.value)
    setTimeout(() => {
      initQrcode();
    }, 200);
    return;
  }
  // 获取qrcodeOutRef的宽高
  const qrcodeOutWidth = qrcodeOutRef.value.offsetWidth;
  const qrcodeOutHeight = qrcodeOutRef.value.offsetHeight;
  console.log('qrcodeOutWidth', qrcodeOutWidth, 'qrcodeOutHeight', qrcodeOutHeight)
  // 设置qrcode的宽高
  const qrcodeWidth = qrcodeOutWidth - 20;
  const qrcodeHeight = qrcodeOutHeight - 20;
  // 生成二维码
  qrcode.toCanvas(qrcodeRef.value, props.data, {
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
initQrcode();

// watch props.data
watch(props.data, () => {
  initQrcode();
});
</script>

<style scoped lang="scss">
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
</style>
