import Vue from 'vue';
import VueRouter from 'vue-router';
import ElementUI from 'element-ui';

export default {
	init: function() {
		console.log("开始初始化TY Root内核...");
		//初始化基础组件
		Vue.use(VueRouter);
		Vue.use(ElementUI);

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
				path: '/:appAlias/b_index',
				meta: {
					title: '应用首页'
				},
				component: (resolve) => require(['./index.vue'], resolve),
				children: [{
					path: '/:appAlias/b_index/:pageAlias',
					meta: {},
					component: (resolve) => require(['./ty.vue'], resolve)
				}]
			}, {
				path: '/:pageAlias',
				meta: {},
				component: (resolve) => require(['./ty.vue'], resolve)
			}]
		});
		router.beforeEach((to, from, next) => {
			// to 和 from 都是 路由信息对象
			// 这里的from.path就是上一步的url的hash值
			//上一页的router对象放到全局变量中
			window._TY_Prev_Router = from;
			next();
		});
		router.afterEach(() => {
			window.scrollTo(0, 0);
		});

		new Vue({
			el: '#app',
			router: router
		});
	}
};