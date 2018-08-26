import router from './router'
import store from './store'

import types from './store/types'


const whiteList = ['/login', '/authredirect'] // 白名单
router.beforeEach((to, from, next) => {
    let token = window.localStorage.getItem('token');
    let _id = window.localStorage.getItem('_id');
    let user_info = store.getters.user_info.token
    if (token !== 'null' && token !== 'undefined' && token) {
        if (to.path === '/login' && token) {
            next()
        }
        else{
            if (!user_info) {
                store.dispatch(types.GET_USERINFO, {_id: _id}).then(() => {
                    next()
                })
                Promise.all([types.GET_TOPREADINGARTICLE, types.GET_TOPFILMARTICLE, types.GET_TOPMUSICARTICLE, types.GET_TOPSOUNDARTICLE].map(item => {
                    return store.dispatch(item)
                })).then(() => {
                    next()
                })
            }
            else {
                next()
            }
        }
    } else {
        /* has no token*/
        if (whiteList.indexOf(to.path) > -1) { // 在免登录白名单，直接进入
            next()
        } else {
            next()
        }
    }
})

router.afterEach(() => {

})
