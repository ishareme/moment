const Validate = {
    isEmail(val){
        return /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/.test(val)
    },
    password(val){
        //6-16位, 数字, 字母, 字符至少包含两种, 同时不能包含中文和空格
        return /(?!.*[\u4E00-\u9FA5\s])(?!^[a-zA-Z]+$)(?!^[\d]+$)(?!^[^a-zA-Z\d]+$)^.{6,16}$/.test(val)
    },
    isPhone(val){
        return /^1[3|4|5|7|8][0-9]{9}$/.test(val)
    }
}

export default {
    install(Vue){
        Vue.prototype.$v = Validate
    }
};
