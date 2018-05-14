//移动端积木
import bbcount from './bb-count.vue';
import bbcountdown from './bb-countdown.vue';
import bbhtml from './bb-html.vue';
import bbimg from './bb-img';
import bbphotosingle from './bb-photo-single.vue';
import bbphotos from './bb-photos.vue';
import bbscore from './bb-score.vue';
import bbtext from './bb-text.vue';
import bbvideo from './bb-video.vue';
import bbvote from './bb-vote.vue';

//公用组件
import bbtoast from './bbToast';
import bbmodal from './bbModal';

export default {
	install: function(Vue) {
		console.log("begin h5 bb init....");
		Vue.component('bb-count', bbcount);
		Vue.component('bb-countdown', bbcountdown);
		Vue.component('bb-html', bbhtml);
		Vue.component('bb-img', bbimg);
		Vue.component('bb-photo-single', bbphotosingle);
		Vue.component('bb-photos', bbphotos);
		Vue.component('bb-score', bbscore);
		Vue.component('bb-text', bbtext);
		Vue.component('bb-video', bbvideo);
		Vue.component('bb-vote', bbvote);
		window._TY_Toast = bbtoast;
		window._TY_Modal = bbmodal;
		console.log("finish h5 bb init;");
	}
};