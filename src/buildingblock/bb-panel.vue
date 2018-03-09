<template>
    <el-card :class="panelClass" :style="fullScreenStyle" :ref="realuuid">
        <div slot="header">
            <span>卡片名称</span>
            <el-button style="float: right; padding: 3px 0" type="text" :icon="fullScreenIcon" @click="toggleScreen"></el-button>
        </div>
        <div class="panelContent">
            <bb-layout-seriation :content="content" :ref="realuuid + '_content'"></bb-layout-seriation>
        </div>
    </el-card>
</template>
<script>
    export default {
        name: 'bb-panel',
        props: {
            /*面板标题
                layoutObject:{
                    uuid:'', //唯一标识
                    title:'',//标题
                    background:'', //背景色
                    transparency:0, //透明度
                    zoomType:'fullScreen'  fullScreen,middleScreen
                },
            */
            layoutObject:{
                type:Object,
                default:function(){
                    return {
                        uuid:_TY_Tool.uuid(), //唯一标识
                        title:'面板',//标题
                        background:'rgba(255,255,255, 0.8)', //背景色
                        transparency:1, //透明度
                        zoomType:'fullScreen'
                    }
                }
            },
            /*
                content:面板静态积木数据,
                content:[{                      //页面内容
                        uuid:'',
                        alias:'',                   //积木别名
                        aliasName:'',               //中文名称
                        attributes:{
                        },              //积木属性
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
                            sort:0,                 //排序 顺序排列布局下有效
                            bgColor:"",             //背景颜色
                            rotate:0,               //旋转
                            transparency:0,         //透明度
                            border:{                //边框
                                style:"",           //边框样式
                                color:"",           //边框颜色
                                size:"",            //边框尺寸
                                radius:"",          //边框弧度
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
            */
            content:{
                type:Array
            }
        },
        data() {
            return {
                //当前积木的标识 供积木选择器使用
                realuuid:this.layoutObject?this.layoutObject.uuid : _TY_Tool.uuid(),
                panelClass:'box-card',
                //面板当前的是否是全屏
                fullScreen:false,
                fullScreenStyle:'',
                fullScreenIcon:'ty-icon_faqi1'
            }
        },
        watch: {

        },
        computed:{

        },
        created: function () {
        },
        mounted:function(){
        },
        methods: {
            //收缩放大面板 
            toggleScreen:function(){
                const t = this;
                //收缩放大 事件
                t.$emit('click');
                if(t.fullScreen){
                    t.panelClass = "box-card normalScreen";
                    t.fullScreenIcon = 'ty-icon_faqi1';
                    t.fullScreenStyle = '';
                    t.fullScreen = false;
                }else{
                    t.fullScreenStyle = `background:${t.layoutObject.background};opacity:${t.layoutObject.transparency}`;
                    t.fullScreenIcon = 'ty-wenjuan_danhang';
                    switch(t.layoutObject.zoomType){
                        case 'fullScreen':   
                            t.panelClass = "box-card fullScreen";
                            break;
                        case 'middleScreen':
                            t.panelClass = "box-card middleScreen";
                            break;
                        default:
                            t.panelClass = "box-card fullScreen";
                            break;
                    }
                    t.fullScreen = true;
                }
            },
            //容器类积木获取子积木
            loadChildBB(){
                let t=this;
                return _TY_Tool.loadChildBB(t);                
            }
        }
    }
</script>
<style lang="less">
    .normalScreen{
        animation:fadeIn 0.5s;
    }
    .panelContent{
        overflow-y: auto;
    }
    .fullScreen{
        position: fixed;
        top: 0%;
        left: 0%;
        width: 100%;
        height: 100%;
        z-index: 2;
        animation:zoomIn 0.2s;
        overflow-y: auto;
        .panelContent{
            height: calc(~'100vh - 100px');
        }
    }
    .middleScreen{
        position: fixed;
        top: 25%;
        left: 25%;
        width: 50%;
        height: 50%;
        z-index: 2;
        animation:zoomIn 0.2s;
        overflow-y: auto;
        .panelContent{
            height: calc(~'50vh - 100px');
        }
    }

</style>