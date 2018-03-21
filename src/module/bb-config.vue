<template>
    <!-- <bb-tabs :tabs="tabs" :activeName="activeName"></bb-tabs> -->
    <el-tabs type="border-card">
        <el-tab-pane label="属性">
            <bb-form :dsFields="attributesDs" v-model="valueBase"></bb-form>
        </el-tab-pane>
        <el-tab-pane label="交互">
            <bb-form :content="interactiveContent" v-model="valueBase"></bb-form>
        </el-tab-pane>
        <el-tab-pane label="动画">
            <bb-button-form :content="animationFormContent" startButtonType="text" startButtonIcon="ty-icon_faqi" formButtonName="添加动画"  settingText ="添加动画" v-model="animationForm" @commit="animationAdd"></bb-button-form>
            <bb-form v-model="valueBase" ref="animationListContent" :content="animationListContent"></bb-form>
        </el-tab-pane>
    </el-tabs>
</template>

<script>
    export default {
        name: 'bb-config',
        props: {
            /*支持v-model 
                value:{
                    { 
                        uuid: '',
                        alias: 'bb-layout-canvas', //布局类积木 || 普通积木
                        aliasName: '自由式布局', 
                        attributes: {}, //积木属性
                        animation: [{ //动画
                        }],
                        interactives: [{ //触发交互
                        }],
                        layout: {} //积木布局
                    }
                }
            */
            value:{
                type:Object,
                default:function(){
                    return {
                        uuid:'123456',
                        alias:'bb-select', //布局类积木 || 普通积木
                        aliasName: '类型选择', 
                        attributes: {
                            fields:[
                                {text:'刷新页面',value:'refresh'},
                                {text:'关闭页面',value:'unload'},
                                {text:'显示弹窗',value:'openDialog'},
                                {text:'解析接口',value:'executeDS'}
                            ]
                        }, //积木属性
                        animation: [{ //动画
                        }],
                        interactives: [{ //触发交互
                        }],
                        layout: {} //积木布局
                    }
                }
            }
        },
        data() {
            return {
                valueBase:this.value,
                tabs:[{
                    type:'static',
                    label:'属性',
                    name:'attributes'
                },{
                    type:'static',
                    label:'交互',
                    name:'interactive'
                },{
                    type:'static',
                    label:'动画',
                    name:'animation'
                }],
                activeName:'attributes',
                //属性配置
                attributesDs:{
                    api:'list-adByBbAlias',method:'get',category:'config',inputs: [{paramName: 'bbAlias', valueType: "template", variable: "bb-list"}],outputs:[{dataKey: 'tableData', valueKey: 'data_list.list'}]
                },
                //交互配置
                interactiveContent:[{                      
                    uuid:'interactiveEditor',
                    alias:'bb-list',                   
                    aliasName:'交互配置',               
                    group:'',                   
                    attributes:{
                        attributeName:'interactives',
                        editConfig:{editable:['add','edit','up','down','remove']},
                        columns:[
                            {prop: 'name',label: '事件名称',type:'defalut',et:'bb-input'},
                            {prop: 'description', label: "描述", dt: '', et: 'bb-input'},
                            {prop: 'triggerEventName',label: '事件',et: 'bb-select', etProp:{
                                ds:{
                                    api: "list-edByBbAlias",
                                    method: "get",
                                    inputs: [
                                        {paramName: 'bbAlias',valueType:"template",variable:this.value.alias}
                                    ],
                                    outputs: [
                                        {dataKey: "fields", valueKey: "data_list"}
                                    ]
                                },
                                textField:'name',
                                valueField:"eventName"
                            }},
                            {prop: 'executeType',label: '方法类型',et: 'bb-select',etProp:{fields:[
                                {text:'预定义方法',value:'trigger_method'},
                                {text:'自定义方法',value:'custom_script'},
                                {text:'容器类方法',value:'container_method'}
                            ]}},
                            {prop: 'executeArgument',label: '传参',et: 'bb-input'},
                            {prop: 'bbName',label: '目标积木',et: 'bb-bb-select'},
                            {prop: 'executeBBMethodName',label: '目标积木方法',et:'bb-select',etProp:{ds:{
                                api: "list-mdByBbAlias",
                                method: "get",
                                inputs: [{paramName: 'bbAlias',valueType:"template",variable:this.pbbId}],
                                outputs: [
                                    {dataKey: "fields", valueKey: "data_list"}
                                ]
                            },textField:'name',valueField:"alias"}},
                            {prop: 'executeScript',label: '巴斯方法',et:'bb-select',etProps:{ds:{
                                api: "list-buzz",
                                method: "get",
                                inputs: [],
                                outputs: [
                                    {dataKey: "fields", valueKey: "data_list"}
                                ]
                            },textField:'name',valueField:"alias"}},
                            {prop: 'containerMethodName',label: '容器类方法名称',et:'bb-select',etProp:{fields:[
                                {text:'刷新页面',value:'refresh'},
                                {text:'关闭页面',value:'unload'},
                                {text:'显示弹窗',value:'openDialog'},
                                {text:'解析接口',value:'executeDS'}
                            ]}}
                        ]
                    }
                }],
                //动画配置 新增表单
                animationFormContent:[{                      
                    uuid:'animation-type',
                    alias:'bb-portal-item-list',                   
                    aliasName:'动画类型',               
                    group:'',                   
                    attributes:{
                        attributeName:'type',
                        styleConfig: {
                            imgWidth: "50px",
                            imgHeight: "50px",
                            margin: "8px",
                            h_margin: "5px"
                        },
                        fields:[{
                            icon:'ty-flower-off ty-font', 
                            src:'',
                            title:'bounced',
                            value:'bounced',
                        },{
                            icon:'ty-flower-off ty-font', 
                            src:'',
                            title:'flash',
                            value:'flash',
                            subtitle:'',
                        },{
                            icon:'ty-flower-off ty-font', 
                            src:'',
                            title:'pulse',
                            value:'pulse',
                            subtitle:'',
                        },{
                            icon:'ty-flower-off ty-font', 
                            src:'',
                            title:'rubberBand',
                            value:'rubberBand',
                            subtitle:'',
                        },{
                            icon:'ty-flower-off ty-font', 
                            src:'',
                            title:'shake',
                            value:'shake',
                            subtitle:'',
                        },{
                            icon:'ty-flower-off ty-font', 
                            src:'',
                            title:'swing',
                            value:'swing',
                            subtitle:'',
                        },{
                            icon:'ty-flower-off ty-font', 
                            src:'',
                            title:'tada',
                            value:'tada',
                            subtitle:'',
                        },{
                            icon:'ty-flower-off ty-font', 
                            src:'',
                            title:'tada',
                            value:'tada',
                            subtitle:'',
                        },{
                            icon:'ty-flower-off ty-font', 
                            src:'',
                            title:'wobble',
                            value:'wobble',
                            subtitle:'',
                        },{
                            icon:'ty-flower-off ty-font', 
                            src:'',
                            title:'jello',
                            value:'jello',
                            subtitle:'',
                        }]
                    }
                },{                      
                    uuid:'animation-time',
                    alias:'bb-slider',                   
                    aliasName:'动画时长(毫秒)',               
                    group:'',                   
                    attributes:{
                        attributeName:'time',
                        step:100,
                        max:10000
                    }
                },{                      
                    uuid:'animation-delay',
                    alias:'bb-slider',                   
                    aliasName:'动画延时(毫秒)',               
                    group:'',                   
                    attributes:{
                        attributeName:'delay',
                        step:100,
                        max:10000
                    }
                },{                      
                    uuid:'animation-playNum',
                    alias:'bb-input-number',                   
                    aliasName:'播放次数',               
                    group:'',                   
                    attributes:{
                        attributeName:'playNum',
                    }
                },{                      
                    uuid:'animation-loop',
                    alias:'bb-editor-switch',                   
                    aliasName:'循环播放',               
                    group:'',                   
                    attributes:{
                        attributeName:'loop',
                    }
                },{                      
                    uuid:'animation-direction',
                    alias:'bb-select',                   
                    aliasName:'播放方向',               
                    group:'',                   
                    attributes:{
                        attributeName:'direction',
                        fields:[
                            {text:'normal',value:'正向'},
                            {text:'alternate',value:'反向'}
                        ],
                        defaultValTpl:''
                    }
                }],
                //动画配置 动画列表
                animationListContent:[{                      
                    uuid:'animationListContent',
                    alias:'bb-list',                   
                    aliasName:'',               
                    group:'',                   
                    attributes:{
                        attributeName:'animation',
                        editConfig:{editable:['edit','up','down','remove']},
                        columns:[{                      
                            prop:'type',                   
                            label:'动画类型',               
                            et:'bb-portal-item-list',                   
                            etProp:{
                                styleConfig: {
                                    imgWidth: "50px",
                                    imgHeight: "50px",
                                    margin: "8px",
                                    h_margin: "5px"
                                },
                                fields:[{
                                    icon:'ty-flower-off ty-font', 
                                    src:'',
                                    title:'bounced',
                                    value:'bounced',
                                },{
                                    icon:'ty-flower-off ty-font', 
                                    src:'',
                                    title:'flash',
                                    value:'flash',
                                    subtitle:'',
                                },{
                                    icon:'ty-flower-off ty-font', 
                                    src:'',
                                    title:'pulse',
                                    value:'pulse',
                                    subtitle:'',
                                },{
                                    icon:'ty-flower-off ty-font', 
                                    src:'',
                                    title:'rubberBand',
                                    value:'rubberBand',
                                    subtitle:'',
                                },{
                                    icon:'ty-flower-off ty-font', 
                                    src:'',
                                    title:'shake',
                                    value:'shake',
                                    subtitle:'',
                                },{
                                    icon:'ty-flower-off ty-font', 
                                    src:'',
                                    title:'swing',
                                    value:'swing',
                                    subtitle:'',
                                },{
                                    icon:'ty-flower-off ty-font', 
                                    src:'',
                                    title:'tada',
                                    value:'tada',
                                    subtitle:'',
                                },{
                                    icon:'ty-flower-off ty-font', 
                                    src:'',
                                    title:'tada',
                                    value:'tada',
                                    subtitle:'',
                                },{
                                    icon:'ty-flower-off ty-font', 
                                    src:'',
                                    title:'wobble',
                                    value:'wobble',
                                    subtitle:'',
                                },{
                                    icon:'ty-flower-off ty-font', 
                                    src:'',
                                    title:'jello',
                                    value:'jello',
                                    subtitle:'',
                                }]
                            }
                        },{                      
                            prop:'time',
                            et:'bb-slider',                   
                            label:'动画时长(毫秒)',                                  
                            etProp:{
                                step:100,
                                max:10000
                            }
                        },{                      
                            prop:'delay',
                            et:'bb-slider',                   
                            label:'动画延时(毫秒)',                                  
                            etProp:{
                                step:100,
                                max:10000
                            }
                        },{                      
                            prop:'playNum',
                            et:'bb-input-number',                   
                            label:'播放次数',                                  
                            etProp:{}
                        },{                      
                            prop:'loop',
                            et:'bb-editor-switch',                   
                            label:'循环播放',                                  
                            etProp:{
                            }
                        },{                      
                            prop:'direction',
                            et:'bb-select',                   
                            label:'播放方向',                                  
                            etProp:{
                                fields:[
                                    {text:'normal',value:'正向'},
                                    {text:'alternate',value:'反向'}
                                ],
                                defaultValTpl:''
                            }
                        }]
                    }
                }],
                animationForm:{}
            }
        },

        // 根据积木名查询积木事件
        // 根据积木名查询积木方法
        watch: {

        },
        created: function () {
        },
        mounted:function(){

        },
        methods: {
            //添加动画
            animationAdd:function(row){
                const t = this;
                t.valueBase.animation.push(row);
            }
        }
    }
</script>