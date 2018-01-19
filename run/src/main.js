import 'babel-polyfill';

import Vue from 'vue';
import VueRouter from 'vue-router';
import Vuex from 'vuex';
import ElementUI from 'element-ui';

//初始化基础组件
Vue.use(VueRouter);
Vue.use(Vuex);
Vue.use(ElementUI);


//常量配置
import env from './env/env';
import envConfig from './env/env_config';
var _env = env[envConfig];
window._TY_ENV = _env;
window._TY_ContentPath = "/config";
window._TY_APIHost = _env.apiHost;
window._TY_SSOURL = _env.ssoURL;
window._TY_Page_Data = {};


//定制化VUE
// import bbcustom from './custom/bb-custom';
// Vue.component('bb-custom', bbcustom);

//引用TY核心
import TY from '../../src/index';
TY.install(Vue);

// 路由配置
const router = new VueRouter({
	mode: 'hash',
	routes: [{
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