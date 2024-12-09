<template>
  <div>
    <canvas ref="qrcodeCanvas"></canvas>
  </div>
</template>

<script>
import QRCode from 'qrcode-generator';

export default {
  props: {
    text: {
      type: String,
      required: true,
      default: 'null',
    },
    size: {
      type: Number,
      default: 256,
    },
    foregroundColors: {
      type: Array,
      default: () => ['#ff9900', '#00cc66', '#ffcc00', '#009966'], // 四种颜色
    },
    backgroundColor: {
      type: String,
      default: '#ffffff', // 背景颜色
    },
  },
  mounted() {
    this.generateQRCode();
  },
  methods: {
    generateQRCode() {
      const qr = QRCode(1, 'L'); // 创建二维码对象，'L' 表示低容错级别
      qr.addData(this.text); // 添加内容数据
      qr.make(); // 生成二维码矩阵

      const moduleCount = qr.getModuleCount(); // 获取二维码模块的数量
      const canvas = this.$refs.qrcodeCanvas;
      const ctx = canvas.getContext('2d');
      const tileSize = this.size / moduleCount; // 每个模块的大小

      canvas.width = canvas.height = this.size; // 设置 canvas 大小

      // 绘制背景色
      ctx.fillStyle = this.backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // x和y在一定差距内颜色相同
      let colorIndexFunc = (x, y) => {
        // 如果x大于等于y，且差距小于等于1/2moduleCount，则返回0
        if (x >= y && x - y <= moduleCount / 2) {
          return 0;
        }
        // 如果x大于等于y-1/2moduleCount，且差距小于等于1/2moduleCount，则返回1
        if (x >= y + moduleCount / 2 && x - y - moduleCount / 2 <= moduleCount / 2) {
          return 1;
        }
        // 如果x小于y，且差距小于等于1/2moduleCount，则返回2
        if (x < y && y - x <= moduleCount / 2) {
          return 2;
        }
        // 如果x小于y+1/2moduleCount，且差距小于等于1/2moduleCount，则返回3
        if (x < y - moduleCount / 2 && y - x - moduleCount / 2 <= moduleCount / 2) {
          return 3;
        }
      };

      // 绘制二维码模块
      for (let row = 0; row < moduleCount; row++) {
        for (let col = 0; col < moduleCount; col++) {
          const isDark = qr.isDark(row, col); // 判断模块是否为黑色
          if (isDark) {
            // 根据位置来决定颜色
            const colorIndex = colorIndexFunc(row, col);

            ctx.fillStyle = this.foregroundColors[colorIndex]; // 应用颜色
            ctx.fillRect(col * tileSize, row * tileSize, tileSize, tileSize); // 绘制方块
          }
        }
      }
    },
  },
};
</script>

<style scoped>
canvas {
  display: block;
  margin: 20px auto;
}
</style>
