import Vue from 'vue';
import toastVue from './main.vue';
import merge from 'element-ui/src/utils/merge';

const defaults = {
    content: '',
    $type: '',
    duration: 3000,
    mask: false,
    beforeClose: null,
    close: null,
    customClass: '',
    visible: false
};

const ToastVueConstructor = Vue.extend(toastVue);

let currentToast, instance;
let toastQueue = [];

const initInstance = () => {
    let toastEle = document.createElement('div');
    toastEle.id = 'bb-toast-wrapper';
    instance = new ToastVueConstructor({
        el: toastEle
    });
};


const Toast = function(options) {
    if (Vue.prototype.$isServer) return;

    toastQueue.push({
        options: merge({}, defaults, Toast.defaults, options)
    });

    showNext();
};

const showNext = () => {
    if (!instance) {
        initInstance();
    }

    if (!instance.visible) {
        currentToast = toastQueue.shift();
        let options = currentToast.options;

        if (!document.querySelector('#bb-toast-wrapper')) {
            document.body.appendChild(instance.$el);
        }

        for (let prop in options) {
            if (options.hasOwnProperty(prop)) {
                instance[prop] = options[prop];
            }
        }

        instance.visible = true;

    } else {
        let temp = instance.close;
        instance.close = () => {
            temp.apply(instance);
            showNext();
        }
    }
}

Toast.setDefaults = defaults => {
    Toast.defaults = defaults;
};

Toast.closeAll = (closeAll) => {
    instance.doclose();
    instance.visible = false;
    msgQueue = [];
    currentToast = null;
    if (closeAll && typeof closeAll == 'function') {
        closeAll.apply(this);
    }
};

export default Toast;