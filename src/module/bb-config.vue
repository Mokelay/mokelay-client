<template>
    <el-tabs v-show="show" :key="key" :type="showBBSelect?'card':'border-card'">
        <el-tab-pane label="属性">
            <div class="bb-info">
                <p>积木名称：<bb-input :style="{width:'auto'}" v-model="valueBase.aliasName" ></bb-input></p>
                <div v-if="showBBSelect">
                    选择积木：<bb-select v-model="valueBase.alias" textField="name" valueField="alias" :ds="bbFieldsDs" @change="bbChange"></bb-select>
                </div>
                <p>积木别名：{{valueBase.alias}}</p>
                <p>积木标识：{{valueBase.uuid}}</p>
            </div>
            <bb-form v-if="showBBSelect" size="mini" labelWidth="80px" :hideSubmitButton="true" :fields="formItemFields" :alias="alias" v-model="valueBase.attributes"></bb-form>
            <bb-form ref="bb-config-ad-form" size="mini" labelWidth="80px" :dsFields="attributesDs" :alias="alias" v-model="valueBase.attributes" @commit="contentChange" :on="bbInfo&&bbInfo.on"></bb-form>
        </el-tab-pane>
        <el-tab-pane label="交互">
            <bb-button-form :content="interactiveFormContent" startButtonType="text" startButtonIcon="ty-icon_faqi" formButtonName="添加交互"  settingText ="添加交互" v-model="interactiveForm" @commit="interactiveAdd"></bb-button-form>
            <bb-form size="mini" :content="interactiveContent" v-model="valueBase" @commit="contentChange"></bb-form>
        </el-tab-pane>
        <el-tab-pane label="动画">
            <bb-button-form :content="animationFormContent" startButtonType="text" startButtonIcon="ty-icon_faqi" formButtonName="添加动画"  settingText ="添加动画" v-model="animationForm" @commit="animationAdd"></bb-button-form>
            <bb-form size="mini" v-model="valueBase" ref="animationListContent" :content="animationListContent" @commit="contentChange"></bb-form>
        </el-tab-pane>
        <el-tab-pane label="布局">
            <bb-form size="mini" v-model="valueBase.layout" ref="layoutContent" :content="layoutContent" @commit="contentChange"></bb-form>
        </el-tab-pane>
        <el-tab-pane label="开发者">
            <bb-editor-code v-model="valueBase" :returnObj="true" @input="contentChange"></bb-editor-code>
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
                        uuid: '',
                        alias: '',
                        aliasName: '', 
                        attributes: {},
                        animation: [{
                        }],
                        interactives: [{
                        }],
                        layout: {}
                    }
                }
            }
        },
        data() {
            return {
                valueBase:this.value,
                layout:{},
                alias:this.value.alias,
                //积木详情
                bbInfo:null,
                animationForm:{},
                tabs:null,
                activeName:'attributes',
                //属性配置
                attributesDs:{},
                //交互新增表单
                interactiveFormContent:null,
                interactiveForm:{},
                //交互配置列表
                interactiveContent:null,
                //动画配置 新增表单
                animationFormContent:null,
                //动画配置 动画列表
                animationListContent:null,
                key:null,
                show:false,
                _TY_Current_Edit_Item:null,
                showBBSelect:true,
                bbFieldsDs: {
                     "api": "list-bb",
                     "category": "config",
                     "method": "post",
                     "inputs": [],
                     "outputs": [{
                         "dataKey": "fields",
                         "valueKey": "data_list"
                    }]
                },
                formItemFields:null,
                layoutContent:null
            }
        },
        watch: {
        },
        created: function () {
            let t=this;
            this.getConfigEnv();
            this.key = _TY_Tool.uuid();
            this.getBBInfo().then(()=>{
                t.setEditor();
            })
        },
        mounted:function(){

        },
        methods: {
            //根据bbalias 获取bb的详细信息
            getBBInfo:function(){
                let t=this;
                return new Promise((resolve,reject)=>{
                    if(!t.alias){
                        resolve();
                    }
                    if(_TY_Root._TY_BBInfo&&_TY_Root._TY_BBInfo[t.alias]){
                         t.bbInfo = _TY_Root._TY_BBInfo[t.alias];
                         resolve();
                    }else{
                        _TY_Tool.post(_TY_ContentPath+"/read-bb",{
                            bbAlias:t.alias
                        }).then(function (response) {
                                let data = response['data'];
                                if(data.ok){
                                    t.bbInfo = data.data.data;
                                    if(t.bbInfo.on&&typeof(t.bbInfo.on)==='string'){
                                        let tempOn = t.bbInfo.on;
                                        const _arg = tempOn.match(/`[^]*?`/gi)
                                        if(_arg&&_arg.length>0){
                                            tempOn = tempOn.replace(/`[^]*?`/gi,"\"\"");
                                        }
                                        t.bbInfo.on = JSON.parse(tempOn);
                                        if(_arg&&_arg.length>0){
                                            t.bbInfo.on.forEach((item,index)=>{
                                                item['executeArgument'] = eval(_arg[index]);
                                            });
                                        }
                                    }
                                    if(!_TY_Root._TY_BBInfo){
                                        _TY_Root._TY_BBInfo = {};
                                    }
                                    //放到全局变量里面去
                                    _TY_Root._TY_BBInfo[t.alias] = _TY_Tool.deepClone(t.bbInfo);
                                    resolve();
                                }else{
                                    reject()
                                }
                        }).catch(function (error) {
                            reject()
                        });
                    }
                });
            },
            //载入当前积木的编辑内容
            editBB:function(content){
                const t = this;
                if(!content.alias){
                    t.show = false
                    return;
                }
                t.show = true;
                t.valueBase = content;
                t.alias = content.alias;
                t.key = _TY_Tool.uuid();
                //选获取积木详情，获取交互
                t.getBBInfo().then(()=>{
                    t.setEditor();
                })
            },
            //添加交互
            interactiveAdd:function(row){
                const t = this;
                t.interactiveForm = {};
                if(t.valueBase.interactives){
                    t.valueBase.interactives.push(row);
                }else{
                    t.valueBase.interactives = [].push(row);
                }
            },
            //添加动画
            animationAdd:function(row){
                const t = this;
                t.animationForm = {};
                if(t.valueBase.animation){
                    t.valueBase.animation.push(row);
                }else{
                    t.valueBase.animation = [].push(row);
                }
                
            },
            //content修改
            contentChange:function(formData){
                const t = this;
                t.$emit('input',t.valueBase);
                t.$emit('change',t.valueBase);
            },
            //获取当前编辑器的环境判断是否需要显示积木选择功能
            getConfigEnv:function(){
                const t = this;
                const parentAliasName = t.$parent.$vnode.data.attrs?t.$parent.$vnode.data.attrs.aliasName: '';
                if(parentAliasName == "rightAside"){
                    t.showBBSelect = false;
                }else{
                    t.show = true
                    t.showBBSelect = true;
                }
            },
            //积木改变
            bbChange:function(val){
                const t = this;
                t.alias = val;
                t.valueBase = Object.assign(t.valueBase,{alias:val});
                t.setEditor();
            },
            setEditor:function(){
                const t = this;
                t.tabs = [{
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
                }];
                t.activeName = 'attributes';
                //属性配置
                t.attributesDs = {
                    api:'list-adByBbAlias',method:'get',category:'config',inputs: [{paramName: 'bbAlias', valueType: "template", variable: t.alias}],outputs:[{dataKey: 'tableData', valueKey: 'data_list.list',handle:'bb-config-ad-fill-uuid'}]
                };
                t.$set(t.attributesDs,'inputs',[{paramName: 'bbAlias', valueType: "template", variable: t.alias}])
                //交互新增表单
                t.interactiveFormContent = [{                      
                    uuid:'interactive-uuid',
                    alias:'bb-uuid',                   
                    aliasName:'唯一标识',              
                    //group:'交互事件',                   
                    attributes:{
                        attributeName:'uuid',
                        radix:8,
                        length:5
                    }
                },{                      
                    uuid:'interactive-fromContentUUID',
                    alias:'bb-select',                   
                    aliasName:'事件积木',              
                    //group:'交互事件',                   
                    attributes:{
                        attributeName:'fromContentUUID',
                        fields:[{text:"当前积木",value:t.alias},{text:"页面容器",value:"Page_Ref_Root"}]
                    },
                    interactives:[{
                        uuid:'interactive-fromContentUUID_01',
                        fromContentEvent:'change',
                        executeType:'trigger_method',
                        executeContentUUID:'interactive-fromContentEvent',
                        executeContentMethodName:'linkage',
                    }]
                },{                      
                    uuid:'interactive-fromContentEvent',
                    alias:'bb-select',                   
                    aliasName:'事件',               
                    //group:'交互事件',                   
                    attributes:{
                        attributeName:'fromContentEvent',
                        ds:{
                            api: "list-edByBbAlias",
                            method: "get",
                            inputs: [
                                {paramName: 'bbAlias',valueType:"template",variable:"<%=bb.external['linkage'] == 'Page_Ref_Root'?'bb-page':bb.external['linkage']%>"}
                            ],
                            outputs: [
                                {dataKey: "fields", valueKey: "data_list"}
                            ]
                        },
                        textField:'name',
                        valueField:"eventName"
                    }
                },{                      
                    uuid:'interactive-executeArgument',
                    alias:'bb-textarea',                   
                    aliasName:'自定义参数',              
                    //group:'交互事件',                   
                    attributes:{
                        attributeName:'executeArgument'
                    }
                },{                      
                    uuid:'interactive-executeType',
                    alias:'bb-select',                   
                    aliasName:'方法类型',               
                    //group:'交互事件',                   
                    attributes:{
                        attributeName:'executeType',
                        fields:[
                            {text:'预定义方法',value:'trigger_method'},
                            {text:'自定义方法',value:'custom_script'},
                            {text:'容器类方法',value:'container_method'}
                        ]
                    },
                    interactives:[{
                        uuid:'interactive-executeType_01',
                        fromContentEvent:'change',
                        executeType:'trigger_method',
                        executeContentUUID:'form-item_interactive-executeContentUUID',
                        executeContentMethodName:'itemShowOrHide',
                        executeArgument: "params[0]==='trigger_method'?true:false"
                    },{
                        uuid:'interactive-executeType_02',
                        fromContentEvent:'change',
                        executeType:'trigger_method',
                        executeContentUUID:'form-item_interactive-executeContentMethodName',
                        executeContentMethodName:'itemShowOrHide',
                        executeArgument: "params[0]==='trigger_method'?true:false"
                    },{
                        uuid:'interactive-executeType_03',
                        fromContentEvent:'change',
                        executeType:'trigger_method',
                        executeContentUUID:'form-item_interactive-executeScript',
                        executeContentMethodName:'itemShowOrHide',
                        executeArgument: "params[0]==='custom_script'?true:false"
                    },{
                        uuid:'interactive-executeType_04',
                        fromContentEvent:'change',
                        executeType:'trigger_method',
                        executeContentUUID:'form-item_interactive-containerMethodName',
                        executeContentMethodName:'itemShowOrHide',
                        executeArgument: "params[0]==='container_method'?true:false"
                    }]
                },{                      
                    uuid:'interactive-executeContentUUID',
                    alias:'bb-bb-select',                   
                    aliasName:'目标积木',               
                    //group:'预定义方法',                   
                    attributes:{
                        attributeName:'executeContentUUID',
                        show:false,
                    },
                    interactives:[{             //触发交互
                        uuid:_TY_Tool.uuid(),
                        fromContentEvent:'change',
                        executeType:'trigger_method',
                        executeContentUUID:'interactive-executeContentMethodName',
                        executeContentMethodName:'linkage'
                    }],
                },{                      
                    uuid:'interactive-executeContentMethodName',
                    alias:'bb-select',                   
                    aliasName:'目标积木方法',               
                    //group:'预定义方法',                   
                    attributes:{
                        attributeName:'executeContentMethodName',
                        show:false,
                        ds:{
                            api: "list-mdByBbAlias",
                            method: "get",
                            inputs: [{paramName: 'bbAlias',valueType:"template",variable:"<%=bb.external.linkage%>"}],
                            outputs: [
                                {dataKey: "fields", valueKey: "data_list"}
                            ]
                        },textField:'name',valueField:"methodName"
                    }
                },{                      
                    uuid:'interactive-executeScript',
                    alias:'bb-select',                   
                    aliasName:'巴斯方法',              
                    //group:'自定义方法',                   
                    attributes:{
                        attributeName:'executeScript',
                        show:false,
                        ds:{
                            api: "list-buzz",
                            method: "get",
                            inputs: [],
                            outputs: [
                                {dataKey: "fields", valueKey: "data_list"}
                            ]
                        },textField:'name',valueField:"alias"
                    }
                },{                      
                    uuid:'interactive-containerMethodName',
                    alias:'bb-select',                   
                    aliasName:'容器类方法名称',               
                    //group:'容器类方法',                   
                    attributes:{
                        attributeName:'containerMethodName',
                        show:false,
                        ds:{
                            api: "list-mdByBbAlias",
                            method: "get",
                            inputs: [{paramName: 'bbAlias',valueType:"template",variable:"bb-page"}],
                            outputs: [
                                {dataKey: "fields", valueKey: "data_list"}
                            ]
                        },textField:'name',valueField:"methodName"
                    }
                }];
                t.interactiveForm = {};
                //交互配置列表
                t.interactiveContent = [{                      
                    uuid:'interactiveEditor',
                    alias:'bb-list',                   
                    aliasName:'',               
                    group:'',                   
                    attributes:{
                        attributeName:'interactives',
                        editConfig:{editable:['edit','up','down','remove']},
                        columns:[
                            {prop: 'uuid',label: '标识',type:'defalut',et: 'bb-uuid'},
                            {prop: 'fromContentUUID',label: '事件积木',type:'defalut',et: 'bb-select',etProp:{fields:[{text:"当前积木",value:t.alias},{text:"页面容器",value:"Page_Ref_Root"}]},etOn:[{
                                uuid:'interactive-fromContentUUID_01',
                                fromContentEvent:'change',
                                executeType:'trigger_method',
                                executeContentUUID:'fromContentEvent',
                                executeContentMethodName:'linkage',
                            }]},
                            {prop:'fromContentEvent',
                                et:'bb-select',                   
                                label:'事件',               
                                //group:'交互事件',                   
                                etProp:{
                                    ds:{
                                        api: "list-edByBbAlias",
                                        method: "get",
                                        inputs: [
                                            {paramName: 'bbAlias',valueType:"template",variable:"<%=bb.external['linkage'] == 'Page_Ref_Root'?'bb-page':bb.external['linkage']%>"}
                                        ],
                                        outputs: [
                                            {dataKey: "fields", valueKey: "data_list"}
                                        ]
                                    },
                                    textField:'name',
                                    valueField:"eventName"
                                }
                            },
                            {prop: 'executeArgument',label: '参数',et: 'bb-textarea',etProp:{}},
                            {prop: 'executeType',label: '方法类型',et: 'bb-select',etProp:{fields:[
                                {text:'预定义方法',value:'trigger_method'},
                                {text:'自定义方法',value:'custom_script'},
                                {text:'容器类方法',value:'container_method'}
                            ]}},
                            {prop: 'executeContentUUID',label: '目标',et: 'bb-bb-select'},
                            {prop: 'executeContentMethodName',label: '目标积木方法',et:'bb-select',etProp:{ds:{
                                api: "list-mdByBbAlias",
                                method: "get",
                                inputs: [{paramName: 'bbAlias',valueType:"template",variable:"<%=bb.external.linkage%>"}],
                                outputs: [
                                    {dataKey: "fields", valueKey: "data_list"}
                                ]
                            },textField:'name',valueField:"methodName"}},
                            {prop: 'executeScript',label: '巴斯',et:'bb-select',etProps:{ds:{
                                api: "list-buzz",
                                method: "get",
                                inputs: [],
                                outputs: [
                                    {dataKey: "fields", valueKey: "data_list"}
                                ]
                            },textField:'name',valueField:"alias"}},
                            {prop: 'containerMethodName',label: '容器方法',et:'bb-select',etProp:{ds:{
                                api: "list-mdByBbAlias",
                                method: "get",
                                inputs: [{paramName: 'bbAlias',valueType:"template",variable:"bb-page"}],
                                outputs: [
                                    {dataKey: "fields", valueKey: "data_list"}
                                ]
                            },textField:'name',valueField:"methodName"}}
                        ]
                    }
                }];
                //动画配置 新增表单
                t.animationFormContent = [{                      
                    uuid:'animation-type',
                    alias:'bb-portal-item-list',                   
                    aliasName:'动画类型',               
                    group:'',                   
                    attributes:{
                        attributeName:'style',
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
                            {text:'正向',value:'normal'},
                            {text:'反向',value:'alternate'}
                        ],
                        defaultValTpl:''
                    }
                }];
                //动画配置 动画列表
                t.animationListContent = [{                      
                    uuid:'animationListContent',
                    alias:'bb-list',                   
                    aliasName:'',               
                    group:'',                   
                    attributes:{
                        attributeName:'animation',
                        editConfig:{editable:['edit','up','down','remove']},
                        columns:[{                      
                            prop:'style',                   
                            label:'动画类型',               
                            et:'bb-select',                   
                            etProp:{
                                fields:[{
                                    title:'bounced',
                                    value:'bounced'
                                },{
                                    title:'flash',
                                    value:'flash'
                                },{
                                    title:'pulse',
                                    value:'pulse'
                                },{
                                    title:'rubberBand',
                                    value:'rubberBand'
                                },{
                                    title:'shake',
                                    value:'shake'
                                },{
                                    title:'swing',
                                    value:'swing'
                                },{
                                    title:'tada',
                                    value:'tada'
                                },{
                                    title:'wobble',
                                    value:'wobble'
                                },{
                                    title:'jello',
                                    value:'jello'
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
                                    {text:'正向',value:'normal'},
                                    {text:'反向',value:'alternate'}
                                ],
                                defaultValTpl:''
                            }
                        }]
                    }
                }];
                //设置表单项积木时需要额外增的字段
                t.formItemFields = [{                      
                            attributeName:'attributeName',
                            et:'bb-input',                   
                            name:'字段别名',
                            group:'表单选项',
                            description:"",                               
                            props:{
                            }
                        },{                      
                            attributeName:'width',
                            et:'bb-input',
                            group:'表单选项',                 
                            name:'表单项宽度',
                            description:"表单项占整行的宽度",                               
                            props:{
                            }
                        },{                      
                            attributeName:'itemMargin',
                            et:'bb-input',
                            group:'表单选项',                 
                            name:'表单项间距',
                            description:"表单项底部间距",                               
                            props:{
                            }
                        },{                      
                            attributeName:'show',
                            et:'bb-editor-switch',
                            group:'表单选项',                   
                            name:'表单项显示',
                            description:"",                               
                            props:{
                            }
                        },{                      
                            attributeName:'rules',
                            et:'bb-array',                   
                            name:'验证规则',
                            group:'表单选项',
                            description:"",                               
                            props:{
                                defaultFormData: {
                                    required: false,
                                    type: "string",
                                    trigger: "blur"
                                },
                                fields: [{
                                    name: '是否必填',
                                    attributeName: 'required',
                                    et: 'bb-editor-switch',
                                    rules: [],
                                    props: {},
                                }, {
                                    name: '数据类型',
                                    attributeName: 'type',
                                    et: 'bb-select',
                                    rules: [],
                                    props: {
                                        fields: [{
                                            text: "整数",
                                            value: "int"
                                        }, {
                                            text: "浮点数",
                                            value: "double"
                                        }, {
                                            text: "布尔值",
                                            value: "boolean"
                                        }, {
                                            text: "字符串",
                                            value: "string"
                                        }, {
                                            text: "日期",
                                            value: "date"
                                        }, {
                                            text: "日期时间",
                                            value: "time"
                                        }, {
                                            text: "对象",
                                            value: "object"
                                        }, {
                                            text: "数组",
                                            value: "array"
                                        }, {
                                            text: "文件",
                                            value: "multipart"
                                        }]
                                    }
                                }, {
                                    name: '提示',
                                    hide:true,
                                    attributeName: 'message',
                                    et: 'bb-input',
                                    rules: [],
                                    props: {},
                                }, {
                                    name: '触发事件',
                                    hide:true,
                                    attributeName: 'trigger',
                                    et: 'bb-select',
                                    rules: [],
                                    props: {
                                        fields: [{
                                            text: '失焦',
                                            value: 'blur'
                                        }, {
                                            text: '改变',
                                            value: 'change'
                                        }]
                                    },
                                }, {
                                    name: '自定义验证方法',
                                    hide:true,
                                    attributeName: 'validatePass',
                                    et: 'bb-editor-code',
                                    group: '额外选项',
                                    rules: [],
                                    props: {
                                        returnObj: true
                                    }
                                }]
                            }
                        },{                      
                            attributeName:'mark',
                            et:'bb-textarea',
                            group:'表单选项',                   
                            name:'表单项说明',
                            description:"",                               
                            props:{
                            }
                        },{                      
                            attributeName:'tip',
                            et:'bb-input',   
                            group:'表单选项',                
                            name:'表单注释',
                            description:"",                               
                            props:{
                            }
                        }];
                        t.layoutContent = [{                      
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
                            uuid:'layout_11',
                            alias:'bb-select',                   
                            aliasName:'定位',                                  
                            attributes:{
                                attributeName:'position',
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
                                attributeName:'xy',
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
                                        attributeName:'radian',
                                    },
                                    interactives:[],
                                },{                      
                                    uuid:'layout_06_04',
                                    alias:'bb-input',                   
                                    aliasName:'边距',                                  
                                    attributes:{
                                        width:"95%",
                                        attributeName:'margin',
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
                                    alias:'bb-input',                   
                                    aliasName:'字体名称',                                  
                                    attributes:{
                                        width:"95%",
                                        attributeName:'family',
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
                        }]
            }
        }
    }
</script>
<style lang='less'>
    .bb-info{
        font-size: 14px;
        color: #666;
        line-height: 40px;
    }
    
</style>