<template>
    <div class="bb-indep-video" :id="id">
        <div class="iframe bb-video" v-if="playConfig">
            <div v-if="!show" class="button-play" v-tap="showDia"><img :src="playConfig.cover" alt=""><i class="ty-icon_qiyong ty-font"></i></div>
            <div v-if="show && playConfig.model == 'static'" class="video" v-html="realUrl"></div>
            <div v-if="show && playConfig.model == 'dialog'" class="dialog">
                <div class="bg"><i class="ty-icon_tuichu ty-font" v-tap="closeDia"></i></div>
                <div class="video" v-html="realUrl"></div>
            </div>
        </div>
        <div class="local-video" v-if="value" id="video">
            <div  v-for="(realUrlItem,key) in realUrl" :key="key" class="video-item" :style="{width:itemWidth}">
                <video v-if="realUrl.length == 1" id="video" class="" controls="controls" :src="realUrlItem"></video>
                <i v-if="realUrl.length > 1" class="ty-icon_qiyong ty-font" v-tap="showDia"></i>
                <bb-indep-dialog width="100%" :closeOnClickOverlay="true" :showClose="false" :isShow="show" @update:isShow="closeDia">
                    <video class="" controls="controls" :src="realUrlItem"></video>
                </bb-indep-dialog>
            </div>

        </div>
    </div>
</template>

<script>
    export default {
        name: 'bb-video',
        props: {
            //音频地址 非iframe嵌入式音频地址
            value:{
                type:[String,Array],
                default:"http://www.w3school.com.cn/i/movie.ogg"
            },
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
                type:Object
            }
        },
        data() {
            return {
                realUrl:typeof this.value == "object"?this.value:[this.value],
                show:false,
                id:_TY_Tool.uuid(),
                covers:[],
                itemWidth:"100%",

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
            this.videoCover();
            this.setListItemWidth();
        },
        methods: {
            //获取视频地址
            getData: function () {
                const t = this;
                if (t.urlDs) {
                    _TY_Tool.getDSData(t.urlDs, _TY_Tool.buildTplParams(t), function (map) {
                        map.forEach((val,key)=>{
                            const dataKey = val.dataKey
                            t.realUrl = val.value
                            t.videoCover()
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
            },
            //获取视频封面
            videoCover(){
                const t = this;
                t.realUrl.forEach((url,key)=>{
                    const video = document.createElement("video");//创建video
                    video.setAttribute("src",url);
                    video.setAttribute("controls","controls");
                    const videocanvas = document.createElement("canvas");//创建video
                    videocanvas.width = 100 * 0.8;
                    videocanvas.height = 100 * 0.8;
                    videocanvas.getContext('2d').drawImage(video, 0, 0, videocanvas.width, videocanvas.height);
                    const img = videocanvas.toDataURL("image/png");
                    t.covers.push(img);
                })
            },
            //根据数量计算宽度
            setListItemWidth(){
                const t = this;
                if(t.realFields){
                    const lg = t.realFields.length;
                    t.itemWidth = "100%";
                    switch(lg){
                        case 1:
                            t.itemWidth = "calc(100% - 0.2rem)";
                            break;
                        case 2:
                            t.itemWidth = "calc(50% - 0.2rem)";
                            break;
                        default:
                            t.itemWidth = "calc(33.3% - 0.2rem)";
                            break;
                    }
                }
            },
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
    .local-video{
        font-size: 2rem;
        text-align: center;
        video{
            height: auto;
            width: 100%;
            max-height: 4rem;
            margin: auto;
            vertical-align: bottom;
        }
        .video-item{
            text-align: center;
        }
    }
</style>