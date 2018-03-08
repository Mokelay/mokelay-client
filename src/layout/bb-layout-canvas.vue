<template>
    <div class="container">
        <div class="canvas" style=""></div>
    </div>
</template>
<script>
/**
1. 特效
2. 背景
<canvas :value="{
    layoutObject:{
        uuid:'',
        title:'',                   //标题
        shell:true ,                //手机/PC外壳
        bgMusic:"",                 //背景音乐
        grid:{                      //网格配置
            switch:true|false,      //开关
            color:"",               //颜色
            reference:true|false,   //智能参考
            adsorbent:true|false    //自动吸附
        }
    },
    ds:["api-1","api-2"],           //数据源
    content:[{                      //页面内容
        uuid:'',
        alias:'',                   //积木别名
        aliasName:'',               //中文名称
        attributes:{},              //积木属性
        animation:[{                //动画
            style:"",               //方式
            time:0,                 //时间
            delay:0,                //延迟时间
            playNum:1               //播放次数
            loop:true|false,        //循环
            direction:""            //方向
        }],
        interactives:[{             //触发交互
            uuid:'',
            fromContentEvent:'',    //触发积木的事件,fromContentUUID为当前content的UUID
            executeType:'',         //执行类型(预定义方法 trigger_method,
                                    //自定义方法 custom_script,
                                    //容器类方法 container_method)
            executeScript:'',       //执行脚本 executeType = custom_script
            executeContentUUID:'',  //执行积木的UUID executeType = trigger_method
            executeContentMethodName:'',
                                    //执行积木的方法
            containerMethodName:''  //容器方法 executeType = container_method
        }],
        layout:{                    //积木布局
            bgColor:"",             //背景颜色
            rotate:0,               //旋转
            transparency:0,         //透明度
            zIndex:0,               //层级
            size:{width:0,height:0},//大小
            position:{x:0,y:0},     //位置
            border:{                //边框
                style:"",           //边框样式
                color:"",           //边框颜色
                size:"",            //边框尺寸
                radian:"",          //边框弧度
                margin:""           //边距
            },
            shadow:{                //阴影
                color:"",           //阴影颜色
                size:"",            //阴影大小
                direction:'',       //阴影方向
                vague:''            //阴影模糊
            }
        }
    }]
}"></canvas>
**/
    export default {
        name: 'bb-layout-canvas',
        props: {
            //画布宽度
            width:{
                type:Number,
                default:320
            },
            //画布高度
            height:{
                type:Number,
                default:480
            },
            value:{
                type:Object,
                default:function(){
                    return {
                        layoutObject:{},
                        content:[],
                        interactives:[]
                    }
                }
            }
        },
        data() {
            return{
            }
        },
        methods: {
        },
        components:{
        }
    }
</script>
<style lang="less">
</style>