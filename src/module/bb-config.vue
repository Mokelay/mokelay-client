<template>
    <el-tabs v-show="show" :key="key" :type="showBBSelect?'card':'border-card'">
        <el-tab-pane label="属性">
            <!-- 基础属性 -->
            <bb-form ref="bb-config-form-base" size="mini" labelWidth="80px" :hideSubmitButton="true" :content="formItemFieldsBase" v-model="valueBase"></bb-form>
            <!-- 表单属性 -->
            <bb-form ref="bb-config-form-ad-form" v-if="valueBase.type == 'Form' && showBBSelect" size="mini" labelWidth="80px" :hideSubmitButton="true" :fields="formItemFields" :alias="alias" v-model="valueBase.attributes"></bb-form>
            <!-- 积木属性 -->
            <bb-form ref="bb-config-ad-form" size="mini" labelWidth="80px" :dsFields="attributesDs" :lazy="false" v-model="valueBase.attributes" @commit="contentChange" :on="bbInfo&&bbInfo.on"></bb-form>
        </el-tab-pane>
        <el-tab-pane label="交互">
            <bb-button-form ref="interactive_add_button_form" :content="interactiveFormContent" startButtonType="text" startButtonIcon="ty-icon_faqi" formButtonName="添加交互"  settingText ="添加交互" v-model="interactiveForm" @commit="interactiveAdd"></bb-button-form>
            <bb-form size="mini" :content="interactiveContent" v-model="valueBase" @commit="contentChange"></bb-form>
        </el-tab-pane>
        <el-tab-pane label="动画">
            <bb-button-form :content="animationFormContent" startButtonType="text" startButtonIcon="ty-icon_faqi" formButtonName="添加动画"  settingText ="添加动画" v-model="animationForm" @commit="animationAdd"></bb-button-form>
            <bb-form size="mini" v-model="valueBase" ref="animationListContent" :content="animationListContent" @commit="contentChange"></bb-form>
        </el-tab-pane>
        <el-tab-pane label="布局">
            <bb-css-editor v-model="valueBase.layout" ref="layoutContent" @change="layoutChange"></bb-css-editor>
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
                bbType:this.value.type,
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
                bbFieldsDs:{
                    "api": "list-bb-by-pageAlias",
                    "category": "config",
                    "method": "get",
                    "inputs": [{
                        "paramName":'pageAlias',
                        "valueType":"template",
                        "variable":_TY_Root.$route.query.pageAlias||_TY_Root.$route.query.param
                    }],
                    "outputs": [{
                        "dataKey": "fields",
                        "valueKey": "data_list"
                    }]
                },
                formItemFieldsBase:null,
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
            this.setEditor();
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
                                resolve(data);
                            }else{
                                reject()
                            }
                        }).catch(function (error) {
                            reject()
                        });
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
                // t.alias = content.alias;
                // t.key = _TY_Tool.uuid();
                t.bbChange(content.alias);
                //选获取积木详情，获取交互
                
                // t.getBBInfo().then(()=>{
                //     t.setEditor();
                // })
            },
            //添加交互
            interactiveAdd:function(row){
                const t = this;
                t.interactiveForm = {};
                //通过uuid判断当前row是新增还是编辑
                let editData = false;
                t.valueBase.interactives.forEach((interactive,key)=>{
                    if(interactive.uuid == row.uuid){
                        interactive = row;
                        editData = true
                    }
                })
                if(t.valueBase.interactives && !editData){
                    t.valueBase.interactives.push(row);
                }else if(!editData){
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
                //form表单的校验
                if(t.$refs['bb-config-form-ad-form']&&t.$refs['bb-config-form-ad-form'].$children[0]){
                    t.$refs['bb-config-form-ad-form'].$children[0].validate((valid)=>{
                        if(valid){
                            t.$emit('input',t.valueBase);
                            t.$emit('change',t.valueBase);
                        }else{
                            t.$message({
                                type: 'info',
                                message: '表单校验失败'
                            });
                        }
                    });
                    t.$refs['bb-config-form-base'].$children[0].validate((valid)=>{
                        if(valid){
                            t.$emit('input',t.valueBase);
                            t.$emit('change',t.valueBase);
                        }else{
                            t.$message({
                                type: 'info',
                                message: '表单校验失败'
                            });
                        }
                    });
                }else{
                    t.$emit('input',t.valueBase);
                    t.$emit('change',t.valueBase);
                }
            },
            //样式变换
            layoutChange(layout){
                const t = this;
                t.valueBase.layout = layout;
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
                _TY_Tool.post(_TY_ContentPath+"/read-bb",{
                    bbAlias:val
                }).then(function(response){
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
                        t.bbType = data.data.data.type;
                        t.valueBase = Object.assign(t.valueBase,{alias:val,type:data.data.data.type});
                        t.setEditor(); 
                    }else{
                        t.$message.error(response.data.message);
                    }
                });
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
                    api:'list-adByBbAlias-online',method:'get',category:'config',inputs: [{paramName: 'bbAlias', valueType: "template", variable: t.alias}],outputs:[{dataKey: 'tableData', valueKey: 'data_list.list',handle:'bb-config-ad-fill-uuid'}]
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
                    uuid:'interactive-fromContentUUID'+t.key,
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
                        executeContentUUID:'interactive-fromContentEvent'+t.key,
                        executeContentMethodName:'linkage',
                    }]
                },{                      
                    uuid:'interactive-fromContentEvent'+t.key,
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
                        executeContentUUID:'form-item_interactive-executeContentUUID'+t.key,
                        executeContentMethodName:'itemShowOrHide',
                        executeArgument: "params[0]==='trigger_method'?true:false"
                    },{
                        uuid:'interactive-executeType_02',
                        fromContentEvent:'change',
                        executeType:'trigger_method',
                        executeContentUUID:'form-item_interactive-executeContentMethodName'+t.key,
                        executeContentMethodName:'itemShowOrHide',
                        executeArgument: "params[0]==='trigger_method'?true:false"
                    },{
                        uuid:'interactive-executeType_03',
                        fromContentEvent:'change',
                        executeType:'trigger_method',
                        executeContentUUID:'form-item_interactive-executeScript'+t.key,
                        executeContentMethodName:'itemShowOrHide',
                        executeArgument: "params[0]==='custom_script'?true:false"
                    },{
                        uuid:'interactive-executeType_04',
                        fromContentEvent:'change',
                        executeType:'trigger_method',
                        executeContentUUID:'form-item_interactive-containerMethodName'+t.key,
                        executeContentMethodName:'itemShowOrHide',
                        executeArgument: "params[0]==='container_method'?true:false"
                    }]
                },{                      
                    uuid:'interactive-executeContentUUID'+t.key,
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
                        executeContentUUID:'interactive-executeContentMethodName'+t.key,
                        executeContentMethodName:'linkage'
                    }],
                },{                      
                    uuid:'interactive-executeContentMethodName'+t.key,
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
                    uuid:'interactive-executeScript'+t.key,
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
                    uuid:'interactive-containerMethodName'+t.key,
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
                            {prop: 'uuid',label: '标识',type:'defalut'},
                            {prop: 'fromContentUUID',label: '事件积木',type:'defalut'
                            },
                            {prop:'fromContentEvent',
                                label:'事件',               
                            },
                            //{prop: 'executeArgument',label: '参数'},
                            {prop: 'executeType',label: '方法类型'},
                            {prop: 'executeContentUUID',label: '目标'},
                            {prop: 'executeContentMethodName',label: '目标积木方法'},
                            {prop: 'executeScript',label: '巴斯'},
                            {prop: 'containerMethodName',label: '容器方法'}
                        ]
                    },
                    interactives: [
                        {
                            "uuid": "95270",
                            "fromContentUUID": "interactiveEditor",
                            "fromContentEvent": "edit",
                            "executeType": "trigger_method",
                            "executeContentUUID": "interactive_add_button_form",
                            "executeContentMethodName": "showDialog"
                        }
                    ]
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
                            title:'bounce',
                            value:'bounce',
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
                                    title:'bounce',
                                    value:'bounce'
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
                //积木属性必填字段
                t.formItemFieldsBase = [{                       
                            uuid: _TY_Tool.uuid(),
                            alias: 'bb-input', //布局类积木 || 普通积木
                            aliasName: '积木名称', 
                            attributes: {
                                attributeName:'aliasName',
                                rules:[{ required: true, message: '请输入积木名称', trigger: 'blur' }]
                            }, //积木属性
                            animation: [{ //动画
                            }],
                            interactives: [{ //触发交互
                            }],
                            layout: {} //积木布局,
                        },{                       
                            uuid: _TY_Tool.uuid(),
                            alias: 'bb-select', //布局类积木 || 普通积木
                            aliasName: '选择积木', 
                            attributes: {
                                show:t.showBBSelect,
                                attributeName:'alias',
                                textField:"name",
                                valueField:"alias",
                                ds:t.bbFieldsDs,
                                rules:[{ required: true, message: '请输入积木名称', trigger: 'blur' }]
                            }, //积木属性
                            animation: [{ //动画
                            }],
                            interactives: [{
                                uuid:_TY_Tool.uuid(),
                                fromContentEvent:'change',
                                executeType:'trigger_method',
                                executeArgument:'t.$parent.$parent.$parent.$parent.$parent.bbChange(params[0])',
                            },{
                                uuid:_TY_Tool.uuid(),
                                fromContentEvent:'mounted',
                                executeType:'trigger_method',
                                executeArgument:'t.$parent.$parent.$parent.$parent.$parent.bbChange(params[0])',
                            }],
                            layout: {} //积木布局,
                        },{                       
                            uuid: _TY_Tool.uuid(),
                            alias: 'bb-words', //布局类积木 || 普通积木
                            aliasName: '积木别名', 
                            attributes: {
                                attributeName:'alias'
                            }, //积木属性
                            animation: [{ //动画
                            }],
                            interactives: [],
                            layout: {} //积木布局,
                        },{                       
                            uuid: _TY_Tool.uuid(),
                            alias: 'bb-words', //布局类积木 || 普通积木
                            aliasName: '积木标识', 
                            attributes: {
                                attributeName:'uuid',
                            }, //积木属性
                            animation: [{ //动画
                            }],
                            interactives: [],
                            layout: {} //积木布局,
                        }]
                if(t.bbType == "Container" || t.valueBase.type == 'Form' && t.showBBSelect){
                    t.formItemFieldsBase.push({                       
                            uuid: _TY_Tool.uuid(),
                            alias: 'bb-input', //布局类积木 || 普通积木
                            aliasName: '积木分组', 
                            attributes: {
                                attributeName:'group',
                            }, //积木属性
                            animation: [{ //动画
                            }],
                            interactives: [],
                            layout: {} //积木布局,
                        });
                }else{
                    t.formItemFieldsBase.forEach((ele,index)=>{
                        if(ele.attributes.attributeName == "bb-input"){
                            t.formItemFieldsBase.splice(index,1);
                        }
                    })
                }
                //设置表单项积木时需要额外增的字段
                t.formItemFields = [{                      
                            attributeName:'attributeName',
                            et:'bb-input',                   
                            name:'字段别名',
                            group:'表单选项',
                            description:"",                               
                            props:{
                            },
                            rules:[{ required: true, message: '请输入字段别名', trigger: 'blur' }]
                        },{                      
                            attributeName:'display',
                            et:'bb-select',
                            group:'表单选项',                 
                            name:'块级样式',
                            description:"display设置",                               
                            props:{
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
                            }
                        },{                      
                            attributeName:'hideLabel',
                            et:'bb-editor-switch',
                            group:'表单选项',                 
                            name:'隐藏标题',
                            description:"不显示表单项标题",                               
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
                                "defaultValTpl":true
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
                                            value: "number"
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