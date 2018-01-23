<template>
    <div :class="'bb-portal-item-list ' + styleConfig.transitionType">
        <div class="grid-item" v-for="(field,key) in realFields">
            <bb-button :button="field.actionConfig" @button-finish='buttonFinish' :style="{width:styleConfig.imgWidth}">
                <!-- 图片或者图标 -->
                <div class="item-container" :style="{height:styleConfig.imgHeight}">
                    <i v-if="field.icon" class="ty-flower-off ty-font" :style="{'line-height':styleConfig.imgHeight,'font-size':styleConfig.imgWidth}"></i>
                    <img v-else  class="item-image" :src="field.src" alt="">
                </div>
                <!-- 主标题 -->
                <div class="item-title" :style="{color:styleConfig.fontColor,'font-size':styleConfig.fontSize}">{{field.title}}</div>
                <!-- 副标题 -->
                <div class="item-subtitle">{{field.subtitle}}</div>
            </bb-button>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'bb-portal-item-list',
        props: {
            /*
                fields 静态数据源
                [{
                    icon:'ty-flower-off ty-font',  //图标名称 同时存在 icon和 src 默认优先显示图标
                    :'', 图片地址
                    title:'',标题
                    subtitle:'',副标题
                    actionConfig:{  //点击后执行的动作
                        action: url || execute-ds || dialog-page || code || buzz
                        url:''  //action: url 
                        urlType:'default' || 'openWindow'
                        ds:{}  //action: execute-ds
                        dialogPage:'' //action: dialog-page
                        method:fn //action: code
                        buzz:'' //action: buzz
                    }
                }]
            */
            fields:{
                type:Array
            },
            /*
                fieldsDs 动态数据源
            */
            fieldsDs:{
                type:[Object,String]
            },
            /*
                styleConfig 样式配置
                {
                    transitionType:'portal-move-up' || 'portal-heighlight-primary' || portal-heighlight-white
                    imgWidth:'', 图片宽度
                    imgHeight:'', 图片高度
                    fontColor:'', 标题字体颜色
                    fontSize:'',    标题字体大小
                }
            */
            styleConfig:{
                type:Object,
                default:function(){
                    return {
                        transitionType:'portal-move-up',
                        imgWidth:'118px',
                        imgHeight:'118px',
                        fontColor:'#666666',
                        fontSize:'14px'
                    }
                }
            }
        },
        data() {
            return {
                realFields:this.fields
            }
        },
        watch: {
        },
        created: function () {
            const t = this;
            if(t.realFields){
                t.setRealFields();
            }
            t.getData();
        },
        mounted:function(){
        },
        methods: {
            //事件 button-finish  点击图片由bb-button 触发触发
            setRealFields:function(){
                const t = this;
                const newFields = t.realFields;
                t.realFields.forEach((val,key)=>{
                    val.actionConfig.type = 'text'
                });
            },
            //传递bb-button返回的 button-finish 事件
            buttonFinish:function(button, valueobj){
                const t = this;
                t.$emit('button-finish',button,valueobj);
            },
            //获取动态数据
            getData:function(){
                const t = this;
                if (t.fieldsDs) {
                    _TY_Tool.getDSData(t.fieldsDs, _TY_Tool.buildTplParams(t), function (map) {
                        map.forEach((val,key)=>{
                            const dataKey = val.dataKey
                            t.realFields = val.value.list;
                            t.setRealFields();
                        })
                    }, function (code, msg) {
                    });
                }
            }
        }
    }
</script>
<style lang='less' scoped>
    .bb-portal-item-list{
        box-sizing: border-box;
        position: relative;
        margin: auto;
        padding: 27px 0 90px;
        display: flex;
        flex-wrap: wrap;
        .grid-item{
            .item-container{
                box-sizing: border-box;
            }
        }
    }
    //默认样式  入口上移动画
    .portal-move-up{
        .grid-item{
            margin: 0 8px 20px;
            text-align: center;
            position: relative;
            .item-container{
                position: relative;
                bottom: 0;
                width: 100%;
                height: 100%;
                border-radius: 6px;
                box-shadow: 0 4px 8px 0 rgba(0,0,0,.06);
                overflow: visible;
                cursor: pointer;
                transition: bottom .3s ease;
                background: #fff;
                .item-image{
                    width: 100%;
                    height: 100%;
                    border-radius: 6px;
                    box-shadow: 0 4px 8px 0 rgba(0,0,0,.06);
                }
                i{  
                    font-size: 80px;
                    color: #90a0ac; 
                    line-height: 118px;
                    text-indent: -2px;
                }
            }
            .item-title{
                width: 100%;
                font-size: 14px;
                color: #434343;
                margin: 16px 0 4px;
                cursor: pointer;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
                transition: margin .3s ease;
            }
            .item-subtitle{
                font-size: 12px;
                color: #90a0ac;
                width: 100%;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
            }
            button{
                box-sizing: content-box;
                display: block;
                margin: 0;
                padding:0;
            }
            &:hover{
                .item-container{
                    bottom:10px;
                }
            }
        }
    }
    //高亮样式
    .portal-heighlight-primary,.portal-heighlight-white{
        padding: 20px 15px 0;
        font-size: 12px;
        .grid-item{
            display: inline-block;
            text-align: center;
            cursor: pointer;
            margin-right: 23px;
            margin-bottom: 23px;
            .item-container{
                width: 100%;
                height: 100%;
                position: relative;
                overflow:hidden;
                i{
                    min-width: 100%;
                    text-indent: -2px;
                }
            }
            .item-title{
                white-space: normal;
                margin-top: 4px;
            }
            .item-subtitle{
                width: 100%;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
            }
            .item-container,.item-title,.item-subtitle{
                -webkit-transition: all 0.3s;
                transition: all 0.3s;
            }
            button{
                box-sizing: content-box;
                color: #90a0ac;
                max-width: 100%;
                font-size: 12px;
                margin: 0;
                padding:0;
            }
        }
    }
    //高亮主题色 边框和字体高亮
    .portal-heighlight-primary{
        color: #90a0ac;
        .grid-item{
            .item-container{
                border:2px solid #ffffff;
                font-size: 35px;
                color: #90a0ac; 
            }
            &:hover{
                .item-container{
                    border:2px solid #0091ea;
                    color: #0091ea;
                }
                .item-title,.item-subtitle{
                    color:#0091ea !important;
                }
            }
        }
    }
    //高亮主白色 边框和字体高亮
    .portal-heighlight-white{
        //color: #0091ea;
        .grid-item{
            .item-container{
                border:2px solid #0091ea;
                font-size: 35px;
                color: #0091ea; 
            }
            &:hover{
                .item-container{
                    border:2px solid #ffffff;
                    color: #ffffff;
                }
                .item-title,.item-subtitle{
                    color:#ffffff !important;
                }
            }
        }  
    }
</style>