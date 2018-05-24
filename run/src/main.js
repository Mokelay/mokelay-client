import 'babel-polyfill';

import Vue from 'vue';

import env from './env/';
env.init("PC");

//定制化VUE
import bbcustom from './custom/bb-custom';
Vue.component('bb-custom', bbcustom);

//引用TY核心
import TY from '../../src';
Vue.use(TY);

//初始化
import root from './root';
root.init();