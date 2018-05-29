// Vant积木安装
import vantBB from './buildingblock/vant/';

//自主研发组件
import independentBB from './buildingblock/independent/';

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
		console.log("开始加载积木....");

		//移动端积木安装
		independentBB.install(Vue);

		//布局积木安装
		layoutBB.install(Vue);

		// Vant安装
		vantBB.install(Vue);

		console.log("积木加载完成!!");
	}
};

export default ty;