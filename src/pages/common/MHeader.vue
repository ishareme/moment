<template>
    <div class="header">
        <div class="logo"></div>
    </div>
</template>

<script>
    export default {
        name: "m-header"
    }
</script>

<style lang="scss" scoped>
    @import "../../assets/css/mixin";
    .header{
        width: 100%;
        height: 88px;
        background-color: #fff;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 9;
        .logo{
            width: 191px;
            height: 40px;
            background: url("../../assets/images/logo.png") no-repeat;
            background-size: 100% auto;
            @include center;
        }
    }
</style>
