<template>
    <transition name="rotate-sides">
        <div v-if="is_show" class="notify" @clik="toMessage">
            {{content}}
            <div class="right centerY"></div>
        </div>
    </transition>
</template>

<script>
    import mixin from '../../mixins';
    export default {
        name: "notify",
        data() {
            return {
                is_show: false, //是否显示toast
                duration: 10500, //停留的时间
                content: "" ,//显示的内容
            };
        },
        mixins: [mixin],
        methods: {
            toMessage(){
                this.setTransitionName('move-right-to-left')
                this.$router.push({
                    path: `/message`
                });
            }
        }
    }
</script>

<style lang="scss" scoped>
    .fade-notify-enter {
        opacity: 0;
    }
    .fade-notify-enter-active,
    .fade-notify-leave-active {
        transition: opacity 0.4s;
    }
    .fade-notify-leave-active {
        opacity: 0;
    }
    /*************** rotate-sides **************/
    .rotate-sides-enter-active {
        animation: rotateSlideIn 1s both ease;
    }
    .rotate-sides-leave-active {
        animation: rotateSlideOut 1s both ease;
    }
    @keyframes rotateSlideIn {
        0%,
        25% {
            opacity: 0.5;
            transform: translateZ(-500px) translateX(200%);
        }
        75% {
            opacity: 0.5;
            transform: translateZ(-500px);
        }
        100% {
            opacity: 1;
            transform: translateZ(0) translateX(0);
        }
    }
    @keyframes rotateSlideOut {
        25% {
            opacity: 0.5;
            transform: translateZ(-500px);
        }
        75% {
            opacity: 0.5;
            transform: translateZ(-500px) translateX(-200%);
        }
        100% {
            opacity: 0.5;
            transform: translateZ(-500px) translateX(-200%);
        }
    }


    .notify {
        width: 650px;
        box-shadow: 0 0 5px 0 #444;
        text-align: center;
        padding: 20px 40px 20px 20px;
        font-size: 30px;
        font-weight: bold;
        color: #666;
        word-break:break-all;
        word-wrap:break-word;
        background-color: #fff;
        position:fixed;
        z-index:99999;
        top: 0;
        left:50%;
        transform: translateX(-50%);
        .right{
            width: 48px;
            height: 48px;
            background: url("../../assets/images/right-arrow2.png") no-repeat;
            background-size: 100% auto;
            position: absolute;
            right: 15px;
        }
    }
    .center{
        position:fixed;
        z-index:99999;
        top:50%;
        left:50%;
        transform:translate(-50%,-50%);
    }
    .top{
        position:fixed;
        z-index:99999;
        top: 50px;
        left:50%;
        transform: translateX(-50%);
    }
    .bottom{
        position: fixed;
        z-index:99999;
        bottom: 50px;
        left:50%;
        transform: translateX(-50%);
    }
</style>
