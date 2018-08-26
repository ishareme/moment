<template>
    <div class="article-header">
        <div class="container">
            <div class="back" @click="goBack"></div>
            <div class="operate">
                <div class="collect" @click="handleCollect"></div>
                <div class="share"></div>
                <div class="like" @click="handleLike"></div>
            </div>
        </div>
    </div>
</template>

<script>
    import mixin from '../../mixins';
    export default {
        name: "article-header",
        props: ['data'],
        mixins: [mixin],
        methods: {
            goBack(){
                this.setTransitionName('move-left-to-right')
                this.$router.go(-1)
            },
            handleCollect(){
                const isCollected = this.isCollected(item)
                this.$axios.changeImageArticleCollectById({_id: item._id, user_id: this.user_info._id, to_collect: isCollected ? false : true}).then(res => {
                    this.imageArticleList[index] = Object.assign(this.imageArticleList[index], res.data.data)
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
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
</style>
