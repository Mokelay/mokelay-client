import 'babel-polyfill';

import Vue from 'vue';
import VueRouter from 'vue-router';
import ElementUI from 'element-ui';

//初始化基础组件
Vue.use(VueRouter);
Vue.use(ElementUI);

import env from './env/';
env.init("H5");

//引用TY核心
import TY from '../../src/h5';
Vue.use(TY);

// 路由配置
const router = new VueRouter({
    mode: 'hash',
    routes: [{
        path: '/',
        redirect: to => {
            return window._TY_Home;
        }
    }, {
        path: '/:appAlias/index',
        meta: {
            title: '应用首页'
        },
        component: (resolve) => require(['./index.vue'], resolve),
        children: [{
            path: '/:appAlias/index/:pageAlias',
            meta: {},
            component: (resolve) => require(['./ty.vue'], resolve)
        }]
    }, {
        path: '/:pageAlias',
        meta: {},
        component: (resolve) => require(['./ty.vue'], resolve)
    }]
});
router.afterEach(() => {
    window.scrollTo(0, 0);
});

new Vue({
    el: '#app',
    router: router
});