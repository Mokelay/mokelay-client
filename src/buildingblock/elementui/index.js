//ElementUI积木
import bbautocomplete from './buildingblock/bb-autocomplete';
import bbbreadcrumb from './buildingblock/bb-breadcrumb';
import bbcard from './buildingblock/bb-card';
import bbcascader from './buildingblock/bb-cascader.vue';
import bbcolorpicker from './buildingblock/bb-color-picker';
import bbdatepicker from './buildingblock/bb-date-picker';
import bbdropdown from './buildingblock/bb-dropdown.vue';
import bbEleLogin from './bb-ele-login';
import bbinput from './buildingblock/bb-input';
import bbpagination from './buildingblock/bb-pagination.vue';
import bbpanel from './buildingblock/bb-panel.vue';
import bbslider from './buildingblock/bb-slider.vue';
import bbsteps from './buildingblock/bb-steps';
import bbtag from './buildingblock/bb-tag';
import bbtransfer from './buildingblock/bb-transfer';
import bbupload from './buildingblock/bb-upload.vue';

import ElTreeGrid from 'element-tree-grid';

export default {
	install: function(Vue) {
		console.log("begin elementui bb init....");

		Vue.component('bb-autocomplete', bbautocomplete);
		Vue.component('bb-breadcrumb', bbbreadcrumb);
		Vue.component('bb-card', bbcard);
		Vue.component('bb-cascader', bbcascader);
		Vue.component('bb-color-picker', bbcolorpicker);
		Vue.component('bb-date-picker', bbdatepicker);
		Vue.component('bb-dropdown', bbdropdown);
		Vue.component('bb-ele-login', bbEleLogin);
		Vue.component('bb-input', bbinput);
		Vue.component('bb-pagination', bbpagination);
		Vue.component('bb-panel', bbpanel);
		Vue.component('bb-slider', bbslider);
		Vue.component('bb-steps', bbsteps);
		Vue.component('bb-tag', bbtag);
		Vue.component('bb-transfer', bbtransfer);
		Vue.component('bb-upload', bbupload);

		Vue.component(ElTreeGrid.name, ElTreeGrid);

		console.log("finish elementui bb init;");
	}
};