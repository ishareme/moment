<template>
    <div id="app">
        <transition
            :name="transitionName"
        >
            <keep-alive>
                <router-view/>
            </keep-alive>
        </transition>

        <loading :show="loadingShow" :isData="isLoadingData"></loading>

        <transition>
            <image-preview :show="previewInfo.show" :author_name="previewInfo.author_name" :src="previewInfo.src" @handleClosed="handlePreviewClosed"></image-preview>
        </transition>

        <m-audio :src="audioSrc" :status="audioStatus"></m-audio>
    </div>
</template>

<script>
    import { mapState, mapGetters, mapMutations } from 'vuex'
    import types from './store/types'
    import mixin from './mixins';


    import Loading from './components/Loading/Loading'
    import ImagePreview from './pages/common/ImagePreview'
    import MAudio from './components/Audio/Audio'

    export default {
        name: 'App',
        data () {
            return {
            }
        },
        sockets:{
            connect(){
            },
            receive_message(val){
                if (val){
                    console.log('服务端实时通信', val)
                    this.$notify(val.content)
                    console.log('this method was fired by the socket server. eg: io.emit("customEmit", data)')
                }
            }
        },
        mixins: [mixin],
        mounted(){
            if (!!JSON.parse(window.localStorage.getItem('user_info'))){
                this.$socket.emit('login_success', {
                    user_id: JSON.parse(window.localStorage.getItem('user_info'))._id
                })
            }
        },
        components: {
            Loading,
            ImagePreview,
            MAudio
        },
        computed: {
            ...mapState({
                transitionName: state => {
                    return state.transitionName
                },
                loadingShow: state => {
                    return state.loadingShow
                },
                isLoadingData: state => {
                    return state.isLoadingData
                },
                previewInfo: state => {
                    return state.previewInfo
                },
                audioSrc: state => {
                    return state.audioSrc
                },
                audioStatus: state => {
                    return state.audioStatus
                },
            })
        },
        methods: {
            handlePreviewClosed(){
                this.hidePreview()
            }
        }
    }
</script>

<style lang="scss">
    #app{
        position: relative;
    }
</style>
