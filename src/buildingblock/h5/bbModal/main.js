import Vue from 'vue';
import modalVue from './main.vue';
import merge from 'element-ui/src/utils/merge';

const defaults = {
    mask: true,
    maskClose: true,
    popup: false,
    close: null,
    customClass: '',
    title: '',
    useHtml: false,
    message: '',
    inputs: [],
    btns: [],
    lockScroll: true,
    visible: false
};

const ModalVueConstructor = Vue.extend(modalVue);

let currentModal, instance;
let modalQueue = [];

const initInstance = () => {
    let modalEle = document.createElement('div');
    modalEle.id = 'bb-modal-wrapper';
    instance = new ModalVueConstructor({
        el: modalEle
    });
};


const Modal = function(options, callback) {
    if (Vue.prototype.$isServer) return;

    for ( let i=0, len=options.inputs.length; i<len; i++ ) {
      if ( options.inputs[i].pattern ) {
        options.inputs[i].legal = '';
      }

      if ( !options.inputs[i].hasOwnProperty('$val') ) {
        options.inputs[i].$val = '';
      }
    }

    modalQueue.push({
        options: merge({}, defaults, Modal.defaults, options),
        callback: callback
    });

    showNext();
};

const showNext = ()=>{
    if (!instance) {
        initInstance();
    }

    if ( !instance.visible ) {
        currentModal = modalQueue.shift();
        let options = currentModal.options;

        if ( !document.querySelector('#bb-modal-wrapper') ) {
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
        instance.close = ()=>{
            temp.apply(instance);
            showNext();
        }
    }
}

Modal.setDefaults = defaults => {
    Modal.defaults = defaults;
};

Modal.closeAll = (closeAll) => {
    instance.doClose();
    instance.visible = false;
    msgQueue = [];
    currentModal = null;
    if ( closeAll && typeof closeAll == 'function') {
        closeAll.apply(this);
    }
};

export default Modal;
