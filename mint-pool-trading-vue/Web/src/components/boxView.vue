<template>
  <div class="boxView">
    <img :src="icon"/>
    <el-divider />
    <div class="title" @click="openBox">{{title}}</div>
  </div>
</template>

<script setup>
const props = defineProps(["name", "title", "icon"]);
// emit openBox
const emit = defineEmits(["openBox"]);
const {name, title, icon} = toRefs(props);

const openBox = () => {
  emit("openBox");
};

</script>

<style scoped lang="scss">
.boxView {
  width: 300px;
  height: 360px;
  background-color: var(--color-dashboard-bg-active);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  img {
    width: 100%;
  }
  .title {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    font-size: 20px;
    line-height: 3;
    &:hover {
      background-color: var(--color-dashboard-green-op2);
    }
  }

}
</style>
