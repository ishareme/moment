<template>
    <div class="loading" v-show="show">
        <div class="container" :class="{noWhite: isData}">
            <Circle8 v-if="isData"></Circle8>
            <circle1 v-else></circle1>
        </div>
    </div>
</template>

<script>
    import Wave from './Wave'
    import Circle1 from './Circle'
    import Circle8 from './Circle8'
    export default {
        name: "loading",
        props: {
            show: {
                type: Boolean,
                default: false,
            },
            isData: {
                type: Boolean,
                default: false,
            }
        },
        components: {
            Wave,
            Circle1,
            Circle8
        }
    }
</script>

<style lang="scss" scoped>
    .loading{
        position: fixed;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        z-index: 999;

        .container{
            width: 100%;
            height: 100%;
            background: rgba(255,255,255,.9);
            display: flex;
            justify-content: center;
            align-items: center;
            &.noWhite{
                background: transparent;
            }
        }
    }
</style>
