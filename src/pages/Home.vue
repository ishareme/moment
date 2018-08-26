<template>
    <div class="Page home">
        <m-header></m-header>
        <div class="container">
            <swiper class="swiper-box" ref="swiper" v-if="list.length>0">
                <swiper-item v-for="(item,index) in list" :key=index>
                    <img :src="item.img" />
                </swiper-item>
            </swiper>
            <div class="classify">
                <ul>
                    <li class="reading" @click="toReadingList">
                        <span>阅读</span>
                    </li>
                    <li class="film" @click="toFilmList">
                        <span>影视</span>
                    </li>
                    <li class="music" @click="toMusicList">
                        <span>音乐</span>
                    </li>
                    <li class="sound" @click="toSoundList">
                        <span>电台</span>
                    </li>
                </ul>
            </div>
            <div class="banner">
                <div class="reading" @click="toReading">
                    <div class="label">- 阅 读 -</div>
                    <div class="info">
                        <p class="title text-overflow">{{topReadingInfo.title}}</p>
                        <p class="author text-overflow">文 / {{topReadingInfo.author_name}}</p>
                        <div class="cover">
                            <img :src="topReadingInfo.cover_url" alt="">
                        </div>
                        <div class="abstract">{{topReadingInfo.abstract}}</div>
                        <div class="view-count">
                            <div class="icon"></div>
                            <div class="txt">
                                浏览量:&nbsp;{{topReadingInfo.views_count}}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="film" @click="toFilm">
                    <div class="label">- 影 视 -</div>
                    <div class="info">
                        <p class="title text-overflow">{{topFilmInfo.title}}</p>
                        <p class="author text-overflow">文 / {{topFilmInfo.author_name}}</p>
                        <div class="line"></div>
                        <div class="cover">
                            <img :src="topFilmInfo.cover_url" alt="">
                        </div>
                        <div class="line"></div>
                        <div class="quote">
                            <div class="word">{{topFilmInfo.film_info ? topFilmInfo.film_info.quote : ''}}</div>
                            <div class="name">—— 《{{topFilmInfo.film_info ? topFilmInfo.film_info.name : ''}}》</div>
                        </div>
                        <div class="view-count">
                            <div class="icon"></div>
                            <div class="txt">
                                浏览量:&nbsp;{{topFilmInfo.views_count}}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="music" @click="toMusic">
                    <div class="label">- 音 乐 -</div>
                    <div class="info">
                        <p class="title text-overflow">{{topMusicInfo.title}}</p>
                        <p class="author text-overflow">文 / {{topMusicInfo.author_name}}</p>
                        <div class="music-info">
                            <div class="image" :style="{background: `url(${topMusicInfo.music_info ? topMusicInfo.music_info.cover : topMusicInfo.cover_url }) no-repeat center`, backgroundSize: '100% auto'}">
                                <div class="play center" :class="{pause: musicPlay}" @click="switchMusic"></div>
                            </div>
                            <div class="name text-overflow">
                                {{topMusicInfo.music_info ? topMusicInfo.music_info.name : ''}} / {{topMusicInfo.music_info ? topMusicInfo.music_info.singer : ''}}
                            </div>
                        </div>
                        <div class="abstract">{{topMusicInfo.abstract}}</div>
                        <div class="view-count">
                            <div class="icon"></div>
                            <div class="txt">
                                浏览量:&nbsp;{{topMusicInfo.views_count}}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="sound" @click="toSound">
                    <div class="label">- 电 台 -</div>
                    <div class="info">
                        <p class="title text-overflow">{{topSoundInfo.title}}</p>
                        <p class="author text-overflow">主播 / {{topSoundInfo.author_name}}</p>
                        <div class="cover">
                            <img :src="topSoundInfo.cover_url" alt="">
                            <div class="icon-cover">
                                <div class="icon center"></div>
                            </div>
                        </div>
                        <div class="view-count">
                            <div class="icon"></div>
                            <div class="txt">
                                浏览量:&nbsp;{{topSoundInfo.views_count}}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <m-footer></m-footer>
    </div>
</template>

<script>
    import { mapState, mapActions, mapGetters, mapMutations } from 'vuex'
    import types from '../store/types'
    import mixin from '../mixins';
    import MHeader from './common/MHeader';
    import MFooter from './common/MFooter';
    import { Swiper, SwiperItem } from '../components/Swiper'
    export default {
        name: 'home',
        components: {
            MHeader,
            MFooter,
            Swiper,
            SwiperItem
        },
        data() {
            return {
                list: [
                    { img: 'http://p89inamdb.bkt.clouddn.com/w.jpg' },
                    { img: 'http://p89inamdb.bkt.clouddn.com/www.jpg' },
                    { img: 'http://p89inamdb.bkt.clouddn.com/ww.jpg' }
                ],
                musicPlay: false,
                musicFirst: true,
                soundPlay: false,
                soundFirst: true,
            }
        },
        mixins: [mixin],
        created(){
            this.showLoading('isData')
            Promise.all(['ReadingArticle','FilmArticle','MusicArticle', 'SoundArticle'].map((item) => {
                return this[`getTop${item}`]()
            })).then(res => {
                this.preload([`${this.topReadingInfo.cover_url}`,`${this.topFilmInfo.cover_url}`,`${this.topMusicInfo.cover_url}`, `${this.topSoundInfo.cover_url}`]).done(() =>{
                    this.hideLoading('isData')
                })
            }).catch(error => console.log('error', error));
        },
        mounted(){
        },
        computed: {
            ...mapGetters([
                'topReadingInfo',
                'topFilmInfo',
                'topMusicInfo',
                'topSoundInfo',
            ]),
        },
        methods: {
            ...mapActions({
                login: types.USER_LOGIN,
                getTopReadingArticle: types.GET_TOPREADINGARTICLE,
                getTopFilmArticle: types.GET_TOPFILMARTICLE,
                getTopMusicArticle: types.GET_TOPMUSICARTICLE,
                getTopSoundArticle: types.GET_TOPSOUNDARTICLE,
            }),
            toReading(){
                this.setTransitionName('move-right-to-left')
                this.$router.push({
                    path: `/reading/${this.topReadingInfo._id}`
                });
            },
            toFilm(){
                this.setTransitionName('move-right-to-left')
                this.$router.push({
                    path: `/film/${this.topFilmInfo._id}`
                });
            },
            toMusic(event){
                if (event.target.className.indexOf('play') > -1) return
                this.setTransitionName('move-right-to-left')
                this.$router.push({
                    path: `/music/${this.topMusicInfo._id}`
                });
            },
            toSound(){
                this.setTransitionName('move-right-to-left')
                this.$router.push({
                    path: `/sound/${this.topSoundInfo._id}`
                });
            },
            toReadingList(){
                this.setTransitionName('move-right-to-left')
                this.$router.push({
                    path: `/readinglist`
                });
            },
            toFilmList(){
                this.setTransitionName('move-right-to-left')
                this.$router.push({
                    path: `/filmlist`
                });
            },
            toMusicList(){
                this.setTransitionName('move-right-to-left')
                this.$router.push({
                    path: `/musiclist`
                });
            },
            toSoundList(){
                this.setTransitionName('move-right-to-left')
                this.$router.push({
                    path: `/soundlist`
                });
            },
            switchMusic(){
                if (this.musicFirst){
                    console.log(this.topMusicInfo.music_info.url)
                    this.setAudioSrc(this.topMusicInfo.music_info.url)
                    this.musicFirst = false
                }
                this.musicPlay = !this.musicPlay
                if (this.musicPlay){
                    this.playAudio()
                }
                else {
                    this.pauseAudio()
                }
            },
            switchSound(){
                if (this.soundFirst){
                    this.setAudioSrc(this.topSoundInfo.sound_url)
                    this.soundFirst = false
                }
                this.soundPlay = !this.soundPlay
                if (this.soundPlay){
                    this.playAudio()
                }
                else {
                    this.pauseAudio()
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .home{
        .container{
            padding-top: 88px;
            padding-bottom: 98px;
            .swiper-box{
                height: 370px;
            }
            .classify{
                width: 100%;
                height: 278px;
                ul{
                    width: 100%;
                    height: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    li{
                        width: 168px;
                        height: 168px;
                        margin-right: 12px;
                        background-color: rgb(168,168,168);
                        position: relative;
                        &.reading{
                            background: url("../assets/images/reading-thumb.jpg") no-repeat;
                            background-size: 100% auto;
                            background-position: center;
                        }
                        &.film{
                            background: url("../assets/images/film-thumb.jpg") no-repeat;
                            background-size: 100% auto;
                            background-position: center;
                        }
                        &.music{
                            background: url("../assets/images/music-thumb.jpg") no-repeat;
                            background-size: 100% auto;
                            background-position: center;
                        }
                        &.sound{
                            background: url("../assets/images/sound-thumb.jpg") no-repeat;
                            background-size: 100% auto;
                            background-position: center;
                        }
                        span{
                            width: 100%;
                            display: block;
                            position: absolute;
                            left: 0;
                            bottom: 15px;
                            color: #f8f8f8;
                            font-size: 25px;
                            text-align: center;
                        }
                        &:last-child{
                            margin-right: 0;
                        }
                    }
                }
            }
            .banner{
                width: 100%;
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
                            padding-top: 30px;
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
            }
        }

    }
</style>
