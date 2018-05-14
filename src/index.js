//pc 端积木
import bb from './buildingblock/bb';
import bblist from './buildingblock/bb-list';
import bbdialog from './buildingblock/bb-dialog';
import bbellipsetag from './buildingblock/bb-ellipse-tag';
import bbeditorcode from './buildingblock/bb-editor-code';
import bbform from './buildingblock/bb-form';
import bbreadbb from './buildingblock/bb-read-bb';
import bbpicturepreview from './buildingblock/bb-picture-preview.vue';
import bbpreview from './buildingblock/bb-preview.vue';
import bbportalitemlist from './buildingblock/bb-portal-item-list.vue';
import bbbar from './buildingblock/bb-bar.vue';
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
		Vue.component('bb-list', bblist);
		Vue.component('bb-dialog', bbdialog);
		Vue.component('bb-ellipse-tag', bbellipsetag);
		Vue.component('bb-editor-code', bbeditorcode);
		Vue.component('bb-form', bbform);
		Vue.component('bb-read-bb', bbreadbb);
		Vue.component('bb-picture-preview', bbpicturepreview);
		Vue.component('bb-preview', bbpreview);
		Vue.component('bb-portal-item-list', bbportalitemlist);
		Vue.component('bb-bar', bbbar);
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