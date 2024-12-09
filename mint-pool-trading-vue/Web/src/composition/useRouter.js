import bus from "@/bus/mitt.js";
import {elTip, routerTo} from "@/utils/index.js";

const titleRef = ref('');
// 获取当前路由的面包屑
export const getCurRouterBreadcrumb = () => {
  return titleRef;
}

bus.$on('updateTitle', (title) => {
  titleRef.value = title;
})

// ----------------------------------
// 在不在白名单页面
const inLogin = ref(false);
export const useToLogin = (tip) => {
  if(inLogin.value) {
    return;
  }
  tip && elTip(tip, 'error');
  routerTo('login');
  inLogin.value = true;
}

export const useUpdateInLogin = (state) => {
  console.log(state)
  inLogin.value = state;
}
