//第三方vendor组件库
import bbecharts from './bb-echarts';
import bbeditormd from './bb-editor-md.vue';
import bbeditorwe from './bb-editor-weditor';
import bbjson from './bb-json.vue';
import bbrelationchart from './bb-relation-chart';

export default {
	install: function(Vue) {
		console.log("begin vendor bb init....");

		Vue.component('bb-echarts', bbecharts);
		Vue.component('bb-editor-md', bbeditormd);
		Vue.component('bb-editor-weditor', bbeditorwe);
		Vue.component('bb-json', bbjson);
		Vue.component('bb-relation-chart', bbrelationchart);

		console.log("finish vendor bb init;");
	}
};