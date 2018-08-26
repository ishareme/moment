<template>
    <div class="user">
        <list-header :title="user_info.user_id ? user_info.user_id.username : user_info.username"></list-header>
        <div v-if="!!user_info.user_id" class="container">
            <div class="top" :style="{background: `url(${user_info.user_id.bg_url}) no-repeat center`, backgroundSize: '100% auto'}">
                <div class="main">
                    <div class="first">
                        <div class="following" @click="toUserList({item: user_info.user_id.following_user, type: 'following'})">
                            <p>TA的关注</p>
                            <p class="num">{{user_info.user_id ? user_info.user_id.following_user.length : 0}}</p>
                        </div>
                        <div class="avatar" :style="{background: `url(${user_info.user_id ? user_info.user_id.avatar : ''}) no-repeat center`, backgroundSize: '100% auto'}"></div>
                        <div class="follower" @click="toUserList({item: user_info.user_id.follower_user, type: 'follower'})">
                            <p>关注TA的</p>
                            <p class="num">{{user_info.user_id ? user_info.user_id.follower_user.length : 0}}</p>
                        </div>
                    </div>
                    <div class="second">
                        <p class="username">{{user_info.user_id.username}}</p>
                        <p class="description">{{user_info.user_id.description}}</p>
                    </div>
                    <div class="third">
                        <div class="follow" :class="{active: isFollowed}" @click="handleFollow(user_info.user_id)">{{isFollowed ? '已关注' : '关注'}}</div>
                    </div>
                </div>
            </div>
            <div class="collection">
                <div class="title">TA的收藏</div>
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
            <div class="banner" v-for="(item, index) in ReadingArticleList" v-bind:key="item ? item._id : ''" @click="toReadingArticle(item)">
                <div class="reading">
                    <div class="label">- 阅 读 -</div>
                    <div class="info">
                        <p class="title text-overflow">{{item.title}}</p>
                        <p class="author text-overflow">文 / {{item.author_name}}</p>
                        <div class="cover">
                            <img :src="item.cover_url" alt="">
                        </div>
                        <div class="abstract">{{item.abstract}}</div>
                        <div class="view-count">
                            <div class="icon"></div>
                            <div class="txt">
                                浏览量:&nbsp;{{item.views_count}}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="banner" v-for="(item, index) in ImageArticleList" v-bind:key="item ? item._id : ''">
                <div class="image">
                    <div class="cover" @click="showPreview(item)">
                        <img :src="item.image_url" alt="">
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
            <div class="banner" v-for="(item, index) in MusicArticleList" v-bind:key="item ? item._id : ''" @click="toMusicArticle(item)">
                <div class="music">
                    <div class="label">- 音 乐 -</div>
                    <div class="info">
                        <p class="title text-overflow">{{item.title}}</p>
                        <p class="author text-overflow">文 / {{item.author_name}}</p>
                        <div class="music-info">
                            <div class="image" :style="{background: `url(${item.music_info ? item.music_info.cover : item.cover_url }) no-repeat center`, backgroundSize: '100% auto'}">
                                <div class="play center"></div>
                            </div>
                            <div class="name text-overflow">
                                {{item.music_info ? item.music_info.name : ''}} / {{item.music_info ? item.music_info.singer : ''}}
                            </div>
                        </div>
                        <div class="abstract">{{item.abstract}}</div>
                        <div class="view-count">
                            <div class="icon"></div>
                            <div class="txt">
                                浏览量:&nbsp;{{item.views_count}}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="banner" v-for="(item, index) in FilmArticleList" v-bind:key="item ? item._id : ''" @click="toFilmArticle(item)">
                <div class="film">
                    <div class="label">- 影 视 -</div>
                    <div class="info">
                        <p class="title text-overflow">{{item.title}}</p>
                        <p class="author text-overflow">文 / {{item.author_name}}</p>
                        <div class="line"></div>
                        <div class="cover">
                            <img :src="item.cover_url" alt="">
                        </div>
                        <div class="line"></div>
                        <div class="quote">
                            <div class="word">{{item.film_info ? item.film_info.quote : ''}}</div>
                            <div class="name">—— 《{{item.film_info ? item.film_info.name : ''}}》</div>
                        </div>
                        <div class="view-count">
                            <div class="icon"></div>
                            <div class="txt">
                                浏览量:&nbsp;{{item.views_count}}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="banner" v-for="(item, index) in SoundArticleList" v-bind:key="item ? item._id : ''" @click="toSoundArticle(item)">
                <div class="sound" @click="">
                    <div class="label">- 电 台 -</div>
                    <div class="info">
                        <p class="title text-overflow">{{item.title}}</p>
                        <p class="author text-overflow">主播 / {{item.author_name}}</p>
                        <div class="cover">
                            <img :src="item.cover_url" alt="">
                            <div class="icon-cover">
                                <div class="icon center"></div>
                            </div>
                        </div>
                        <div class="view-count">
                            <div class="icon"></div>
                            <div class="txt">
                                浏览量:&nbsp;{{item.views_count}}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-else class="container">
            <div class="top" :style="{background: `url(${user_info.bg_url}) no-repeat center`, backgroundSize: '100% auto'}">
                <div class="main">
                    <div class="first">
                        <div class="following" @click="toUserList({item: user_info.following_user, type: 'following'})">
                            <p>TA的关注</p>
                            <p class="num">{{user_info.following_user ? user_info.following_user.length : 0}}</p>
                        </div>
                        <div class="avatar" :style="{background: `url(${user_info.avatar ? user_info.avatar : ''}) no-repeat center`, backgroundSize: '100% auto'}"></div>
                        <div class="follower" @click="toUserList({item: user_info.follower_user, type: 'follower'})">
                            <p>关注TA的</p>
                            <p class="num">{{user_info.follower_user ? user_info.follower_user.length : 0}}</p>
                        </div>
                    </div>
                    <div class="second">
                        <p class="username">{{user_info.username}}</p>
                        <p class="description">{{user_info.description}}</p>
                    </div>
                    <div class="third">
                        <div class="follow" :class="{active: isFollowed}" @click="handleFollow(user_info)">{{isFollowed ? '已关注' : '关注'}}</div>
                    </div>
                </div>
            </div>
            <div class="collection">
                <div class="title">TA的收藏</div>
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
                <div class="sub">Moment</div>
                <div class="noMoment" v-if="!ImageArticleList.length">
                    TA还没有Moment~
                </div>
                <div v-else class="banner" v-for="(item, index) in ImageArticleList" v-bind:key="item._id">
                    <div class="cover" @click="showPreview(item)">
                        <img :src="item.image_url" alt="">
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
    </div>
</template>

<script>
    import ListHeader from './common/ListHeader'
    import ImagePreview from './common/ImagePreview'
    import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
    import types from '../store/types'
    import mixin from '../mixins';
    export default {
        name: "user",
        components: {
            ListHeader,
            ImagePreview
        },
        data(){
            return {
                ImageArticleList: [],
                ReadingArticleList: [],
                FilmArticleList: [],
                MusicArticleList: [],
                SoundArticleList: [],
                user_info: {},
                isFollowed: false
            }
        },
        mixins: [mixin],
        created(){
            this.showLoading('isData')
            if (Object.keys(this.$route.query)[0] === 'author_id'){
                this.$axios.getAdminInfo(this.$route.query.author_id).then(res => {
                    this.user_info = res.data.data
                    console.log('this.user_info 1',this.user_info)
                    Promise.all(['ImageArticleList','ReadingArticleList', 'MusicArticleList', 'FilmArticleList', 'SoundArticleList'].map((item) => {
                        this.$axios[`get${item}ByUserId`](this.user_info.user_id._id).then(res => {
                            this[`${item}`] = res.data.data.docs
                            console.log(`${item}`, this[`${item}`])
                            this.hideLoading('isData')
                        })
                    })).catch(() =>{
                        this.hideLoading('isData')
                        this.$toast('出错了', 'bottom')
                    })
                    this.$axios.getFriendShipById({from_user: this.$store.getters.user_info._id, to_user: this.user_info.user_id._id}).then(res => {
                        this.isFollowed = res.data.data.isFollowed
                    })
                })
            }
            else {
                this.$axios.getUserInfo(this.$route.query.user_id).then(res => {
                    this.user_info = res.data.data
                    console.log('this.user_info 2',this.user_info)
                    this.$axios.getImageArticleListByUserId(this.user_info._id).then(res => {
                        this.ImageArticleList = res.data.data.docs
                        this.hideLoading('isData')
                    }).catch(() =>{
                        this.hideLoading('isData')
                        this.$toast('出错了', 'bottom')
                    })
                    this.$axios.getFriendShipById({from_user: this.$store.getters.user_info._id, to_user: this.user_info._id}).then(res => {
                        this.isFollowed = res.data.data.isFollowed
                    })
                })
            }
        },
        mounted(){
        },
        computed: {
        },
        watch: {
            $route (to, from) {
                console.log('to', to)
                console.log('from',from)
                if (to.name === 'User'){
                    this.showLoading('isData')
                    if (Object.keys(this.$route.query)[0] === 'author_id'){
                        this.$axios.getAdminInfo(this.$route.query.author_id).then(res => {
                            this.user_info = res.data.data
                            console.log('this.user_info',this.user_info)
                            Promise.all(['ImageArticleList','ReadingArticleList', 'MusicArticleList', 'FilmArticleList', 'SoundArticleList'].map((item) => {
                                this.$axios[`get${item}ByUserId`](this.user_info.user_id._id).then(res => {
                                    this[`${item}`] = res.data.data.docs
                                    this.hideLoading('isData')
                                })
                            })).catch(() =>{
                                this.hideLoading('isData')
                                this.$toast('出错了', 'bottom')
                            })
                            this.$axios.getFriendShipById({from_user: this.$store.getters.user_info._id, to_user: this.user_info.user_id._id}).then(res => {
                                this.isFollowed = res.data.data.isFollowed
                            })
                        })
                    }
                    else {
                        this.$axios.getUserInfo(this.$route.query.user_id).then(res => {
                            this.user_info = res.data.data
                            this.$axios.getImageArticleListByUserId(this.user_info._id).then(res => {
                                this.ImageArticleList = res.data.data.docs
                                this.hideLoading('isData')
                            }).catch(() =>{
                                this.hideLoading('isData')
                                this.$toast('出错了', 'bottom')
                            })
                            this.$axios.getFriendShipById({from_user: this.$store.getters.user_info._id, to_user: this.user_info._id}).then(res => {
                                this.isFollowed = res.data.data.isFollowed
                            })
                        })
                    }
                }
            }
        },
        methods: {
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
            toReadingArticle(item){
                this.setTransitionName('move-right-to-left')
                this.$router.push({
                    path: `/reading/${item._id}`
                });
            },
            toMusicArticle(item){
                this.setTransitionName('move-right-to-left')
                this.$router.push({
                    path: `/music/${item._id}`
                });
            },
            toFilmArticle(item){
                this.setTransitionName('move-right-to-left')
                this.$router.push({
                    path: `/film/${item._id}`
                });
            },
            toSoundArticle(item){
                this.setTransitionName('move-right-to-left')
                this.$router.push({
                    path: `/sound/${item._id}`
                });
            },
            handleFollow(user){
                this.$axios.changeFriendShipById({from_user: this.$store.getters.user_info._id, to_user: user._id, to_follow: !this.isFollowed}).then(res => {
                    this.isFollowed = res.data.data.isFollowed
                    this.$axios.getUserInfo(user._id).then(res => {
                        this.user_info = JSON.parse(JSON.stringify(res.data.data))
                    })
                })
            },
            toUserList(data){
                if (!data.item.length) return
                this.setTransitionName('move-right-to-left')
                this.$router.push({
                    name: 'UserList',
                    params: data
                });
            },
            handleCollect(item, index){
                // console.log('item', item)
                // const to_collect = this.isCollected(item)
                // console.log('!to_collect', to_collect)
                // this.$axios.changeImageArticleCollectById({_id: item._id, user_id: this.$store.getters.user_info._id, to_collect: !to_collect}).then(res => {
                //     console.log(res.data.data)
                //     this.ImageArticleList[index] = Object.assign(this.ImageArticleList[index], res.data.data)
                // })
            },
            handleLike(item, index){
                // const to_like = this.isLiked(item)
                // this.$axios.changeImageArticleLikesById({_id: item._id, user_id: this.$store.getters.user_info._id, to_like: !to_like}).then(res => {
                //     this.ImageArticleList[index] = Object.assign(this.ImageArticleList[index], res.data.data)
                // })
            },
            toImageCollect(){
                this.setTransitionName('move-right-to-left')
                this.$router.push({
                    name: 'ImageList',
                    params: this.user_info.role ? this.user_info.user_id.collection_image_article : this.user_info.collection_image_article
                });
            },
            toReadingCollect(){
                this.setTransitionName('move-right-to-left')
                this.$router.push({
                    name: 'ReadingCollect',
                    params: this.user_info.role ? this.user_info.user_id.collection_reading_article : this.user_info.collection_reading_article
                });
            },
            toMusicCollect(){
                this.setTransitionName('move-right-to-left')
                this.$router.push({
                    name: 'MusicCollect',
                    params: this.user_info.role ? this.user_info.user_id.collection_music_article : this.user_info.collection_music_article
                });
            },
            toFilmCollect(){
                this.setTransitionName('move-right-to-left')
                this.$router.push({
                    name: 'FilmCollect',
                    params: this.user_info.role ? this.user_info.user_id.collection_film_article : this.user_info.collection_film_article
                });
            },
            toSoundCollect(){
                this.setTransitionName('move-right-to-left')
                this.$router.push({
                    name: 'SoundCollect',
                    params: this.user_info.role ? this.user_info.user_id.collection_sound_article : this.user_info.collection_sound_article
                });
            }
        }
    }
</script>

<style lang="scss" scoped>
    .user{
        width: 100%;
        overflow-x: hidden;
        position: absolute;
        left: 0;
        top: 0;
        overflow-y: scroll;
        .container{
            padding-top: 98px;
            .top{
                width: 100%;
                height: 460px;
                background: url("../assets/images/info-bg.jpg") no-repeat;
                background-size: 100% auto;
                position: relative;
                display: flex;
                justify-content: center;
                align-items: center;
                .main{
                    .first{
                        display: flex;
                        align-items: center;
                        .following{
                            color: rgba(0,0,0,0.5);
                            font-size: 26px;
                            font-weight: 400;
                            margin-right: 30px;
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
                        }
                        .follower{
                            color: rgba(0,0,0,0.5);
                            font-size: 26px;
                            font-weight: 400;
                            margin-left: 30px;
                            .num{
                                color: rgba(0,0,0,0.7);
                                font-size: 26px;
                                font-weight: bold;
                            }
                        }
                    }
                    .second{
                        margin-top: 20px;
                        .username{
                            font-size: 26px;
                            font-weight: bold;
                            color: #141414;
                        }
                        .description{
                            margin-top: 10px;
                            text-align: center;
                            font-size: 24px;
                            color: #141414;
                        }
                    }
                    .third{
                        display: block;
                        .follow{
                            display: block;
                            width: 90px;
                            height: 50px;
                            line-height: 50px;
                            margin: 20px auto;
                            text-align: center;
                            font-size: 20px;
                            color: #666666;
                            border: 1px solid rgb(102,102,102); /* no */
                            border-radius: 5px;
                            transition: all 1s;
                            box-sizing: border-box;
                            &.active{
                                display: block;
                                border: none;
                                background-color: rgb(153, 157, 252);
                                color: #fff;
                            }
                        }
                    }
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
                            .view-count{
                                font-size: 20px;
                                color: #666;
                                display: flex;
                                align-items: center;
                                justify-content: flex-end;
                                .icon{
                                    width: 32px;
                                    height: 32px;
                                    display: inline-block;
                                    background: url("../assets/images/view-count.png") no-repeat;
                                    background-size: 100% auto;
                                    margin-right: 10px;
                                }
                            }
                        }
                    }
                }
            }
            .banner{
                width: 100%;
                margin-bottom: 30px;
                .reading, .film, .music, .sound{
                    width: 100%;
                    box-sizing: border-box;
                    padding: 25px;
                    background-color: #fff;
                    .label{
                        width: 100%;
                        height: 35px;
                        line-height: 35px;
                        color: rgba(0,0,0,0.5);
                        font-size: 25px;
                    }
                    .info{
                        width: 660px;
                        text-align: left;
                        .title{
                            width: 100%;
                            padding: 20px 0 10px 0;
                            font-size: 32px;
                            color: #141414;
                            text-shadow: 0 0 rgba(255,255,255, 0.4);
                        }
                        .author{
                            padding-bottom: 10px;
                            font-size: 22px;
                            color: #141414;
                            font-weight: 300;
                        }
                        .cover{
                            width: 700px;
                            height: 390px;
                            position: relative;
                            overflow: hidden;
                            overflow: hidden;
                            img{
                                width: 100%;
                            }
                            .icon-cover{
                                position: absolute;
                                left: 0;
                                top: 0;
                                width: 100%;
                                height: 100%;
                                background-color: rgba(0,0,0,0.3);
                                .icon{
                                    width: 350px;
                                    height: 64px;
                                    background: url("../assets/images/sound-icon.png") no-repeat;
                                    background-size: 100% auto;
                                }
                            }

                        }
                        .music-info{
                            width: 700px;
                            height: 390px;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            position: relative;
                            .image{
                                width: 300px;
                                height: 300px;
                                border-radius: 50%;
                                position: relative;
                                .play{
                                    width: 50px;
                                    height: 50px;
                                    background: url("../assets/images/play-icon.png") no-repeat;
                                    background-size: 100% auto;
                                    z-index: 9;
                                    &.pause{
                                        background: url("../assets/images/pause-icon.png") no-repeat;
                                        background-size: 100% auto;
                                    }
                                }
                            }
                            .name{
                                width: 100%;
                                position: absolute;
                                bottom: 0;
                                right: 0;
                                font-size: 25px;
                                color: #666;
                                padding-right: 10px;
                                box-sizing: border-box;
                                text-align: right;
                            }
                        }
                        .line{
                            width: 698px;
                            height: 28px;
                            margin: 5px auto;
                            background: url("../assets/images/film-icon.png") no-repeat;
                            background-size: 100% auto;
                        }
                        .quote{
                            margin-top: 10px;
                            width: 700px;
                            font-size: 28px;
                            color: #666;
                            .name{
                                margin-top: 5px;
                                text-align: right;
                            }
                        }
                        .abstract{
                            margin-top: 10px;
                            width: 100%;
                            font-size: 28px;
                            color: #666;
                            word-break:break-all;
                            word-wrap: break-word;
                        }
                        .view-count{
                            font-size: 20px;
                            color: #666;
                            display: flex;
                            align-items: center;
                            justify-content: flex-end;
                            .icon{
                                width: 32px;
                                height: 32px;
                                display: inline-block;
                                background: url("../assets/images/view-count.png") no-repeat;
                                background-size: 100% auto;
                                margin-right: 10px;
                            }
                        }
                    }

                }
                .film, .music, .sound{
                    margin-top: 20px;
                }
                .sound{
                    margin-bottom: 10px;
                }
                .image{
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
