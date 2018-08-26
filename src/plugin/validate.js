const rules = {
    requireReq : /.+/,
    email: /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/,
    url: /^((https|http|ftp|rtsp|mms)?:\/\/)[^\s]+/,
    ip: /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])((\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])){3}|(\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])){5})$/,
    tel: /^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/,
    phone: /^1[3|4|5|7|8][0-9]{9}$/,
    chinese: /^[\u0391-\uFFE5]+$/,
    english: /^[A-Za-z]+$/,
    identityNum: /\d{15}(\d\d[0-9xX])?/,
    //6-16位, 数字, 字母, 字符至少包含两种, 同时不能包含中文和空格
    passWord: /(?!^[0-9]+$)(?!^[A-z]+$)(?!^[^A-z0-9]+$)^[^\s\u4e00-\u9fa5]{6,16}$/,
    // isPassWordEqual:

    require: function (str) {
        return this.requireReq.test(str)
    },
    isEmail: function (str) {
        return this.email.test(str)
    },
    isUrl: function (str) {
        return this.url.test(str)
    },
    isIp: function (str) {
        return this.ip.test(str)
    },
    isTel: function (str) {
        return this.tel.test(str)
    },
    isPhone: function (str) {
        return this.phone.test(str)
    },
    isEnglish: function (str) {
        return this.english.test(str)
    },
    isChinese: function (str) {
        return this.chinese.test(str)
    },
    isIdentityNum: function (str) {
        return this.identityNum.test(str)
    },
    isPassWord: function (str) {
        return this.passWord.test(str)
    },
    isNumber: function (val) {
        return; return typeof val === 'number' && isFinite(val)
    },
    isString: function (str) {
        return typeof str === 'string'
    },
    limitLength(str, min, max){
        return min <= str.length && str.length <= max
    },
    limitVal(val, min, max){
        return min <= val && val <= max
    },
    isPassWordEqual(){

    }
};

const utils = {
    isUndefined(val){
        return typeof val === 'undefined'
    },
    isFunction(fn){
        return typeof fn === 'function'
    }
}

let self = {
    init(Vue, options, callback){
        this.validate(Vue, options, callback)
    },
    validate(Vue, options, callback){
        let validateRArr = [], validateVal = Vue[options]
        let result = false
        if (!utils.isUndefined(options) && !utils.isUndefined(Vue.rules[options]) && !utils.isUndefined(validateVal)) {
            for (let [key, value] of Object.entries(Vue.rules[options])) {
                if (!value) continue
                if (key === 'validator'){
                    if (!utils.isFunction(value)) continue
                    value()
                    continue
                }
                if (!rules[key](validateVal)) {
                    break
                }
                else {
                    result = true
                }
            }

            if (result){
                callback && callback({
                    type: 'success',
                    key: options,
                    value: validateVal,
                })
            }
            else {
                callback && callback({
                    type: 'error',
                    key: options,
                    value: validateVal,
                })
            }
        }
    },
};

function Validate(options) {
    return new Promise((resolve, reject) =>{
        self.init(this, options, (date) => {
            if (date.type === 'success') {
                resolve({
                    type: 'success',
                    key: date.key,
                    value: date.value,
                })
            }
            else {
                reject({
                    type: 'error',
                    key: date.key,
                    value: date.value,
                })
            }
        })
    })
}




export default {
    install(Vue){
        Vue.prototype.$validate = Validate
    }
};
