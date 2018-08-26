import Vue from 'vue'
import PromptComponent from './Prompt.vue'
let instance;

// init constructor
let PromptConstructor = Vue.extend(PromptComponent);

// init toast instance
let initInstance = () => {
    instance = new PromptConstructor({
        el: document.createElement('div')
    });
    document.body.appendChild(instance.$el);
}

// 显示
let Prompt = (opt, confirm, cancel) => {
    instance.show = true
    instance.options = {
        title: opt.title ,
        val: opt.val,
        cancelBtnTxt: opt.cancelBtnTxt,
        confirmBtnTxt: opt.confirmBtnTxt || '确定',
        bg: opt.bg || `rgba(0,0,0,0.3)`,
        type: opt.type,
    }
    if (instance.options.type === 'password'){
        instance.options.pw = {
            oldPassword: opt.pw.oldPassword,
            newPassword: opt.pw.newPassword,
        }
    }
    instance.handleConfirm = confirm
    instance.handleCancel = cancel || instance.handleCancel
}
export default {
    install(Vue) {
        initInstance();
        Vue.prototype.$prompt = Prompt;
    }
};
