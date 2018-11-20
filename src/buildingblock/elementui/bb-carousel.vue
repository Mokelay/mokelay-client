<template>
    <div :class="{'show_thumb':showThumb}">
        <el-carousel
            ref="bb-carousel"
            class="bb-carousel"
            :type="realOption.type"
            :height="realOption.height"
            :autoplay="realOption.autoplay"
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
        <div class="bb_thumb">
            <ul class="bb_thumb_ul clearfix" v-if="showThumb">
                <li class="" v-for="(item,key) in realItems" @click="thumbClick(item,key)" :key="key">
                    <img :src="item.src" alt="item.text"/>
                </li>
            </ul>
        </div>

    </div>
</template>

<script>
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
            },
            //是否显示缩略图
            showThumb:{
                type:Boolean,
                default:false
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
            const t=this;
            this.getData();
            //如果是显示缩略图，则自动轮播
            if(t.showThumb){
                let autoIndex = 0;
                //3s轮播一次
                this.time = window.setInterval(()=>{
                    if(t.realItems&&t.realItems.length>0){
                        const len = t.realItems.length;
                        if(autoIndex>=len-1){
                            autoIndex = 0;
                        }else{
                            autoIndex++;
                        }
                        const car = t.$refs['bb-carousel'];
                        //切换幻灯片
                        car.setActiveItem(autoIndex);
                    }
                },t.realOption.interval||3000);
            }
        },
        //销毁前的处理逻辑
        beforeDestroy:function(){
            const t=this;
            if(t.time){
                window.clearInterval(t.time);
            }
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
            //缩略图点击事件
            thumbClick:function(item,index){
                const t=this;
                const car = t.$refs['bb-carousel'];
                //切换幻灯片
                car.setActiveItem(index);
            }
        }
    }
</script>

<style scoped>
    .bb_thumb{
        width: 100%;
        overflow-x: auto;
    }
    .bb_thumb_ul{
        width: 2000px;
    }
    .bb_thumb .bb_thumb_ul li{
        width: 114px;
        float: left;
    }
</style>
<style lang="less">
    .show_thumb .el-carousel__indicators.el-carousel__indicators--labels{
        display: none;
    }

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