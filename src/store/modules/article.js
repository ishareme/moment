import types from "../types";
import axios from "../../api/axios";

export default {
    // namespaced: true,

    state: {
        topReadingInfo: {},
        topFilmInfo: {},
        topMusicInfo: {},
        topSoundInfo: {},
    },

    getters: {

    },

    mutations: {
        [types.GET_TOPREADINGARTICLE](state, data) {
            state.topReadingInfo = {
                ...data.data.data,
            }
        },
        [types.GET_TOPFILMARTICLE](state, data) {
            state.topFilmInfo = {
                ...data.data.data,
            }
        },
        [types.GET_TOPMUSICARTICLE](state, data) {
            state.topMusicInfo = {
                ...data.data.data,
            }
        },
        [types.GET_TOPSOUNDARTICLE](state, data) {
            state.topSoundInfo = {
                ...data.data.data,
            }
        },
    },
    actions: {
        [types.GET_TOPREADINGARTICLE]({commit}) {
            return axios.getTopReadingArticle().then((res) => {
                commit(types.GET_TOPREADINGARTICLE, res);
            }).catch(error => console.log(error));
        },
        [types.GET_TOPFILMARTICLE]({commit}) {
            return axios.getTopFilmArticle().then((res) => {
                commit(types.GET_TOPFILMARTICLE, res);
            }).catch(error => console.log(error));
        },
        [types.GET_TOPMUSICARTICLE]({commit}) {
            return axios.getTopMusicArticle().then((res) => {
                commit(types.GET_TOPMUSICARTICLE, res);
            }).catch(error => console.log(error));
        },
        [types.GET_TOPSOUNDARTICLE]({commit}) {
            return axios.getTopSoundArticle().then((res) => {
                commit(types.GET_TOPSOUNDARTICLE, res);
            }).catch(error => console.log(error));
        },
    },
};
