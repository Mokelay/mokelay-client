//pc 端积木
import bbeditorcode from './buildingblock/bb-editor-code';
import bbpicturepreview from './buildingblock/bb-picture-preview.vue';
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
import './css/theme-default/index.css';

//引入TYiconfont
import './css/iconfont/ty.css';

//引入动画组件
import 'animate.css/animate.min.css'

//引入移动端手势组件
import './libs/touch.js'

//引入移动端 rem组件
import './libs/flexble.js'

//引入Mokelay工具类
import './libs/util.js'

import elementInit from './libs/element.js'


let ty = {
	install: function(Vue) {
		console.log("开始加载积木....");

		//以下五个积木需要把elementui解耦，然后再迁移到independent
		Vue.component('bb-editor-code', bbeditorcode);
		Vue.component('bb-picture-preview', bbpicturepreview);
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

		//初始化element的部分组件
		elementInit.install(Vue);

		console.log("积木加载完成!!");
	}
};

export default ty;