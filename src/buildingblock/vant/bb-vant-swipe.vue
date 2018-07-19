<template>
    <van-swipe 
        :autoplay="option.autoplay" 
        :duration="option.duration" 
        :loop="option.loop" 
        :vertical="option.vertical" 
        :touchable="option.touchable" 
        :show-indicators="option.showIndicators" 
        :initial-swipe="option.initialSwipe" 
        @change="change">
        <van-swipe-item v-for="(image, index) in valueBase" :key="index">
            <img :src="image.src" @click="click(image.href)"/>
        </van-swipe-item>
    </van-swipe>
</template>

<script>
import SwipeItem from 'vant/lib/swipe-item';
import 'vant/lib/swipe-item/style';
import Swipe from 'vant/lib/swipe';
import 'vant/lib/swipe/style';

    export default {
        name: 'bb-vant-swipe',
        components: {
          "van-swipe-item":SwipeItem,
          "van-swipe":Swipe,
        },
        props: {
            /*静态图组
                [{
                    src:""  图片地址
                    href:"" 跳转地址
                    
                }]
            */
            images:{
                type:[Array,String]
            },
            //动态图组
            imageDs:{
                type:Object
            },
            /*其他属性配置
                {
                    autoplay:3000,  自动轮播间隔，单位为 ms
                    duration:500, 动画时长，单位为 ms   
                    loop:true, 是否开启循环播放 
                    vertical:false, 是否为纵向滚动 
                    touchable:true, 是否可以通过手势滑动
                    showIndicators:true,  是否显示指示器
                    initialSwipe:0, 初始位置，从 0 开始算 
                }
            */
            option:{
                type:Object,
                default:function() {
                    return {
                        autoplay:3000,
                        duration:500,
                        loop:true,
                        vertical:false,
                        touchable:true,
                        showIndicators:true,
                        initialSwipe:0,
                    };
                }
            }
        },
        data() {
            return {
                valueBase:typeof this.images == 'string'?this.images.split(','):this.images,
            };
        },
        mounted(){
            this.getData();
        },
        //事件click
        methods: {
            //图片变换
            change(param){
                this.$emit('change',param);
            },
            //获取图片地址
            getData(){
                const t = this;
                if (t.imageDs) {
                    Util.getDSData(t.imageDs, _TY_Tool.buildTplParams(t), function (data) {
                        data.forEach((item) => {
                            const {dataKey, value} = item;
                            t.valueBase = value;
                        });
                    }, function (code, msg) {
                    });
                }
            },
            //点击图片
            click(href){
                const t = this;
                window.location.href = href;
            }
        }
    }
</script>

<style scoped>
</style>