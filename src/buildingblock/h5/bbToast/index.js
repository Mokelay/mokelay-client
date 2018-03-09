export {default} from './main.js';

/*
* 轻提示组建，挂在在vue原型上，通过$toast调用
* new Vue({
*   mounted(){
*     ...
*     this.$toast({options});
*     ...
*   }
* });
*
*
*
*
* ------------------Options----------------
*
* content: ''                   string，提示信息
* $type: ''                     string，弹窗类型，success、fail、loading
* duration: 3000,               number，自动关闭的延时，单位毫秒
* mask: true,                   boolean，是否显示半透明蒙层
* beforeClose: null,            function，关闭当前弹窗之前的回调
* close: null,                  function，点击mask关闭当前弹窗之后的回调
* customClass: '',              string，自定义类名
*
*
*
*
* ----------------全局方法----------------
*
* Toast.closeAll                关闭弹窗，并清空队列中的弹窗
* Toast.setDefaults             修改默认配置
* */
