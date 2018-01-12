<template>
    <div class="bb-video">
        <div v-if="!show" class="button-play" v-tap="showDia"><img :src="playConfig.cover" alt=""><i class="ty-icon_qiyong ty-font"></i></div>
        <div v-if="show && playConfig.model == 'static'" class="video" v-html="realUrl"></div>
        <div v-if="show && playConfig.model == 'dialog'" class="dialog">
            <div class="bg"><i class="ty-icon_tuichu ty-font" v-tap="closeDia"></i></div>
            <div class="video" v-html="realUrl"></div>
        </div>
    </div>
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
            urlDs:{
                type:Object,
            },
            playConfig:{
                type:Object,
            }
        },
        data() {
            return {
                realUrl:null,
                show:false
            }
        },
        computed:{
        },
        watch: {
        },
        created: function () {
            const t = this;
            if(t.playConfig && t.playConfig.url){
                t.realUrl = t.playConfig.url
            }
            t.getData();
        },
        mounted:function(){
        },
        methods: {
            //获取视频地址
            getData: function () {
                const t = this;
                if (t.urlDs) {
                    _TY_Tool.getDSData(t.urlDs, {"bb": t, "router": t.$route.params,"external":t.external}, function (map) {
                        map.forEach((val,key)=>{
                            const dataKey = val.dataKey
                            t.realUrl = val.value
                        })
                    }, function (code, msg) {
                    });
                }
            },
            showDia:function(){
                this.show = true;
            },
            closeDia:function(){
                this.show = false;
            }
        }
    }
</script>
<style lang='less' scoped>
    .bb-video{
        height: 150px;
        .dialog{
            animation: zoomIn 0.2s;
            position: fixed;
            z-index: 100;
            top: 0;
            height: 100%;
            width: 100%;
            .bg{
                height: 100%;
                width: 100%;
                background-color: rgba(0,0,0,0.8);
                position: absolute;
                top: 0;
                i{
                    color: #ffffff;
                    font-size: 20px;
                    text-align: right;
                    margin: 20px;
                    float: right;
                }
            }
            .video{
                position: absolute;
                margin-top: 50%;
            }
        }
        .button-play{
            font-size: 100px;
            width: 100%;
            max-height: 100%;
            color:#E5E5E5;
            display: flex;
            i{  
                flex: 1;
                position: absolute;
                top: 0;
                bottom: 0;
                left: 0;
                right: 0;
                margin: auto;
                width: 100px;
                height: 100px;
                &:hover{
                    color: #999999;
                    animation: pulse 0.1s;
                }
            }
            img{
                flex: 1;
            }
        }
    }
</style>