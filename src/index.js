
                import layoutBB from './layout/';
                import './css/minireset.css';
                import './css/theme-default/index.css';
                import './css/iconfont/ty.css';
                import 'animate.css/animate.min.css';
                import './libs/touch.js';
                import './libs/flexble.js';
                import './libs/util.js';

                import elementInit from './libs/element.js';
                //公用组件
                import { Toast } from 'vant';//用到了vant的toast

                import bbtoast from './buildingblock/independent/bbToast';
                import bbmodal from './buildingblock/independent/bbModal';
                import bbreadbb from 'bb-read-bb';
                import bb from './buildingblock/independent/bb';
                                import bbindepbutton from 'bb-indep-button';
                import bbbuttonform from 'bb-button-form';
                import bblist from 'bb-list';
                import bbinput from 'bb-input';
                import bbselect from 'bb-select';
                import bbtextarea from 'bb-textarea';
                import bbbreadcrumb from 'bb-breadcrumb';
                import bbform from 'bb-form';
                import bbbutton from 'bb-button';
                import bbeditorcode from 'bb-editor-code';
                import bbpopselect from 'bb-pop-select';
                import bbbuttongroup from 'bb-button-group';
                import bbtabs from 'bb-tabs';
                import bbradiogroup from 'bb-radio-group';
                import bbeditorswitch from 'bb-editor-switch';
                import bbpage from 'bb-page';
                import bbiconselect from 'bb-icon-select';
                import bbtreeselect from 'bb-tree-select';
                import bbinputnumber from 'bb-input-number';
                import bbportalitemlist from 'bb-portal-item-list';
                import bbbbtypeselect from 'bb-bbtype-select';
                import bbwords from 'bb-words';
                import bbbuttonattributeconfig from 'bb-button-attribute-config';
                import bbarray from 'bb-array';
                import bbeditorweditor from 'bb-editor-weditor';
                import bbbillboard from 'bb-billboard';
                import bbecharts from 'bb-echarts';
                import bbelelogin from 'bb-ele-login';
                import bbbar from 'bb-bar';
                import bbdropdown from 'bb-dropdown';
                import bbimg from 'bb-img';
                import bbbuttonmedia from 'bb-button-media';
                import bbmedia from 'bb-media';
                import bblayoutseriation from 'bb-layout-seriation';
                import bbindepul from 'bb-indep-ul';
                import bbtext from 'bb-text';

                    export default {
                        install: function(Vue) {
                            console.log("开始加载积木....");
                                            Vue.component('bb-indep-button', bbindepbutton);
                            Vue.component('bb-button-form', bbbuttonform);
                            Vue.component('bb-list', bblist);
                            Vue.component('bb-input', bbinput);
                            Vue.component('bb-select', bbselect);
                            Vue.component('bb-textarea', bbtextarea);
                            Vue.component('bb-breadcrumb', bbbreadcrumb);
                            Vue.component('bb-form', bbform);
                            Vue.component('bb-button', bbbutton);
                            Vue.component('bb-editor-code', bbeditorcode);
                            Vue.component('bb-pop-select', bbpopselect);
                            Vue.component('bb-button-group', bbbuttongroup);
                            Vue.component('bb-tabs', bbtabs);
                            Vue.component('bb-radio-group', bbradiogroup);
                            Vue.component('bb-editor-switch', bbeditorswitch);
                            Vue.component('bb-page', bbpage);
                            Vue.component('bb-icon-select', bbiconselect);
                            Vue.component('bb-tree-select', bbtreeselect);
                            Vue.component('bb-input-number', bbinputnumber);
                            Vue.component('bb-portal-item-list', bbportalitemlist);
                            Vue.component('bb-bbtype-select', bbbbtypeselect);
                            Vue.component('bb-words', bbwords);
                            Vue.component('bb-button-attribute-config', bbbuttonattributeconfig);
                            Vue.component('bb-array', bbarray);
                            Vue.component('bb-editor-weditor', bbeditorweditor);
                            Vue.component('bb-billboard', bbbillboard);
                            Vue.component('bb-echarts', bbecharts);
                            Vue.component('bb-ele-login', bbelelogin);
                            Vue.component('bb-bar', bbbar);
                            Vue.component('bb-dropdown', bbdropdown);
                            Vue.component('bb-img', bbimg);
                            Vue.component('bb-button-media', bbbuttonmedia);
                            Vue.component('bb-media', bbmedia);
                            Vue.component('bb-layout-seriation', bblayoutseriation);
                            Vue.component('bb-indep-ul', bbindepul);
                            Vue.component('bb-text', bbtext);

                            //布局积木安装
                            layoutBB.install(Vue);
                            elementInit.install(Vue);
                            
                            Vue.component('bb-read-bb', bbreadbb);
                            Vue.component('bb', bb);
                            Vue.use(Toast);
                            //安装全局变量
                            window._TY_Toast = bbtoast;
                            window._TY_Modal = bbmodal;
                        }
                    };
                