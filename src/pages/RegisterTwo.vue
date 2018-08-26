<template>
    <div class="register2">
        <div class="container">
            <div class="back" @click="goBack"></div>
            <div class="input-code centerX">
                <div class="label">验证码</div>
                <input maxlength="4" type="text" v-model="code" placeholder="请输入验证码">
            </div>
            <div class="input-username centerX">
                <div class="label">昵称</div>
                <input type="text" v-model="username" placeholder="请输入昵称">
            </div>
            <div class="input-password centerX">
                <div class="label">密码</div>
                <input type="password" v-model="password" placeholder="请输入密码">
            </div>
            <div class="btn centerX" :class="{active: btnActive}" @click="handleRegister">
                注册
            </div>
            <p class="tip centerX">注册遇到困难？</p>
        </div>
    </div>
</template>

<script>
    import { mapState, mapActions, mapGetters, mapMutations } from 'vuex'
    import types from '../store/types'
    import mixin from '../mixins';
    export default {
        name: "register-two",
        data(){
            return {
                email: '',
                code: '',
                username: '',
                password: '',
                btnActive: false,
            }
        },
        mixins: [mixin],
        created(){
            this.email = decodeURIComponent(this.$route.query.email)
        },
        watch: {
            code(val){
                this.btnActive = (val.trim() !== '' && this.username.trim() !== '' && this.$v.password(this.password)) ? true : false
            },
            username(val){
                this.btnActive = (val.trim() !== '' && this.code.trim() !== '' && this.$v.password(this.password)) ? true : false
            },
            password(val){
                this.btnActive = (this.$v.password(val) && this.code.trim() !== '' && this.username.trim() !== '') ? true : false
            }
        },
        methods: {
            ...mapActions({
                register: types.USER_REGISTER,
            }),
            goBack(){
                this.setTransitionName('move-left-to-right')
                this.$router.go(-1)
            },
            handleRegister(){
                if (!this.code.trim()){
                    this.$toast('请输入验证码')
                }
                else if (!this.username.trim()){
                    this.$toast('请输入昵称')
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
                    this.register({
                        email: this.email,
                        code: this.code,
                        username: this.username,
                        password: this.password
                    }).then((res) => {
                        if (res.data.status){
                            this.hideLoading()
                            this.setTransitionName('move-right-to-left')
                            this.$router.push({
                                path: '/home'
                            });
                        }
                        else {
                            this.hideLoading()
                            this.$toast(res.data.message)
                        }
                    }).catch((error) => {
                        this.hideLoading()
                        this.$toast(error)
                    })
                }

            }
        },

    }
</script>

<style lang="scss" scoped>
    .register2{
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
            .input-code, .input-username, .input-password{
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
            .input-username{
                top: 710px;
            }
            .input-password{
                top: 815px;
            }
            .btn{
                width: 500px;
                height: 80px;
                border-radius: 10px;
                background-color: rgb(219,219,219);
                top: 980px;
                font-size: 28px;
                color: #fff;
                font-weight: bold;
                line-height: 80px;
                text-align: center;
            }
            .btn.active{
                background-color: #666;
            }
            .tip{
                top: 1080px;
                font-size: 22px;
                color: #666666;
                padding: 5px 0;
                text-decoration: underline;
            }
        }
    }
</style>
