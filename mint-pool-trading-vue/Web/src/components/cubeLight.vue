<template>
  <div class="cubeLight">
    <div class="box">
      <div class="cube"></div>
    </div>
  </div>
</template>

<script setup>

</script>

<style scoped lang="scss">
.cubeLight {
  width: 100%;
  margin-top: 10%;
  transform: rotate(-15deg);
}

.box {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 200px;
  -webkit-box-reflect: below 1px linear-gradient(transparent, #0004);
  animation: translate 1.5s ease-in-out infinite;
}

@keyframes translate {
  0% {
    transform: translateX(0px);
  }

  100% {
    transform: translateX(-200px);
  }
}

.cube {
  width: 200px;
  height: 200px;
  border-radius: 10px;
  background-color: var(--color-dashboard-green);
  box-shadow: 0 0 5px var(--color-dashboard-green-op),
  0 0 25px var(--color-dashboard-green-op),
  0 0 50px var(--color-dashboard-green-op),
  0 0 100px var(--color-dashboard-green-op),
  0 0 200px var(--color-dashboard-green-op2),
  0 0 300px var(--color-dashboard-green-op2);
  transform-origin: bottom right;
  animation: rotate 1.5s ease-in-out infinite;
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }

  60% {
    transform: rotate(90deg);
  }

  65% {
    transform: rotate(85deg);
  }

  70% {
    transform: rotate(90deg);
  }

  75% {
    transform: rotate(87.5deg);
  }

  100% {
    transform: rotate(90deg);
  }

}
</style>
