<template>
  <div class="rippleCircle" @click="clickCircle">
    <div class="rippleCircleContainer">
      <div class="circle" :style="`--top: ${top}`">
      </div>
      <div class="circleContent">
        {{ title }}
      </div>
    </div>
  </div>
</template>

<script setup>
// props top title
const props = defineProps(["top", "title"]);
const emit = defineEmits(["clickEvent", "update:top", "update:title"]);
const { top, title } = toRefs(props);

const clickCircle = () => {
  emit("clickEvent");
};

</script>

<style scoped lang="scss">
.rippleCircle {
  max-width: 40%;
  width: 300px;
  font-size: 25px;
  display: flex;
  align-self: center;
  background-color: #ffffff;
  border-radius: 50%;
  margin-bottom: 10px;
  box-shadow:  0px 0px 67px var(--color-dashboard-green);
  overflow: hidden;

  .rippleCircleContainer {
    width: 100%;
    position: relative;
    background-color: #ffffff;
    overflow: hidden;
    padding-top: 100%;

    .circle {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: transparent;
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 2;

      &::before {
        content: "";
        position: absolute;
        top: var(--top);
        left: 0;
        width: 200%;
        height: 200%;
        background-color: var(--color-dashboard-green);
        border-radius: 25%;
        transform-origin: 25% 50%;
        animation: rotate 5s linear infinite;
        z-index: 1;
      }
    }

    .circleContent {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #000000  ;
      z-index: 3;
    }
  }
  @keyframes rotate {
    0% {
      transform: rotate(0deg) translateX(-25%);
    }
    100% {
      transform: rotate(360deg) translateX(-25%);
    }

  }
}
</style>
