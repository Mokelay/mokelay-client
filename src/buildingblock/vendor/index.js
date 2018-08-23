//第三方vendor组件库
import bbecharts from './bb-echarts';
import bbeditormd from './bb-editor-md.vue';
import bbeditorwe from './bb-editor-weditor';
import bbjson from './bb-json.vue';
import bbrelationchart from './bb-relation-chart';
import bbmap from './map/bb-map.vue';
import bbcalendar from './bb-calendar/bb-calendar';
import bbpdf from './bb-pdf/bb-pdf';

export default {
	install: function(Vue) {
		Vue.component('bb-echarts', bbecharts);
		Vue.component('bb-editor-md', bbeditormd);
		Vue.component('bb-editor-weditor', bbeditorwe);
		Vue.component('bb-json', bbjson);
		Vue.component('bb-relation-chart', bbrelationchart);
		Vue.component('bb-map', bbmap);
		Vue.component('bb-calendar', bbcalendar);
		Vue.component('bb-pdf', bbpdf);

		console.log("成功加载Vendor类库积木;");
	}
};