<template>
  <div class="radio">
    <input :checked="indexChecked === index" :value="item.value" name="gender" type="radio" :label="item.label" v-for="(item, index) in btnList" @click="handleClick(index)">
  </div>
</template>

<script setup>
// props btnList: {value: string, label: string}
const props = defineProps({
  btnList: {
    type: Array,
    default: () => [],
    required: true,
    validate: (value) => {
      return value.length > 0 && value.every((item) => {
        return typeof item === 'object' && 'value' in item && 'label' in item
      })
    }
  }
})

// emit change
const emit = defineEmits(['change'])

const indexChecked = ref(0);

const handleClick = (index) => {
  indexChecked.value = index;
  emit('change', props.btnList[index]);
}
</script>

<style scoped lang="scss">
.radio {
  background: #454857;
  padding: 4px;
  border-radius: 3px;
  box-shadow: inset 0 0 0 3px rgba(35, 33, 45, 0.3),
  0 0 0 3px rgba(185, 185, 185, 0.3);
  position: relative;
}

.radio input {
  width: auto;
  height: 100%;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  outline: none;
  cursor: pointer;
  border-radius: 2px;
  padding: 4px 8px;
  background: #454857;
  color: #bdbdbdbd;
  font-size: 14px;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
  "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji",
  "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  transition: all 100ms linear;
}

.radio input:checked {
  background-image: linear-gradient(180deg, #95d891, #74bbad);
  color: #fff;
  box-shadow: 0 1px 1px #0000002e;
  text-shadow: 0 1px 0px #79485f7a;
}

.radio input:hover {
  background-image: linear-gradient(180deg, #a0aaa0, #a2ddd2);;
  color: #fff;
  box-shadow: 0 1px 1px #0000002e;
  text-shadow: 0 1px 0px #79485f7a;
}

.radio input:before {
  content: attr(label);
  display: inline-block;
  text-align: center;
  width: 100%;
}

</style>
