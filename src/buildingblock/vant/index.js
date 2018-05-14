//Vant积木
import vantAddressEdit from './bb-vant-address-edit';

export default {
	install: function(Vue) {
		Vue.component('bb-vant-address-edit', vantAddressEdit);

		console.log("成功加载Vant积木;");
	}
};