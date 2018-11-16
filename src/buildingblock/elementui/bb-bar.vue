<template>
    <div class="bb-bar-outer" :style="{'background':p_basicConfig.outerBgColor}">
        <div class="bb-bar" :style="{'background-image':p_basicConfig.backgroundColor,color:p_basicConfig.fontColor,height:p_basicConfig.height,width:p_basicConfig.width,'line-height':p_basicConfig.height}">
                <div class="bb-bar-left " :style="p_basicConfig.leftStyle">
                    <bb-button v-if="logoBtn" :button="p_logoButton" :style="{height:'100%',width:p_basicConfig.logoWidth,background:p_basicConfig.logoBackground}" class="bb-bar-logo">
                        <img v-if="!p_logoButton.icon" :src="p_basicConfig.logoUrl" alt=""> 
                    </bb-button>
                    <bb-button v-if="foldBtn" :button="p_foldButton" @click="foldClick"></bb-button>
                    <bb-read-bb class="bb-list" :fields="realFieldsLeft"></bb-read-bb>
                </div>
                <div class="bb-bar-middle " :style="p_basicConfig.middleStyle">
                    <bb-read-bb class="bb-list" :fields="realFieldsMiddle"></bb-read-bb>
                </div>
                <div class="bb-bar-right " :style="p_basicConfig.rightStyle">
                    <bb-read-bb class="bb-list" v-if="p_basicConfig.showBarRight" :fields="realFieldsRight"></bb-read-bb>
                </div>
        </div>
    </div>
</template>

<script>

    import bbbutton from './bb-button.vue';
    import bbreadbb from '../independent/bb-read-bb.vue';

    export default {
        name: 'bb-bar',
        components: {
            "bb-button":bbbutton,
            "bb-read-bb":bbreadbb
        },
        props: {
            /*
                basicConfig 样式配置
                {
                    logoIcon:'ty-icon_M_b ty-font',
                    logoMiniIcon:'ty-icon_M ty-font',
                    logoUrl:'logo图片地址',  logo的图表的和图片互斥 都配置时 优先显示图标
                    logoHref:'点击跳转地址'
                    outerBgColor:'#0091EA',//最外层的背景色
                    backgroundColor:'', 背景色
                    height:'', bar高度
                    width:'', bar宽度
                    logoWidth:'', logo宽度
                    logoBackground:'#0181D0 ',logo背景色
                    fontColor:'', 标题字体颜色
                    fontSize:'',    标题字体大小
                    showBarRight:true//是否显示右边组件s
                    middleStyle:{},//bar 的样式控制
                    rightStyle:{},
                    leftStyle:{}
                }
            */
            basicConfig:{
                type:Object,
                default:function(){
                    return{
                        logoIcon:'ty-icon_M_b ty-font',
                        logoMiniIcon:'ty-icon_M ty-font',
                        logoMiniWidth:'64px',
                        logoUrl:'',
                        logoHref:'',
                        outerBgColor:'#0091EA',
                        backgroundColor:'-webkit-linear-gradient(0deg, #1E90FF,#104E8B)',
                        logoWidth:'120px',
                        logoBackground:'',
                        width:'100%',
                        height:'50px',
                        fontColor:'#ffffff',
                        fontSize:'30px',
                        showBarRight:true,
                        middleStyle:{},
                        rightStyle:{},
                        leftStyle:{}
                    }
                }
            },
            //Logo按钮是否展示
            logoBtn:{
                type:Boolean,
                default:true
            },
            //是否显示折叠按钮
            foldBtn:{
                type:Boolean,
                default:false
            },
            /*
                bbFieldsLeft 左侧积木
                [{
                    et:'bb-button' || 'bb-dropdown'
                    etProps:{ //bb:logo
                        url:'logo图片地址',
                        href:'点击跳转地址'
                    }
                }]
            */
            bbFieldsLeft:{
                type:Array
            },
            /*
                bbFieldsMiddle 中间积木
                [{
                    et:'bb-button' || 'bb-dropdown'
                    etProps:{}
                }]
            */
            bbFieldsMiddle:{
                type:Array
            },
            /*
                bbFieldsRight 右侧积木
                [{
                    et:'bb-button' || 'bb-dropdown'
                    etProps:{}
                }]
            */
            bbFieldsRight:{
                type:Array
            },
           
        },
        data() {
            return {
                initconfig:{},//初始化的config配置，记录logo切换数据
                real_basicConfig:this.basicConfig,
                realFieldsLeft:this.bbFieldsLeft,
                realFieldsMiddle:this.bbFieldsMiddle,
                realFieldsRight:this.bbFieldsRight,
                //logo 点击后的跳转地址
                logoButton:{},
                //折叠按钮
                foldButton:{},
                folded:false//标志是否折叠了
            }
        },
        computed:{
           p_basicConfig(){
                return Object.assign({
                        logoIcon:'ty-icon_M_b ty-font',
                        logoMiniIcon:'ty-icon_M ty-font',
                        logoMiniWidth:'64px',
                        logoUrl:'',
                        logoHref:'/',
                        outerBgColor:'#0091EA',
                        backgroundColor:'-webkit-linear-gradient(0deg, #1E90FF,#104E8B)',
                        logoWidth:'120px',
                        logoBackground:'',
                        width:'100%',
                        height:'52px',
                        fontColor:'#ffffff',
                        fontSize:'30px',
                        showBarRight:true//是否显示右边组件s
                    },this.basicConfig,this.real_basicConfig);
           },
           p_logoButton(){
                return Object.assign({
                    type:'text',
                    action:'url',
                    url:this.p_basicConfig.logoHref,
                    icon:this.p_basicConfig.logoIcon,
                    color:this.p_basicConfig.fontColor,
                    fontSize:this.p_basicConfig.fontSize,
                },this.logoButton);
           },
           p_foldButton(){
                return Object.assign({
                    type:'text',
                    icon:"ty-icon_libiao ty-font",
                    color:this.p_basicConfig.fontColor,
                    fontSize:"25px",
                },this.foldButton);
           }

        },
        watch: {
        },
        created: function () {
        },
        mounted:function(){
            let t=this;
            //初始化初始值
            t.initconfig = _TY_Tool.deepClone(t.p_basicConfig);
        },
        methods: {
            //折叠按钮点击事件
            foldClick:function(...args){
                let t=this;
                if(t.folded){
                    t.folded = false;
                    t.logoButton.icon=t.initconfig.logoIcon;
                    t.real_basicConfig.logoWidth=t.initconfig.logoWidth;
                }else{
                    t.folded = true;
                    t.logoButton.icon=t.initconfig.logoMiniIcon;
                    t.real_basicConfig.logoWidth=t.initconfig.logoMiniWidth;
                }
                //方便外面交互
                t.$emit("fold",t.folded,args,t);
            }
        }
    }
</script>
<style lang='less'>
    .clearfix:after {
      visibility: hidden;
      display: block;
      font-size: 0;
      content: " ";
      clear: both;
      height: 0;
    }
    .bb-bar-outer{
        height: 52px;
        width:100%;
    }
    .bb-bar{
        margin:0 auto;
        height: 52px;
        display: flex;
        &>div{
            display: inline-block;
            flex: 1;
        }
        .bb-bar-left{
            text-align: left;
            .bb-list{
                justify-content: flex-end;
            }
            &>div,button{
                display: inline-block;
                float: left;
            }
            .bb-bar-logo{
                display: inline-block;
                float: left;
                border-radius:0;
                margin:0 10px 0 0;
                padding: 0;
                border: none;
                img{
                    height: 100%;
                }
            }
        }
        .bb-list{
            display: flex;
            position: relative;
            height: 100%;
            align-items: center;
            justify-content: center;
            &>div{
                margin: 0 5px;
            }
            &>button{
                margin: 0 5px;
            }
        }
        .bb-bar-middle{
            justify-content: center;
        }
        .bb-bar-right{
            padding-right: 10px;
            text-align: right;
            .bb-list{
                justify-content: flex-end;
            }
            
        }
    }
</style>