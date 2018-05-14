//第三方vendor组件库
import bbecharts from './bb-echarts';
import bbeditormd from './bb-editor-md.vue';
import bbeditorwe from './bb-editor-weditor';
import bbjson from './bb-json.vue';


export default {
	install: function(Vue) {
		console.log("begin vendor bb init....");

		Vue.component('bb-echarts', bbecharts);
		Vue.component('bb-editor-md', bbeditormd);
		Vue.component('bb-editor-weditor', bbeditorwe);
		Vue.component('bb-json', bbjson);

		console.log("finish vendor bb init;");
	}
};