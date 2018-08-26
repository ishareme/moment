<template>
    <div>

        <div v-if="loaded&&!completed&&spinner=='circles'" class="main">
            <div  class="spinner ring-2">
                <div class="ball-holder">
                    <div class="ball"></div>
                </div>
            </div>
            <div class="txt">加载中...</div>
        </div>

        <div v-if="loaded&&!completed&&spinner=='spiral'" class="spinner wh-spinner-loading">
        </div>

        <div class="wh_completed" v-if="completed">
            {{completed}}
        </div>
    </div>

</template>

<script>
    //获取滚动条当前的位置
    function getScrollTop() {
        var scrollTop = 0;
        if (document.documentElement && document.documentElement.scrollTop) {
            scrollTop = document.documentElement.scrollTop;
        } else if (document.body) {
            scrollTop = document.body.scrollTop;
        }
        return scrollTop;
    }

    //获取当前可视范围的高度
    function getClientHeight() {
        var clientHeight = 0;
        if (document.body.clientHeight && document.documentElement.clientHeight) {
            clientHeight = Math.min(
                document.body.clientHeight,
                document.documentElement.clientHeight
            );
        } else {
            clientHeight = Math.max(
                document.body.clientHeight,
                document.documentElement.clientHeight
            );
        }
        return clientHeight;
    }

    //获取文档完整的总高度 body
    function getScrollHeight() {
        return Math.max(
            document.body.scrollHeight,
            document.documentElement.scrollHeight
        );
    }

    export default {
        name: "load-more",
        data() {
            return {
                loaded: false,
                completed: false
            };
        },
        props: {
            spinner: {
                default: "circles"
            },
            scrollEle: {
                default: window,
            }
        },
        created() {
            var that = this;
            this.change_state = {
                loaded: () => {
                    that.loaded = false;
                },
                completed: (text = "暂无更多加载") => {
                    that.completed = text;
                }
            };
        },
        watch: {
            scrollEle(newVal){
                if (newVal){
                    console.log('21313131313')
                    this.scrollEle.addEventListener('click', (event) => {
                        console.log(event)
                    })
                    this.scrollEle.addEventListener('scroll', (event) => {
                        console.log(event)
                        console.log(getScrollHeight() - (getScrollTop() + getClientHeight()) < 7)
                        if (!that.loaded && !that.completed) {
                            if (getScrollHeight() - (getScrollTop() + getClientHeight()) < 7) {
                                that.loaded = true;
                                that.$emit("infinite", that.change_state);
                            }
                        }
                    })
                }
                else {
                    this.scrollEle.removeListener('scroll', () => {
                        console.log(getScrollHeight() - (getScrollTop() + getClientHeight()) < 7)
                        if (!that.loaded && !that.completed) {
                            if (getScrollHeight() - (getScrollTop() + getClientHeight()) < 7) {
                                that.loaded = true;
                                that.$emit("infinite", that.change_state);
                            }
                        }
                    })
                }
            }
        },

    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
    @keyframes wh-spinner-rotate {
        0% {
            -webkit-transform: rotate(0deg);
            transform: rotate(0deg);
        }
        100% {
            -webkit-transform: rotate(360deg);
            transform: rotate(360deg);
        }
    }

    .main{
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 20px 0;
    }
    .wh-spinner-loading {
        -webkit-animation: wh-spinner-rotate 0.8s infinite linear;
        animation: wh-spinner-rotate 0.8s infinite linear;
        border: 4px solid transparent;
        border-radius: 50%;
        border-top-color: rgb(204, 204, 204);
        border-left-color: rgb(204, 204, 204);
        border-bottom-color: rgb(204, 204, 204);
        height: 30px;
        width: 30px;
        margin: auto;
    }

    .ring-2 {
        position: relative;
        width: 32px;
        height: 32px;
        border: 3px solid #666;
        border-radius: 100%;
    }

    .ball-holder {
        position: absolute;
        width: 8px;
        height: 32px;
        left: 12px;
        top: 0px;
        animation: wh-spinner-rotate 0.8s linear infinite;
        -webkit-animation: wh-spinner-rotate 0.8s linear infinite;
    }
    .txt{
        font-size: 20px;
        color: #666;
        margin-left: 10px;
    }

    .ball {
        position: absolute;
        top: -7px;
        left: 0;
        width: 12px;
        height: 12px;
        border-radius: 100%;
        background: #666;
    }

    .wh_completed {
        text-align: center;
        height: 30px;
        line-height: 30px;
        font-size: 15px;
    }
</style>
