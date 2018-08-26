<template>
    <div class="footer">
        <ul>
            <li @click="toAll">
                <span class="all" :class="{active: allActive}">
                </span>
            </li>
            <li @click="toMoment">
                <span class="moment" :class="{active: momentActive}">
                </span>
            </li>
            <li @click="toMe">
                <span class="me" :class="{active: meActive}">
                </span>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        name: "m-footer",
        data(){
            return {
                allActive: false,
                momentActive: false,
                meActive: false,
            }
        },
        created(){
            this[`${this.$route.name}Active`] = true
        },
        methods: {
            toAll(){
                this.activeChange('all')
                this.$router.push({
                    path: '/home'
                });
            },
            toMoment(){
                this.activeChange('moment')
                this.$router.push({
                    path: '/moment'
                });
            },
            toMe(){
                this.activeChange('me')
                this.$router.push({
                    path: '/me'
                });
            },
            activeChange(arg){
                switch(arg) {
                    case 'moment':
                        this.allActive = false
                        this.momentActive = true
                        this.meActive = false
                        break;
                    case 'me':
                        this.allActive = false
                        this.momentActive = false
                        this.meActive = true
                        break;
                    default:
                        this.allActive = true
                        this.momentActive = false
                        this.meActive = false
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .footer{
        width: 100%;
        height: 98px;
        background-color: #fff;
        position: fixed;
        bottom: 0;
        left: 0;
        z-index: 9;
        ul{
            display: flex;
            justify-content: center;
            align-items: center;
            li{
                width: 98px;
                height: 98px;
                display: flex;
                justify-content: center;
                align-items: center;
                &:nth-child(1){
                    margin-right: 120px;
                }
                &:nth-child(2){
                    margin-right: 107px;
                }
                span{
                    display: block;
                }
                .all{
                    width: 50px;
                    height: 71px;
                    background: url("../../assets/images/nav-all.png") no-repeat;
                    background-size: 100% auto;
                }
                .all.active{
                    width: 50px;
                    height: 71px;
                    background: url("../../assets/images/nav-all-active.png") no-repeat;
                    background-size: 100% auto;
                }
                .moment{
                    width: 89px;
                    height: 72px;
                    background: url("../../assets/images/nav-moment.png") no-repeat;
                    background-size: 100% auto;
                }
                .moment.active{
                    width: 89px;
                    height: 72px;
                    background: url("../../assets/images/nav-moment-active.png") no-repeat;
                    background-size: 100% auto;
                }
                .me{
                    width: 50px;
                    height: 71px;
                    background: url("../../assets/images/nav-me.png") no-repeat;
                    background-size: 100% auto;
                }
                .me.active{
                    width: 50px;
                    height: 71px;
                    background: url("../../assets/images/nav-me-active.png") no-repeat;
                    background-size: 100% auto;
                }
            }


        }
    }
</style>
