//ElementUI积木
import bbautocomplete from './bb-autocomplete';
import bbbadge from './bb-badge';
import bbbreadcrumb from './bb-breadcrumb';
import bbbutton from './bb-button';
import bbcard from './bb-card';
import bbcascader from './bb-cascader.vue';
import bbcheckboxgroup from './bb-checkbox-group';
import bbcolorpicker from './bb-color-picker';
import bbdatepicker from './bb-date-picker';
import bbdropdown from './bb-dropdown.vue';
import bbeditorswitch from './bb-editor-switch';
import bbEleLogin from './bb-ele-login';
import bbhidden from './bb-hidden';
import bbinputnumber from './bb-input-number';
import bbinput from './bb-input';
import bblistscroll from './bb-list-scroll';
import bbpagination from './bb-pagination.vue';
import bbpanel from './bb-panel.vue';
import bbradiogroup from './bb-radio-group';
import bbselect from './bb-select';
import bbslider from './bb-slider.vue';
import bbsteps from './bb-steps';
import bbtabs from './bb-tabs';
import bbtag from './bb-tag';
import bbtextarea from './bb-textarea';
import bbtransfer from './bb-transfer';
import bbtreeselect from './bb-tree-select.vue';
import bbtree from './bb-tree.vue';
import bbupload from './bb-upload.vue';

import ElTreeGrid from 'element-tree-grid';

export default {
	install: function(Vue) {
		console.log("begin elementui bb init....");

		Vue.component('bb-autocomplete', bbautocomplete);
		Vue.component('bb-badge', bbbadge);
		Vue.component('bb-breadcrumb', bbbreadcrumb);
		Vue.component('bb-button', bbbutton);
		Vue.component('bb-card', bbcard);
		Vue.component('bb-cascader', bbcascader);
		Vue.component('bb-checkbox-group', bbcheckboxgroup);
		Vue.component('bb-color-picker', bbcolorpicker);
		Vue.component('bb-date-picker', bbdatepicker);
		Vue.component('bb-dropdown', bbdropdown);
		Vue.component('bb-editor-switch', bbeditorswitch);
		Vue.component('bb-ele-login', bbEleLogin);
		Vue.component('bb-hidden', bbhidden);
		Vue.component('bb-input-number', bbinputnumber);
		Vue.component('bb-input', bbinput);
		Vue.component('bb-list-scroll', bblistscroll);
		Vue.component('bb-pagination', bbpagination);
		Vue.component('bb-panel', bbpanel);
		Vue.component('bb-radio-group', bbradiogroup);
		Vue.component('bb-select', bbselect);
		Vue.component('bb-slider', bbslider);
		Vue.component('bb-steps', bbsteps);
		Vue.component('bb-tabs', bbtabs);
		Vue.component('bb-tag', bbtag);
		Vue.component('bb-textarea', bbtextarea);
		Vue.component('bb-transfer', bbtransfer);
		Vue.component('bb-tree', bbtree);
		Vue.component('bb-tree-select', bbtreeselect);
		Vue.component('bb-upload', bbupload);

		Vue.component(ElTreeGrid.name, ElTreeGrid);

		console.log("finish elementui bb init;");
	}
};