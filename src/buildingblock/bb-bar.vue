<template>
    <div class="bb-bar" :style="{'background-image':realBasicConfig.backgroundColor,color:realBasicConfig.fontColor,height:realBasicConfig.height,'line-height':realBasicConfig.height}">
        <div class="bb-bar-left">
            <bb-button :button="logoButton" :style="{height:'100%',width:realBasicConfig.logoWidth}" class="bb-bar-logo">
                <img v-if="!logoButton.icon" :src="realBasicConfig.logoUrl" alt=""> 
            </bb-button>   
            <bb-read-bb class="bb-list" :fields="realFieldsLeft"></bb-read-bb>
        </div>
        <div class="bb-bar-middle">
            <bb-read-bb class="bb-list" :fields="realFieldsMiddle"></bb-read-bb>
        </div>
        <div class="bb-bar-right">
            <bb-read-bb class="bb-list" :fields="realFieldsRight"></bb-read-bb>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'bb-bar',
        props: {
            /*
                basicConfig 样式配置
                {
                    logoUrl:'logo图片地址',  logo的图表的和图片互斥 都配置时 优先显示图标
                    logoHref:'点击跳转地址'
                    backgroundColor:'':'', 背景色
                    height:'', bar高度
                    logoWidth:'', logo宽度
                    fontColor:'', 标题字体颜色
                    fontSize:'',    标题字体大小
                }
            */
            basicConfig:{
                type:Object,
                default:function(){
                    return{
                        logoIcon:'ty-icon_M_b ty-font',
                        logoUrl:'',
                        logoHref:'',
                        backgroundColor:'-webkit-linear-gradient(0deg, #1E90FF,#104E8B)',
                        logoWidth:'120px',
                        height:'50px',
                        fontColor:'#ffffff',
                        fontSize:'30px',
                    }
                }
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
                realBasicConfig:this.basicConfig,
                realFieldsLeft:this.bbFieldsLeft,
                realFieldsMiddle:this.bbFieldsMiddle,
                realFieldsRight:this.bbFieldsRight,
                //logo 点击后的跳转地址
                logoButton:{
                    type:'text',
                    action:'url',
                    url:this.basicConfig.logoHref,
                    icon:this.basicConfig.logoIcon,
                    color:this.basicConfig.fontColor,
                    fontSize:this.basicConfig.fontSize,
                }
            }
        },
        watch: {
        },
        created: function () {
        },
        mounted:function(){
        },
        methods: {
        }
    }
</script>
<style lang='less'>
    .bb-bar{
        height: 50px;
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