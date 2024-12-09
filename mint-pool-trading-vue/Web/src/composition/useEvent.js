import bus from "@/bus/mitt.js";

window.onresize = (e) => {
  bus.$emit('resizeWindow', e)
}
