<template>
    <div class="bb-photo-single" :style="realStyle" v-tap="tap">
        <img :src="valueBase" alt="">
    </div>
</template>
<script>
    export default {
        name: 'bb-photo-single',
        props: {
            //src 图片地址
            src:{
                type:String,
            },
            //srcDs 动态图片地址
            srcDs:{
                type:Object
            },
            /*
                defaultValTpl 图片地址支持模板
            */
            defaultValTpl:{
                type:[String,Number,Boolean]
            },
            /*     
                styleConfig 图片样式
                {   
                    height:'auto',  图片高度
                    width:'100%',   图片宽度
                    transparency:0, 透明度
                    borderRadian:0, 圆角
                    shadowSize:'100px' 阴影
                }
            */
            styleConfig:{
                type:Object,
                default:function(){
                    return {
                        height:'auto',
                        width:'100%',
                        transparency:0,
                        borderRadian:0,
                        shadowSize:'100px'
                    }
                }
            }
        },
        data() {
            return {
                valueBase:this.src,
                realStyle:null
            }
        },
        computed:{
        },
        watch: {
        },
        created: function () {
        },
        mounted:function(){
            let t=this;
            t.setStyle();
            //渲染默认值模板
            _TY_Tool.buildDefaultValTpl(t,"valueBase");
            t.getData();
        },
        methods: {
            //获取图片地址
            getData: function () {
                const t = this;
                if (t.srcDs) {
                    _TY_Tool.getDSData(t.srcDs, _TY_Tool.buildTplParams(t), function (map) {
                        map.forEach((val,key)=>{
                            const dataKey = val.dataKey
                            t.valueBase = val.value;
                        })
                    }, function (code, msg) {
                    });
                }
            },
            //初始化样式设置
            setStyle:function(){
                const t = this;
                t.realStyle = {
                    height:t.styleConfig.height,
                    width:t.styleConfig.width,
                    opacity: t.styleConfig.transparency,
                    'border-radius': t.styleConfig.borderRadian,
                    'box-shadow':'black 0px 0px ' + t.styleConfig.shadowSize,
                }
            },
            tap:function(){
                const t = this;
                //图片点击事件
                t.$emit('click',t);
            }
        }
    }
</script>
<style lang='less'>
    .bb-photo-single{
        overflow:hidden;
        margin: auto;
        img{
            width: 100%;
            height: 100%;
        }
        img[src=""]{
            opacity: 0;
        }
    }
</style>
