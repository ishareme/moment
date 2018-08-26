import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

import './assets/css/app.scss'

Vue.config.productionTip = false

import './permission'

//插件
import V from './plugin/v'
import upload from './plugin/upload'
import axios from './api'
import Toast from './components/Toast'
import Notify from './components/notify'
import Prompt from './components/Prompt'
import VueScroller from 'vue-scroller'
import { focus } from 'vue-focus';
Vue.directive('focus', focus)
Vue.use(V).use(axios).use(Toast).use(Prompt).use(VueScroller).use(Notify)
Vue.prototype.upload = (data, callback) => {
    upload(Vue, data, callback)
}

import VueSocketio from 'vue-socket.io';
Vue.use(VueSocketio, 'http://localhost:8888/');
// Vue.use(VueSocketio, 'http://119.29.68.45:8888');

new Vue({
    el: '#app',
    router,
    store,
    components: { App },
    template: '<App/>'
})
