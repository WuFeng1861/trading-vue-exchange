export const exchangeRoute = {
    path: '/exchange',
    component: () => import('@/view/exchangeView/componentsNew/exchangeNew.vue'),
    name: 'exchange',
    meta: {
        title: '水星交易所',
        type: 'all'
    }
};

// 这个表示可以异步
export const exchangeRouterBeforeResolve = async (to, from, next) => {
    // 先判断路由是不是在交易所路由
    if (to.matched.some(record => record.name === 'exchange')) {
        next();
    }
}
