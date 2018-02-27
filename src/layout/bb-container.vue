<template>
    <div class="bb-container template">
        <!-- 上下布局 -->
        <el-container v-if="realLayout == 'layout1'">
            <el-header>
                <bb-layout-seriation :content="realHeader" :horizontal="true"></bb-layout-seriation>
            </el-header>
            <el-main>
                <bb-layout-seriation :content="realMain"></bb-layout-seriation>
            </el-main>
        </el-container>
        <!-- 上中下布局 -->
        <el-container v-if="realLayout == 'layout2'">
            <el-header>
                <bb-layout-seriation :content="realHeader" :horizontal="true"></bb-layout-seriation>
            </el-header>
            <el-main>
                <bb-layout-seriation :content="realMain"></bb-layout-seriation>
            </el-main>
            <el-footer>
                <bb-layout-seriation :content="realFooter" :horizontal="true"></bb-layout-seriation>
            </el-footer>
        </el-container>
        <!-- 左右布局 -->
        <el-container v-if="realLayout == 'layout3'">
            <el-aside width="20%">
                <bb-layout-seriation :content="realLeftAside"></bb-layout-seriation>
            </el-aside>
            <el-main>
                <bb-layout-seriation :content="realMain"></bb-layout-seriation>
            </el-main>
        </el-container>
        <!-- 上下左右布局 -->
        <el-container v-if="realLayout == 'layout4'">
            <el-header>
                <bb-layout-seriation :content="realHeader" :horizontal="true"></bb-layout-seriation>
            </el-header>
            <el-container>
                <el-aside width="20%">
                    <bb-layout-seriation :content="realLeftAside"></bb-layout-seriation>
                </el-aside>
                <el-main>
                    <bb-layout-seriation :content="realMain"></bb-layout-seriation>
                </el-main>
            </el-container>
        </el-container>
        <!-- 上下左右上下布局 -->
        <el-container v-if="realLayout == 'layout5'">
            <el-header>
                <bb-layout-seriation :content="realHeader" :horizontal="true"></bb-layout-seriation>
            </el-header>
            <el-container>
                <el-aside width="20%">
                    <bb-layout-seriation :content="realLeftAside"></bb-layout-seriation>
                </el-aside>
                <el-container>
                    <el-main>
                        <bb-layout-seriation :content="realMain"></bb-layout-seriation>
                    </el-main>
                    <el-footer>
                        <bb-layout-seriation :content="realFooter" :horizontal="true"></bb-layout-seriation>
                    </el-footer>
                </el-container>
            </el-container>
        </el-container>
        <!-- 左右上下布局 -->
        <el-container v-if="realLayout == 'layout6'">
            <el-aside width="20%">
                <bb-layout-seriation :content="realLeftAside"></bb-layout-seriation>
            </el-aside>
            <el-container>
                <el-header>
                    <bb-layout-seriation :content="realHeader" :horizontal="true"></bb-layout-seriation>
                </el-header>
                <el-main>
                    <bb-layout-seriation :content="realMain"></bb-layout-seriation>
                </el-main>
            </el-container>
        </el-container>
        <!-- 左右上中下布局 -->
        <el-container v-if="realLayout == 'layout7'">
            <el-aside width="20%">
                <bb-layout-seriation :content="realLeftAside"></bb-layout-seriation>
            </el-aside>
            <el-container>
                <el-header>
                    <bb-layout-seriation :content="realHeader" :horizontal="true"></bb-layout-seriation>
                </el-header>
                <el-main>
                    <bb-layout-seriation :content="realMain"></bb-layout-seriation>
                </el-main>
                <el-footer>
                    <bb-layout-seriation :content="realFooter" :horizontal="true"></bb-layout-seriation>
                </el-footer>
            </el-container>
        </el-container>
        <!-- 上下左中右布局 -->
        <el-container v-if="realLayout == 'layout8'">
            <el-header>
                <bb-layout-seriation :content="realHeader" :horizontal="true"></bb-layout-seriation>
            </el-header>
            <el-container>
                <el-aside width="20%">
                    <bb-layout-seriation :content="realLeftAside"></bb-layout-seriation>
                </el-aside>
                <el-main>
                    <bb-layout-seriation :content="realMain"></bb-layout-seriation>
                </el-main>
                <el-aside width="20%">
                    <bb-layout-seriation :content="realRightAside"></bb-layout-seriation>
                </el-aside>
            </el-container>
        </el-container>
    </div> 
</template>
<script>
    export default {
        name: 'bb-container',
        props: {
            /*
                layout 布局样式配置
                //通过bb-portal-item-list 图文入口 展示选项
                layout1:'上下布局',
                layout2:'上中下布局',
                layout3:'左右布局',
                layout4:'上下左右布局',
                layout5:'上下左右上下布局',
                layout6:'左右上下布局',
                layout7:'左右上中下布局'                
                layout8:'上下左中右布局'                
            */
            layout:{
                type:String,
                default:'layout8'
            },
            /*
                header leftAside rightAside main footer 头部积木静态数据配置
                    //积木数组
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
                            sort:0,                 //积木排序
                            bgColor:"",             //背景颜色
                            rotate:0,               //旋转
                            transparency:0,         //透明度
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
            */
            header:{
                type:Array,
                default:function(){
                    return[{uuid:'header',alias:'bb-words',aliasName:'',attributes:{value:'Header',textAlign:'center',lineHeight:'60px'},animation:[],interactives:[]}]
                }
            },
            /*leftAside 侧边栏积木配置*/
            leftAside:{
                type:Array,
                default:function(){
                    return[{uuid:'leftAside',alias:'bb-words',aliasName:'',attributes:{value:'LeftAside',textAlign:'center',lineHeight:'60px'},animation:[],interactives:[]}]
                }
            },
            /*rightAside 侧边栏积木配置*/
            rightAside:{
                type:Array,
                default:function(){
                    return[{uuid:'rightAside',alias:'bb-words',aliasName:'',attributes:{value:'RightAside',textAlign:'center',lineHeight:'60px'},animation:[],interactives:[]}]
                }
            },
            /*main 头部积木配置*/
            main:{
                type:Array,
                default:function(){
                    return[{uuid:'main',alias:'bb-words',aliasName:'',attributes:{value:'Main',textAlign:'center',lineHeight:'60px'},animation:[],interactives:[]}]
                }
            },
            /*footer 底部积木配置*/
            footer:{
                type:Array,
                default:function(){
                    return[{uuid:'footer',alias:'bb-words',aliasName:'',attributes:{value:'Footer',textAlign:'center',lineHeight:'60px'},animation:[],interactives:[]}]
                }
            },
            /*
                containerDs 动态数据源配置 
                返回数据包含 header leftAside rightAside      
            */
            containerDs:{
                type:Object
            }
        },
        data() {
            return {
                realLayout:this.layout,
                realHeader:this.header,
                realLeftAside:this.leftAside,
                realRightAside:this.rightAside,
                realMain:this.main,
                realFooter:this.footer
            }
        },
        watch: {
        },
        created: function () {
        },
        mounted:function(){
            const t = this;
            t.getData();
        },
        methods: {
            //在支持静态和动态数据混合渲染
            //获取动态数据
            getData:function(){
                const t = this;
                if (t.containerDs) {
                    _TY_Tool.getDSData(t.containerDs, _TY_Tool.buildTplParams(t), function (map) {
                        map.forEach((val,key)=>{
                            t.realLayout = val.value.layout;
                            t.realHeader = val.value.header;
                            t.realLeftAside = val.value.leftAside;
                            t.realRightAside = val.value.rightAside;
                            t.realMain = val.value.main;
                            t.realFooter = val.value.footer;
                        })
                    }, function (code, msg) {
                    });
                }
            }
        }
    }
</script>
<style lang='less' scoped>
    .template{
        .el-header, .el-footer {
            background-color: #B3C0D1;
        }
        .el-aside {
            min-width:200px;
            background-color: #D3DCE6;
        }
        .el-main {
            background-color: #E9EEF3;
        }
    }
</style>