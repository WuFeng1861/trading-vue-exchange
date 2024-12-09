<template>
  <div class="myTable">
    <el-table :data="tableData" style="width: 100%" row-class-name="tableRowClassName" header-row-class-name="tableRowClassName">
      <el-table-column :prop="item.key" :label="item.title" :width="item.width" v-for="item in tableHeader"/>
    </el-table>
  </div>
</template>

<script setup>
const props = defineProps(['tableData', 'tableHeader']);
const {tableData, tableHeader} = toRefs(props);
</script>

<style scoped lang="scss">
.myTable {
  width: 100%;
  height: auto;
  :deep(.tableRowClassName) {
    background-color: var(--color-dashboard-black) !important;
    color: var(--color-dashboard-white) !important;
  }
  :deep(.el-table th.el-table__cell) {
    background-color: var(--color-dashboard-black) !important;
    color: var(--color-dashboard-white) !important;
  }
  :deep(.el-table--enable-row-hover .el-table__body tr:hover>td.el-table__cell) {
    background-color: var(--color-dashboard-bg-grey) !important;
    color: var(--color-dashboard-white) !important;
  }
}
</style>
