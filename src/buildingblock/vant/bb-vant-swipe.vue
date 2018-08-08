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
            // 配置选项  动态接口返回属性对应
            props:{
                type:Object,
                default:function(){
                    return {
                        src:'src',
                        href:'href'
                    }
                }
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
                valueBase:typeof this.images == 'string'?JSON.parse(this.images):this.images,
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
                    _TY_Tool.getDSData(t.imageDs, _TY_Tool.buildTplParams(t), function (data) {
                        data.forEach((item) => {
                            let _list = [];
                            if(item['value']&&item['value']['currentRecords']){
                                _list = item['value']['currentRecords'];
                                const totalPage = item['value']['totalPages'];
                                if(t.page>=totalPage){
                                    t.end=true;
                                }else{
                                    t.end=false;
                                }
                            }else if(item['value']&&item['value']['list']){
                                _list = item['value']['list'];    
                            }else{
                                _list = item['value'];
                            }
                            let newValue = t.transferData(_list);
                            t.valueBase = newValue;
                            debugger
                        });
                    }, function (code, msg) {
                    });
                }
            },
            //点击图片
            click(href){
                const t = this;
                window.location.href = href;
            },
            //转换DS返回的数据
            transferData(data){
                const t = this;
                const valueKey = t.props["src"];
                const textKey = t.props["href"];
                const dataString = JSON.stringify(data);
                let newString = valueKey?dataString.replace(new RegExp(valueKey,'g'),"src"):dataString;
                newString = textKey?newString.replace(new RegExp(textKey,'g'),"href"):newString;
                const newData = JSON.parse(newString);
                return newData;
            },
        }
    }
</script>

<style scoped>
</style>