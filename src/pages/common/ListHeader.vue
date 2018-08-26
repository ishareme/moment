<template>
    <div class="list-header">
        <div class="container">
            <div class="title">{{title}}</div>
        </div>
        <div class="back" @click="goBack"></div>
    </div>
</template>

<script>
    import mixin from '../../mixins';
    export default {
        name: "list-header",
        mixins: [mixin],
        props: {
            title: {
                type: String,
            }
        },
        methods: {
            goBack(){
                this.setTransitionName('move-left-to-right')
                this.$router.go(-1)
            }
        }
    }
</script>

<style lang="scss" scoped>
    .list-header{
        width: 100%;
        height: 88px;
        background-color: #fff;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 9;
        .container{
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            display: flex;
            justify-content: center;
            align-items: center;
            .title{
                font-size: 26px;
                font-weight: bold;
            }
        }
        .back{
            width: 18px;
            height: 35px;
            background: url("../../assets/images/back.png") no-repeat;
            background-size: 100% auto;
            position: absolute;
            left: 25px;
            top: 30px;
        }
    }
</style>

