//Vant积木
import vantAddressEdit from './bb-vant-address-edit';
import vantButton from './bb-vant-button';

export default {
	install: function(Vue) {
		Vue.component('bb-vant-address-edit', vantAddressEdit);
		Vue.component('bb-vant-button', vantButton);

		console.log("成功加载Vant积木;");
	}
};