<template>
    <div class="image-collect">
        <list-header title="图文收藏"></list-header>
        <div class="container">
            <div class="banner" v-for="(item, index) in imageArticleList" v-bind:key="item._id">
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
        computed: {
            ...mapGetters([
                'user_info',
            ]),
        },
        created(){
            this.showLoading('isData')
            this.$axios.getImageArticleList({current: this.current}).then(res => {
                this.imageArticleList = res.data.data.docs
                this.preload(this.imageArticleList.map(item => {
                    return item.image_url
                })).done(() => {
                    this.hideLoading('isData')
                })
            })
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
        }
    }
</style>
