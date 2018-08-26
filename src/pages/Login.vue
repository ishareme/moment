<template>
    <div class="login">
        <div class="container">
            <div class="back" @click="goBack"></div>
            <div class="input-email centerX">
                <div class="label">邮箱</div>
                <input type="email" v-model="email" placeholder="请输入邮箱">
            </div>
            <div class="input-password centerX">
                <div class="label">密码</div>
                <input type="password" v-model="password" placeholder="请输入密码">
            </div>
            <div class="btn centerX" :class="{active: btnActive}" @click="handleLogin">
                登录
            </div>
            <div class="tips centerX">
                <div class="register" @click="toRegister">注册</div>
                <div class="forgot">忘记密码</div>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapState, mapActions, mapGetters, mapMutations } from 'vuex'
    import types from '../store/types'
    import mixin from '../mixins';
    export default {
        name: "login",
        data(){
            return {
                email: '',
                password: '',
                btnActive: false,
                socketId: ''
            }
        },
        mixins: [mixin],
        mounted(){
            // this.$socket.emit('connect'); //在这里触发connect事件
        },
        watch: {
            email(val){
                this.btnActive = (this.$v.isEmail(val) && this.$v.password(this.password)) ? true : false
            },
            password(val){
                this.btnActive = (this.$v.password(val) && this.$v.isEmail(this.email)) ? true : false
            }
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
            goBack(){
                this.setTransitionName('move-left-to-right')
                this.$router.go(-1)
            },
            toRegister(){
                this.setTransitionName('move-right-to-left')
                this.$router.push({
                    path: '/register1'
                });
            },
            handleLogin(){
                if (!this.$v.isEmail(this.email)){
                    this.$toast('请输入正确邮箱地址')
                }
                else if (!this.$v.password(this.password)){
                    if (this.password === ''){
                        this.$toast('请输入密码')
                    }
                    else {
                        this.$toast('密码为6-16位, 数字, 字母, 字符至少包含两种')
                    }
                }
                else {
                    this.showLoading()
                    this.login({
                        email: this.email,
                        password: this.password
                    }).then((res) => {
                        if (res.data.status){
                            //登录成功服务端触发登录成功事件
                            this.$socket.emit('login_success', {
                                user_id: res.data.data._id
                            })
                            Promise.all(['ReadingArticle','FilmArticle','MusicArticle', 'SoundArticle'].map((item) => {
                                return this[`getTop${item}`]()
                            })).then(res => {
                                this.preload([`${this.topReadingInfo.cover_url}`,`${this.topFilmInfo.cover_url}`,`${this.topMusicInfo.cover_url}`, `${this.topSoundInfo.cover_url}`]).done(() =>{
                                    this.hideLoading()
                                    this.setTransitionName('move-right-to-left')
                                    this.$router.push({
                                        path: '/home'
                                    });
                                })
                            }).catch(error => console.log('error', error));
                        }
                        else {
                            this.hideLoading()
                            this.$toast(res.data.message || '出错了')
                        }
                    }).catch((error) => {
                        console.log(error)
                        this.hideLoading()
                        this.$toast(error)
                    })
                }

            }
        },
    }
</script>

<style lang="scss" scoped>
    .login{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        overflow-x: hidden;
        overflow-y: auto;
        background: url("../assets/images/l-r-bg.jpg") no-repeat;
        background-size: 100% auto;
        background-color: #fff;
        .container{
            width: 100%;
            position: relative;
            .back{
                width: 18px;
                height: 35px;
                background: url("../assets/images/back.png") no-repeat;
                background-size: 100% auto;
                position: absolute;
                left: 40px;
                top: 54px;
            }
            .input-email, .input-password{
                top: 600px;
                width: 600px;
                height: 80px;
                border: 1px solid rgb(219,219,219); /* no */
                padding: 20px 35px 20px 0;
                display: flex;
                align-items: center;
                box-sizing: border-box;
                .label{
                    width: 140px;
                    font-size: 26px;
                    color: #999999;
                }
                input{
                    background:none;
                    outline:none;
                    -webkit-appearance: none;
                    border-radius: 0;
                    width: 465px;
                    height: 35px;
                    border: 0;
                    border-left: 1px solid rgb(219,219,219); /* no */
                    padding-left: 20px;
                }
            }
            .input-email{
                top: 600px;
            }
            .input-password{
                top: 710px;
            }
            .btn{
                width: 500px;
                height: 80px;
                border-radius: 10px;
                background-color: rgb(219,219,219);
                top: 870px;
                font-size: 28px;
                color: #fff;
                font-weight: bold;
                line-height: 80px;
                text-align: center;
            }
            .btn.active{
                background-color: #666;
            }
            .tips{
                top: 980px;
                width: 500px;
                font-size: 22px;
                color: #666666;
                padding: 5px 0;
                display: flex;
                justify-content: space-between;
            }
        }
    }
</style>
