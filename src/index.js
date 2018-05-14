//pc 端积木
import bb from './buildingblock/bb';
import bbbuttongroup from './buildingblock/bb-button-group';
import bblist from './buildingblock/bb-list';
import bbdialog from './buildingblock/bb-dialog';
import bblistscroll from './buildingblock/bb-list-scroll';
import bbellipsetag from './buildingblock/bb-ellipse-tag';
import bbmenu from './buildingblock/bb-menu';
import bbeditorarray from './buildingblock/bb-editor-array';
import bbeditorobject from './buildingblock/bb-editor-object';
import bbrelationchart from './buildingblock/bb-relation-chart';
import bbpopselect from './buildingblock/bb-pop-select';
import bbeditorcode from './buildingblock/bb-editor-code';
import bbselect from './buildingblock/bb-select';
import bbeditorswitch from './buildingblock/bb-editor-switch';
import bbform from './buildingblock/bb-form';
import bbarray from './buildingblock/bb-array';
import bbbutton from './buildingblock/bb-button';
import bbbuttonform from './buildingblock/bb-button-form';
import bbbuttonarray from './buildingblock/bb-button-array';
import bbreadbb from './buildingblock/bb-read-bb';
import bbpicturepreview from './buildingblock/bb-picture-preview.vue';
import bbuuid from './buildingblock/bb-uuid.vue';
import bbbuttontransfer from './buildingblock/bb-button-transfer.vue';
import bbpreview from './buildingblock/bb-preview.vue';
import bbportalitemlist from './buildingblock/bb-portal-item-list.vue';
import bbbar from './buildingblock/bb-bar.vue';
import bbcollapse from './buildingblock/bb-collapse.vue';
import bbformitem from './buildingblock/bb-form-item.vue';
import bbview from './buildingblock/bb-view.vue';
import bbmap from './buildingblock/bb-map.vue';
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
		Vue.component('bb-menu', bbmenu);
		Vue.component('bb-editor-array', bbeditorarray);
		Vue.component('bb-editor-object', bbeditorobject);
		Vue.component('bb-relation-chart', bbrelationchart);
		Vue.component('bb-pop-select', bbpopselect);
		Vue.component('bb-editor-code', bbeditorcode);
		Vue.component('bb-select', bbselect);
		Vue.component('bb-editor-switch', bbeditorswitch);
		Vue.component('bb-form', bbform);
		Vue.component('bb-array', bbarray);
		Vue.component('bb-button', bbbutton);
		Vue.component('bb-button-form', bbbuttonform);
		Vue.component('bb-button-array', bbbuttonarray);
		Vue.component('bb-read-bb', bbreadbb);
		Vue.component('bb-picture-preview', bbpicturepreview);
		Vue.component('bb-uuid', bbuuid);
		Vue.component('bb-button-transfer', bbbuttontransfer);
		Vue.component('bb-preview', bbpreview);
		Vue.component('bb-portal-item-list', bbportalitemlist);
		Vue.component('bb-bar', bbbar);
		Vue.component('bb-collapse', bbcollapse);
		Vue.component('bb-form-item', bbformitem);
		Vue.component('bb-view', bbview);
		Vue.component('bb-map', bbmap);
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