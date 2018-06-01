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
import bbvantpasswordinput from './bb-vant-password-input';
import bbvanttabbar from './bb-vant-tab-bar';
import bbvantdialog from './bb-vant-dialog';
import bbvantswitchcell from './bb-vant-switch-cell';
import bbvantsearch from './bb-vant-search';
import bbvantstepper from './bb-vant-stepper';

import bbvantcircle from "./bb-vant-circle";

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
		Vue.component('bb-vant-password-input', bbvantpasswordinput);
		Vue.component('bb-vant-tab-bar', bbvanttabbar);
		Vue.component('bb-vant-dialog', bbvantdialog);
		Vue.component('bb-vant-switch-cell', bbvantswitchcell);
		Vue.component('bb-vant-search', bbvantsearch);
		Vue.component('bb-vant-stepper', bbvantstepper);

		Vue.component('bb-vant-circle', bbvantcircle);

		console.log("成功加载Vant积木;");
	}
};