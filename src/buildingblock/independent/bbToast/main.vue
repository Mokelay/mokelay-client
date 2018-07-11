<template>
    <div v-show="visible" class="bb-toast-container" :class="[customClass]">
        <div class="mask" v-show="mask"></div>
        <div class="toast-content" :class="[$type]">
            <i class="icon" v-show="$type == 'fail' || $type == 'success'"></i>
            <svg viewBox="0 0 30 30" class="circular" v-show="$type=='loading'">
                <circle cx="15" cy="15" r="13" fill="none" class="path"></circle>
            </svg>
            <p>{{content}}</p>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue';

    export default {
        name: 'bb-toast',
        props: {
            content: {
                type: String
            },
            $type: {
                type: String,
                default: ''
            },
            duration:{
                type: Number,
                default: 3000
            },
            mask: {
                type: Boolean,
                default: false
            },
            beforeClose: {
                type: Function
            },
            close: {
                type: Function
            },
            customClass: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                uid: 1,
                visible: false
            }
        },
        watch: {
            visible(newVal) {
                if ( newVal ) {
                    this.uid++;
                    setTimeout(()=>{
                        this.doclose();
                    }, this.duration);
                }
            }
        },
        mounted() {
            window.addEventListener('hashchange', this.doclose);
        },

        beforeDestroy() {
            window.removeEventListener('hashchange', this.doclose);
        },
        methods: {
            doclose() {
                if (!this.visible) return;
                if ( this.beforeClose && typeof this.beforeClose == 'function') this.beforeClose();
                this.visible = false;
                if ( this.close && typeof this.close == 'function') {
                    Vue.nextTick(() => {
                        this.close();
                    });
                }
            }
        }
    }
</script>
<style lang='less' scoped>
    .bb-toast-container {
        display: flex;
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 99;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        * {
            box-sizing: inherit;
        }

        .mask {
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(255,255,255,.4);
        }

        .toast-content {
            position: relative;
            margin: auto;
            max-width: 80%;
            padding: 0.8rem;
            padding: .4rem 0.8rem;
            background-color: rgba(0,0,0,.7);
            border-radius: 0.12rem;

            p {
                font-size: 0.3rem;
                color: #fff;
                text-align: center;
                overflow: hidden;
                text-overflow: ellipsis;
                word-break: break-all;
                white-space: nowrap;
            }
        }

        .success, .fail {
            .icon {
                display: block;
                width: 1.8666rem;
                height: 1.8666rem;
                margin: 0 auto .426666rem;
                border: 0.08rem solid #fff;
                border-radius: 50%;
            }
        }

        .success {
            .icon {

                &:before {
                    content: '';
                    display: block;
                    margin: .2666rem auto 0;
                    width: .48rem;
                    height: .85333rem;
                    border-bottom: .08rem solid #fff;
                    border-right: .08rem solid #fff;
                    transform: rotate(45deg);
                }
            }
        }

        .fail {
            .icon {
                position: relative;

                &:before, &:after {
                    content: '';
                    position: absolute;
                    top: .66666rem;

                    width: 1.0666rem;
                    height: 1.0666rem;
                }

                &:before {
                    left: -0.05333rem;
                    border-right: 0.08rem solid #fff;
                    transform: rotate(-45deg);
                }

                &:after {
                    left: .64rem;
                    border-left: .08rem solid #fff;
                    transform: rotate(45deg);
                }
            }
        }

        .circular {
            display: block;
            margin: 0 auto .42666;
            width: .8rem;
            height: .8rem;
            animation: loading-rotate 2s linear infinite;

            .path {
                stroke-width: 2;
                stroke: hsla(1,1,1,.75);
                stroke-linecap: round;
                animation: loading-dash 1.4s ease-in-out infinite;
            }

            @keyframes loading-rotate {
                100% {
                    transform: rotate(1turn);
                }
            }

            @keyframes loading-dash {
                0% {
                    stroke-dasharray: 1,100;
                    stroke-dashoffset: 0;
                }

                60% {
                  stroke-dasharray: 80,100;
                  stroke-dashoffset: -0.8rem;
                }

                100% {
                    stroke-dasharray: 80,100;
                    stroke-dashoffset: -1.97333rem;
                }
            }
        }
    }
</style>
