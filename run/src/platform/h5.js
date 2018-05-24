import 'babel-polyfill';

import Vue from 'vue';

import env from '../env/';
env.init("H5");

//引用TY核心
import TY from '../../../src/h5';
Vue.use(TY);

//初始化
import root from './root';
root.init();