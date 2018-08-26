<template>
    <div class="profile">
        <profile-header :username="user_info.username"></profile-header>
        <div class="container">
            <div class="avatar">
                <div class="left">
                    <div class="label">头像</div>
                </div>
                <div class="right" :style="{background: `url(${user_info.avatar}) no-repeat center`, backgroundSize: '100% auto'}">
                    <input type="file" accept="image/jpg,image/jpeg,image/png" @change="chooseImage('avatar')">
                </div>
            </div>
            <div class="username" @click="openUserName">
                <div class="left">
                    <div class="label">昵称</div>
                    <div class="content text-overflow">{{user_info.username}}</div>
                </div>
                <div class="right"></div>
            </div>
            <div class="description" @click="openUserDescription">
                <div class="left">
                    <div class="label">简介</div>
                    <div class="content">{{user_info.description}}</div>
                </div>
                <div class="right"></div>
            </div>
            <div class="bg">
                <div class="left">
                    <div class="label">背景</div>
                </div>
                <div class="right"></div>
                <input type="file" accept="image/jpg,image/jpeg,image/png" @change="chooseImage('bg')">
            </div>
            <div class="email">
                <div class="left">
                    <div class="label">邮箱</div>
                    <div class="content">{{user_info.email}}</div>
                </div>
            </div>
            <div class="phone" @click="openUserPhone">
                <div class="left">
                    <div class="label">手机</div>
                    <div class="content">{{user_info.phone}}</div>
                </div>
                <div class="right"></div>
            </div>
            <div class="modifyPassword" @click="openUserPassword">
                <div class="left">
                    <div class="label">修改密码</div>
                </div>
                <div class="right"></div>
            </div>
            <div class="loginout" @click="handleLoginOut">
                <div class="left">
                    <div class="label">退出登录</div>
                </div>
                <div class="right"></div>
            </div>
        </div>

        <clipper v-if="clipperShow" :img="url" @confirm="getFinalImage" @cancel="hiddenClipper" :clipper-img-width="clipperW" :clipper-img-height="clipperH"></clipper>
    </div>
</template>

<script>
    import Exif from 'exif-js'
    import ProfileHeader from './common/ProfileHeader'
    import Clipper from '../components/Clipper/Clipper'
    import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
    import types from '../store/types'
    import mixin from '../mixins';
    export default {
        name: "profile",
        components: {
            ProfileHeader,
            Clipper
        },
        mixins: [mixin],
        data(){
            return {
                clipperShow: false,
                clipperW: 600,
                clipperH: 600,
                avatarUrl: '',
                bgUrl:'',
                url: '',
            }
        },
        created(){
        },
        computed: {
            ...mapGetters([
                'user_info',
            ]),
        },
        methods: {
            ...mapActions({
                loginOut: types.USER_LOGINOUT,
                updateUserInfo: types.UPDATE_USERINFO,
                getUserInfo: types.GET_USERINFO
            }),
            openUserName(){
                this.$prompt({ title: '昵称', val: this.user_info.username}, (val) => {
                    if (!val){
                        this.$toast('昵称必填', 'bottom')
                    }
                    else {
                        this.updateUserInfo({_id: this.user_info._id, item: 'username', username: val}).then(() => {
                            this.getUserInfo({_id: this.user_info._id})
                            this.$toast('用户名修改成功', 'bottom')
                        })
                    }
                })
            },
            openUserDescription(){
                this.$prompt({ title: '简介', val: this.user_info.description}, (val) => {
                    if (!val){
                        this.$toast('简介不为空', 'bottom')
                    }
                    else {
                        this.updateUserInfo({_id: this.user_info._id, item: 'description', description: val}).then(() => {
                            this.getUserInfo({_id: this.user_info._id})
                            this.$toast('简介修改成功', 'bottom')
                        })
                    }
                })
            },
            openUserPhone(){
                this.$prompt({ title: '手机', val: this.user_info.phone}, (val) => {
                    console.log(val)
                    if (!val && this.$v.isPhone(val)){
                        this.$toast('手机号格式错误', 'bottom')
                    }
                    else {
                        this.updateUserInfo({_id: this.user_info._id, item: 'phone', phone: val}).then(() => {
                            this.getUserInfo({_id: this.user_info._id})
                            this.$toast('手机号修改成功', 'bottom')
                        })
                    }
                })
            },
            openUserPassword(){
                this.$prompt({
                    title: '密码',
                    type: 'password',
                    pw: {
                        oldPassword: '',
                        newPassword: '',
                    }
                }, (pw) => {
                    console.log(pw)
                    if (this.$v.password(pw.oldPassword) || this.$v.password(pw.newPassword)){
                        this.$toast('密码格式错误', 'bottom')
                    }
                    else {
                        this.updateUserInfo({_id: this.user_info._id, item: 'password', password: pw.oldPassword, newPassword: pw.newPassword}).then((res) => {
                            this.getUserInfo({_id: this.user_info._id})
                            this.$toast('手机号修改成功', 'bottom')
                        })
                    }
                })
            },
            handleLoginOut(){
                this.loginOut()
                this.$router.push({
                    path: '/me',
                });
            },
            chooseImage(arg){
                const file = event.target.files[0] || e.dataTransfer.files[0]
                if (!file) return
                this.clipperW = arg === 'bg' ? 850 : 600
                this.clipperH = arg === 'bg' ? 510 : 600
                if (this.readFileSize(file).indexOf('MB') > -1) {
                    if (parseInt(this.readFileSize(file)) > 30){
                        this.$toast('图片太大哦');
                        return;
                    }
                }
                this.getImageBase(file, (originB64) => {
                    this.url = originB64
                    this.clipperShow = true
                })
            },
            getImageBase(file, callback){
                let self = this;
                let Orientation;
                //去获取拍照时的信息，解决拍出来的照片旋转问题
                Exif.getData(file, function(){
                    Orientation = Exif.getTag(this, 'Orientation');
                });
                // 看支持不支持FileReader
                if (!file || !window.FileReader) return;
                if (/^image/.test(file.type)) {
                    // 创建一个reader
                    let reader = new FileReader();
                    // 将图片转成 base64 格式
                    reader.readAsDataURL(file);
                    // 读取成功后的回调
                    reader.onloadend = function () {
                        let base64 = this.result;
                        let img = new Image();
                        img.src = base64;
                        //判断图片是否大于100K,是就直接上传，反之压缩图片
                        if (base64.length <= (100 * 1024)) {
                            callback && callback(base64)
                        }else {
                            img.onload = () => {
                                let data = self.compress(img, Orientation);
                                callback && callback(data)
                            }
                        }
                    }
                }
            },
            getFinalImage(base64, type){
                this.showLoading('isData')
                this.upload(base64, (res) => {
                    if (type === 'bg'){
                        this.updateUserInfo({_id: this.user_info._id, item: 'bg_url', bg_url: res.result_url}).then((res) => {
                            this.getUserInfo({_id: this.user_info._id})
                            this.hideLoading('isData')
                            this.clipperShow = false
                        })
                    }
                    else {
                        this.updateUserInfo({_id: this.user_info._id, item: 'avatar', avatar: res.result_url}).then((res) => {
                            this.getUserInfo({_id: this.user_info._id})
                            this.hideLoading('isData')
                            this.clipperShow = false
                        })
                    }
                }, (error) => {
                    console.log(error)
                    this.hideLoading('isData')
                    this.$toast('出错了')
                })
            },
            hiddenClipper(){
                this.clipperShow = false
            },
        }
    }
</script>

<style lang="scss" scoped>
    .profile{
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        .container{
            padding-top: 98px;
            .label{
                font-size: 30px;
                color: #666;
            }
            .avatar{
                width: 100%;
                height: 120px;
                background-color: #fff;
                display: flex;
                justify-content: space-between;
                align-items: center;
                .left{
                    padding: 0 28px;
                }
                .right{
                    margin-right: 28px;
                    width: 100px;
                    height: 100px;
                    background-color: #999;
                    border-radius: 50%;
                    position: relative;
                    input[type="file"] {
                        display: block;
                        width: 100%;
                        height: 100%;
                        opacity:0;
                        position: absolute;
                        top: 0;
                        left: 0;
                        cursor: pointer;
                    }
                }
            }
            .username, .bg, .email{
                margin-top: 20px;
            }
            .loginout, .modifyPassword{
                margin-top: 30px;
            }
            .username, .description, .bg, .email, .phone, .loginout, .modifyPassword{
                width: 100%;
                height: 80px;
                background-color: #fff;
                border-bottom: 1px solid rgba(0,0,0, 0.1); /* no */
                padding: 0 28px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                position: relative;
                input[type="file"] {
                    display: block;
                    width: 100%;
                    height: 100%;
                    opacity:0;
                    position: absolute;
                    top: 0;
                    left: 0;
                    cursor: pointer;
                }
                .left{
                    display: flex;
                    align-items: center;
                    .content{
                        width: 550px;
                        font-size: 30px;
                        margin-left: 30px;
                        text-align: left;
                    }
                }
                .right{
                    width: 32px;
                    height: 32px;
                    background: url("../assets/images/right-arrow.png") no-repeat;
                    background-size: 100% auto;
                    margin-right: 50px;
                }
            }
        }
    }
</style>
