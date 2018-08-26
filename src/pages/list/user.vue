<template>
    <div class="user-list">
        <list-header title="关注"></list-header>
        <div class="container">
            <div class="banner" v-for="(item, index) in userList" :key="item._id">
                <div class="left">
                    <div class="avatar" @click="toUser(item)" :style="{background: `url(${item.avatar}) no-repeat center`, backgroundSize: '100% auto'}"></div>
                </div>
                <div class="middle">
                    <div class="name text-overflow">{{item.username}}</div>
                    <div class="description text-overflow">{{item.description}}</div>
                </div>
                <div class="right" v-if="type === 'myFollower'"></div>
                <div class="right" v-else>
                    <div v-if="type === 'following'" class="follow" :class="{active: followingFollowed[`${item._id}`]}"  @click="handleFollow(item)">{{followingFollowed[`${item._id}`] ? '已关注' : '关注'}}</div>
                    <div v-if="type === 'follower'" class="follow" :class="{active: followerFollowed[`${item._id}`]}"  @click="handleFollow(item)">{{followerFollowed[`${item._id}`] ? '已关注' : '关注'}}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import ListHeader from '../common/ListHeader'
    import mixin from '../../mixins';
    import { mapState, mapGetters, mapMutations } from 'vuex'
    import types from '../../store/types'
    export default {
        name: "user",
        components: {
            ListHeader
        },
        mixins: [mixin],
        data(){
            return {
                userList: [],
                type: '',
                followingFollowed: {},
                followerFollowed: {}
            }
        },
        computed: {
            ...mapGetters([
                'user_info',
            ]),
        },
        created(){
            this.userList = this.$route.params.item
            this.type = this.$route.params.type
            console.log('this.$route.params',this.userList)
            if (this.userList && this.userList.length){
                this.userList.map(item => {
                    this.$axios.getFriendShipById({from_user: this.user_info._id, to_user: item._id}).then(res => {
                        if (this.type === 'following'){
                            this.followingFollowed[`${item._id}`] = res.data.data.isFollowed
                        }
                        else {
                            this.followerFollowed[`${item._id}`] = res.data.data.isFollowed
                        }
                    })
                })
            }

        },
        watch: {
            $route (to, from) {
                if (to.name === 'UserList'){
                    this.userList = this.$route.params.item
                    this.type = this.$route.params.type
                    if (this.userList && this.userList.length){
                        this.userList.map(item => {
                            this.$axios.getFriendShipById({from_user: this.user_info._id, to_user: item._id}).then(res => {
                                if (this.type === 'following'){
                                    this.followingFollowed[`${item._id}`] = res.data.data.isFollowed
                                }
                                else {
                                    this.followerFollowed[`${item._id}`] = res.data.data.isFollowed
                                }
                            })
                        })
                    }
                }
            }
        },
        methods: {
            handleFollow(item){
                if (this.type === 'following'){
                    this.$axios.changeFriendShipById({from_user: this.user_info._id, to_user: item._id, to_follow: !this.followingFollowed[`${item._id}`]}).then(res => {
                        this.$set(this.followingFollowed, `${item._id}`, res.data.data.isFollowed)
                    })
                }
                else {
                    this.$axios.changeFriendShipById({from_user: this.user_info._id, to_user: item._id, to_follow: !this.followerFollowed[`${item._id}`]}).then(res => {
                        this.$set(this.followerFollowed, `${item._id}`, res.data.data.isFollowed)
                    })
                }

            },
            toUser(user){
                this.setTransitionName('move-right-to-left')
                this.$router.push({
                    path: '/user',
                    query: {
                        user_id: user._id
                    }
                });
            }
        }
    }
</script>

<style lang="scss" scoped>
    .user-list{
        width: 100%;
        overflow-x: hidden;
        position: absolute;
        left: 0;
        top: 0;
        overflow-y: scroll;
        .container{
            width: 100%;
            margin-top: 98px;
            background-color: #fff;
            .banner{
                width: 750px;
                height: 100px;
                margin: 30px auto;
                padding: 10px 20px;
                border-bottom: 1px solid #d4d4d4; /*no*/
                display: flex;
                .left{
                    .avatar{
                        width: 100px;
                        height: 100px;
                        border-radius: 50%;
                    }
                }
                .middle{
                    margin-left: 20px;
                    text-align: left;
                    width: 490px;
                    .name{
                        height: 60px;
                        line-height: 60px;
                        font-size: 30px;
                        color: #666;
                        font-weight: bold;
                    }
                    .description{
                        height: 40px;
                        line-height: 40px;
                        font-size: 20px;
                        color: #666;
                    }
                }
                .right{
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;
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
    }
</style>
