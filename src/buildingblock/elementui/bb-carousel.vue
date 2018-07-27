<template>
    <el-carousel 
        :type="realOption.type"
        :height="realOption.height"
        :interval="realOption.interval"
        :trigger="realOption.trigger"
        :arrow="realOption.arrow"
        :initial-index="realOption.initialIndex"
        :indicator-position="realOption.indicatorPosition" 
        @change="change">
        <el-carousel-item v-for="(item,key) in realItems" :key="key" :name="item.text" :label="item.text">
            <img :src="item.src" alt="item.text" @click="itemClick">
        </el-carousel-item>
    </el-carousel>
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
                        map.forEach((val,key)=>{
                            t.realItems = val.value
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
            }
        }
    }
</script>

<style scoped>
   
</style>