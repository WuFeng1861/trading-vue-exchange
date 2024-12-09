<template>
  <div class="textWave">
    <span :style="`font-size: ${sizeNew}`">{{text}}</span>
    <span :style="`font-size: ${sizeNew}`">{{text}}</span>
  </div>
</template>

<script setup>
// props text size
const props = defineProps(['text', 'size']);
const {text, size} = toRefs(props);
const sizeNew = computed(() => {
  return `${size.value || 24}px`
})

</script>

<style scoped lang="scss">
@keyframes waveText {
  0%, 100% {
    clip-path: polygon(0% 72%, 9% 63%, 22% 55%, 30% 56%, 40% 63%, 49% 78%, 61% 85%, 78% 85%, 90% 78%, 100% 68%, 100% 100%, 0 100%);
  }
  50% {
    clip-path: polygon(0% 72%, 9% 83%, 19% 90%, 30% 90%, 41% 85%, 54% 71%, 64% 58%, 76% 56%, 87% 62%, 100% 73%, 100% 100%, 0 100%);
  }
}
.textWave {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  position: relative;
  user-select: none;
  span {
    position: absolute;
    &:first-child {
      -webkit-text-stroke: var(--color-dashboard-bg-active) 2px;
      color: transparent;
    }
    &:last-child {
      color: var(--color-dashboard-green);
      animation: waveText 3s ease-in-out infinite;
    }
  }
}
// clip-path: polygon(1% 62%, 8% 56%, 20% 52%, 30% 49%, 39% 54%, 45% 61%, 51% 67%, 59% 71%, 71% 74%, 84% 70%, 98% 65%, 99% 100%, 1% 100%);
// clip-path: polygon(0% 50%, 8% 57%, 16% 61%, 26% 65%, 38% 63%, 48% 55%, 57% 46%, 65% 42%, 75% 42%, 82% 47%, 90% 52%, 95% 57%, 99% 64%, 100% 99%, 1% 98%, 1% 98%, 0% 100%);

</style>
