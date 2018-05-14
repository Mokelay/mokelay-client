//pc 端积木
import bb from './buildingblock/bb';
import bbbuttongroup from './buildingblock/bb-button-group';
import bblist from './buildingblock/bb-list';
import bbdialog from './buildingblock/bb-dialog';
import bblistscroll from './buildingblock/bb-list-scroll';
import bbellipsetag from './buildingblock/bb-ellipse-tag';
import bbsteps from './buildingblock/bb-steps';
import bbmenu from './buildingblock/bb-menu';
import bbeditorarray from './buildingblock/bb-editor-array';
import bbeditorobject from './buildingblock/bb-editor-object';
import bbtransfer from './buildingblock/bb-transfer';
import bbtag from './buildingblock/bb-tag';
import bbrelationchart from './buildingblock/bb-relation-chart';
import bbtabs from './buildingblock/bb-tabs';
import bbpopselect from './buildingblock/bb-pop-select';
import bbeditorcode from './buildingblock/bb-editor-code';
import bbselect from './buildingblock/bb-select';
import bbbreadcrumb from './buildingblock/bb-breadcrumb';
import bbeditorswitch from './buildingblock/bb-editor-switch';
import bbradiogroup from './buildingblock/bb-radio-group';
import bbcheckboxgroup from './buildingblock/bb-checkbox-group';
import bbdatepicker from './buildingblock/bb-date-picker';
import bbcolorpicker from './buildingblock/bb-color-picker';
import bbform from './buildingblock/bb-form';
import bbarray from './buildingblock/bb-array';
import bbtextarea from './buildingblock/bb-textarea';
import bbinput from './buildingblock/bb-input';
import bbinputnumber from './buildingblock/bb-input-number';
import bbhidden from './buildingblock/bb-hidden';
import bbbutton from './buildingblock/bb-button';
import bbbuttonform from './buildingblock/bb-button-form';
import bbbuttonarray from './buildingblock/bb-button-array';
import bbcard from './buildingblock/bb-card';
import bbbadge from './buildingblock/bb-badge';
import bbreadbb from './buildingblock/bb-read-bb';
import bbwords from './buildingblock/bb-words.vue';
import bbpicturepreview from './buildingblock/bb-picture-preview.vue';
import bbuuid from './buildingblock/bb-uuid.vue';
import bbtree from './buildingblock/bb-tree.vue';
import bbtreeselect from './buildingblock/bb-tree-select.vue';
import bbbuttontransfer from './buildingblock/bb-button-transfer.vue';
import bbpreview from './buildingblock/bb-preview.vue';
import bbbillboard from './buildingblock/bb-billboard.vue';
import bbupload from './buildingblock/bb-upload.vue';
import bbautocomplete from './buildingblock/bb-autocomplete'
import bbportalitemlist from './buildingblock/bb-portal-item-list.vue';
import bbbar from './buildingblock/bb-bar.vue';
import bbdropdown from './buildingblock/bb-dropdown.vue';
import bbcascader from './buildingblock/bb-cascader.vue';
import bbslider from './buildingblock/bb-slider.vue';
import bbpanel from './buildingblock/bb-panel.vue';
import bbcollapse from './buildingblock/bb-collapse.vue';
import bbformitem from './buildingblock/bb-form-item.vue';
import bbview from './buildingblock/bb-view.vue';
import bbpagination from './buildingblock/bb-pagination.vue';
import bbmap from './buildingblock/bb-map.vue';
import bbspace from './buildingblock/bb-space.vue';
import bbcommentchain from './buildingblock/bb-comment-chain.vue';
import bbviewgroup from './buildingblock/bb-view-group.vue';
import bbproductitem from './buildingblock/bb-product-item.vue';

// Vant积木安装
import vantBB from './buildingblock/vant/';

// ElementUI相关的
import elementBB from './buildingblock/elementui/';

//自主研发组件
import independentBB from './buildingblock/independent/';

//Vendor库积木安装
import vendorBB from './buildingblock/vendor';

//Module相关
import moduleBB from './module/';

//布局相关
import layoutBB from './layout/';

//引入minireset
import './css/minireset.css';

//引入Element UI的css库
import './css/theme-MOF/index.css';

//引入TYiconfont
import './css/iconfont/ty.css';

//引入动画组件
import 'animate.css/animate.min.css'
//引入移动端手势组件
import './libs/touch.js'


let ty = {
	install: function(Vue) {
		console.log("begin ty bb init....");
		Vue.component('bb', bb);
		Vue.component('bb-button-group', bbbuttongroup);
		Vue.component('bb-list', bblist);
		Vue.component('bb-dialog', bbdialog); // 2017-10-11 season add
		Vue.component('bb-list-scroll', bblistscroll); // 2017-10-11 season add
		Vue.component('bb-ellipse-tag', bbellipsetag); // 2017-10-11 season add
		Vue.component('bb-steps', bbsteps);
		Vue.component('bb-menu', bbmenu);
		Vue.component('bb-editor-array', bbeditorarray);
		Vue.component('bb-editor-object', bbeditorobject);
		Vue.component('bb-transfer', bbtransfer);
		Vue.component('bb-tag', bbtag);
		Vue.component('bb-relation-chart', bbrelationchart);
		Vue.component('bb-tabs', bbtabs);
		Vue.component('bb-pop-select', bbpopselect);
		Vue.component('bb-editor-code', bbeditorcode);
		Vue.component('bb-select', bbselect);
		Vue.component('bb-breadcrumb', bbbreadcrumb);
		Vue.component('bb-editor-switch', bbeditorswitch);
		Vue.component('bb-radio-group', bbradiogroup);
		Vue.component('bb-checkbox-group', bbcheckboxgroup);
		Vue.component('bb-date-picker', bbdatepicker);
		Vue.component('bb-color-picker', bbcolorpicker);
		Vue.component('bb-form', bbform);
		Vue.component('bb-array', bbarray);
		Vue.component('bb-textarea', bbtextarea);
		Vue.component('bb-input', bbinput);
		Vue.component('bb-input-number', bbinputnumber);
		Vue.component('bb-hidden', bbhidden);
		Vue.component('bb-button', bbbutton);
		Vue.component('bb-button-form', bbbuttonform);
		Vue.component('bb-button-array', bbbuttonarray);
		Vue.component('bb-card', bbcard);
		Vue.component('bb-badge', bbbadge);
		Vue.component('bb-read-bb', bbreadbb);
		Vue.component('bb-words', bbwords);
		Vue.component('bb-picture-preview', bbpicturepreview);
		Vue.component('bb-uuid', bbuuid);
		Vue.component('bb-tree', bbtree);
		Vue.component('bb-tree-select', bbtreeselect);
		Vue.component('bb-button-transfer', bbbuttontransfer);
		Vue.component('bb-preview', bbpreview);
		Vue.component('bb-billboard', bbbillboard);
		Vue.component('bb-upload', bbupload);
		Vue.component('bb-autocomplete', bbautocomplete);
		Vue.component('bb-portal-item-list', bbportalitemlist);
		Vue.component('bb-bar', bbbar);
		Vue.component('bb-dropdown', bbdropdown);
		Vue.component('bb-cascader', bbcascader);
		Vue.component('bb-slider', bbslider);
		Vue.component('bb-panel', bbpanel);
		Vue.component('bb-collapse', bbcollapse);
		Vue.component('bb-form-item', bbformitem);
		Vue.component('bb-view', bbview);
		Vue.component('bb-pagination', bbpagination);
		Vue.component('bb-map', bbmap);
		Vue.component('bb-space', bbspace);
		Vue.component('bb-comment-chain', bbcommentchain);
		Vue.component('bb-view-group', bbviewgroup);
		Vue.component('bb-product-item', bbproductitem);

		//移动端积木安装
		independentBB.install(Vue);

		//Vendor库安装
		vendorBB.install(Vue);

		//布局积木安装
		layoutBB.install(Vue);

		//Module积木安装
		moduleBB.install(Vue);
		
		// ElementUI积木安装
		elementBB.install(Vue);

		// Vant安装
		vantBB.install(Vue);
		console.log("finish ty bb init....");
	}
};

export default ty;