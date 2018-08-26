<template>
    <div class="moment">
        <m-header></m-header>
        <scroller class="scroller" ref="scroller"
            :on-refresh="refresh"
            :on-infinite="infinite"
                  :height="scrollerH"
                  :snappingHeight="30"
                  refresh-layer-color="#666"
                  loading-layer-color="#666"
        >
            <svg class="spinner" style="stroke: #666;" slot="refresh-spinner" viewBox="0 0 64 64">
                <g stroke-width="7" stroke-linecap="round"><line x1="10" x2="10" y1="27.3836" y2="36.4931"><animate attributeName="y1" dur="750ms" values="16;18;28;18;16;16" repeatCount="indefinite"></animate><animate attributeName="y2" dur="750ms" values="48;46;36;44;48;48" repeatCount="indefinite"></animate><animate attributeName="stroke-opacity" dur="750ms" values="1;.4;.5;.8;1;1" repeatCount="indefinite"></animate></line><line x1="24" x2="24" y1="18.6164" y2="45.3836"><animate attributeName="y1" dur="750ms" values="16;16;18;28;18;16" repeatCount="indefinite"></animate><animate attributeName="y2" dur="750ms" values="48;48;46;36;44;48" repeatCount="indefinite"></animate><animate attributeName="stroke-opacity" dur="750ms" values="1;1;.4;.5;.8;1" repeatCount="indefinite"></animate></line><line x1="38" x2="38" y1="16.1233" y2="47.8767"><animate attributeName="y1" dur="750ms" values="18;16;16;18;28;18" repeatCount="indefinite"></animate><animate attributeName="y2" dur="750ms" values="44;48;48;46;36;44" repeatCount="indefinite"></animate><animate attributeName="stroke-opacity" dur="750ms" values=".8;1;1;.4;.5;.8" repeatCount="indefinite"></animate></line><line x1="52" x2="52" y1="16" y2="48"><animate attributeName="y1" dur="750ms" values="28;18;16;16;18;28" repeatCount="indefinite"></animate><animate attributeName="y2" dur="750ms" values="36;44;48;48;46;36" repeatCount="indefinite"></animate><animate attributeName="stroke-opacity" dur="750ms" values=".5;.8;1;1;.4;.5" repeatCount="indefinite"></animate></line></g></svg>
            <div class="container" id="scrollMoment">
                <div class="banner" v-for="(item, index) in imageArticleList" v-bind:key="item._id">
                    <div class="cover" @click="showPreview(item)">
                        <img alt="" :src="item.image_url">
                    </div>
                    <div class="info">
                        <p class="txt">{{item.content}}</p>
                        <p class="author" @click="toUser(item)">{{item.author.username}}</p>
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
            <svg class="spinner" style="fill: #666;" slot="infinite-spinner" viewBox="0 0 64 64">
                <g><circle cx="16" cy="32" stroke-width="0" r="3"><animate attributeName="fill-opacity" dur="750ms" values=".5;.6;.8;1;.8;.6;.5;.5" repeatCount="indefinite"></animate><animate attributeName="r" dur="750ms" values="3;3;4;5;6;5;4;3" repeatCount="indefinite"></animate></circle><circle cx="32" cy="32" stroke-width="0" r="3.09351"><animate attributeName="fill-opacity" dur="750ms" values=".5;.5;.6;.8;1;.8;.6;.5" repeatCount="indefinite"></animate><animate attributeName="r" dur="750ms" values="4;3;3;4;5;6;5;4" repeatCount="indefinite"></animate></circle><circle cx="48" cy="32" stroke-width="0" r="4.09351"><animate attributeName="fill-opacity" dur="750ms" values=".6;.5;.5;.6;.8;1;.8;.6" repeatCount="indefinite"></animate><animate attributeName="r" dur="750ms" values="5;4;3;3;4;5;6;5" repeatCount="indefinite"></animate></circle></g></svg>
        </scroller>
        <m-footer></m-footer>
    </div>
</template>

<script>
    import MHeader from './common/MHeader';
    import MFooter from './common/MFooter';
    import ImagePreview from './common/ImagePreview'
    import { mapState, mapGetters, mapMutations } from 'vuex'
    import types from '../store/types'
    import mixin from '../mixins';
    export default {
        name: "moment",
        components: {
            MHeader,
            MFooter,
            ImagePreview
        },
        mixins: [mixin],
        data(){
            return {
                imageArticleList: [],
                totalItems: 0,
                current: 1,
                scrollerH: '625',
            }
        },
        created(){
            this.scrollerH = Math.floor(window.innerHeight - (window.innerWidth * 88 / 750) - (window.innerWidth * 98 / 750)).toString()
            this.showLoading('isData')
            this.$axios.getImageArticleList({current: this.current}).then(res => {
                this.totalItems = res.data.data.pageInfo.totalItems
                this.imageArticleList = res.data.data.docs
                this.preload(this.imageArticleList.map(item => {
                    return item.image_url
                })).done(() => {
                    this.hideLoading('isData')
                })
            })
        },
        mounted(){
        },
        computed: {
            ...mapGetters([
                'user_info',
            ]),
        },
        methods: {
            refresh(done){
                this.$axios.getImageArticleList().then(res => {
                    this.imageArticleList = res.data.data.docs
                    this.preload(this.imageArticleList.map(item => {
                        return item.image_url
                    })).done(() => {
                        this.current = 1
                        done()
                    })
                })
            },
            infinite(done){
                if((this.current * 5) >= this.totalItems) {
                    this.$refs.scroller.finishInfinite(2);
                    return;
                }

                this.current++
                this.$axios.getImageArticleList({current: this.current}).then((res) => {
                    this.imageArticleList = res.data.data.docs
                    this.preload(this.imageArticleList.map(item => {
                        return item.image_url
                    })).done(() => {
                        this.$refs.scroller.resize();
                        done()
                    })
                })
            },
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
            toUser(item){
                this.setTransitionName('move-right-to-left')
                this.$router.push({
                    path: '/user',
                    query: {
                        user_id: item.author._id
                    }
                });
            }
        }
    }
</script>

<style lang="scss" scoped>
    .moment{
        max-width: 750px;
        height: 100vh;
        .scroller{
            margin-top: 98px;
            height: 100%;
            overflow: hidden;
            .container{
                width: 100%;
                overflow-y: scroll;
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
                            margin-top: 80px;
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
                                    background: url("../assets/images/collect.png") no-repeat;
                                    background-size: 100% auto;
                                    margin-right: 30px;
                                    cursor: pointer;
                                }
                                .collect.active{
                                    background: url("../assets/images/colect-active.png") no-repeat;
                                    background-size: 100% auto;
                                }
                                .share{
                                    width: 32px;
                                    height: 32px;
                                    background: url("../assets/images/share.png") no-repeat;
                                    background-size: 100% auto;
                                    margin-right: 40px;
                                    cursor: pointer;
                                }
                                .like-box{
                                    display: flex;
                                    .like{
                                        width: 32px;
                                        height: 32px;
                                        background: url("../assets/images/like.png") no-repeat;
                                        background-size: 100% auto;
                                        cursor: pointer;
                                    }
                                    .like.active{
                                        background: url("../assets/images/like-active.png") no-repeat;
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
    }
</style>
