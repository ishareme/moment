<template>
    <div class="make-result">
        <div class="back" @click="goBack"></div>
        <div class="container">
            <div class="result">
                <img :src="url" alt="">
            </div>
            <div class="tip">请长按图片进行保存</div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "make-result",
        props: {
            url: {
                type: String,
            }
        },
        created(){
            document.getElementById('app').style.backgroundColor = `#fff`
        },
        watch: {
        },
        methods: {
            goBack(){
                this.$emit('back')
            },
        }
    }
</script>

<style lang="scss" scoped>
    .make-result{
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        background: #fff;
        .back{
            width: 18px;
            height: 35px;
            background: url("../assets/images/back.png") no-repeat;
            background-size: 100% auto;
            position: absolute;
            left: 28px;
            top: 25px;
            z-index: 1;
        }
        .container{
            width: 100%;
            background: #fff;
            position: relative;
            .result{
                width: 100%;
                img{
                    width: 100%;
                }
            }
            .tip{
                width: 100%;
                font-size: 28px;
                color: #666;
                text-align: center;
                padding-top: 20px;
                padding-bottom: 30px;
            }
        }

    }
</style>
