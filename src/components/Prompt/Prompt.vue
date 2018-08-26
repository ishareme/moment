<template>
    <div v-show="show" class="prompt" :style="{backgroundColor: options.bg}" @click="closePrompt">
        <transition name="scale-up-to-up">
            <div class="main" v-show="show">
                <div class="top" v-if="options.title">
                    {{options.title}}
                </div>
                <div v-if="options.type === 'password'" class="content-password">
                    <div class="old">
                        原密码：
                        <input type="password" v-model="options.pw.oldPassword">
                    </div>
                    <div class="new">
                        新密码：
                        <input type="password" v-model="options.pw.newPassword">
                    </div>
                </div>
                <div v-else class="content">
                    <input type="text" v-model="options.val">
                </div>
                <div class="bottom">
                    <div class="btns">
                        <div class="cancel" v-if="options.cancelBtnTxt" @click="handleCancel">{{options.cancelBtnTxt}}</div>
                        <div class="confirm" @click="confirm">{{options.confirmBtnTxt}}</div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
    export default {
        name: "toast",
        data() {
            return {
                options: {
                    title: '',
                    cancelBtnTxt: '',
                    confirmBtnTxt: '确定',
                    bg: 'rgba(0,0,0,0.8)',
                    val: '',
                    type: '',
                    pw: {
                        oldPassword: '',
                        newPassword: '',
                    }
                },
                show: false,
            };
        },
        created(){
        },
        methods: {
            confirm(){
                if (this.options.type === 'password'){
                    console.log('this.options.pw',this.options.pw)
                    this.handleConfirm(this.options.pw)
                }
                else {
                    this.handleConfirm(this.options.val)
                }
                this.show = false
            },
            handleConfirm(){
            },
            handleCancel(){
                this.show = false
            },
            closePrompt(event){
                if (event.target.className !== 'prompt') return
                this.show = false
            }
        }
    }
</script>

<style lang="scss" scoped>
    .fade-prompt-enter {
        opacity: 0;
    }
    .fade-prompt-enter-active,
    .fade-prompt-leave-active {
        transition: opacity 1s;
    }
    .fade-toast-leave-active {
        opacity: 0;
    }

    .prompt {
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        right: 0;
        margin: auto;
        z-index:9999;
        display: flex;
        justify-content: center;
        align-items: center;
        .main{
            width: 650px;
            background-color: #fff;
            border-radius: 10px;
            .top{
                width: 100%;
                font-size: 30px;
                font-weight: bold;
                padding: 20px 20px 30px 30px;
            }
            .content-password{
                display: flex;
                flex-direction: column;
                align-items: center;
                color: #666;
                font-size: 30px;
                .old{
                    margin-bottom: 30px;
                }
                input{
                    background:none;
                    outline:none;
                    -webkit-appearance: none;
                    border-radius: 0;
                    width: 350px;
                    height: 35px;
                    border: 0;
                    /*background-color: #f1f2f6;*/
                    border: 1px solid #666; /* no */
                    padding: 15px 20px;
                    border-radius: 10px;
                }
            }
            .content{
                display: flex;
                justify-content: center;
                input{
                    background:none;
                    outline:none;
                    -webkit-appearance: none;
                    border-radius: 0;
                    width: 450px;
                    height: 35px;
                    border: 0;
                    /*background-color: #f1f2f6;*/
                    border: 1px solid #666; /* no */
                    padding: 15px 20px;
                    border-radius: 10px;
                }
            }
            .bottom{
                display: flex;
                justify-content: flex-end;
                margin-top: 30px;
                margin-bottom: 30px;
                margin-right: 40px;
                .btns{
                    font-size: 26px;
                    color: #666;
                    display: flex;
                    .confirm{
                        width: 80px;
                        height: 40px;
                        line-height: 40px;
                        text-align: center;
                        border: 1px solid #666; /* no */
                        padding: 5px;
                        border-radius: 10px;
                    }
                }
            }
        }
    }
</style>
