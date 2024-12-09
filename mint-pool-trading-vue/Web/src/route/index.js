import {createRouter, createWebHistory} from "vue-router";
import bus from "@/bus/mitt.js";
import {walletRoute, walletRouterBeforeResolve} from "@/route/walletRoute/index.js";
import {useUpdateInLogin} from "@/composition/useRouter.js";
import {exchangeRoute, exchangeRouterBeforeResolve} from "@/route/exchangeRoute/index2.js";

// 取钱路由
const withdraw = () => {
  return {
    path: '/Home/withdraw--self',
    component: () => import('../view/selfView/withdraw--self.vue'),
    name: 'withdraw--self',
    meta: {
      title: '合约',
      arr: ['合约'],
      type: 'all',
      keepAlive: false
    }
  }
}

const routes = [
  {
    path: '/',
    component: () => import('../view/login.vue'),
    name: 'login',
    meta: {
      title: '登录',
      type: 'all'
    }
  },
  {
    path: '/register',
    component: () => import('../view/register.vue'),
    name: 'register',
    meta: {
      title: '注册',
      type: 'all'
    }
  },
  {
    path: '/find',
    component: () => import('../view/findpwd.vue'),
    name: 'findpwd',
    meta: {
      title: '找回密码',
      type: 'all'
    }
  },
  {
    path: '/update',
    component: () => import('../view/updatepwd.vue'),
    name: 'updatepwd',
    meta: {
      title: '更新密码',
      type: 'all'
    }
  },
  {
    path: '/gptview',
    component: () => import('../view/gptView/index.vue'),
    name: 'gptview',
    meta: {
      title: 'gpt页面',
      type: 'all'
    }
  },
  // {
  //   path: '/Home',
  //   component: () => import('../view/home.vue'),
  //   name: 'Home',
  //   meta: {
  //     title: '首页',
  //     type: 'all'
  //   },
  //   children: [
  //     {
  //       path: '/Home/dashboard',
  //       component: () => import('../view/homeView/dashboard.vue'),
  //       name: 'dashboard',
  //       meta: {
  //         title: 'Merc Net',
  //         arr: ['Merc Net'],
  //         type: 'all',
  //         keepAlive: true
  //       }
  //     },
  //     {
  //       path: '/Home/recommend',
  //       component: () => import('../view/homeView/recommend.vue'),
  //       name: 'recommend',
  //       meta: {
  //         title: '推荐奖励',
  //         arr: ['推荐奖励'],
  //         type: 'all',
  //         keepAlive: true
  //       }
  //     },
  //     {
  //       path: '/Home/reward',
  //       component: () => import('../view/homeView/reward.vue'),
  //       name: 'reward',
  //       meta: {
  //         title: '阶段奖励',
  //         arr: ['阶段奖励'],
  //         type: 'all',
  //         keepAlive: true
  //       }
  //     },
  //     {
  //       path: '/Home/box',
  //       component: () => import('../view/homeView/blindbox.vue'),
  //       name: 'box',
  //       meta: {
  //         title: '盲盒',
  //         arr: ['盲盒'],
  //         type: 'all',
  //         keepAlive: true
  //       }
  //     },
  //     {
  //       path: '/Home/layout',
  //       component: () => import('../view/homeView/layout.vue'),
  //       name: 'layout',
  //       meta: {
  //         title: '规划',
  //         arr: ['规划'],
  //         type: 'all',
  //         keepAlive: true
  //       }
  //     },
  //     withdraw(),
  //   ]
  // },
  // walletRoute,
  exchangeRoute,
];

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_PATH), // 路由类型
  routes
});

let whiteList = ['login', 'register', 'findpwd', 'updatepwd', 'gptview']; // 不需要登录的页面
// Home路由前拦截
const homeRouterBeforeResolve = (to, from, next) => {
  if (to.matched.some(record => record.name === 'Home')) {
    next();
  }
}
// 路由前拦截
router.beforeEach((to, from, next) => {
  console.log(to, 'beforeEach to');
  if (whiteList.indexOf(to.name) !== -1) {
    next();
    return;
  }
  let token = localStorage.getItem('token');
  let id = localStorage['id'];
  if (token && id) {
    homeRouterBeforeResolve(to, from, next);
    walletRouterBeforeResolve(to, from, next);
    exchangeRouterBeforeResolve(to, from, next);
  } else {
    next('/');
  }
});

// 路由后拦截
router.afterEach((to, from) => {
  let isInLogin = whiteList.indexOf(to.name) !== -1;
  useUpdateInLogin(isInLogin);

  bus.$emit('updateTitle', to.meta.title);
});

export default router;
