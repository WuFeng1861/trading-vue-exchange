<template>
  <div class="my-table-container" ref="myTableContainerRef">
    <el-table :data="tableData" class="my-table" :height="tableHeight" :row-class-name="tableRowClassName"  v-el-table-infinite-scroll="onInfiniteScroll">
      <el-table-column :prop="item.prop" :label="item.label" :width="item.width" v-for="item in tableHeader"
                       class="my-table-column"/>
      <el-table-column :label="actionColumn.label" :width="actionColumn.width">
        <template #default="scope">
          <slot :$index="scope.$index" :row="scope.row"></slot>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { default as vElTableInfiniteScroll } from "el-table-infinite-scroll";

// props are defined here
const props = defineProps({
  tableData: {
    type: Array,
    required: true
  },
  // tableHeader is an array of objects, each object has two properties: prop and label
  tableHeader: {
    type: Array,
    required: true,
    validator: (value) => {
      return value.every((item) => {
        return typeof item.prop === "string" && typeof item.label === "string";
      });
    }
  },
  actionColumn: {
    type: Object,
  },
  rowClassNameFn: {
    type: Function,
    default: () => {}
  },
  onInfiniteScroll: {
    type: Function,
    default: () => {}
  }
});

const tableRowClassName = (row, rowIndex) => {
  if(props.rowClassNameFn) {
    return props.rowClassNameFn(row, rowIndex);
  }
};

const myTableContainerRef = ref(null);
const tableHeight = ref(0);
const updateTableHeight = () => {
  // 获取myTableContainerRef的高度
  const containerHeight = myTableContainerRef.value.offsetHeight;
  // 计算表格的高度
  tableHeight.value = containerHeight - 40;
};
// watch the tableData to update the tableHeight
watch(() => props.tableData, (newValue) => {
  // console.log("tableData changed", newValue);
  updateTableHeight();
});

onMounted(() => {
  updateTableHeight();
});
</script>

<style scoped lang="scss">
.my-table-container {
  width: 100%;
  height: 100%;
  overflow: auto;

  :deep(.el-table) {
    background-color: var(--exchange-main-bg);
  }

  :deep(.el-table th.el-table__cell) {
    background-color: var(--exchange-main-bg);
  }

  :deep(.el-table th.el-table__cell) {
    background-color: var(--exchange-main-bg);
    border-bottom: 5px solid var(--exchange-black);
  }
  :deep(.el-table__inner-wrapper) {
    &::before {
      border-bottom: 2px solid var(--exchange-black);
    }
  }
  :deep(.el-table__row) {
    color: var(--color-dashboard-white);
    background-color: var(--exchange-main-bg);
    .el-table__cell {
      border-bottom: 2px solid var(--exchange-black);
    }
  }
  :deep(.el-table--enable-row-hover .el-table__body tr:hover>td.el-table__cell) {
    background-color: var(--exchange-grey-highlight);
  }

  .my-table {
    width: 100%;
  }
}
</style>
