
import {
    Loading,
    MessageBox,
    Message,
    Notification
} from 'element-ui';

//加载element的通用组件
let el = {
    install: function(Vue) {
        console.log("开始加载element 通用组件....");

        Vue.prototype.$loading = Loading.service;
        Vue.prototype.$msgbox = MessageBox;
        Vue.prototype.$alert = MessageBox.alert;
        Vue.prototype.$confirm = MessageBox.confirm;
        Vue.prototype.$prompt = MessageBox.prompt;
        Vue.prototype.$notify = Notification;
        Vue.prototype.$message = Message;

        console.log("element 通用组件加载完成!!");
    }
};

export default el;