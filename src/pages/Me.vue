<template>
    <div class="Page me">
        <div v-if="user_info.token" class="container">
            <div class="top" :style="{background: `url(${user_info.bg_url}) no-repeat center`, backgroundSize: '100% auto'}">
                <div class="config" @click="toProfile"></div>
                <div class="message"></div>
                <div class="main">
                    <div class="following" @click="toUserList({item: user_info.following_user, type: 'myFollowing'})">
                        <p>我的关注</p>
                        <p class="num">{{user_info.following_user ? user_info.following_user.length : 0}}</p>
                    </div>
                    <div class="avatar centerX" :style="{background: `url(${user_info.avatar}) no-repeat center`, backgroundSize: '100% auto'}"></div>
                    <div class="follower" @click="toUserList({item: user_info.follower_user, type: 'follower'})">
                        <p>关注我的</p>
                        <p class="num">{{user_info.follower_user ? user_info.follower_user.length : 0}}</p>
                    </div>
                    <p class="username">{{user_info.username}}</p>
                    <p class="description">{{user_info.description}}</p>
                </div>
            </div>
            <div class="collection">
                <div class="title">我的收藏</div>
                <div class="icons">
                    <ul>
                        <li class="image" @click="toImageCollect"></li>
                        <li class="reading" @click="toReadingCollect"></li>
                        <li class="music" @click="toMusicCollect"></li>
                        <li class="film" @click="toFilmCollect"></li>
                        <li class="sound" @click="toSoundCollect"></li>
                    </ul>
                </div>
            </div>
            <div class="my-moment">
                <div class="sub">My Moment</div>
                <div class="noMoment" v-if="!imageArticleList.length">
                    你还没有Moment，赶快去创建吧~
                </div>
                <div v-else class="banner" v-for="(item, index) in imageArticleList" v-bind:key="item._id">
                    <div class="cover" @click="showPreview(item)">
                        <img :src="item.image_url" alt="">
                    </div>
                    <div class="info">
                        <p class="txt">{{item.content}}</p>
                        <p class="author">{{item.author.username}}</p>
                        <div class="bottom">
                            <div class="time">{{moment(item.create_time)}}</div>
                            <div class="operate">
                                <div class="share"></div>
                                <div class="like-box">
                                    <div class="like" :class="{active: !!item.likes_count}"></div>
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
        <div v-else class="no-login">
            <div class="main">
                <div class="logo"></div>
                <div class="btn" @click="toLogin">登录</div>
            </div>
        </div>
        <m-footer></m-footer>

        <div class="add" v-if="user_info.token" @click="toMake">
            <div class="icon"></div>
        </div>
    </div>
</template>

<script>
    import MFooter from './common/MFooter';
    import ImagePreview from './common/ImagePreview'
    import { mapState, mapGetters, mapMutations } from 'vuex'
    import types from '../store/types'
    import mixin from '../mixins';
    export default {
        name: "me",
        components: {
            MFooter,
            ImagePreview
        },
        sockets:{
            receive_message: function(val){
                console.log(val)
                console.log('this method was fired by the socket server. eg: io.emit("customEmit", data)')
            }
        },
        data(){
            return {
                imageArticleList: [],
            }
        },
        mixins: [mixin],
        created(){
            // this.showLoading('isData')
            this.$axios.getImageArticleListByUserId(this.user_info._id).then(res => {
                this.imageArticleList = res.data.data.docs
                this.preload(this.imageArticleList.map(item => {
                    return item.image_url
                })).done(() => {
                    this.hideLoading('isData')
                })
            }).catch((error) => {
                this.hideLoading('isData')
            })

            console.log('this.user_info',this.user_info)
        },
        computed: {
            ...mapGetters([
                'user_info',
            ]),
        },
        methods: {
            toLogin(){
                this.setTransitionName('move-right-to-left')
                this.$router.push({
                    path: '/login'
                });
            },
            toProfile(){
                this.setTransitionName('move-right-to-left')
                this.$router.push({
                    path: '/profile'
                });
            },
            toMake(){
                this.setTransitionName('move-right-to-left')
                this.$router.push({
                    path: '/make'
                });
            },
            openPreview(item){
                this.previewInfo = {
                    show: true,
                    src: item.image_url,
                    author_name: item.author.username,
                    previewTranName: 'rotate-carousel-top'
                }
            },
            handlePreviewClosed(){
                this.previewInfo = {
                    show: false,
                    src: '',
                    author_name: '',
                    previewTranName: 'move-right-to-left'
                }
            },
            toUserList(data){
                if (!data.item.length) return
                this.setTransitionName('move-right-to-left')
                this.$router.push({
                    name: 'UserList',
                    params: data
                });
            },
            toImageCollect(){
                this.setTransitionName('move-right-to-left')
                this.$router.push({
                    name: 'ImageList',
                    params: this.user_info.collection_image_article
                });
            },
            toReadingCollect(){
                this.setTransitionName('move-right-to-left')
                this.$router.push({
                    name: 'ReadingCollect',
                    params: this.user_info.collection_reading_article
                });
            },
            toMusicCollect(){
                this.setTransitionName('move-right-to-left')
                this.$router.push({
                    name: 'MusicCollect',
                    params: this.user_info.collection_music_article
                });
            },
            toFilmCollect(){
                this.setTransitionName('move-right-to-left')
                this.$router.push({
                    name: 'FilmCollect',
                    params: this.user_info.collection_film_article
                });
            },
            toSoundCollect(){
                this.setTransitionName('move-right-to-left')
                this.$router.push({
                    name: 'SoundCollect',
                    params: this.user_info.collection_sound_article
                });
            }
        }
    }
</script>

<style lang="scss" scoped>
    .me{
        max-width: 750px;
        height: 100vh;
        .container{
            padding-bottom: 98px;
            .top{
                width: 100%;
                height: 460px;
                background: url("../assets/images/info-bg.jpg") no-repeat;
                background-size: 100% auto;
                position: relative;
                .config{
                    position: absolute;
                    left: 28px;
                    top: 25px;
                    width: 40px;
                    height: 40px;
                    background: url("../assets/images/config.png") no-repeat;
                    background-size: 100% auto;
                }
                .message{
                    position: absolute;
                    right: 28px;
                    top: 25px;
                    width: 45px;
                    height: 45px;
                    background: url("../assets/images/tip-icon.png") no-repeat;
                    background-size: 100% auto;
                }
                .following{
                    width: 200px;
                    height: 80px;
                    position: absolute;
                    left: 80px;
                    top: 100px;
                    color: rgba(0,0,0,0.5);
                    font-size: 26px;
                    font-weight: 400;
                    .num{
                        color: rgba(0,0,0,0.7);
                        font-size: 26px;
                        font-weight: bold;
                    }
                }
                .avatar{
                    width: 150px;
                    height: 150px;
                    border: 5px solid #fff;
                    border-radius: 50%;
                    background-size: 100% auto;
                    top: 60px;
                }
                .follower{
                    width: 200px;
                    height: 80px;
                    position: absolute;
                    right: 80px;
                    top: 100px;
                    color: rgba(0,0,0,0.5);
                    font-size: 26px;
                    font-weight: 400;
                    .num{
                        color: rgba(0,0,0,0.7);
                        font-size: 26px;
                        font-weight: bold;
                    }
                }
                .username{
                    width: 100%;
                    text-align: center;
                    font-size: 26px;
                    font-weight: bold;
                    color: #141414;
                    position: absolute;
                    top: 230px;
                }
                .description{
                    width: 100%;
                    text-align: center;
                    font-size: 24px;
                    color: #141414;
                    position: absolute;
                    top: 280px;
                }
            }
            .collection{
                width: 100%;
                height: 177px;
                background-color: #fff;
                padding: 15px 28px;
                .title{
                    text-align: left;
                    font-size: 18px;
                    color: #141414;
                }
                .icons{
                    ul{
                        width: 694px;
                        height: 145px;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        .image{
                            width: 63px;
                            height: 85px;
                            background: url("../assets/images/collect-image.png") no-repeat;
                            background-size: 100% auto;
                            margin-right: 60px;
                        }
                        .reading{
                            width: 84px;
                            height: 85px;
                            background: url("../assets/images/collect-reading.png") no-repeat;
                            background-size: 100% auto;
                            margin-right: 60px;
                        }
                        .film{
                            width: 57px;
                            height: 85px;
                            background: url("../assets/images/collect-film.png") no-repeat;
                            background-size: 100% auto;
                            margin-right: 60px;
                        }
                        .music{
                            width: 58px;
                            height: 85px;
                            background: url("../assets/images/collect-music.png") no-repeat;
                            background-size: 100% auto;
                            margin-right: 60px;
                        }
                        .sound{
                            width: 62px;
                            height: 85px;
                            background: url("../assets/images/collect-sound.png") no-repeat;
                            background-size: 100% auto;
                        }
                    }
                }
            }
            .make{
                margin-top: 30px;
                width: 100%;
                height: 63px;
                padding: 0 28px;
                background-color: #fff;
                display: flex;
                align-items: center;
                color: #141414;
                font-size: 24px;
                .icon{
                    width: 26px;
                    height: 25px;
                    margin-right: 33px;
                    background: url("../assets/images/make-icon.png") no-repeat;
                    background-size: 100% auto;
                }
            }
            .my-moment{
                margin-top: 10px;
                .noMoment{
                    width: 100%;
                    height: 150px;
                    line-height: 150px;
                    font-size: 25px;
                    color: #666;
                }
                .sub{
                    padding: 30px 0;
                    font-size: 30px;
                    color: #141414;
                    background-color: #fff;
                    margin-bottom: 5px;
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
                        height: 370px;
                        overflow: hidden;
                        img{
                            width: 100%;
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
                            text-align: left;
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
                                    height: 31px;
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
                                            font-size: 10px;
                                            color: #141414;
                                            transform: scale(0.7);
                                        }
                                    }
                                }

                            }
                        }
                    }
                }
            }
        }
        .no-login{
            width: 100%;
            height: 100vh;
            background-color: #fff;
            display: flex;
            justify-content: center;
            align-items: center;
            .main{
                display: flex;
                align-items: center;
                justify-content: center;
                flex-direction: column;
                .logo{
                    width: 191px;
                    height: 40px;
                    background: url("../assets/images/logo.png") no-repeat;
                    background-size: 100% auto;
                }
                .btn{
                    width: 150px;
                    height: 50px;
                    line-height: 50px;
                    text-align: center;
                    font-size: 26px;
                    margin-top: 50px;
                    border-radius: 40px;
                    border: 1px solid #666; /* no */
                    box-shadow: 0 0 5px 0 #666;
                }
                .tip{
                    font-size: 16px;
                    color: #999;
                    font-weight: 400;
                    margin-top: 50px;
                }
            }

        }
        .add{
            width: 80px;
            height: 80px;
            border-radius: 50%;
            background-color: #fff;
            box-shadow: 0 0 10px 0 #666;
            display: flex;
            justify-content: center;
            align-items: center;
            position: fixed;
            bottom: 200px;
            right: 60px;
            z-index: 99;
            .icon{
                width: 50px;
                height: 50px;
                background: url("../assets/images/add.png") no-repeat;
                background-size: 100% auto;
            }
        }
    }
</style>
