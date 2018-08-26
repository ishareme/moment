<template>
    <div v-show="is_show" @click="closePreview" class="preview">
        <div class="main">
            <img :src="src" alt="">
            <div class="author text-overflow">Author: &nbsp;{{author_name}}</div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "image-preview",
        props: {
            src: {
                type: String
            },
            author_name: {
                type: String
            },
            show: {
                type: Boolean
            }
        },
        data() {
            return {
                is_show: false,
            };
        },
        created(){

        },
        watch: {
            show(newVal){
                this.is_show = newVal
            }
        },
        methods: {
            closePreview(event){
                if (event.target.tagName.toLowerCase() === 'img') return
                this.is_show = false
                this.$emit('handleClosed')
            }
        }
    }
</script>
<style lang="scss" scoped>
    .preview{
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        z-index: 99999;
        background-color: rgba(0,0,0,0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        position: fixed;
        top: 0;
        bottom: 0;
        .author{
            width: 100%;
            height: 50px;
            line-height: 50px;
            font-size: 32px;
            color: rgba(255,255,255,0.8);
            text-align: right;
            text-indent: 10px;
            margin-top: 30px;
            padding-right: 30px;
            box-sizing: border-box;
        }
        img{
            width: 100%;
        }
    }
</style>
