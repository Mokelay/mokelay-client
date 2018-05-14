//ElementUI积木
import bbautocomplete from './bb-autocomplete';
import bbbadge from './bb-badge';
import bbbreadcrumb from './bb-breadcrumb';
import bbcard from './bb-card';
import bbcascader from './bb-cascader.vue';
import bbcolorpicker from './bb-color-picker';
import bbdatepicker from './bb-date-picker';
import bbdropdown from './bb-dropdown.vue';
import bbEleLogin from './bb-ele-login';
import bbinputnumber from './bb-input-number';
import bbinput from './bb-input';
import bbpagination from './bb-pagination.vue';
import bbpanel from './bb-panel.vue';
import bbslider from './bb-slider.vue';
import bbsteps from './bb-steps';
import bbtag from './bb-tag';
import bbtextarea from './bb-textarea';
import bbtransfer from './bb-transfer';
import bbupload from './bb-upload.vue';

import ElTreeGrid from 'element-tree-grid';

export default {
	install: function(Vue) {
		console.log("begin elementui bb init....");

		Vue.component('bb-autocomplete', bbautocomplete);
		Vue.component('bb-badge', bbbadge);
		Vue.component('bb-breadcrumb', bbbreadcrumb);
		Vue.component('bb-card', bbcard);
		Vue.component('bb-cascader', bbcascader);
		Vue.component('bb-color-picker', bbcolorpicker);
		Vue.component('bb-date-picker', bbdatepicker);
		Vue.component('bb-dropdown', bbdropdown);
		Vue.component('bb-ele-login', bbEleLogin);
		Vue.component('bb-input-number', bbinputnumber);
		Vue.component('bb-input', bbinput);
		Vue.component('bb-pagination', bbpagination);
		Vue.component('bb-panel', bbpanel);
		Vue.component('bb-slider', bbslider);
		Vue.component('bb-steps', bbsteps);
		Vue.component('bb-tag', bbtag);
		Vue.component('bb-textarea', bbtextarea);
		Vue.component('bb-transfer', bbtransfer);
		Vue.component('bb-upload', bbupload);

		Vue.component(ElTreeGrid.name, ElTreeGrid);

		console.log("finish elementui bb init;");
	}
};