//pc 端积木
import bb from './buildingblock/bb';
import bbbuttongroup from './buildingblock/bb-button-group';
import bblist from './buildingblock/bb-list';
import bbdialog from './buildingblock/bb-dialog'; // 2017-10-11 season add
import bblistscroll from './buildingblock/bb-list-scroll'; // 2017-10-11 season add
import bbellipsetag from './buildingblock/bb-ellipse-tag'; // 2017-10-11 season add
import bbsteps from './buildingblock/bb-steps';
import bbmenu from './buildingblock/bb-menu';
import bbecharts from './buildingblock/bb-echarts';
import bbeditorarray from './buildingblock/bb-editor-array';
import bbeditorobject from './buildingblock/bb-editor-object';
import bbtransfer from './buildingblock/bb-transfer';
import bbtag from './buildingblock/bb-tag';
import bbrelationchart from './buildingblock/bb-relation-chart';
import bbtabs from './buildingblock/bb-tabs';
import bbpopselect from './buildingblock/bb-pop-select';
import bbeditorwe from './buildingblock/bb-editor-weditor';
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
import bbechartsselect from './buildingblock/bb-echarts-select.vue';
import bbbillboard from './buildingblock/bb-billboard.vue';
import bbupload from './buildingblock/bb-upload.vue';
import ElTreeGrid from 'element-tree-grid';
import bbautocomplete from './buildingblock/bb-autocomplete'
import bbeditormd from './buildingblock/bb-editor-md.vue';
import bbportalitemlist from './buildingblock/bb-portal-item-list.vue';
import bbbar from './buildingblock/bb-bar.vue';
import bbdropdown from './buildingblock/bb-dropdown.vue';
import bbcascader from './buildingblock/bb-cascader.vue';
import bbslider from './buildingblock/bb-slider.vue';
import bbpanel from './buildingblock/bb-panel.vue';
import bbcollapse from './buildingblock/bb-collapse.vue';
import bbformitem from './buildingblock/bb-form-item.vue';
import bbjson from './buildingblock/bb-json.vue';
import bbview from './buildingblock/bb-view.vue';
import bbpagination from './buildingblock/bb-pagination.vue';
import bbmap from './buildingblock/bb-map.vue';
import bbspace from './buildingblock/bb-space.vue';
import bbcommentchain from './buildingblock/bb-comment-chain.vue';
import bbviewgroup from './buildingblock/bb-view-group.vue';

// Vant相关的
import vantAddressEdit from './buildingblock/vant/bb-vant-address-edit';


// ElementUI相关的
import bbEleLogin from './buildingblock/elementui/bb-ele-login';

//移动端积木
import bbtext from './buildingblock/h5/bb-text.vue';
import bbphotos from './buildingblock/h5/bb-photos.vue';
import bbvideo from './buildingblock/h5/bb-video.vue';
import bbscore from './buildingblock/h5/bb-score.vue';
import bbcount from './buildingblock/h5/bb-count.vue';
import bbcountdown from './buildingblock/h5/bb-countdown.vue';
import bbvote from './buildingblock/h5/bb-vote.vue';
import bbhtml from './buildingblock/h5/bb-html.vue';
import bbphotosingle from './buildingblock/h5/bb-photo-single.vue';
import bbimg from './buildingblock/h5/bb-img';
import bbtoast from './buildingblock/h5/bbToast';
import bbmodal from './buildingblock/h5/bbModal';

//Module相关
import bbbblistselect from './module/bb-bblist-select';
import bbbbtypeselect from './module/bb-bbtype-select';
import bbbuttonselect from './module/bb-button-select';
import bbcolumnsselect from './module/bb-columns-select';
import bbdsselect from './module/bb-ds-select';
import bbiconselect from './module/bb-icon-select.vue';
import bbicon from './module/bb-icon.vue';
import bbbbselect from './module/bb-bb-select.vue';
import bbfieldselect from './module/bb-field-select.vue';
import bbconfig from './module/bb-config.vue';
import bbapiinfo from './module/bb-api-info.vue';
import bbapilegoconfig from './module/bb-apilego-config.vue';
import bbfieldtreeselect from './module/bb-field-tree-select.vue';
import bbfieldtreepopselect from './module/bb-field-tree-pop-select.vue';
import bbconfigarray from './module/bb-config-array.vue';

//布局相关
import bbpage from './layout/bb-page';
import bblayoutgrid from './layout/bb-layout-grid.vue';
import bblayoutseriation from './layout/bb-layout-seriation.vue';
import bblayoutcanvas from './layout/bb-layout-canvas.vue';
import bblayoutcanvasedit from './layout/bb-layout-canvas-edit.vue';
import bblayoutcontainer from './layout/bb-layout-container.vue';
import bbseriationitemedit from './layout/bb-seriation-item-edit.vue';
import bblayoutseriationedit from './layout/bb-layout-seriation-edit.vue';
import bbpageedit from './layout/bb-page-edit.vue';

// DEMO
import helloworld from './buildingblock/demo/bb-hello-world'

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
		Vue.component('bb-page', bbpage);
		Vue.component('bb-button-group', bbbuttongroup);
		Vue.component('bb-list', bblist);
		Vue.component('bb-dialog', bbdialog); // 2017-10-11 season add
		Vue.component('bb-list-scroll', bblistscroll); // 2017-10-11 season add
		Vue.component('bb-ellipse-tag', bbellipsetag); // 2017-10-11 season add
		Vue.component('bb-steps', bbsteps);
		Vue.component('bb-menu', bbmenu);
		Vue.component('bb-echarts', bbecharts);
		Vue.component('bb-editor-array', bbeditorarray);
		Vue.component('bb-editor-object', bbeditorobject);
		Vue.component('bb-transfer', bbtransfer);
		Vue.component('bb-tag', bbtag);
		Vue.component('bb-relation-chart', bbrelationchart);
		Vue.component('bb-tabs', bbtabs);
		Vue.component('bb-pop-select', bbpopselect);
		Vue.component('bb-editor-weditor', bbeditorwe);
		Vue.component('bb-editor-code', bbeditorcode);
		Vue.component('bb-select', bbselect);
		Vue.component('bb-breadcrumb', bbbreadcrumb);
		Vue.component('bb-editor-switch', bbeditorswitch);
		Vue.component('bb-radio-group', bbradiogroup);
		Vue.component('bb-checkbox-group', bbcheckboxgroup);
		Vue.component('bb-date-picker', bbdatepicker);
		Vue.component('bb-color-picker', bbcolorpicker);
		Vue.component('bb-ds-select', bbdsselect);
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
		Vue.component('bb-button-select', bbbuttonselect);
		Vue.component('bb-columns-select', bbcolumnsselect);
		Vue.component('bb-badge', bbbadge);
		Vue.component('bb-bblist-select', bbbblistselect);
		Vue.component('bb-bbtype-select', bbbbtypeselect);
		Vue.component('bb-read-bb', bbreadbb);
		Vue.component('bb-words', bbwords);
		Vue.component('bb-picture-preview', bbpicturepreview);
		Vue.component('bb-uuid', bbuuid);
		Vue.component('bb-tree', bbtree);
		Vue.component('bb-tree-select', bbtreeselect);
		Vue.component('bb-icon', bbicon);
		Vue.component('bb-icon-select', bbiconselect);
		Vue.component('bb-button-transfer', bbbuttontransfer);
		Vue.component('bb-preview', bbpreview);
		Vue.component('bb-echarts-select', bbechartsselect);
		Vue.component('bb-billboard', bbbillboard);
		Vue.component('bb-upload', bbupload);
		Vue.component('bb-autocomplete', bbautocomplete);
		Vue.component('bb-text', bbtext);
		Vue.component('bb-editor-md', bbeditormd);
		Vue.component('bb-photos', bbphotos);
		Vue.component('bb-video', bbvideo);
		Vue.component('bb-score', bbscore);
		Vue.component('bb-count', bbcount);
		Vue.component('bb-countdown', bbcountdown);
		Vue.component('bb-vote', bbvote);
		Vue.component('bb-portal-item-list', bbportalitemlist);
		Vue.component('bb-bar', bbbar);
		Vue.component('bb-dropdown', bbdropdown);
		Vue.component('bb-html', bbhtml);
		Vue.component('bb-photo-single', bbphotosingle);
		Vue.component('bb-img', bbimg);
		Vue.component('bb-layout-grid', bblayoutgrid);
		Vue.component('bb-layout-canvas', bblayoutcanvas);
		Vue.component('bb-layout-canvas-edit', bblayoutcanvasedit);
		Vue.component('bb-layout-container', bblayoutcontainer);
		Vue.component('bb-cascader', bbcascader);
		Vue.component('bb-layout-seriation', bblayoutseriation);
		Vue.component('bb-bb-select', bbbbselect);
		Vue.component('bb-field-select', bbfieldselect);
		Vue.component('bb-slider', bbslider);
		Vue.component('bb-panel', bbpanel);
		Vue.component('bb-collapse', bbcollapse);
		Vue.component('bb-form-item', bbformitem);
		Vue.component('bb-json', bbjson);
		Vue.component('bb-config', bbconfig);
		Vue.component('bb-seriation-item-edit', bbseriationitemedit);
		Vue.component('bb-layout-seriation-edit', bblayoutseriationedit);
		Vue.component('bb-page-edit', bbpageedit);
		Vue.component('bb-api-info', bbapiinfo);
		Vue.component('bb-apilego-config', bbapilegoconfig);
		Vue.component('bb-field-tree-select', bbfieldtreeselect);
		Vue.component('bb-field-tree-pop-select', bbfieldtreepopselect);
		Vue.component('bb-view', bbview);
		Vue.component('bb-config-array', bbconfigarray);
		Vue.component('bb-pagination', bbpagination);
		Vue.component('bb-map', bbmap);
		Vue.component('bb-space', bbspace);
		Vue.component('bb-comment-chain', bbcommentchain);
		Vue.component('bb-view-group', bbviewgroup);

		// ElementUI
		Vue.component('bb-ele-login', bbEleLogin);

		// DEMO
		Vue.component('bb-hello-world', helloworld);

		// Vant
		Vue.component('bb-vant-address-edit', vantAddressEdit);

		Vue.component(ElTreeGrid.name, ElTreeGrid);
		window._TY_Toast = bbtoast;
		window._TY_Modal = bbmodal;
		console.log("finish ty bb init....");
	}
};

export default ty;