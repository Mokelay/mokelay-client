<template>
    <div></div>
</template>

<script>
    export default {
        name: 'bb-video',
        props: {
            /*
                transformConfig 样式
                {
                    url:'https://a.mp4'  视频地址 支持tpl 模板
                    source:'腾讯视频',  视频来源
                    model:'static'   'static' || 'dialog'  视频播放模式 固定,弹出
                    cover:'' 封面地址 model为static时必填
                    
                }
            */
            playConfig:{
                type:Object,
                default:function(){
                    return {
                        url:'https://a.mp4',  
                        source:'腾讯视频',
                        model:'dialog',
                    }
                }
            }
        },
        data() {
            return {
            }
        },
        computed:{
        },
        watch: {
        },
        created: function () {
        },
        mounted:function(){
        },
        methods: {
        }
    }
</script>
<style lang='less' scoped>
</style>