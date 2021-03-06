//Module相关积木
import bbapiinfo from './bb-api-info.vue';
import bbapilegoconfig from './bb-apilego-config.vue';
import bbbbselect from './bb-bb-select.vue';
import bbbblistselect from './bb-bblist-select';
import bbbbtypeselect from './bb-bbtype-select';
import bbbuttonselect from './bb-button-select';
import bbcolumnsselect from './bb-columns-select';
import bbconfigarray from './bb-config-array.vue';
import bbconfig from './bb-config.vue';
import bbdsselect from './bb-ds-select';
import bbechartsselect from './bb-echarts-select.vue';
import bbfieldselect from './bb-field-select.vue';
import bbfieldtreepopselect from './bb-field-tree-pop-select.vue';
import bbfieldtreeselect from './bb-field-tree-select.vue';
import bbiconselect from './bb-icon-select.vue';
import bbicon from './bb-icon.vue';
import bbcsseditor from './bb-css-editor.vue';
import bbbuttoncsseditor from './bb-button-css-editor.vue';
import bbsmsverification from './bb-sms-verification.vue';
import bbmodule from './bb-module.vue';
import bbbuttonattributeconfig from './bb-button-attribute-config.vue';
import bbdscolumnselect from './bb-ds-column-select.vue';
import bbbuzzselect from './bb-buzz-select.vue';

export default {
	install: function(Vue) {
		Vue.component('bb-api-info', bbapiinfo);
		Vue.component('bb-apilego-config', bbapilegoconfig);
		Vue.component('bb-bb-select', bbbbselect);
		Vue.component('bb-bblist-select', bbbblistselect);
		Vue.component('bb-bbtype-select', bbbbtypeselect);
		Vue.component('bb-button-select', bbbuttonselect);
		Vue.component('bb-columns-select', bbcolumnsselect);
		Vue.component('bb-config-array', bbconfigarray);
		Vue.component('bb-config', bbconfig);
		Vue.component('bb-ds-select', bbdsselect);
		Vue.component('bb-echarts-select', bbechartsselect);
		Vue.component('bb-field-select', bbfieldselect);
		Vue.component('bb-field-tree-pop-select', bbfieldtreepopselect);
		Vue.component('bb-field-tree-select', bbfieldtreeselect);
		Vue.component('bb-icon-select', bbiconselect);
		Vue.component('bb-icon', bbicon);
		Vue.component('bb-css-editor', bbcsseditor);
		Vue.component('bb-button-css-editor', bbbuttoncsseditor);
		Vue.component('bb-sms-verification', bbsmsverification);
		Vue.component('bb-module', bbmodule);
		Vue.component('bb-button-attribute-config', bbbuttonattributeconfig);
		Vue.component('bb-ds-column-select', bbdscolumnselect);
		Vue.component('bb-buzz-select', bbbuzzselect);

		console.log("成功加载模块积木;");
	}
};