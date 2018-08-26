<template>
    <div class="reading-collect">
        <list-header title="阅读收藏"></list-header>
        <div class="container" >
            <div class="no center" v-if="!readingArticleList.length">
                <div>無</div>
            </div>
            <div class="banner" v-else v-for="(item, index) in readingArticleList" v-bind:key="item._id" @click="toArticleDetail(item)">
                <img class="center" :src="item.cover_url" alt="">
                <div class="main">
                    <div class="title">{{item.title}}</div>
                    <div class="info">
                        <div class="time">{{moment(item.update_time,`YYYY/MM/DD`)}}</div>
                        <div class="author">©&nbsp;️{{item.author.user_id ? item.author.user_id.username : ''}}</div>
                    </div>
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
        name: "reading-list",
        mixins: [mixin],
        components: {
            ListHeader,
        },
        data(){
            return {
                readingArticleList: [],
            }
        },
        created(){
            console.log('this.$route',this.$route)
            this.readingArticleList = this.$route.params
        },
        watch: {
            $route (to, from) {
                if (to.name === 'ReadingCollect' && from.path.indexOf('reading') > -1){
                    this.$router.push('/me')
                }
                this.readingArticleList = to.params
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
                    path: `/reading/${item._id}`
                });
            },
        }
    }
</script>

<style lang="scss" scoped>
    .reading-collect{
        position: absolute;
        left: 0;
        top: 0;
        width: 750px;
        height: 100vh;
        .container{
            width: 100%;
            overflow-y: scroll;
            margin-top: 98px;
            .no{
                font-size: 50px;
                color: #666;
            }
            .banner{
                width: 670px;
                height: 300px;
                border-radius: 10px;
                margin: 0 auto;
                box-shadow: 0 0 15px 0px #c4c4c4;
                position: relative;
                margin-bottom: 30px;
                overflow: hidden;
                &:last-child{
                    margin-bottom: 0;
                }
                img{
                    width: 100%;
                    -webkit-filter:blur(1px);
                    -moz-filter:blur(1px);
                    -o-filter:blur(1px);
                    -ms-filter:blur(1px);
                    filter:blur(1px);
                }
                .main{
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 10;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    .title{
                        width: 98%;
                        margin: 0 auto;
                        font-size: 30px;
                        font-weight: 400;
                        color: #fff;
                        word-break:break-all;
                        word-wrap: break-word;
                        display: -webkit-box;
                        -webkit-box-orient: vertical;
                        -webkit-line-clamp: 2;  //这里是在第二行有省略号
                        overflow: hidden;
                    }
                    .info{
                        position: absolute;
                        right: 0;
                        bottom: 20px;
                        width: 100%;
                        padding: 0 20px;
                        font-size: 20px;
                        text-align: right;
                        color: #fff;
                    }
                }
            }
        }
    }
</style>
