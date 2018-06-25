//自主研发积木
import bbbillboard from './bb-billboard.vue';
import bbcommentchain from './bb-comment-chain.vue';
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
import bbuuid from './bb-uuid.vue';
import bbvideo from './bb-video.vue';
import bbvote from './bb-vote.vue';
import bbwords from './bb-words.vue';
import bbellipsetag from './bb-ellipse-tag';
import bbpreview from './bb-preview.vue';
import bbreadbb from './bb-read-bb';
import bb from './bb';
import bbindepdialog from './bb-indep-dialog';
import bbindepbutton from './bb-indep-button';
import bbportalitemlist from './bb-portal-item-list';
import bbindepul from './bb-indep-ul';
import bbindepportal from './bb-indep-portal';
import bbindeptabs from './bb-indep-tabs';

import bbindepTextarea from './bb-indep-textarea';
import bblxItem from './bb-lx-item';
import bblxItemList from './bb-lx-item-list';
import bbindepTag from './bb-indep-tag';
import bbindepsku from './bb-indep-sku';
import bbindepcontactlist from './bb-indep-contact-list';
import bbindepBlogPost from './bb-indep-blog-post';
import bbindepBlog from './bb-indep-blog';
import bbindepform from './bb-indep-form';
import bbindepBlogAction from './bb-indep-blog-action';
import bbindepBlogPraise from './bb-indep-blog-praise';
import bbindepBlogComment from './bb-indep-blog-comment';

import helloworld from './bb-hello-world'

//公用组件
import bbtoast from './bbToast';
import bbmodal from './bbModal';

export default {
	install: function(Vue) {
		Vue.component('bb-billboard', bbbillboard);
		Vue.component('bb-comment-chain', bbcommentchain);
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
		Vue.component('bb-uuid', bbuuid);
		Vue.component('bb-video', bbvideo);
		Vue.component('bb-vote', bbvote);
		Vue.component('bb-words', bbwords);
		Vue.component('bb-ellipse-tag', bbellipsetag);
		Vue.component('bb-preview', bbpreview);
		Vue.component('bb-read-bb', bbreadbb);
		Vue.component('bb', bb);
		Vue.component('bb-indep-dialog', bbindepdialog);
		Vue.component('bb-indep-button', bbindepbutton);
		Vue.component('bb-portal-item-list', bbportalitemlist);
		Vue.component('bb-indep-ul', bbindepul);
		Vue.component('bb-indep-portal', bbindepportal);
		Vue.component('bb-indep-tabs', bbindeptabs);
		Vue.component('bb-indep-textarea', bbindepTextarea);
		Vue.component('bb-lx-item', bblxItem);
		Vue.component('bb-lx-item-list', bblxItemList);
		Vue.component('bb-indep-tag', bbindepTag);
		Vue.component('bb-indep-sku', bbindepsku);
		Vue.component('bb-indep-contact-list', bbindepcontactlist);
		Vue.component('bb-indep-blog-post', bbindepBlogPost);
		Vue.component('bb-indep-blog', bbindepBlog);
		Vue.component('bb-indep-form', bbindepform);
		Vue.component('bb-indep-blog-action', bbindepBlogAction);
		Vue.component('bb-indep-blog-praise', bbindepBlogPraise);
		Vue.component('bb-indep-blog-comment', bbindepBlogComment);


		Vue.component('bb-hello-world', helloworld);

		window._TY_Toast = bbtoast;
		window._TY_Modal = bbmodal;
		console.log("成功加载自主研发积木;");
	}
};