<template>
    <div v-show="is_show" @click="closePreview" class="preview">
        <div class="main">
            <div class="author">{{author_name}}</div>
            <img :src="imageUrl" alt="">
        </div>
    </div>
</template>

<script>
    export default {
        name: "image-preview",
        props: {
            show: {
                type: Boolean
            },
            imageUrl: {
                type: String
            },
            author_name: {
                type: String
            }
        },
        data() {
            return {

            };
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
        background-color: rgba(0,0,0,0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        .author{
            width: 100%;
            height: 50px;
            line-height: 50px;
            font-size: 32px;
            color: rgba(255,255,255,0.8);
            margin-bottom: 30px;
            img{
                width: 100px;
            }
        }
    }
</style>
