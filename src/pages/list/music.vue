<template>
    <div class="music-list">
        <list-header title="音乐文章"></list-header>
        <div class="input-search">
            <div class="main">
                <input type="text" v-focus="focused" @focus="searchFocus" @blur="searchBlur" v-model="searchTxt" placeholder="Search Article" ref="musicSearchInput">
                <div class="search-icon" @click="searchMusicArticle"></div>
            </div>
        </div>
        <scroller class="scroller" ref="musicScroller"
                  :on-refresh="refresh"
                  :on-infinite="infinite"
                  :height="scrollerH"
                  :snappingHeight="30"
                  refresh-layer-color="#666"
                  loading-layer-color="#666"
        >
            <svg class="spinner" style="stroke: #666;" slot="refresh-spinner" viewBox="0 0 64 64">
                <g stroke-width="7" stroke-linecap="round"><line x1="10" x2="10" y1="27.3836" y2="36.4931"><animate attributeName="y1" dur="750ms" values="16;18;28;18;16;16" repeatCount="indefinite"></animate><animate attributeName="y2" dur="750ms" values="48;46;36;44;48;48" repeatCount="indefinite"></animate><animate attributeName="stroke-opacity" dur="750ms" values="1;.4;.5;.8;1;1" repeatCount="indefinite"></animate></line><line x1="24" x2="24" y1="18.6164" y2="45.3836"><animate attributeName="y1" dur="750ms" values="16;16;18;28;18;16" repeatCount="indefinite"></animate><animate attributeName="y2" dur="750ms" values="48;48;46;36;44;48" repeatCount="indefinite"></animate><animate attributeName="stroke-opacity" dur="750ms" values="1;1;.4;.5;.8;1" repeatCount="indefinite"></animate></line><line x1="38" x2="38" y1="16.1233" y2="47.8767"><animate attributeName="y1" dur="750ms" values="18;16;16;18;28;18" repeatCount="indefinite"></animate><animate attributeName="y2" dur="750ms" values="44;48;48;46;36;44" repeatCount="indefinite"></animate><animate attributeName="stroke-opacity" dur="750ms" values=".8;1;1;.4;.5;.8" repeatCount="indefinite"></animate></line><line x1="52" x2="52" y1="16" y2="48"><animate attributeName="y1" dur="750ms" values="28;18;16;16;18;28" repeatCount="indefinite"></animate><animate attributeName="y2" dur="750ms" values="36;44;48;48;46;36" repeatCount="indefinite"></animate><animate attributeName="stroke-opacity" dur="750ms" values=".5;.8;1;1;.4;.5" repeatCount="indefinite"></animate></line></g></svg>
            <div class="container" id="scrollMusicList">
                <div class="banner" v-for="(item, index) in musicArticleList" v-bind:key="item._id" @click="toArticleDetail(item)">
                    <div class="left" :style="{background: `url(${item.music_info.cover}) no-repeat center`, backgroundSize: '100% auto'}"></div>
                    <div class="right">
                        <div class="title">{{item.title}}</div>
                        <div class="music_info">{{item.music_info.name ? item.music_info.name : '未知'}} / {{item.music_info.singer ? item.music_info.singer: '未知'}}</div>
                    </div>
                </div>
            </div>
            <svg class="spinner" style="fill: #666;" slot="infinite-spinner" viewBox="0 0 64 64">
                <g><circle cx="16" cy="32" stroke-width="0" r="3"><animate attributeName="fill-opacity" dur="750ms" values=".5;.6;.8;1;.8;.6;.5;.5" repeatCount="indefinite"></animate><animate attributeName="r" dur="750ms" values="3;3;4;5;6;5;4;3" repeatCount="indefinite"></animate></circle><circle cx="32" cy="32" stroke-width="0" r="3.09351"><animate attributeName="fill-opacity" dur="750ms" values=".5;.5;.6;.8;1;.8;.6;.5" repeatCount="indefinite"></animate><animate attributeName="r" dur="750ms" values="4;3;3;4;5;6;5;4" repeatCount="indefinite"></animate></circle><circle cx="48" cy="32" stroke-width="0" r="4.09351"><animate attributeName="fill-opacity" dur="750ms" values=".6;.5;.5;.6;.8;1;.8;.6" repeatCount="indefinite"></animate><animate attributeName="r" dur="750ms" values="5;4;3;3;4;5;6;5" repeatCount="indefinite"></animate></circle></g></svg>
        </scroller>
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
                totalItems: 0,
                current: 1,
                scrollerH: '625',
                searchTxt: '',
                focused: false,
            }
        },
        created(){
            this.scrollerH = Math.floor(window.innerHeight - (window.innerWidth * 88 / 750) - (window.innerWidth * 70 / 750)).toString()
            this.showLoading('isData')
            this.$axios.getMusicArticleList({current: this.current, isWebApp: true}).then(res => {
                this.totalItems = res.data.data.pageInfo.totalItems
                this.musicArticleList = res.data.data.docs
                console.log('this.musicArticleList',this.musicArticleList)
                this.preload(this.musicArticleList.map(item => {
                    return item.cover_url
                })).done(() => {
                    this.hideLoading('isData')
                })
            })
        },
        watch: {
            searchTxt(newVal){
                this.$axios.getMusicArticleList({current: this.current, searchKey: newVal,  isWebApp: true}).then((res) => {
                    this.musicArticleList = res.data.data.docs
                    console.log('this.musicArticleList',this.musicArticleList)
                })
            }
        },
        methods: {
            refresh(done){
                this.$axios.getMusicArticleList({current: this.current, isWebApp: true}).then(res => {
                    this.musicArticleList = res.data.data.docs
                    this.preload(this.musicArticleList.map(item => {
                        return item.cover_url
                    })).done(() => {
                        this.current = 1
                        done()
                    })
                })
            },
            infinite(done){
                if((this.current * 15) >= this.totalItems) {
                    this.$refs.musicScroller.finishInfinite(2);
                    return;
                }

                this.current++
                this.$axios.getMusicArticleList({current: this.current, isWebApp: true}).then((res) => {
                    this.musicArticleList = res.data.data.docs
                    this.preload(this.musicArticleList.map(item => {
                        return item.cover_url
                    })).done(() => {
                        this.$refs.musicScroller.resize();
                        done()
                    })
                })
            },
            goBack(){
                this.getTopMusicArticle().then(res => {
                    this.setTransitionName('move-left-to-right')
                    this.$router.go(-1)
                }).catch(error => console.log('error', error));
            },
            toArticleDetail(item){
                this.setTransitionName('move-right-to-left')
                this.$router.push({
                    path: `/music/${item._id}`
                });
            },
            searchFocus(){
                this.focused = true
            },
            searchBlur(){
                this.focused = false
            },
            searchMusicArticle(){
                this.$axios.getMusicArticleList({current: this.current, searchKey: this.searchTxt,  isWebApp: true}).then((res) => {
                    this.musicArticleList = res.data.data.docs
                    console.log('this.musicArticleList',this.musicArticleList)
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .music-list{
        position: absolute;
        left: 0;
        top: 0;
        width: 750px;
        height: 100vh;
        .input-search{
            position: absolute;
            left: 0;
            top: 88px;
            width: 100%;
            height: 70px;
            background-color: rgb(240,240,240);
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 28px;
            .main{
                position: relative;
                input{
                    background:none;
                    outline:none;
                    -webkit-appearance: none;
                    border-radius: 0;
                    width: 695px;
                    height: 50px;
                    border: 0;
                    background-color: rgb(246,246,246);
                    box-sizing: border-box;
                    padding: 0px 20px;
                }
                .search-icon{
                    width: 40px;
                    height: 40px;
                    background: url("../../assets/images/search-icon.png") no-repeat;
                    background-size: 100%;
                    position: absolute;
                    right: 2%;
                    top: 50%;
                    transform: translateY(-38%);
                }
            }
        }
        .scroller{
            margin-top: 168px;
            height: 100%;
            overflow: hidden;
            background: #fff;
            .container{
                width: 100%;
                overflow-y: scroll;
                padding-top: 50px;
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
    }
</style>
