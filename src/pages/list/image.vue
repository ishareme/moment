<template>
    <div class="image-collect">
        <list-header title="图文收藏"></list-header>
        <div class="container">
            <div class="noImage center" v-if="!imageArticleList.length">
                <div>無</div>
            </div>
            <div class="banner" v-else v-for="(item, index) in imageArticleList" v-bind:key="item._id">
                <div class="cover" @click="showPreview(item)">
                    <img alt="" :src="item.image_url">
                </div>
                <div class="info">
                    <p class="txt">{{item.content}}</p>
                    <p class="author">{{item.author.username}}</p>
                    <div class="bottom">
                        <div class="time">{{moment(item.create_time)}}</div>
                        <div class="operate">
                            <div class="collect" :class="{active: isCollected(item, index)}" @click="handleCollect(item, index)"></div>
                            <div class="share"></div>
                            <div class="like-box" @click="handleLike(item, index)">
                                <div class="like" :class="{active: isLiked(item)}"></div>
                                <div class="num-box">
                                    <div class="num">{{item.likes_count}}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import ListHeader from '../common/ListHeader'
    import { mapState, mapGetters, mapMutations } from 'vuex'
    import types from '../../store/types'
    import mixin from '../../mixins';
    export default {
        name: "image-collect",
        components: {
            ListHeader,
        },
        data(){
            return {
                imageArticleList: [],
            }
        },
        mixins: [mixin],
        computed: {
            ...mapGetters([
                'user_info',
            ]),
        },
        created(){
            this.imageArticleList = this.$route.params
            console.log('this.imageArticleList',this.imageArticleList)
        },
        watch: {
            $route (to, from) {
                if (to.name === 'ImageList'){
                    this.imageArticleList = to.params
                }
            }
        },
        methods: {
            handleCollect(item, index){
                const to_collect = this.isCollected(item)
                console.log('!to_collect',!to_collect)
                this.$axios.changeImageArticleCollectById({_id: item._id, user_id: this.user_info._id, to_collect: !to_collect}).then(res => {
                    console.log(res.data.data)
                    this.imageArticleList[index] = Object.assign(this.imageArticleList[index], res.data.data)
                })
            },
            handleLike(item, index){
                const to_like = this.isLiked(item)
                this.$axios.changeImageArticleLikesById({_id: item._id, user_id: this.user_info._id, to_like: !to_like}).then(res => {
                    this.imageArticleList[index] = Object.assign(this.imageArticleList[index], res.data.data)
                })
            },
        }
    }
</script>

<style lang="scss" scoped>
    .image-collect{
        position: absolute;
        left: 0;
        top: 0;
        width: 750px;
        height: 100vh;
        .container{
            margin-top: 98px;
            .noImage{
                width: 100%;
                height: 100%;
                font-size: 50px;
                color: #666;
            }
            .banner{
                width: 100%;
                background-color: #fff;
                margin-bottom: 20px;
                &:last-child{
                    margin-bottom: 10px;
                }
                .cover{
                    width: 100%;
                    height: 470px;
                    overflow: hidden;
                    background: rgba(255,255,255,.3);
                    img{
                        width: 100%;
                        max-height: 80vh;
                    }
                    img[lazy=loading] {
                        width: 40px;
                        height: 300px;
                        margin: auto;
                    }
                }
                .info{
                    width: 570px;
                    margin: 0 auto;
                    font-size: 30px;
                    line-height: 35px;
                    color: #666666;
                    letter-spacing: 2px;
                    .txt{
                        width: 100%;
                        margin-top: 50px;
                        text-align: center;
                    }
                    .author{
                        width: 100%;
                        margin-top: 40px;
                        text-align: center;
                    }
                    .bottom{
                        width: 100%;
                        margin-top: 60px;
                        padding-bottom: 10px;
                        display: flex;
                        justify-content: space-between;
                        .time{
                            font-size: 28px;
                            text-align: left;
                        }
                        .operate{
                            display: flex;
                            justify-content: center;
                            .collect{
                                width: 32px;
                                height: 33px;
                                background: url("../../assets/images/collect.png") no-repeat;
                                background-size: 100% auto;
                                margin-right: 30px;
                                cursor: pointer;
                            }
                            .collect.active{
                                background: url("../../assets/images/colect-active.png") no-repeat;
                                background-size: 100% auto;
                            }
                            .share{
                                width: 32px;
                                height: 32px;
                                background: url("../../assets/images/share.png") no-repeat;
                                background-size: 100% auto;
                                margin-right: 40px;
                                cursor: pointer;
                            }
                            .like-box{
                                display: flex;
                                .like{
                                    width: 32px;
                                    height: 32px;
                                    background: url("../../assets/images/like.png") no-repeat;
                                    background-size: 100% auto;
                                    cursor: pointer;
                                }
                                .like.active{
                                    background: url("../../assets/images/like-active.png") no-repeat;
                                    background-size: 100% auto;
                                }
                                .num-box{
                                    height: 100%;
                                    .num{
                                        font-size: 16px;
                                        color: #141414;
                                        transform: scale(0.7);
                                        margin-left: 3px;
                                    }
                                }
                            }

                        }
                    }
                }
            }
        }
    }
</style>
