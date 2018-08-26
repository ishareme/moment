<template>
    <div class="music-collect">
        <list-header title="音乐收藏"></list-header>
        <div class="container">
            <div class="no center" v-if="!musicArticleList.length">
                <div>無</div>
            </div>
            <div class="banner" v-else v-for="(item, index) in musicArticleList" v-bind:key="item._id" @click="toArticleDetail(item)">
                <div class="left" :style="{background: `url(${item.music_info ? item.music_info.cover : ''}) no-repeat center`, backgroundSize: '100% auto'}"></div>
                <div class="right">
                    <div class="title">{{item.title}}</div>
                    <div class="music_info">{{item.music_info ? item.music_info.name : '未知'}} / {{item.music_info.singer ? item.music_info.singer: '未知'}}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import ListHeader from '../common/ListHeader'
    import mixin from '../../mixins';
    import moment from 'moment'
    export default {
        name: "music-list",
        mixins: [mixin],
        components: {
            ListHeader,
        },
        data(){
            return {
                musicArticleList: [],
            }
        },
        created(){
            this.musicArticleList = this.$route.params
        },
        watch: {
            $route (to, from) {
                if (to.name === 'MusicCollect' && from.path.indexOf('music') > -1){
                    this.$router.push('/me')
                }
                this.musicArticleList = to.params
            }
        },
        methods: {
            goBack(){
                this.setTransitionName('move-left-to-right')
                this.$router.go(-1)
            },
            toArticleDetail(item){
                this.setTransitionName('move-right-to-left')
                this.$router.push({
                    path: `/music/${item._id}`
                });
            },
        }
    }
</script>

<style lang="scss" scoped>
    .music-collect{
        position: absolute;
        left: 0;
        top: 0;
        width: 750px;
        height: 100vh;
        .container{
            width: 100%;
            overflow-y: scroll;
            margin-top: 128px;
            .no{
                font-size: 50px;
                color: #666;
            }
            .banner{
                width: 670px;
                height: 150px;
                border-radius: 10px;
                margin: 0 auto;
                box-shadow: 0 0 5px 0px #c4c4c4;
                margin-bottom: 30px;
                position: relative;
                overflow: hidden;
                display: flex;
                background-color: #fff;
                &:last-child{
                    margin-bottom: 0;
                }
                .left{
                    width: 150px;
                    height: 150px;
                }
                .right{
                    width: 520px;
                    font-size: 32px;
                    color: #666;
                    .title{
                        width: 520px;
                        height: 100px;
                        box-sizing: border-box;
                        padding: 10px 10px;
                        word-break:break-all;
                        word-wrap: break-word;
                        display: -webkit-box;
                        -webkit-box-orient: vertical;
                        -webkit-line-clamp: 2;  //这里是在第二行有省略号
                        overflow: hidden;
                        text-align: left;
                    }
                    .music_info{
                        width: 520px;
                        height: 50px;
                        box-sizing: border-box;
                        text-align: right;
                        font-size: 20px;
                        line-height: 50px;
                        padding: 0 30px;
                    }
                }
            }
        }
    }
</style>
