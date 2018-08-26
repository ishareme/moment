import types from "../types";
import axios from "../../api/axios";

export default {
    // namespaced: true,

    state: {
        user_info: {

        }
    },

    getters: {

    },

    mutations: {
        [types.USER_REGISTER](state, data) {
            state.user_info = {
                ...data.data.data,
            }
            window.localStorage.setItem('token', state.user_info.token);
            window.localStorage.setItem('_id', state.user_info._id);
            window.localStorage.setItem('user_info', JSON.stringify(state.user_info));
        },
        [types.USER_LOGIN](state, data) {
            state.user_info = {
                ...data.data.data,
            }
            window.localStorage.setItem('token', state.user_info.token);
            window.localStorage.setItem('_id', state.user_info._id);
            window.localStorage.setItem('user_info', JSON.stringify(state.user_info));
        },
        [types.USER_LOGINOUT](state) {
            state.user_info = {};
            window.localStorage.removeItem('token');
            window.localStorage.removeItem('_id');
            window.localStorage.removeItem('user_info');
        },
        [types.GET_USERINFO](state, data) {
            state.user_info = {
                ...data.data.data,
            }
            window.localStorage.setItem('token', state.user_info.token);
            window.localStorage.setItem('_id', state.user_info._id);
            window.localStorage.setItem('user_info', JSON.stringify(state.user_info));
        },
        [types.UPDATE_USERINFO](state, data) {
            state.user_info = {
                ...data.data.data,
            }
            window.localStorage.setItem('token', state.user_info.token);
            window.localStorage.setItem('_id', state.user_info._id);
            window.localStorage.setItem('user_info', JSON.stringify(state.user_info));
        },
    },
    actions: {
        [types.USER_REGISTER]({commit}, data) {
            return new Promise((resolve, reject) => {
                axios.userRegister(data).then((res) => {
                    resolve(res)
                    commit(types.USER_REGISTER, res);
                    resolve()
                }).catch(error => {
                    reject(error)
                    console.log(error)
                });
            })
        },
        [types.USER_LOGIN]({commit}, data) {
            return new Promise((resolve, reject) => {
                axios.userLogin(data).then((res) => {
                    commit(types.USER_LOGIN, res);
                    resolve(res)
                }).catch(error => {
                    reject(error)
                    console.log(error)
                });
            })
        },
        [types.USER_LOGINOUT]({commit, state}){
            commit(types.USER_LOGINOUT);
        },
        [types.GET_USERINFO]({commit}, data) {
            return axios.getUserInfo(data._id).then((res) => {
                commit(types.GET_USERINFO, res);
            }).catch(error => console.log(error));
        },
        [types.UPDATE_USERINFO]({commit}, data) {
            return new Promise((resolve, reject) => {
                axios.updateUserInfo(data).then((res) => {
                    commit(types.UPDATE_USERINFO, res);
                    resolve(res)
                }).catch(error => {
                    reject(error)
                    console.log(error)
                });
            })
        },
    },
};
