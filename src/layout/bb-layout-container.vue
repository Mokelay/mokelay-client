<template>
    <div class="bb-layout-container">
        <!-- 上下布局 -->
        <el-container v-if="realLayout == 'h-f'">
            <el-header :style="{background:realBgColor.header}">
                <bb-layout-seriation :content="realHeader" :horizontal="true"></bb-layout-seriation>
            </el-header>
            <el-main :style="{background:realBgColor.main}">
                <bb-layout-seriation :content="realMain"></bb-layout-seriation>
            </el-main>
        </el-container>
        <!-- 上中下布局 -->
        <el-container v-if="realLayout == 'h-m-f'">
            <el-header :style="{background:realBgColor.header}">
                <bb-layout-seriation :content="realHeader" :horizontal="true"></bb-layout-seriation>
            </el-header>
            <el-main :style="{background:realBgColor.main}">
                <bb-layout-seriation :content="realMain"></bb-layout-seriation>
            </el-main>
            <el-footer>
                <bb-layout-seriation :content="realFooter" :horizontal="true"></bb-layout-seriation>
            </el-footer>
        </el-container>
        <!-- 左右布局 -->
        <el-container v-if="realLayout == 'r-m'">
            <el-aside width="20%" :style="{background:realBgColor.leftAside}">
                <bb-layout-seriation :content="realLeftAside"></bb-layout-seriation>
            </el-aside>
            <el-main :style="{background:realBgColor.main}">
                <bb-layout-seriation :content="realMain"></bb-layout-seriation>
            </el-main>
        </el-container>
        <!-- 上下左右布局 -->
        <el-container v-if="realLayout == 'h-l-m'">
            <el-header :style="{background:realBgColor.header}">
                <bb-layout-seriation :content="realHeader" :horizontal="true"></bb-layout-seriation>
            </el-header>
            <el-container>
                <el-aside width="20%" :style="{background:realBgColor.leftAside}">
                    <bb-layout-seriation :content="realLeftAside"></bb-layout-seriation>
                </el-aside>
                <el-main :style="{background:realBgColor.main}">
                    <bb-layout-seriation :content="realMain"></bb-layout-seriation>
                </el-main>
            </el-container>
        </el-container>
        <!-- 上下左右上下布局 -->
        <el-container v-if="realLayout == 'h-l-m-f'">
            <el-header :style="{background:realBgColor.header}">
                <bb-layout-seriation :content="realHeader" :horizontal="true"></bb-layout-seriation>
            </el-header>
            <el-container>
                <el-aside width="20%" :style="{background:realBgColor.leftAside}">
                    <bb-layout-seriation :content="realLeftAside"></bb-layout-seriation>
                </el-aside>
                <el-container>
                    <el-main :style="{background:realBgColor.main}">
                        <bb-layout-seriation :content="realMain"></bb-layout-seriation>
                    </el-main>
                    <el-footer>
                        <bb-layout-seriation :content="realFooter" :horizontal="true"></bb-layout-seriation>
                    </el-footer>
                </el-container>
            </el-container>
        </el-container>
        <!-- 左右上下布局 -->
        <el-container v-if="realLayout == 'l-h-m'">
            <el-aside width="20%" :style="{background:realBgColor.leftAside}">
                <bb-layout-seriation :content="realLeftAside"></bb-layout-seriation>
            </el-aside>
            <el-container>
                <el-header :style="{background:realBgColor.header}">
                    <bb-layout-seriation :content="realHeader" :horizontal="true"></bb-layout-seriation>
                </el-header>
                <el-main :style="{background:realBgColor.main}">
                    <bb-layout-seriation :content="realMain"></bb-layout-seriation>
                </el-main>
            </el-container>
        </el-container>
        <!-- 左右上中下布局 -->
        <el-container v-if="realLayout == 'l-h-m-f'">
            <el-aside width="20%" :style="{background:realBgColor.leftAside}">
                <bb-layout-seriation :content="realLeftAside"></bb-layout-seriation>
            </el-aside>
            <el-container>
                <el-header :style="{background:realBgColor.header}">
                    <bb-layout-seriation :content="realHeader" :horizontal="true"></bb-layout-seriation>
                </el-header>
                <el-main :style="{background:realBgColor.main}">
                    <bb-layout-seriation :content="realMain"></bb-layout-seriation>
                </el-main>
                <el-footer :style="{background:realBgColor.footer}">
                    <bb-layout-seriation :content="realFooter" :horizontal="true"></bb-layout-seriation>
                </el-footer>
            </el-container>
        </el-container>
        <!-- 上下左中右布局 -->
        <el-container v-if="realLayout == 'h-l-m-r'">
            <el-header :style="{background:realBgColor.header}">
                <bb-layout-seriation :content="realHeader" :horizontal="true"></bb-layout-seriation>
            </el-header>
            <el-container>
                <el-aside width="20%" :style="{background:realBgColor.leftAside}">
                    <bb-layout-seriation :content="realLeftAside"></bb-layout-seriation>
                </el-aside>
                <el-main :style="{background:realBgColor.main}">
                    <bb-layout-seriation :content="realMain"></bb-layout-seriation>
                </el-main>
                <el-aside width="20%" :style="{background:realBgColor.rightAside}">
                    <bb-layout-seriation :content="realRightAside"></bb-layout-seriation>
                </el-aside>
            </el-container>
        </el-container>
    </div> 
</template>
<script>
    export default {
        name: 'bb-layout-container',
        props: {
            /*
                layout 布局样式配置
                //通过bb-portal-item-list 图文入口 展示选项 
                h-f:'上下布局',
                h-m-f:'上中下布局',
                r-m:'左右布局',
                h-l-m:'上下左右布局',
                h-l-m-f:'上下左右上下布局',
                l-h-m:'左右上下布局',
                l-h-m-f:'左右上中下布局'                
                h-l-m-r:'上下左中右布局'
                {
                    type:'', 
                    bgColor:{}//布局背景色
                }               
            */
            layout:{
                type:Object,
                default:function(){
                    return {
                        type:'h-l-m-r',
                        bgColor:{
                            header:"#B3C0D1",
                            leftAside:"#D3DCE6",
                            main:"#E9EEF3",
                            rightAside:"#D3DCE6",
                            footer:"#B3C0D1"
                        }
                    }
                }
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
                    return[{uuid:'rightAside',alias:'bb-words',aliasName:'',attributes:{value:'rightAside',textAlign:'center',lineHeight:'60px'},animation:[],interactives:[]}]
                }
            },
            /*main 头部积木配置*/
            main:{
                type:Array,
                default:function(){
                    return[{uuid:'main',alias:'bb-words',aliasName:'',attributes:{value:'main',textAlign:'center',lineHeight:'60px'},animation:[],interactives:[]}]
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
                返回数据包含 header leftAside rightAside main footer     
            */
            containerDs:{
                type:Object
            }

        },
        data() {
            return {
                realLayout:this.layout.type,
                realBgColor:this.layout.bgColor,
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
            },
            loadChildBB(){
                let t=this;
                return _TY_Tool.loadChildBB(t);                
            }
        }
    }
</script>
<style lang='less' scoped>
</style>