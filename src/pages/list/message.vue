<template>
    <div class="message-list">
        <div class="container">
            <div class="banner">

            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "message"
    }
</script>

<style lang="scss" scoped>
    .message-list{
        position: absolute;
        left: 0;
        top: 0;
        width: 750px;
        height: 100vh;
        .container{
            width: 100%;
            overflow-y: scroll;
            margin-top: 128px;
        }
    }
</style>
