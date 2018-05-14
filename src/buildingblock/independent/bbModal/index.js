export {default} from './main.js';

/*
* 对话框组建，挂在在vue原型上，通过$modal调用
* new Vue({
*   mounted(){
*     ...
*     this.$modal({options});
*     ...
*   }
* });
*
*
*
*
* ------------------Options----------------
*
* mask: true,                   boolean，是否显示半透明蒙层
* maskClose: true,              boolean，是否可通过点击蒙层关闭弹窗
* close: null,                  function，点击mask关闭当前弹窗之后的回调
* customClass: '',              string，自定义类名
* title: '',                    string，标题
* message: '',                  string，提示信息
* useHtml: false,               message直接以html片段处理
* inputs: [                     array，在弹窗正文中显示输入框
*   {
*     placeholders: '',         string，占位符
*     pattern: '',              regexp，校验规则
*     $type: '',                string，输入框类型
*     $val: '',                 string，输入框的值
*   }
* ],
* btns: [                       array，弹窗中的按钮
*   {
*     text: '',                 string，按钮文字
*     $action: (modal) => {     function，点击按钮的回调，modal为当前弹窗示例，通过modal.docloes()可关闭当前弹窗
*         ...
*         modal.doclose();
*     },
*     checkInputs: false        boolean，如果弹窗中有输入框，设置为true时会对输入框进行校验，校验通过之后才会执行$action
*   }
* ],
* lockScroll: true,             弹窗时是否禁止body滚动
* popup: false,                 是否弹窗模式，影响弹窗在页面中的显示位置（中间或页面底部）
*
*
*
*
* ----------------全局方法----------------
*
* Modal.closeAll                关闭弹窗，并清空队列中的弹窗
* Modal.setDefaults             修改默认配置
* */
