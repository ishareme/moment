<template>
    <transition name="fade-toast">
        <div v-if="is_show" class="toast" :class="type">
            {{content}}
        </div>
    </transition>
</template>

<script>
    export default {
        name: "toast",
        data() {
            return {
                is_show: false, //是否显示toast
                duration: 1500, //停留的时间
                content: "" ,//显示的内容
                type: 'center'
            };
        }
    }
</script>

<style scoped>
    .fade-toast-enter {
        opacity: 0;
    }
    .fade-toast-enter-active,
    .fade-toast-leave-active {
        transition: opacity 0.4s;
    }
    .fade-toast-leave-active {
        opacity: 0;
    }

    .toast {
        padding:20px 30px;
        font-size:.55rem;
        word-break:break-all;
        word-wrap:break-word;
        white-space:nowrap;
        border-radius:10px;
        background-color: rgba(0,0,0,0.8);
        color:#fff;
        opacity: 0.9;
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
