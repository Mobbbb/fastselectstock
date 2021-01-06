import Vue from 'vue';
import VueRouter from 'vue-router';
import Index from '../views/Index.vue';

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'index',
        component: Index
    },
    {
        path: '/strategyDetail',
        name: 'StrategyDetail',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "strategyDetail" */ '../views/StrategyDetail.vue')
    },
    {
        path: '/searchList',
        name: 'SearchList',
        component: () => import(/* webpackChunkName: "searchList" */ '../views/SearchList.vue')
    },
];

const router = new VueRouter({
    routes,
});

export default router;
