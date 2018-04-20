import 'babel-polyfill';

import Vue from 'vue';
import VueRouter from 'vue-router';
import ElementUI from 'element-ui';

//初始化基础组件
Vue.use(VueRouter);
Vue.use(ElementUI);


//常量配置
var _env = {
    name: 'local',
    apiHost: "http://longyan.dev.rs.com", 
    ssoURL: "http://urms.dev.rs.com/passport/login?service=http://longyan.dev.rs.com/urmscallback",
    h5Host: '/dist',
    questionnaireHost: 'http://questionnaire.dev.rs.com'
};
window._TY_ENV = _env;
window._TY_ContentPath = "/config";
window._TY_APIHost = _env.apiHost;
window._TY_SSOURL = _env.ssoURL;
window._TY_Page_Data = {};
window._TY_HOSTS = {
    "default":window._TY_APIHost
};

//定制化VUE
import bbcustom from './custom/bb-custom';
Vue.component('bb-custom', bbcustom);

//引用TY核心
import TY from '../../src';
// TY.install(Vue);
Vue.use(TY);

// 路由配置
const router = new VueRouter({
    mode: 'hash',
    routes: [{
        path: '/',
        redirect: to => {
            return "/home";
        }
    }, {
        path: '/:appAlias/index',
        meta: {
            title: '应用首页'
        },
        component: (resolve) => require(['./custom/index.vue'], resolve),
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

import App from './app.vue';
new Vue({
    el: '#app',
    router: router,
    render: h => h(App)
});