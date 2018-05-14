//Vant积木
import vantAddressEdit from './bb-vant-address-edit';

export default {
	install: function(Vue) {
		console.log("begin vant bb init....");

		Vue.component('bb-vant-address-edit', vantAddressEdit);

		console.log("finish vant bb init;");
	}
};