//Vant积木
import vantAddressEdit from './bb-vant-address-edit';
import vantButton from './bb-vant-button';
import vantSlider from './bb-vant-slider';
import vantRadioGroup from './bb-vant-radio-group';
import vantSwitch from './bb-vant-switch';
import cell from './bb-vant-cell';
import cellGroup from './bb-vant-cell-group';
import vantCheckbox from './bb-vant-checkbox';
import vantNumberkeyboard from './bb-vant-number-keyboard';
import bbvantfield from './bb-vant-field';
import bbvantfieldnumber from './bb-vant-field-number';
import bbvantswipe from './bb-vant-swipe';
import bbvanttag from './bb-vant-tag';

export default {
	install: function(Vue) {
		Vue.component('bb-vant-address-edit', vantAddressEdit);
		Vue.component('bb-vant-button', vantButton);
		Vue.component('bb-vant-slider', vantSlider);
		Vue.component('bb-vant-radio-group', vantRadioGroup);
		Vue.component('bb-vant-switch', vantSwitch);
		Vue.component('bb-vant-cell', cell);
		Vue.component('bb-vant-cell-group', cellGroup);
		Vue.component('bb-vant-checkbox', vantCheckbox);
		Vue.component('bb-vant-number-keyboard', vantNumberkeyboard);
		Vue.component('bb-vant-field', bbvantfield);
		Vue.component('bb-vant-field-number', bbvantfieldnumber);
		Vue.component('bb-vant-swipe', bbvantswipe);
		Vue.component('bb-vant-tag', bbvanttag);

		console.log("成功加载Vant积木;");
	}
};