import Vue from 'vue'
import NotifyComponent from './Notify'
let instance;
// toast 是否存在的标记位
let showing = false;

// init constructor
let NotifyConstructor = Vue.extend(NotifyComponent);

// init toast instance
let initInstance = () => {
    instance = new NotifyConstructor({
        el: document.createElement('div')
    });
    document.body.appendChild(instance.$el);
}

// 显示
let Notify = (content, duration = 5500) => {
    // 如果没有显示, 则不显示
    if (!showing) {
        showing = true;
        initInstance();
        instance.is_show = true;
        instance.content = content;
        instance.duration = duration;

        // 在指定 duration 之后干掉 toast
        setTimeout(() => {
            showing = false;
            instance.is_show = false;
        }, instance.duration);
    }
}
export default {
    install(Vue) {
        Vue.prototype.$notify = Notify;
    }
};
