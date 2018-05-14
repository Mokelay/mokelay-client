//ElementUI积木
import bbEleLogin from './bb-ele-login';

export default {
	install: function(Vue) {
		console.log("begin elementui bb init....");

		Vue.component('bb-ele-login', bbEleLogin);

		console.log("finish elementui bb init;");
	}
};