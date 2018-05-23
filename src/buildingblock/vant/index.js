//Vant积木
import vantAddressEdit from './bb-vant-address-edit';
import vantButton from './bb-vant-button';
import vantRadioGroup from './bb-vant-radio-group';
import vantSwitch from './bb-vant-switch';

export default {
	install: function(Vue) {
		Vue.component('bb-vant-address-edit', vantAddressEdit);
		Vue.component('bb-vant-button', vantButton);
		Vue.component('bb-vant-radio-group', vantRadioGroup);
		Vue.component('bb-vant-switch', vantSwitch);

		console.log("成功加载Vant积木;");
	}
};