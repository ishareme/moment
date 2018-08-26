<template>
    <div class="main">
        <audio
            :src="src"
            preload="auto"
            class="audio"
            loop="loop"
            ref="audio"
        >
        </audio>
    </div>
</template>

<script>
    export default {
        name: "m-audio",
        data(){
            return {
                music: null,
                mStatus: 'pause'
            }
        },
        props: {
            src:{
                type: String,
            },
            status: {
                type: String,
                default: 'pause'
            }
        },
        mounted() {
            this.music = this.$refs.audio
            // if (window.WeixinJSBridge) {
            //     WeixinJSBridge.invoke('getNetworkType', {}, ()=>{
            //         this.switchMusic('play');
            //     });
            // } else if (this.$is.WeChat) {
            //     document.addEventListener('WeixinJSBridgeReady', ()=>{
            //         this.switchMusic('play');
            //     });
            // }
        },
        watch: {
            status(status){
                if((status && status == 'play') || (!status && this.music.paused)){
                    setTimeout(() => {
                        this.music.play();
                    }, 500)
                }else if((status && status == 'pause') || (!status && !this.music.paused)){
                    this.music.pause();
                }
            }
        },
        methods: {
            // play(){
            //     this.music.play();
            // },
            // pause(){
            //     this.music.pause();
            // },
            // switchMusic(status) {
            //     if (!this.music) return
            //     if((status && status == 'play') || (!status && this.music.paused)){
            //         this.music.play();
            //         this.status = true;
            //     }else if((status && status == 'pause') || (!status && !this.music.paused)){
            //         this.status = false;
            //         this.music.pause();
            //     }
            // },
        }
    }
</script>

<style lang="scss" scoped>
    .main{
        width: 0;
        height: 0;
        opacity: 0;
        .audio{
            width: 0;
            height: 0;
            opacity: 0;
        }
    }
</style>
