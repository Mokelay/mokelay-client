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
import bbdsselect from './buildingblock/bb-ds-select';
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
import bbbuttonselect from './buildingblock/bb-button-select';
import bbcolumnsselect from './buildingblock/bb-columns-select';
import bbbadge from './buildingblock/bb-badge';
import bbbblistselect from './buildingblock/bb-bblist-select';
import bbbbtypeselect from './buildingblock/bb-bbtype-select';
import bbreadbb from './buildingblock/bb-read-bb';
import bbwords from './buildingblock/bb-words.vue';
import bbpicturepreview from './buildingblock/bb-picture-preview.vue';
import bbuuid from './buildingblock/bb-uuid.vue';
import bbtree from './buildingblock/bb-tree.vue';
import bbtreeselect from './buildingblock/bb-tree-select.vue';
import bbicon from './buildingblock/bb-icon.vue';
import bbiconselect from './buildingblock/bb-icon-select.vue';
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

//布局相关
import bbpage from './layout/bb-page';
import bblayout from './layout/bb-layout.vue';
import bbgrid from './layout/bb-grid.vue';
import bbcontainer from './layout/bb-container.vue';

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
		Vue.component('bb-layout', bblayout);
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
		Vue.component('bb-grid', bbgrid);
		Vue.component('bb-container', bbcontainer);

		Vue.component(ElTreeGrid.name, ElTreeGrid);
		console.log("finish ty bb init....");
	}
};

export default ty;