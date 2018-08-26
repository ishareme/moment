import Vue from 'vue'
import Vuex from 'vuex'
import types from './types'

import user from './modules/user'
import article from './modules/article'



Vue.use(Vuex);


export default new Vuex.Store({
    modules: {
        user,
        article
    },
    state: {
        transitionName: 'move-right-to-left',
        loadingShow: false,
        isLoadingData: false,
        previewInfo: {
            show: false,
            src: '',
            author_name: '',
        },
        audioSrc: '',
        audioStatus: ''
    },
    getters: {
        transitionName: state => state.transitionName,
        user_info: state => {
            return state.user.user_info
        },
        topReadingInfo: state => state.article.topReadingInfo,
        topFilmInfo: state => state.article.topFilmInfo,
        topMusicInfo: state => state.article.topMusicInfo,
        topSoundInfo: state => state.article.topSoundInfo,
        previewInfo: state => state.previewInfo,
        audioSrc: state => state.audioSrc,
        audioStatus: state => state.audioStatus,
    },
    mutations: {
        [types.SET_TRANSITIONNAME](state, data) {
            state.transitionName = data
        },
        [types.SET_LOADING](state, data) {
            state.loadingShow = data.show
            state.isLoadingData = data.isData
        },
        [types.SET_PREVIEW](state, data) {
            state.previewInfo = {
                show: data.show,
                src: !data.show ? '' :  data.item.image_url,
                author_name: !data.show ? '' :  data.item.author.username,
            }
        },
        [types.SET_AUDIOSRC](state, data) {
            state.audioSrc = data
        },
        [types.SET_AUDIOSTATUS](state, data) {
            state.audioStatus = data
        },
    },
    actions: {

    }
})
