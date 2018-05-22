import 'babel-polyfill';

import Vue from 'vue';
import VueRouter from 'vue-router';
import ElementUI from 'element-ui';

//初始化基础组件
Vue.use(VueRouter);
Vue.use(ElementUI);


//常量配置
import env from './env/env';
import envConfig from './env/env_config';
var _env = env[envConfig];
window._TY_ENV = _env;
window._TY_ContentPath = "/config";
window._TY_APIHost = _env.apiHost;
window._TY_SSOURL = _env.ssoURL;
window._TY_Page_Data = {};
window._TY_HOSTS = _env.hosts || {};
window._TY_Home = "/home";
if(_env['home']){
    window._TY_Home = _env['home'];
}
window._TY_Platform = "PC";

//定制化VUE
import bbcustom from './custom/bb-custom';
Vue.component('bb-custom', bbcustom);

//引用TY核心
import TY from '../../src';
// TY.install(Vue);
Vue.use(TY);

//注册项目BB
import bbRadioExamination from './bb/bb_radio_examination';
import bbMultipleChoiceQuestion from './bb/bb_multiple_choice_question';
import bbOpenQuestions from './bb/bb_open_questions';
import bbSingleColumnCloze from './bb/bb_single_column_cloze';
import bbMultipleRadioQuestions from './bb/bb_multiple_radio_questions';
import bbAddItemQuestions from './bb/bb_add_item_questions';
import bbNameAddress from './bb/bb_name_address';
import bbCompoundRadioQuestions from './bb/bb_compound_radio_questions';
import bbMallAddressQuestion from './bb/bb_mall_address_question';
import bbSkipLongQuestions from './bb/bb_skip_long_questions';
import bbpopupselection from './bb/bb-popup-selection';
import bbMarkStarQuestions from './bb/bb_mark_star_questions';

Vue.component('bb-radio-examination', bbRadioExamination);
Vue.component('bb-multiple-choice-question', bbMultipleChoiceQuestion);
Vue.component('bb-open-questions', bbOpenQuestions);
Vue.component('bb-single-column-cloze', bbSingleColumnCloze);
Vue.component('bb-multiple-radio-questions', bbMultipleRadioQuestions);
Vue.component('bb-add-item-questions', bbAddItemQuestions);
Vue.component('bb-name-address', bbNameAddress);
Vue.component('bb-compound-radio-questions', bbCompoundRadioQuestions);
Vue.component('bb-mall-address-question', bbMallAddressQuestion);
Vue.component('bb-skip-long-questions', bbSkipLongQuestions);
Vue.component('bb-popup-selection', bbpopupselection);
Vue.component('bb-mark-star-questions', bbMarkStarQuestions);


// 路由配置
const router = new VueRouter({
    mode: 'hash',
    routes: [{
        path: '/',
        redirect: to => {
            return window._TY_Home;
        }
    }, {
        path: '/:appAlias/index',
        meta: {
            title: '应用首页'
        },
        component: (resolve) => require(['./index.vue'], resolve),
        children: [{
            path: '/:appAlias/index/:pageAlias',
            meta: {},
            component: (resolve) => require(['./ty.vue'], resolve)
        }]
    }, {
        path: '/:pageAlias',
        meta: {},
        component: (resolve) => require(['./ty.vue'], resolve)
    }]
});
router.afterEach(() => {
    window.scrollTo(0, 0);
});

new Vue({
    el: '#app',
    router: router
});