<template>
  <el-dialog draggable :title="title" :model-value="visible" @closed="close" class="myDialog" :width="width">
    <div class="dialogContainer">
      <slot></slot>
    </div>
  </el-dialog>
</template>

<script setup>
const props = defineProps(['visible', 'title', 'width']);
const emit = defineEmits(['cancel', 'update:visible']);
const {
  visible,
  title,
  width
} = toRefs(props);

const close = () => {
  emit('update:visible', false);
  emit('cancel');
};
</script>

<style lang="scss">
.myDialog {
  background-color: var(--color-dashboard-bg-grey) !important;
  .el-dialog__title {
    color: var(--color-dashboard-white) !important;
  }
  .dialogContainer {
    width: 100%;
    border-radius: 20px;
    display: flex;
    flex-direction: column;

    .el-input-number {
      width: 100%;
    }
    .el-form-item__label {
      color: var(--color-dashboard-white);
    }
    .el-input__wrapper {
      background-color: var(--color-dashboard-bg-grey);
    }
  }
}
</style>
