<template>
    <div class="bb-css-editor">
        <bb-form v-if="!isButton" size="mini" v-model="valueBase" ref="layoutContent" :content="layoutContent" @commit="change"></bb-form>
        <bb-button-form v-if="isButton" size="mini" v-model="valueBase" ref="layoutContent" :content="layoutContent" @commit="change"></bb-button-form>
    </div>
    
</template>

<script>
    export default {
        name: 'bb-css-editor',
        props: {
            /*支持v-model 
                value:{//积木布局
                    display:"fixed block inline inline-block absolut none"
                    positionType:"absolute relative fixed inherit"  //展示类型
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
                        margin:""           //外边距
                        padding:""          //内边距
                    },
                    shadow:{                //阴影
                        color:"",           //阴影颜色
                        size:"",            //阴影大小
                        direction:'',       //阴影方向
                        vague:''            //阴影模糊
                    },
                    font:{                  //阴影
                        family:"",           //阴影颜色
                        size:"",            //阴影大小
                        color:'',       //阴影方向
                        align:''            //阴影模糊
                    }
                }
            */
            value:{
                type:[Object,String],
                default:function(){
                    return { 
                    }
                }
            },
            isButton:{
                type:Boolean,
                default:false
            }
        },
        data() {

            return {
                valueBase:typeof(this.value)==='string'?JSON.parse(this.value):this.value,
                layoutContent:null
            }
        },
        watch: {
            value(val){
                this.valueBase = val;
            }
        },
        created: function () {
            this.setEditor();
        },
        mounted:function(){

        },
        methods: {
            change(layout){
                this.$emit('change',layout);
                this.$emit('input',layout);
            },
            setEditor:function(){
                const t = this;
                //样式表单设置
                t.layoutContent = [{                      
                    uuid:'layout_14',
                    alias:'bb-button-media',                   
                    aliasName:'背景图地址',                                 
                    attributes:{
                        attributeName:'bgUrl',
                        show:true,
                        mediaDs: {
                            api: "ty_page_file_storage",
                            outputs: [
                                {
                                    dataKey: "tableData",
                                    handle: "ty_oss_storage_transfer_to_media_list",
                                    valueKey: "page_data"
                                }
                            ],
                            inputs: [
                                {
                                    paramName: "pageSize",
                                    variable: "<%=bb.pageSize%>",
                                    valueType: "template"
                                },
                                {
                                    paramName: "page",
                                    variable: "<%=bb.page%>",
                                    valueType: "template"
                                },
                                {
                                    paramName: "oiAlias",
                                    variable: "ty-storage",
                                    valueType: "template"
                                }
                            ],
                            category: "config",
                            method: "GET",
                            url: null
                        },
                        pageSize: 20,
                        uploadDs: {
                            api: "ty_oss_upload",
                            inputs: [
                                
                            ],
                            category: "config",
                            method: "POST",
                            url: null
                        }
                    },
                    interactives:[],
                },{                      
                    uuid:'layout_15',
                    alias:'bb-select',                   
                    aliasName:'背景图重复',                                 
                    attributes:{
                        attributeName:'bgRepeat',
                        show:true,
                        fields:[{
                            text:"重复",
                            value:"repeat"
                        },{
                            text:"x轴重复",
                            value:"repeat-x"
                        },{
                            text:"y轴重复",
                            value:"repeat-y"
                        },{
                            text:"不重复",
                            value:"no-repeat"
                        },{
                            text:"继承",
                            value:"inherit"
                        }]
                    },
                    interactives:[],
                },{                      
                    uuid:'layout_16',
                    alias:'bb-select',                   
                    aliasName:'背景图起始位置',                                 
                    attributes:{
                        attributeName:'bgOrigin',
                        show:true,
                        fields:[{
                            text:"相对于内边距框来定位",
                            value:"padding-box"
                        },{
                            text:"相对于边框盒来定位",
                            value:"border-box"
                        },{
                            text:"相对于内容框来定位",
                            value:"content-box"
                        }]

                    },
                    interactives:[],
                },{                      
                    uuid:'layout_17',
                    alias:'bb-input',                   
                    aliasName:'背景图起始位置',                                 
                    attributes:{
                        attributeName:'bgPosition',
                        show:true,
                    },
                    interactives:[],
                },{                      
                    uuid:'layout_18',
                    alias:'bb-input',                   
                    aliasName:'背景图尺寸',                                 
                    attributes:{
                        attributeName:'bgSize',
                        show:true
                    },
                    interactives:[],
                },{                      
                    uuid:'layout_19',
                    alias:'bb-select',                   
                    aliasName:'背景图滚动',                                 
                    attributes:{
                        attributeName:'bgAttachment',
                        show:true,
                        fields:[{
                            text:"随页面滚动",
                            value:"scroll"
                        },{
                            text:"图像不会移动",
                            value:"fixed"
                        },{
                            text:"继承",
                            value:"inherit"
                        }]
                    },
                    interactives:[],
                },{                      
                    uuid:'layout_01',
                    alias:'bb-color-picker',                   
                    aliasName:'背景色',                                 
                    attributes:{
                        attributeName:'bgColor',
                        show:true,
                    },
                    interactives:[],
                },{                      
                    uuid:'layout_02',
                    alias:'bb-slider',                   
                    aliasName:'旋转角度',                                  
                    attributes:{
                        attributeName:'rotate',
                        show:true,
                        min:0,
                        max:360
                    },
                    interactives:[],
                },{                      
                    uuid:'layout_03',
                    alias:'bb-slider',                   
                    aliasName:'透明度',                                  
                    attributes:{
                        attributeName:'transparency',
                        show:true,
                        min:0,
                        step:0.05,
                        max:1
                    },
                    interactives:[],
                },{                      
                    uuid:'layout_13',
                    alias:'bb-select',                   
                    aliasName:'块级样式',                                  
                    attributes:{
                        attributeName:'display',
                        fields:[{
                            value:"inline",
                            text:"行内"
                        },{
                            value:"inline-block",
                            text:"行内块"
                        },{
                            value:"block",
                            text:"块"
                        },{
                            value:"none",
                            text:"隐藏"
                        },{
                            value:"flex",
                            text:"流式布局"
                        }]
                    },
                    interactives:[],
                },{                      
                    uuid:'layout_11',
                    alias:'bb-select',                   
                    aliasName:'定位',                                  
                    attributes:{
                        attributeName:'positionType',
                        fields:[
                            {value:"inherit",text:"继承"},
                            {value:"absolute",text:"绝对"},
                            {value:"relative",text:"相对"},
                            {value:"static",text:"默认"},
                            {value:"fixed",text:"浮动"}
                        ]
                    },
                    interactives:[],
                },{                      
                    uuid:'layout_12',
                    alias:'bb-input-number',                   
                    aliasName:'层级',                                  
                    attributes:{
                        attributeName:'zIndex'
                    },
                    interactives:[],
                },{                      
                    uuid:'layout_04',
                    alias:'bb-form',                   
                    aliasName:'尺寸',                                  
                    attributes:{
                        attributeName:'size',
                        labelWidth:"80px",
                        grid:true,
                        size:"mini",
                        content:[{                      
                            uuid:'layout_04_01',
                            alias:'bb-input',                   
                            aliasName:'宽度',                                  
                            attributes:{
                                width:"95%",
                                attributeName:'width',
                            },
                            interactives:[],
                        },{                      
                            uuid:'layout_04_02',
                            alias:'bb-input',                   
                            aliasName:'高度',                                  
                            attributes:{
                                width:"95%",
                                attributeName:'height',
                            },
                            interactives:[],
                        }]
                    },
                    interactives:[],
                },{                      
                    uuid:'layout_05',
                    alias:'bb-form',                   
                    aliasName:'坐标',                                  
                    attributes:{
                        attributeName:'position',
                        labelWidth:"80px",
                        grid:true,
                        size:"mini",
                        content:[{                      
                            uuid:'layout_05_01',
                            alias:'bb-input',                   
                            aliasName:'横坐标',                                  
                            attributes:{
                                width:"95%",
                                attributeName:'x',
                            },
                            interactives:[],
                        },{                      
                            uuid:'layout_05_02',
                            alias:'bb-input',                   
                            aliasName:'纵坐标',                                  
                            attributes:{
                                width:"95%",
                                attributeName:'y',
                            },
                            interactives:[],
                        }]
                    },
                    interactives:[],
                },{                      
                    uuid:'layout_06',
                    alias:'bb-form',                   
                    aliasName:'边框',                                  
                    attributes:{
                        attributeName:'border',
                        labelWidth:"80px",
                        grid:true,
                        size:"mini",
                        content:[{                      
                            uuid:'layout_06_01',
                            alias:'bb-select',                   
                            aliasName:'样式',                                  
                            attributes:{
                                width:"95%",
                                attributeName:'style',
                                fields:[
                                    {text:"实线",value:"solid"},
                                    {text:"虚线",value:"dashed"},
                                    {text:"点状",value:"dotted"},
                                    {text:"双线",value:"double"}
                                    ]
                            },
                            interactives:[],
                        },{                      
                            uuid:'layout_06_02',
                            alias:'bb-color-picker',                   
                            aliasName:'颜色',                                  
                            attributes:{
                                width:"95%",
                                attributeName:'color',
                            },
                            interactives:[],
                        },{                      
                            uuid:'layout_06_03',
                            alias:'bb-input',                   
                            aliasName:'圆角',                                  
                            attributes:{
                                width:"95%",
                                attributeName:'radius',
                            },
                            interactives:[],
                        },{                      
                            uuid:'layout_06_04',
                            alias:'bb-input',                   
                            aliasName:'内边距',                                  
                            attributes:{
                                width:"95%",
                                attributeName:'padding',
                            },
                            interactives:[],
                        },{                      
                            uuid:'layout_06_05',
                            alias:'bb-input',                   
                            aliasName:'外边距',                                  
                            attributes:{
                                width:"95%",
                                attributeName:'margin',
                            },
                            interactives:[],
                        },{                      
                            uuid:'layout_06_06',
                            alias:'bb-input',                   
                            aliasName:'粗细',                                  
                            attributes:{
                                width:"95%",
                                attributeName:'size',
                            },
                            interactives:[],
                        }]
                    },
                    interactives:[],
                },{                      
                    uuid:'layout_07',
                    alias:'bb-form',                   
                    aliasName:'阴影',                                  
                    attributes:{
                        attributeName:'shadow',
                        labelWidth:"80px",
                        size:"mini",
                        grid:true,
                        content:[{                      
                            uuid:'layout_07_01',
                            alias:'bb-color-picker',                   
                            aliasName:'阴影颜色',                                  
                            attributes:{
                                width:"95%",
                                attributeName:'color',
                            },
                            interactives:[],
                        },{                      
                            uuid:'layout_07_02',
                            alias:'bb-input',                   
                            aliasName:'阴影大小',                                  
                            attributes:{
                                width:"95%",
                                attributeName:'size',
                            },
                            interactives:[],
                        },{                      
                            uuid:'layout_07_03',
                            alias:'bb-input',                   
                            aliasName:'阴影方向',                                  
                            attributes:{
                                width:"95%",
                                attributeName:'direction',
                            },
                            interactives:[],
                        },{                      
                            uuid:'layout_07_04',
                            alias:'bb-input',                   
                            aliasName:'阴影模糊',                                  
                            attributes:{
                                width:"95%",
                                attributeName:'vague',
                            },
                            interactives:[],
                        }]
                    },
                    interactives:[],
                },{                      
                    uuid:'layout_08',
                    alias:'bb-form',                   
                    aliasName:'字体',                                  
                    attributes:{
                        attributeName:'font',
                        labelWidth:"80px",
                        size:"mini",
                        grid:true,
                        content:[{                      
                            uuid:'layout_08_01',
                            alias:'bb-select',                   
                            aliasName:'字体名称',                                  
                            attributes:{
                                width:"95%",
                                attributeName:'family',
                                fields:[{
                                    text:"Arial",
                                    value:"Arial"
                                },{
                                    text:"微软雅黑",
                                    value:"Microsoft YaHei"
                                },{
                                    text:"黑体",
                                    value:"黑体"
                                },{
                                    text:"宋体",
                                    value:"宋体"
                                },{
                                    text:"sans-serif",
                                    value:"sans-serif"
                                }]
                            },
                            interactives:[],
                        },{                      
                            uuid:'layout_08_02',
                            alias:'bb-color-picker',                   
                            aliasName:'字体颜色',                                  
                            attributes:{
                                width:"95%",
                                attributeName:'color',
                            },
                            interactives:[],
                        },{                      
                            uuid:'layout_08_03',
                            alias:'bb-input',                   
                            aliasName:'字体大小',                                  
                            attributes:{
                                width:"95%",
                                attributeName:'size',
                            },
                            interactives:[],
                        },{                      
                            uuid:'layout_08_06',
                            alias:'bb-input',                   
                            aliasName:'字体行高',                                  
                            attributes:{
                                width:"95%",
                                attributeName:'lineHeight',
                            },
                            interactives:[],
                        },{                      
                            uuid:'layout_08_04',
                            alias:'bb-select',                   
                            aliasName:'字体对齐',                                  
                            attributes:{
                                width:"95%",
                                attributeName:'align',
                                fields:[
                                    {text:"左对齐",value:"left"},
                                    {text:"居中",value:"center"},
                                    {text:"右对齐",value:"right"},
                                    {text:"两端对齐",value:"justify"},
                                    {text:"从父元素继承",value:"inherit"}
                                    ]
                            },
                            interactives:[],
                        },{                      
                            uuid:'layout_08_05',
                            alias:'bb-select',                   
                            aliasName:'下划线',                                  
                            attributes:{
                                width:"95%",
                                attributeName:'decoration',
                                fields:[
                                    {text:"无",value:"none"},
                                    {text:"文本下",value:"underline"},
                                    {text:"文本上",value:"overline"},
                                    {text:"穿过文本",value:"line-through"},
                                    {text:"闪烁",value:"blink"},
                                    {text:"从父元素继承",value:"inherit"}
                                    ]
                            },
                            interactives:[],
                        }]
                    },
                    interactives:[],
                },{                      
                    uuid:'layout_09',
                    alias:'bb-select',                   
                    aliasName:'x轴滚动条',                                  
                    attributes:{
                        attributeName:'overflow-x',
                        fields:[
                            {text:"默认值",value:"visible"},
                            {text:"自动",value:"auto"},
                            {text:"超出隐藏",value:"hidden"},
                            {text:"超出滚动",value:"scroll"},
                            {text:"穿过文本",value:"line-through"},
                            {text:"从父元素继承",value:"inherit"}
                        ]
                    },
                    interactives:[],
                },{                      
                    uuid:'layout_10',
                    alias:'bb-select',                   
                    aliasName:'y轴滚动条',                                  
                    attributes:{
                        attributeName:'overflow-y',
                        fields:[
                            {text:"默认值",value:"visible"},
                            {text:"自动",value:"auto"},
                            {text:"超出隐藏",value:"hidden"},
                            {text:"超出滚动",value:"scroll"},
                            {text:"穿过文本",value:"line-through"},
                            {text:"从父元素继承",value:"inherit"}
                        ]
                    },
                    interactives:[],
                },{                      
                    uuid:'layout_11',
                    alias:'bb-editor-code',                   
                    aliasName:'自定义css样式',                                  
                    attributes:{
                        attributeName:'other',
                        returnObj:true
                    },
                    interactives:[],
                }]
            }
        }
    }
</script>
<style lang='less'>
</style>