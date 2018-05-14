//ElementUI积木
import bbEleLogin from './bb-ele-login';

import ElTreeGrid from 'element-tree-grid';

export default {
	install: function(Vue) {
		console.log("begin elementui bb init....");

		Vue.component('bb-ele-login', bbEleLogin);

		Vue.component(ElTreeGrid.name, ElTreeGrid);

		console.log("finish elementui bb init;");
	}
};