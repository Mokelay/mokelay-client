<template>
    <el-carousel 
        class="bb-carousel"
        :type="realOption.type"
        :height="realOption.height"
        :interval="realOption.interval"
        :trigger="realOption.trigger"
        :arrow="realOption.arrow"
        :initial-index="realOption.initialIndex"
        :indicator-position="realOption.indicatorPosition" 
        @change="change">
        <el-carousel-item v-for="(item,key) in realItems" :key="key" :name="item.text" :label="item.text">
            <img 
                class="bb-carousel-item"
                :class="[{
                            'verticle-center': realOption['verticleCenter'],
                            'align-center': realOption['alignCenter'],
                        }]"
                :src="item.src" 
                alt="item.text" 
                @click="itemClick">
        </el-carousel-item>
    </el-carousel>
</template>

<script>

    import Vue from 'vue';
    import {
            Carousel,
            CarouselItem
    } from 'element-ui'
    Vue.use(Carousel);
    Vue.use(CarouselItem);

    export default {
        name : 'bb-carousel',
        props:{
            /*轮播图组
                [{
                    src:"",
                    text:"文字描述"
                }]
            */
            fields:{
                type:Array
            },
            /*动态获取图组*/
            fieldsDs:{
                type:Object
            },
            /*数据关键字 配合DS接口使用，从返回数据中获取需要的值*/
            valueKey:{
                type:Object,
                default:function(){
                    return {
                        src:"src",
                        text:"text",
                    }
                }
            },
            /*基础配置
                {
                    type:"",  card  走马灯的类型
                    height:"",  走马灯的高度
                    initialIndex:0,  初始状态激活的幻灯片的索引
                    trigger:"click", click 指示器的触发方式
                    autoplay:true, 自动切换
                    interval:3000, 自动切换的时间间隔，单位为毫秒
                    indicatorPosition:'', outside/none 指示器的位置
                    arrow:"hover", always/hover/never  切换箭头的显示时机
                    verticleCenter:true,  垂直居中
                    alignCenter:true,     水平居中
                }
            */
            option:{
                type:Object,
                default:function(){
                    return {
                        type:"",
                        height:"",
                        initialIndex:0,
                        autoplay:true,
                        interval:3000,
                        indicatorPosition:'',
                        arrow:"hover",
                        verticleCenter:true,
                        alignCenter:true,
                    }
                }
            }
        },
        data() {
            return {
                realItems:this.fields,
                realOption:this.option
            };
        },
        watch:{
            value(val){
                this.p_value = (typeof val==='boolean')?val:(val==true)
            }
        },
        mounted:function(){
            this.getData();
        },
        methods: {
           //获取动态数据
            getData(){
                const t = this;
                if (t.fieldsDs) {
                    _TY_Tool.getDSData(t.fieldsDs, _TY_Tool.buildTplParams(t), function (map) {
                        map.forEach((item,key)=>{
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
                            t.realItems = t.transferData(_list);
                        })
                    }, function (code, msg) {
                    });
                }
            }, 
            //幻灯片切换
            change(...params){
                this.$emit("change",params,this);
            },
            //图片点击
            itemClick(...params){
                this.$emit("click",params,this);
            },
            //转换DS返回的数据
            transferData(data){
                const t = this;
                const srcKey = t.valueKey["src"];
                const textKey = t.valueKey["text"];
                const dataString = JSON.stringify(data);
                let newString = srcKey?dataString.replace(new RegExp(srcKey,'g'),"src"):dataString;
                newString = textKey?newString.replace(new RegExp(textKey,'g'),"text"):newString;
                const newData = JSON.parse(newString);
                return newData;
            },
        }
    }
</script>

<style lang="less">
    .bb-carousel{
        .bb-carousel-item{
            display:block;
            max-height:100%;
            max-width:100%;
        }
        .verticle-center{
            position:absolute;
            margin: auto;
            top:0;
            bottom:0;
        }
        .align-center{
            position:absolute;
            margin: auto;
            left:0;
            right:0;
        }
    }
</style>