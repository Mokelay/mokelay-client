//移动端积木
import bbbillboard from './bb-billboard.vue';
import bbcount from './bb-count.vue';
import bbcountdown from './bb-countdown.vue';
import bbhtml from './bb-html.vue';
import bbhyperlink from './bb-hyperlink.vue';
import bbimg from './bb-img';
import bbphotosingle from './bb-photo-single.vue';
import bbphotos from './bb-photos.vue';
import bbscore from './bb-score.vue';
import bbspace from './bb-space.vue';
import bbtext from './bb-text.vue';
import bbvideo from './bb-video.vue';
import bbvote from './bb-vote.vue';
import bbwords from './bb-words.vue';

import helloworld from './bb-hello-world'

//公用组件
import bbtoast from './bbToast';
import bbmodal from './bbModal';

export default {
	install: function(Vue) {
		console.log("begin independent bb init....");

		Vue.component('bb-billboard', bbbillboard);
		Vue.component('bb-count', bbcount);
		Vue.component('bb-countdown', bbcountdown);
		Vue.component('bb-html', bbhtml);
		Vue.component('bb-hyperlink', bbhyperlink);
		Vue.component('bb-img', bbimg);
		Vue.component('bb-photo-single', bbphotosingle);
		Vue.component('bb-photos', bbphotos);
		Vue.component('bb-score', bbscore);
		Vue.component('bb-space', bbspace);
		Vue.component('bb-text', bbtext);
		Vue.component('bb-video', bbvideo);
		Vue.component('bb-vote', bbvote);
		Vue.component('bb-words', bbwords);

		Vue.component('bb-hello-world', helloworld);

		window._TY_Toast = bbtoast;
		window._TY_Modal = bbmodal;
		console.log("finish independent bb init;");
	}
};