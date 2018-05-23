//Vant积木
import vantAddressEdit from './bb-vant-address-edit';
import vantButton from './bb-vant-button';
import vantSlider from './bb-vant-slider';

export default {
	install: function(Vue) {
		Vue.component('bb-vant-address-edit', vantAddressEdit);
		Vue.component('bb-vant-button', vantButton);
		Vue.component('bb-vant-slider', vantSlider);

		console.log("成功加载Vant积木;");
	}
};