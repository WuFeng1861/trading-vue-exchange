export const exchangeRoute = {
  path: '/exchange',
  component: () => import('@/view/exchangeView/exchange.vue'),
  name: 'exchange',
  meta: {
    title: '水星交易所',
    type: 'all'
  },
  children: [
    {
      path: '/exchange/main',
      component: () => import('@/view/exchangeView/main.vue'),
      name: 'main',
      meta: {
        title: '水星交易所',
        arr: ['exchange', 'main'],
        type: 'all',
        keepAlive: true
      }
    },
    {
      path: '/exchange/rwview/:type',
      component: () => import('@/view/exchangeView/recharge-withdraw.vue'),
      name: 'rwview',
      meta: {
        title: '水星交易所',
        arr: ['exchange', 'recharge'],
        type: 'all',
        keepAlive: true
      }
    },
  ]
};

// 这个表示可以异步
export const exchangeRouterBeforeResolve = async (to, from, next) => {
  // 先判断路由是不是在交易所路由
  if (to.matched.some(record => record.name === 'exchange')) {
    next();
  }
}
