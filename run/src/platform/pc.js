import 'babel-polyfill';

import Vue from 'vue';

import env from '../env/';
env.init("PC");

//定制化VUE
import bbcustom from '../custom/bb-custom';
Vue.component('bb-custom', bbcustom);

//引用TY核心
import TY from '../../../src';
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

//初始化
import root from './root';
root.init();