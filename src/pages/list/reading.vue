<template>
    <div class="reading-list">
        <list-header title="阅读文章"></list-header>
        <div class="input-search">
            <div class="main">
                <input type="text" v-focus="focused" @focus="searchFocus" @blur="searchBlur" v-model="searchTxt" placeholder="Search Article" ref="readingSearchInput">
                <div class="search-icon" @click="searchReadingArticle"></div>
            </div>
        </div>
        <scroller class="scroller" ref="readingScroller"
                  :on-refresh="refresh"
                  :on-infinite="infinite"
                  :height="scrollerH"
                  :snappingHeight="30"
                  refresh-layer-color="#666"
                  loading-layer-color="#666"
        >
            <svg class="spinner" style="stroke: #666;" slot="refresh-spinner" viewBox="0 0 64 64">
                <g stroke-width="7" stroke-linecap="round"><line x1="10" x2="10" y1="27.3836" y2="36.4931"><animate attributeName="y1" dur="750ms" values="16;18;28;18;16;16" repeatCount="indefinite"></animate><animate attributeName="y2" dur="750ms" values="48;46;36;44;48;48" repeatCount="indefinite"></animate><animate attributeName="stroke-opacity" dur="750ms" values="1;.4;.5;.8;1;1" repeatCount="indefinite"></animate></line><line x1="24" x2="24" y1="18.6164" y2="45.3836"><animate attributeName="y1" dur="750ms" values="16;16;18;28;18;16" repeatCount="indefinite"></animate><animate attributeName="y2" dur="750ms" values="48;48;46;36;44;48" repeatCount="indefinite"></animate><animate attributeName="stroke-opacity" dur="750ms" values="1;1;.4;.5;.8;1" repeatCount="indefinite"></animate></line><line x1="38" x2="38" y1="16.1233" y2="47.8767"><animate attributeName="y1" dur="750ms" values="18;16;16;18;28;18" repeatCount="indefinite"></animate><animate attributeName="y2" dur="750ms" values="44;48;48;46;36;44" repeatCount="indefinite"></animate><animate attributeName="stroke-opacity" dur="750ms" values=".8;1;1;.4;.5;.8" repeatCount="indefinite"></animate></line><line x1="52" x2="52" y1="16" y2="48"><animate attributeName="y1" dur="750ms" values="28;18;16;16;18;28" repeatCount="indefinite"></animate><animate attributeName="y2" dur="750ms" values="36;44;48;48;46;36" repeatCount="indefinite"></animate><animate attributeName="stroke-opacity" dur="750ms" values=".5;.8;1;1;.4;.5" repeatCount="indefinite"></animate></line></g></svg>
            <div class="container" id="scrollReadingList">
                <div class="banner" v-for="(item, index) in readingArticleList" v-bind:key="item._id" @click="toArticleDetail(item)">
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
        name: "reading-list",
        mixins: [mixin],
        components: {
            ListHeader,
        },
        data(){
            return {
                readingArticleList: [],
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
            this.$axios.getReadingArticleList({current: this.current, isWebApp: true}).then(res => {
                this.totalItems = res.data.data.pageInfo.totalItems
                this.readingArticleList = res.data.data.docs
                console.log('this.readingArticleList',this.readingArticleList)
                this.preload(this.readingArticleList.map(item => {
                    return item.cover_url
                })).done(() => {
                    this.hideLoading('isData')
                })
            })
        },
        watch: {
            searchTxt(newVal){
                this.$axios.getReadingArticleList({current: this.current, searchKey: newVal,  isWebApp: true}).then((res) => {
                    this.readingArticleList = res.data.data.docs
                })
            }
        },
        methods: {
            refresh(done){
                this.$axios.getReadingArticleList({current: this.current, isWebApp: true}).then(res => {
                    this.readingArticleList = res.data.data.docs
                    this.preload(this.readingArticleList.map(item => {
                        return item.cover_url
                    })).done(() => {
                        this.current = 1
                        done()
                    })
                })
            },
            infinite(done){
                if((this.current * 15) >= this.totalItems) {
                    this.$refs.readingScroller.finishInfinite(2);
                    return;
                }

                this.current++
                this.$axios.getReadingArticleList({current: this.current, isWebApp: true}).then((res) => {
                    this.readingArticleList = res.data.data.docs
                    this.preload(this.readingArticleList.map(item => {
                        return item.cover_url
                    })).done(() => {
                        this.$refs.readingScroller.resize();
                        done()
                    })
                })
            },
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
            searchFocus(){
                this.focused = true
            },
            searchBlur(){
                this.focused = false
            },
            searchReadingArticle(){
                this.$axios.getReadingArticleList({current: this.current, searchKey: this.searchTxt,  isWebApp: true}).then((res) => {
                    this.readingArticleList = res.data.data.docs
                    console.log('this.readingArticleList',this.readingArticleList)
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .reading-list{
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
            line-height: 70px;
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
            margin-top: 165px;
            height: 100%;
            overflow: hidden;
            background: #fff;
            .container{
                width: 100%;
                overflow-y: scroll;
                padding-top: 50px;
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
    }
</style>
