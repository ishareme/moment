<template>
    <div class="sound">
        <div class="article-header">
            <div class="container">
                <div class="back" @click="goBack"></div>
                <div class="operate">
                    <div class="collect" :class="{active: collectActive}" @click="handleCollect(soundArticleInfo)"></div>
                    <div class="share"></div>
                    <div class="like" :class="{active: likesActive}" @click="handleLike(soundArticleInfo)"></div>
                </div>
            </div>
        </div>
        <div class="container">
            <div class="title">{{soundArticleInfo.title}}</div>
            <div class="author">主播 / {{(soundArticleInfo.author && soundArticleInfo.author.user_id) ? soundArticleInfo.author.user_id.username : '我叫这个名字'}}</div>
            <div class="cover">
                <img :src="soundArticleInfo.cover_url" alt="">
                <div class="icon" :class="{pause: soundPlay}" @click="switchSound"></div>
            </div>
            <div class="content" ref="soundContent" v-html="soundArticleInfo.content"></div>
            <div class="author-info">
                <div class="sub">作者</div>
                <div class="box">
                    <div class="main">
                        <div class="avatar" @click="toUser(soundArticleInfo.author)" :style="{background: `url(${(soundArticleInfo.author && soundArticleInfo.author.user_id) ? soundArticleInfo.author.user_id.avatar : ''}) no-repeat center`, backgroundSize: `${soundArticleInfo.author ? '100% auto' : ''}`}"></div>
                        <div class="info">
                            <div class="name">
                                {{(soundArticleInfo.author && soundArticleInfo.author.user_id) ? soundArticleInfo.author.user_id.username : 'TA'}}
                            </div>
                            <div class="description">
                                {{(soundArticleInfo.author && soundArticleInfo.author.user_id) ? soundArticleInfo.author.user_id.description : 'TA'}}
                            </div>
                        </div>
                    </div>
                    <div class="follow" :class="{active: isFollowed}" @click="handleFollow(soundArticleInfo.author.user_id)">{{isFollowed ? '已关注' : '关注'}}</div>
                </div>
            </div>
            <div class="comment">
                <div class="sub">评论</div>
                <div class="main" v-for="(item, index) in soundArticleInfo.comment" v-bind:key="item._id">
                    <div class="info">
                        <div class="top">
                            <div class="left">
                                <div class="avatar" @click="toUser(item)" :style="{background: `url(${item.user_id.avatar}) no-repeat center`, backgroundSize: '100% auto'}"></div>
                                <div class="name">{{item.user_id.username}}</div>
                            </div>
                            <div class="right">
                                {{moment(item.create_time, 'YYYY-MM-DD HH:mm:ss')}}
                            </div>
                        </div>
                        <div class="reply-box" v-if="!!item.reply_to_id">
                            <span>{{item.reply_to_id.user_id.username}}:&nbsp;</span>{{item.reply_to_id.content}}
                        </div>
                        <div class="txt">
                            {{item.content}}
                        </div>
                        <div class="bottom">
                            <div class="delComment" v-if="user_info._id === soundArticleInfo.author.user_id._id" @click="handleDelComment(item)">删除</div>
                            <div class="reply" @click="handleReplay(item)"></div>
                            <div class="like-box" @click="handleCommentLikes(item)">
                                <div class="like" :class="{active: likes_active[`${item._id}`]}"></div>
                                <div class="num-box">
                                    <div class="num">{{item.likes_count}}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="noComment" v-if="soundArticleInfo.comment ? !soundArticleInfo.comment.length : true">还没有评论哦～</div>
            </div>
        </div>
        <div class="input-comment">
            <input type="text" v-focus="focused" @focus="commentFocus" @blur="commentBlur" v-model="commentTxt" :placeholder="placeholder" ref="commentInput">
            <div class="submit" @click="submitComment">{{commentBtnTxt}}</div>
        </div>
    </div>
</template>

<script>
    import { mapState, mapActions, mapGetters, mapMutations } from 'vuex'
    import types from '../../store/types'
    import mixin from '../../mixins';
    export default {
        name: "sound",
        data(){
            return {
                soundArticleInfo: {},
                collectActive: false,
                likesActive: false,
                commentTxt: '',
                placeholder: '写评论',
                commentBtnTxt: '发布',
                focused: false,
                likes_active: {},
                reply_to_id: '',
                soundPlay: false,
                soundFirst: true,
                isFollowed: false
            }
        },
        mixins: [mixin],
        components: {
        },
        created(){
            this.showLoading('isData')
            this.$axios.getSoundArticleById(this.$route.params.id).then(res => {
                this.soundArticleInfo = res.data.data
                console.log('this.soundArticleInfo',this.soundArticleInfo)
                this.collectActive = this.isCollected(this.soundArticleInfo)
                this.likesActive = this.isLiked(this.soundArticleInfo)
                this.hideLoading('isData')
                this.$axios.getFriendShipById({from_user: this.user_info._id, to_user: this.soundArticleInfo.author.user_id._id}).then(res => {
                    this.isFollowed = res.data.data.isFollowed
                })
            }).catch(() => {
                this.hideLoading('isData')
            })
        },
        mounted(){
        },
        watch: {
            $route (to, from) {
                if (to.name === 'SoundArticle'){
                    this.showLoading('isData')
                    this.$axios.getSoundArticleById(this.$route.params.id).then(res => {
                        this.soundArticleInfo = res.data.data
                        console.log('this.soundArticleInfo',this.soundArticleInfo)
                        this.collectActive = this.isCollected(this.soundArticleInfo)
                        this.likesActive = this.isLiked(this.soundArticleInfo)
                        this.hideLoading('isData')
                        this.$axios.getFriendShipById({from_user: this.user_info._id, to_user: this.soundArticleInfo.author.user_id._id}).then(res => {
                            this.isFollowed = res.data.data.isFollowed
                        })
                    }).catch(() => {
                        this.hideLoading('isData')
                    })
                }
            }
        },
        computed: {
            ...mapGetters([
                'user_info',
            ]),
        },
        methods: {
            ...mapActions({
                getTopSoundArticle: types.GET_TOPREADINGARTICLE,
            }),
            goBack(){
                this.soundFirst = true
                this.getTopSoundArticle().then(res => {
                    this.setTransitionName('move-left-to-right')
                    this.$router.go(-1)
                }).catch(error => console.log('error', error));
            },
            handleCollect(item){
                const isCollected = this.isCollected(item)
                this.$axios.changeSoundArticleCollectById({_id: item._id, user_id: this.user_info._id, to_collect: isCollected ? false : true}).then(res => {
                    this.$axios.getSoundArticleById(this.$route.params.id).then(res => {
                        this.soundArticleInfo = res.data.data
                        this.collectActive = isCollected ? false : true
                        this.hideLoading('isData')
                    }).catch(() => {
                        this.hideLoading('isData')
                    })
                })
            },
            handleLike(item){
                const isLiked = this.isLiked(item)
                this.$axios.changeSoundArticleLikesById({_id: item._id, user_id: this.user_info._id, to_like: isLiked ? false : true}).then(res => {
                    this.$axios.getSoundArticleById(this.$route.params.id).then(res => {
                        this.soundArticleInfo = res.data.data
                        this.likesActive = isLiked ? false : true
                        this.hideLoading('isData')
                    }).catch(() => {
                        this.hideLoading('isData')
                    })
                })
            },
            submitComment(){
                if (this.commentTxt === ''){
                    this.$toast('评论不能为空')
                }
                else {
                    this.showLoading('isData')
                    if (!!this.reply_to_id){
                        console.log('this.reply_to_id',this.reply_to_id)
                        this.$axios.addSoundComment({
                            article_id: this.soundArticleInfo._id,
                            user_id: this.user_info._id,
                            content: this.commentTxt,
                            reply_to_id: this.reply_to_id,
                        }).then(res => {
                            this.$axios.getSoundArticleById(this.$route.params.id).then(res => {
                                this.soundArticleInfo = res.data.data
                                this.hideLoading('isData')
                                this.focused = false
                                this.commentTxt = ''
                            }).catch(() => {
                                this.hideLoading('isData')
                                this.focused = false
                            })
                        })
                    }
                    else {
                        this.$axios.addSoundComment({
                            article_id: this.soundArticleInfo._id,
                            user_id: this.user_info._id,
                            content: this.commentTxt,
                        }).then(res => {
                            this.$axios.getSoundArticleById(this.$route.params.id).then(res => {
                                this.soundArticleInfo = res.data.data
                                this.hideLoading('isData')
                                this.focused = false
                                this.commentTxt = ''
                            }).catch(() => {
                                this.hideLoading('isData')
                                this.focused = false
                            })
                        })
                    }
                }

            },
            handleReplay(item){
                this.reply_to_id = item._id
                this.focused = true
                this.placeholder = `回复：${item.user_id.username}`
                this.commentBtnTxt = '回复'
            },
            commentFocus(){
                this.focused = true
            },
            commentBlur(){
                this.focused = false
                this.placeholder = '写评论'
                this.commentBtnTxt = '发布'
            },
            handleDelComment(item){
                this.showLoading('isData')
                this.$axios.deleteSoundCommentById(item._id).then(res => {
                    this.$axios.getSoundArticleById(this.$route.params.id).then(res => {
                        this.soundArticleInfo = res.data.data
                        this.commentTxt = ''
                        this.hideLoading('isData')
                    }).catch(() => {
                        this.commentTxt = ''
                        this.hideLoading('isData')
                    })
                })
            },
            handleCommentLikes(item){
                this.likes_active[`${item._id}`] = !this.likes_active[`${item._id}`]
                this.$axios.changeSoundCommentLikesById({_id: item._id, to_like: this.likes_active[`${item._id}`]}).then(res => {
                    console.log('res',res)
                    this.$axios.getSoundArticleById(this.$route.params.id).then(res => {
                        this.soundArticleInfo = res.data.data
                        this.hideLoading('isData')
                    }).catch(() => {
                        this.hideLoading('isData')
                    })
                })
            },
            switchSound(){
                if (this.soundFirst){
                    this.setAudioSrc(this.soundArticleInfo.sound_url)
                    this.soundFirst = false
                }
                this.soundPlay = !this.soundPlay
                if (this.soundPlay){
                    this.playAudio()
                }
                else {
                    this.pauseAudio()
                }
            },
            handleFollow(user){
                this.$axios.changeFriendShipById({from_user: this.user_info._id, to_user: user._id, to_follow: !this.isFollowed}).then(res => {
                    this.isFollowed = res.data.data.isFollowed
                })
            },
            toUser(user){
                this.setTransitionName('move-right-to-left')
                this.$router.push({
                    path: '/user',
                    query: user.role ? {
                        author_id: user._id
                    } : {
                        user_id: user.user_id._id
                    }
                });
            }
        }
    }
</script>

<style lang="scss" scoped>
    .sound .moment-img{
        width: 100%;
    }
    .sound{
        width: 100%;
        background-color: #fff;
        overflow-x: hidden;
        position: absolute;
        left: 0;
        top: 0;
        .article-header{
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
                justify-content: space-between;
                align-items: center;
                padding: 0 28px;
                .back{
                    width: 18px;
                    height: 35px;
                    background: url("../../assets/images/back.png") no-repeat;
                    background-size: 100% auto;
                }
                .operate{
                    display: flex;
                    .collect{
                        width: 34px;
                        height: 34px;
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
                }
            }
        }
        .container{
            padding: 108px 28px 0;
            .title{
                text-align: left;
                color: #141414;
                font-size: 40px;
                font-weight: bold;
            }
            .author{
                text-align: left;
                color: #666666;
                font-size: 28px;
                font-weight: 400;
                padding: 10px 0;
            }
            .cover{
                width: 700px;
                height: 390px;
                border-radius: 15px;
                overflow: hidden;
                position: relative;
                img{
                    width: 100%;
                }
                .icon{
                    position: absolute;
                    left: 0;
                    top: 0;
                    right: 0;
                    bottom: 0;
                    margin: auto;
                    width: 100px;
                    height: 100px;
                    background: url("../../assets/images/play-big-icon.png") no-repeat;
                    background-size: 100% auto;
                    &.pause{
                        background: url("../../assets/images/pause-big-icon.png") no-repeat;
                        background-size: 100% auto;
                    }
                }
            }
            .content{
                width: 694px;
                text-align: left;
                color: #666;
                font-size: 32px;
                font-weight: 400;
                letter-spacing: 2px;
                padding-bottom: 80px;
                padding-top: 30px;
                p{
                    img{
                        width: 100%;
                    }
                }
                img{
                    width: 100%;
                }
                .moment-img{
                    width: 100%;
                }
            }
            .author-info{
                .sub{
                    text-align: left;
                    text-indent: 10px;
                    font-size: 35px;
                    color: #000;
                    border-left: 10px solid #666;
                    margin-bottom: 40px;
                }
                .box{
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    .main{
                        display: flex;
                        align-items: center;
                        .avatar{
                            width: 70px;
                            height: 70px;
                            background-color: rgba(0,0,0,0.2);
                            border-radius: 50%;
                            margin-right: 20px;
                        }
                        .info{
                            .name{
                                font-size: 30px;
                                font-weight: 400;
                                color: #141414;
                                text-align: left;
                            }
                            .description{
                                text-align: left;
                                color: #666666;
                                font-size: 25px;
                            }
                        }
                    }
                    .follow{
                        width: 80px;
                        height: 40px;
                        line-height: 40px;
                        text-align: center;
                        font-size: 20px;
                        color: #666666;
                        padding: 5px;
                        border: 1px solid rgb(102,102,102); /* no */
                        border-radius: 5px;
                        transition: all 1s;
                        &.active{
                            border: none;
                            background-color: rgb(153, 157, 252);
                            color: #fff;
                        }
                    }
                }
            }
            .comment{
                margin-top: 80px;
                margin-bottom: 128px;
                .sub{
                    text-align: left;
                    text-indent: 10px;
                    font-size: 35px;
                    color: #000;
                    border-left: 10px solid #666;
                    margin-bottom: 40px;
                }
                .main{
                    width: 694px;
                    display: flex;
                    align-items: center;
                    border-bottom: 1px solid #999; /* no */
                    &:last-child{
                        border-bottom: none;
                        margin-bottom: 30px;
                    }
                    .info{
                        width: 100%;
                        .top{
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            padding: 20px 0;
                            .left{
                                display: flex;
                                align-items: center;
                                .avatar{
                                    width: 60px;
                                    height: 60px;
                                    border-radius: 50%;
                                    background-color: rgba(0,0,0,0.2);
                                    margin-right: 14px;
                                }
                                .name{
                                    font-size: 28px;
                                    color: #666666;
                                }
                            }
                            .right{
                                font-size: 28px;
                                color: #666666;
                            }
                        }
                        .reply-box{
                            width: 606px;
                            margin-left: 44px;
                            border: 1px solid #666; /* no */
                            padding: 10px;
                            font-size: 30px;
                            color: #666;
                            text-align: left;
                            word-break:break-all;
                            word-wrap: break-word;
                            span{
                                font-weight: bold;
                            }
                        }
                        .txt{
                            padding-left: 44px;
                            padding-top: 20px;
                            font-size: 32px;
                            color: #666;
                            text-align: left;
                            word-break:break-all;
                            word-wrap: break-word;
                        }
                        .bottom{
                            padding: 20px 0;
                            display: flex;
                            justify-content: flex-end;
                            align-items: center;
                            .delComment{
                                font-size: 20px;
                                margin-right: 20px;
                                text-decoration: underline;
                                color: #8179e2;
                            }
                            .reply{
                                width: 55px;
                                height: 55px;
                                background: url("../../assets/images/reply.png") no-repeat;
                                background-size: 100% auto;
                                margin-right: 20px;
                            }
                            .like-box{
                                display: flex;
                                .like{
                                    width: 30px;
                                    height: 30px;
                                    background: url("../../assets/images/like.png") no-repeat;
                                    background-size: 100% auto;
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
                                    }
                                }
                            }
                        }
                    }
                }
                .noComment{
                    font-size: 25px;
                    color: #666;
                }
            }
        }
        .input-comment{
            width: 100%;
            height: 100px;
            background-color: rgb(240,240,240);
            position: fixed;
            left: 0;
            bottom: 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-left: 28px;
            input{
                background:none;
                outline:none;
                -webkit-appearance: none;
                border-radius: 0;
                width: 600px;
                height: 60px;
                border: 0;
                background-color: rgb(246,246,246);
                box-sizing: border-box;
                padding: 0px 20px;
            }
            .submit{
                font-size: 28px;
                color: #666666;
                margin-right: 56px;
            }
        }
    }
</style>
