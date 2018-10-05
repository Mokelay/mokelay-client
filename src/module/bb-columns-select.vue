<template>
    <div>
        <bb-button-array :fields="fields" :customTopBtns="customTopBtns" settingText="设置按钮" v-model="table" :on="on" @commit="commit" arrayDescTpl="按钮:<%text%>"></bb-button-array>
    </div>
</template>

<script>
    export default {
        name: 'bb-columns-select',
        props: {
            value:{
                type:[Array,String]
            }
        },
        data() {
            return {
                //bb-array 顶部自定义按钮
                customTopBtns:[{
                    style:{},//css样式
                    type:'text',//按钮样式
                    disabled:false,//按钮是否可编辑
                    size:'small',//按钮大小
                    icon:'ty-icon_jzds',//按钮图标
                    text:'快速添加',//
                    action:'buzz',
                    buzz:'ty_ds_column_quick_select'
                }],
                fields: [{
                    name: '名称',
                    attributeName: 'label',
                    et: 'bb-input',
                    rules: [],
                    description:'表头中文名称',
                    props: {}
                }, {
                    name: '变量名',
                    attributeName: 'prop',
                    et: 'bb-input',
                    description:'接口返回的字段',
                    rules: [],
                    props: {}
                }, {
                    name: '筛选条件',
                    attributeName: 'filter',
                    hide:true,
                    et: 'bb-list',
                    rules: [],
                    description:'根据条件展示表单内数据',
                    props: {
                        editConfig:{
                            editable:['add','edit','up','down','remove']
                        },
                        columns:[
                            {prop:'text',label:'条件名称',type:"defalut",et:"bb-input",etProp:{}},
                            {prop:'value',label:'条件别名',type:"defalut",et:"bb-input",etProp:{}}
                        ]
                    }
                }, {
                    name: '宽度',
                    attributeName: 'width',
                    description:'表单项的宽度 50% 200px',
                    hide:true,
                    et: 'bb-input',
                    rules: [],
                    props: {}
                }, {
                    pbbId:'type',
                    name: '表头类型',
                    attributeName: 'type',
                    description:'默认：直接显示接口字段数据;按钮组：可以添加操作当前列表的按钮，如删除，编辑等;自定义模板:通过映射转换需要展示的数据;显示图片:传入逗号隔开的图片地址数组',
                    hide:true,
                    et: 'bb-select',
                    rules: [],
                    props: {
                        fields: [{
                            text: '默认',
                            value: 'default'
                        }, {
                            text: '积木',
                            value: 'bb'
                        },{
                            text: '按钮组',
                            value: 'button-group'
                        }, {
                            text: '可编辑项',
                            value: 'edit'
                        }, {
                            text: '显示图片',
                            value: 'picture'
                        }, {
                            text: '自定义模板',
                            value: 'template'
                        }]
                    }
                }, {
                    pbbId:'buttons',
                    name: '按钮组',
                    attributeName: 'buttons',
                    hide:true,
                    show:false,
                    et: 'bb-array',
                    rules: [],
                    props: {
                        on:[
                            {pbbId:'action',triggerEventName:'change',executeArgument:`debugger;var type = params[0];if(type == "url"){t.$parent.$parent.hideAndShowFormItem(["form-item_url","form-item_urlType"],["form-item_dialogTitle","form-item_ds","form-item_callBackStaticWords","form-item_confirmTitle","form-item_confirmText","form-item_buzz","form-item_dialogPage"]);}else if(type == "execute-ds"){t.$parent.$parent.hideAndShowFormItem(["form-item_ds","form-item_callBackStaticWords","form-item_confirmTitle","form-item_confirmText"],["form-item_url","form-item_urlType","form-item_dialogTitle","form-item_buzz","form-item_dialogPage"]);}else if(type == "buzz"){t.$parent.$parent.hideAndShowFormItem(["form-item_buzz"],["form-item_url","form-item_urlType","form-item_dialogTitle","form-item_ds","form-item_callBackStaticWords","form-item_confirmTitle","form-item_confirmText","form-item_dialogPage"]);}else if(type == "dialog-page"){t.$parent.$parent.hideAndShowFormItem(["form-item_dialogTitle","form-item_dialogPage"],["form-item_url","form-item_urlType","form-item_ds","form-item_callBackStaticWords","form-item_confirmTitle","form-item_confirmText","form-item_buzz"]);}`},
                            {pbbId:'action',triggerEventName:'mounted',executeArgument:`debugger;var type = params[0];if(type == "url"){t.$parent.$parent.hideAndShowFormItem(["form-item_url","form-item_urlType"],["form-item_dialogTitle","form-item_ds","form-item_callBackStaticWords","form-item_confirmTitle","form-item_confirmText","form-item_buzz","form-item_dialogPage"]);}else if(type == "execute-ds"){t.$parent.$parent.hideAndShowFormItem(["form-item_ds","form-item_callBackStaticWords","form-item_confirmTitle","form-item_confirmText"],["form-item_url","form-item_urlType","form-item_dialogTitle","form-item_buzz","form-item_dialogPage"]);}else if(type == "buzz"){t.$parent.$parent.hideAndShowFormItem(["form-item_buzz"],["form-item_url","form-item_urlType","form-item_dialogTitle","form-item_ds","form-item_callBackStaticWords","form-item_confirmTitle","form-item_confirmText","form-item_dialogPage"]);}else if(type == "dialog-page"){t.$parent.$parent.hideAndShowFormItem(["form-item_dialogTitle","form-item_dialogPage"],["form-item_url","form-item_urlType","form-item_ds","form-item_callBackStaticWords","form-item_confirmTitle","form-item_confirmText","form-item_buzz"]);}`}
                        ],
                        fields: [{
                            pbbId:"text",
                            name: '按钮文字',
                            attributeName: 'text',
                            et: 'bb-input',
                            props: {}
                        },{
                            pbbId:"size",
                            name: '大小',
                            attributeName: 'size',
                            show:false,
                            hide:true,
                            et: 'bb-select',
                            props: {
                                fields:[
                                    {text:"大",value:"medium"},
                                    {text:"中",value:"small"},
                                    {text:"小",value:"mini"},
                                ]
                            }
                        }, {
                            pbbId:"wordColor",
                            name: '文字颜色',
                            attributeName: 'wordColor',
                            show:false,
                            hide:true,
                            et: 'bb-input',
                            props: {}
                        }, {
                            pbbId:"buttonType",
                            name: '按钮类型',
                            attributeName: 'buttonType',
                            hide:false,
                            show:true,
                            et: 'bb-select',
                            props: {
                                options: [{
                                    text: '默认',
                                    value: 'default'
                                }, {
                                    text: '弹窗',
                                    value: 'dialog'
                                }, {
                                    text: '弹窗选择器',
                                    value: 'popup'
                                }]
                            }
                        }, {
                            pbbId:"type",
                            name: '主题',
                            attributeName: 'type',
                            hide:true,
                            et: 'bb-select',
                            props: {
                                options: [{
                                    text: '默认',
                                    value: 'default'
                                }, {
                                    text: '主要',
                                    value: 'primary'
                                }, {
                                    text: '成功',
                                    value: 'success'
                                }, {
                                    text: '警告',
                                    value: 'warning'
                                }, {
                                    text: '危险',
                                    value: 'danger'
                                }, {
                                    text: '信息',
                                    value: 'info'
                                }, {
                                    text: '文本',
                                    value: 'text'
                                }]
                            }
                        }, {
                            pbbId:"icon",
                            name: '图标',
                            attributeName: 'icon',
                            hide:true,
                            et: 'bb-icon-select',
                            props: {}
                        }, {
                            pbbId:"showKey",
                            name: '状态变量',
                            show:true,
                            description:"根据接口中某个关键字控制按钮展示",
                            attributeName: 'showKey',
                            hide:true,
                            et: 'bb-input',
                        }, {
                            pbbId:"keyType",
                            name: '变量类型',
                            show:true,
                            description:"改变量的数据类型",
                            attributeName: 'keyType',
                            hide:true,
                            et: 'bb-select',
                            props:{
                                fields: [{
                                    text: "字符串",
                                    value: "string"
                                },{
                                    text: "数字",
                                    value: "number"
                                }]
                            }
                        }, {
                            pbbId:"showValue",
                            name: '显示值',
                            show:true,
                            description:"按钮展示的值",
                            attributeName: 'showValue',
                            hide:true,
                            et: 'bb-input',
                        }, {
                            pbbId:"action",
                            name: '执行动作',
                            attributeName: 'action',
                            description:"按钮类型选择默认时需要配置此项",
                            et: 'bb-select',
                            props: {
                                options: [{
                                    text: 'URL跳转',
                                    value: 'url'
                                }, {
                                    text: '执行接口',
                                    value: 'execute-ds'
                                }, {
                                    text: '执行巴斯',
                                    value: 'buzz'
                                }, {
                                    text: '页面对话框',
                                    value: 'dialog-page'
                                }]
                            }
                        }, {
                            pbbId:"dialogTitle",
                            name: '弹窗标题',
                            show:false,
                            attributeName: 'dialogTitle',
                            description:"点击类型为‘页面对话框’时有效",
                            et: 'bb-input',
                            props: {}
                        },{
                            pbbId:"url",
                            name: '跳转页面',
                            show:false,
                            attributeName: 'url',
                            description:"点击类型选择URL跳转时需要填写",
                            hide:true,
                            et: 'bb-input',
                            props: {}
                        }, {
                            pbbId:"urlType",
                            name: '跳转方式',
                            show:false,
                            attributeName: 'urlType',
                            description:"点击类型选择URL跳转时需要填写",
                            hide:true,
                            et: 'bb-select',
                            props: {
                                options: [{
                                    text: '在本页面中打开',
                                    value: 'default'
                                }, {
                                    text: '在新标签中打开',
                                    value: 'openWindow'
                                }]
                            }
                        }, {
                            pbbId:"ds",
                            name: '执行接口',
                            show:false,
                            attributeName: 'ds',
                            description:"点击类型选择执行接口时需要填写",
                            hide:true,
                            et: 'bb-ds-select',
                            props: {}
                        }, {
                            pbbId:"callBackStaticWords",
                            name: '成功提示',
                            show:false,
                            description:"点击类型选择执行接口时需要填写",
                            attributeName: 'callBackStaticWords',
                            hide:true,
                            et: 'bb-input',
                            props: {}
                        }, {
                            pbbId:"confirmTitle",
                            name: '提示标题',
                            show:false,
                            description:"点击类型选择执行接口时需要填写",
                            attributeName: 'confirmTitle',
                            hide:true,
                            et: 'bb-input',
                            props: {}
                        }, {
                            pbbId:"confirmText",
                            name: '提示文本',
                            show:false,
                            description:"点击类型选择执行接口时需要填写",
                            attributeName: 'confirmText',
                            hide:true,
                            et: 'bb-input',
                            props: {}
                        }, {
                            pbbId:"buzz",
                            name: '设置巴斯',
                            show:false,
                            description:"点击类型选择执行巴斯时需要填写",
                            attributeName: 'buzz',
                            hide:true,
                            et: 'bb-select',
                            props: {
                                ds:{api: "/list-buzz",method: "get",inputs: [],outputs: [{dataKey: "fields", valueKey: "data_list"}]},
                                textField:'name',
                                valueField:"alias"
                            }
                        }, {
                            pbbId:"dialogPage",
                            name: '页面别名',
                            show:false,
                            description:"点击类型选择页面对话框时需要填写",
                            attributeName: 'dialogPage',
                            hide:true,
                            et: 'bb-input',
                            props: {}
                        }, {
                            pbbId:"dialog",
                            name: '弹窗配置',
                            show:true,
                            attributeName: 'dialog',
                            description:"按钮类型选择弹窗时需要配置此项",
                            hide:true,
                            et: 'bb-button-form',
                            props: {
                                fields: [{
                                    name: '弹窗积木名称',
                                    attributeName: 'alias',
                                    et: 'bb-bblist-select',
                                },{
                                    name: '弹窗积木配置',
                                    attributeName: 'config',
                                    et: 'bb-editor-code',
                                }]
                            }

                        }, {
                            pbbId:"popupConfig",
                            name: '弹窗选择器配置',
                            show:false,
                            attributeName: 'popupConfig',
                            description:"按钮类型选择弹窗选择器时需要配置此项",
                            hide:true,
                            et: 'bb-button-form',
                            props: {
                                fields: [{
                                    name: '默认值',
                                    attributeName: 'value',
                                    et: 'bb-input',
                                }, {
                                    name: '选项名称',
                                    attributeName: 'textField',
                                    et: 'bb-input'
                                }, {
                                    name: '选项值字段',
                                    attributeName: 'valueField',
                                    et: 'bb-input'
                                }, {
                                    name: '表单名称',
                                    attributeName: 'title',
                                    et: 'bb-input'
                                }, {
                                    name: '遮罩层显示',
                                    attributeName: 'showModal',
                                    et: 'bb-editor-switch'
                                }, {
                                    name: '主按钮配置',
                                    attributeName: 'buttonConfig',
                                    et: 'bb-button-select'
                                }, {
                                    name: '确认按钮组配置',
                                    attributeName: 'popupButtons',
                                    et: 'bb-editor-code'
                                }, {
                                    name: '数据源',
                                    attributeName: 'popupGrid',
                                    et: 'bb-form',
                                    props: {
                                        fields: [{
                                            name: '表单动态数据源',
                                            attributeName: 'ds',
                                            et: 'bb-ds-select',
                                            rules: [],
                                            props: {},
                                        }, {
                                            name: '表头',
                                            attributeName: 'columns',
                                            et: 'bb-columns-select',
                                            rules: [],
                                            props: {},
                                        }, {
                                            name: '是否显示表头',
                                            attributeName: 'showHeader',
                                            et: 'bb-editor-switch',
                                            rules: [],
                                            props: {},
                                        }, {
                                            name: '支持多选',
                                            attributeName: 'selection',
                                            et: 'bb-editor-switch',
                                            rules: [],
                                            props: {},
                                        }, {
                                            name: '支持分页',
                                            attributeName: 'pagination',
                                            et: 'bb-editor-switch',
                                            rules: [],
                                            props: {},
                                        }, {
                                            name: '搜索按钮配置',
                                            attributeName: 'buttonConfig',
                                            et: 'bb-button-form',
                                            props: {
                                                fields: [{
                                                    name: '按钮类型',
                                                    attributeName: 'searchType',
                                                    et: 'bb-select',
                                                    props: {
                                                        fields: [{
                                                            value: 'default',
                                                            text: '默认'
                                                        }, {
                                                            value: 'primary',
                                                            text: '主要'
                                                        }, {
                                                            value: 'text',
                                                            text: '文字'
                                                        }]
                                                    }
                                                }]
                                            },
                                        }, {
                                            name: '搜索配置',
                                            attributeName: 'searchConfig',
                                            et: 'bb-button-form',
                                            props: {
                                                fields: [{
                                                    name: '搜索框类型',
                                                    attributeName: 'searchType',
                                                    et: 'bb-select',
                                                    props: {
                                                        fields: [{
                                                            value: 'searchInput',
                                                            text: '输入框'
                                                        }, {
                                                            value: 'searchSelection',
                                                            text: '标签选择器'
                                                        }]
                                                    }
                                                }, {
                                                    name: '选择器类型',
                                                    attributeName: 'type',
                                                    et: 'bb-select',
                                                    props: {
                                                        fields: [{
                                                            value: 'radio',
                                                            text: '单选'
                                                        }, {
                                                            value: 'checkbox',
                                                            text: '多选'
                                                        }]
                                                    }
                                                }, {
                                                    name: '标签内容',
                                                    attributeName: 'searchKeys',
                                                    et: 'bb-array',
                                                    props: {
                                                        fields: [{
                                                            name: '值',
                                                            attributeName: 'value',
                                                            et: 'bb-input',
                                                            rules: [],
                                                            props: {},
                                                        }, {
                                                            name: '显示名称',
                                                            attributeName: 'text',
                                                            et: 'bb-input',
                                                            rules: [],
                                                            props: {},
                                                        }]
                                                    }
                                                }, {
                                                    name: '标签数据源',
                                                    attributeName: 'ds',
                                                    et: 'bb-ds-select'
                                                }, {
                                                    name: '显示内容',
                                                    attributeName: 'optionText',
                                                    et: 'bb-input'
                                                }, {
                                                    name: '对应值',
                                                    attributeName: 'optionValue',
                                                    et: 'bb-input'
                                                }]
                                            }
                                        }]
                                    }
                                }]
                            }
                        }]
                    }
                }, {
                    pbbId:'content',
                    name: '积木内容',
                    attributeName: 'content',
                    et: 'bb-config-array',
                    hide:true,
                    show:false,
                    rules: [],
                    props: {}
                }, {
                    pbbId:'template',
                    name: '表头模板类型',
                    attributeName: 'template',
                    et: 'bb-select',
                    hide:true,
                    show:false,
                    rules: [],
                    props: {
                        fields: [{
                            value: 'default',
                            text: '无'
                        }, {
                            value: 'judge',
                            text: '判断'
                        }, {
                            value: 'custom',
                            text: '自定义键值对'
                        }, {
                            value: 'staticWords',
                            text: '静态字段'
                        }, {
                            value: 'file',
                            text: '自定义模板'
                        }, {
                            value: 'html',
                            text: 'html模板'
                        }, {
                            value: 'tpl',
                            text: '模板'
                        }]
                    }
                }, {
                    pbbId:'templateProp',
                    name: '自定义模板参数',
                    attributeName: 'templateProp',
                    et: 'bb-array',
                    hide:true,
                    show:false,
                    rules: [],
                    props: {
                        fields: [{
                            name: '名称',
                            attributeName: 'name',
                            et: 'bb-input',
                            rules: [],
                            props: {}
                        }, {
                            name: '别名',
                            attributeName: 'alias',
                            et: 'bb-input',
                            rules: [],
                            props: {}
                        }]
                    }
                }, {
                    pbbId:'tpl',
                    name: '模板',
                    attributeName: 'tpl',
                    et: 'bb-input',
                    hide:true,
                    show:false,
                    rules: [],
                    props: {
                    }
                }, {
                    pbbId:'file',
                    name: '自定义模板路径',
                    attributeName: 'file',
                    et: 'bb-input',
                    hide:true,
                    show:false,
                    rules: [],
                    props: {}
                }, {
                    pbbId:'staticWords',
                    name: '静态字段填写',
                    attributeName: 'staticWords',
                    hide:true,
                    show:false,
                    et: 'bb-input'
                }, {
                    pbbId:'valueKey',
                    name: '值对象来源',
                    attributeName: 'valueKey',
                    hide:true,
                    show:false,
                    et: 'bb-select',
                    props: {
                        fields: [{
                            text: '组件对象',
                            value: 'bb'
                        }, {
                            text: '路由数据',
                            value: 'router'
                        }, {
                            text: '列数据',
                            value: 'row-data'
                        }]
                    }
                }, {
                    name: '编辑器类型',
                    attributeName: 'et',
                    hide:true,
                    et: 'bb-select',
                    props: {
                         textField: 'name',
                         valueField: 'alias',
                         ds: {
                             "api": "list-bb",
                             "category": "config",
                             "method": "post",
                             "inputs": [],
                             "outputs": [{
                                 "dataKey": "fields",
                                 "valueKey": "data_list"
                            }]
                         }
                    }
                }, {
                    name: "表单验证",
                    attributeName: "rules",
                    hide: true,
                    et: "bb-array",
                    props: {
                        defaultFormData: {
                            required: false,
                            type: "string",
                            trigger: "blur"
                        },
                        fields: [{
                            name: "是否必填",
                            attributeName: "required",
                            et: "bb-editor-switch",
                            rules: [],
                            props: {}
                        }, {
                            name: "数据类型",
                            attributeName: "type",
                            et: "bb-select",
                            rules: [],
                            props: {
                                fields: [{
                                    text: "整数(number)",
                                    value: "number"
                                }, {
                                    text: "浮点数(Double)",
                                    value: "double"
                                }, {
                                    text: "布尔值(Boolean)",
                                    value: "boolean"
                                }, {
                                    text: "字符串(String)",
                                    value: "string"
                                }, {
                                    text: "日期(Date)",
                                    value: "date"
                                }, {
                                    text: "日期时间(DateTime)",
                                    value: "time"
                                }, {
                                    text: "对象(Object)",
                                    value: "object"
                                }, {
                                    text: "数组(Array)",
                                    value: "array"
                                }, {
                                    text: "文件(File)",
                                    value: "multipart"
                                }]
                            }
                        }, {
                            name: "提示",
                            attributeName: "message",
                            et: "bb-input",
                            rules: [],
                            props: {}
                        }, {
                            name: "最小长度",
                            attributeName: "min",
                            et: "bb-input-number",
                            rules: [],
                            props: {}
                        }, {
                            name: "最大长度",
                            attributeName: "max",
                            et: "bb-input-number",
                            rules: [],
                            props: {}
                        }, {
                            name: "自定义验证方法",
                            attributeName: "validatePass",
                            et: "bb-editor-code",
                            group: "额外选项",
                            rules: [],
                            props: {
                                returnObj: true
                            }
                        }]
                    }
                }, {
                    name: '编辑器属性',
                    attributeName: 'etProp',
                    hide:true,
                    et: 'bb-editor-code',
                    props: {
                        
                    }
                }, {
                    name: '编辑器交互',
                    attributeName: 'etOn',
                    et: 'bb-editor-code',
                    hide:true,
                    props: {
                        returnObj:true
                    }
                }, {
                    name: '是否添加后不能修改',
                    hide:true,
                    attributeName: 'onlyAddEditShow',
                    et: 'bb-editor-switch'
                }],
                on:[
                    {pbbId:'type',triggerEventName:'change',executeArgument:`var type = params[0];if(type == "bb"){t.$parent.$parent.hideAndShowFormItem(["form-item_content"],["form-item_buttons","form-item_template","form-item_file","form-item_templateProp","form-item_valueKey","form-item_staticWords"]);}else if(type == "button-group"){t.$parent.$parent.hideAndShowFormItem(["form-item_buttons"],["form-item_content","form-item_template","form-item_file","form-item_templateProp","form-item_valueKey","form-item_staticWords"]);}else if(type == "template"){t.$parent.$parent.hideAndShowFormItem(["form-item_template"],["form-item_content","form-item_buttons","form-item_file","form-item_templateProp","form-item_valueKey","form-item_staticWords"]);}else if(type == "edit"){t.$parent.$parent.hideAndShowFormItem([],["form-item_template","form-item_content","form-item_buttons","form-item_file","form-item_templateProp","form-item_valueKey","form-item_staticWords"]);}else if(type == "picture"){t.$parent.$parent.hideAndShowFormItem([],["form-item_template","form-item_content","form-item_buttons","form-item_file","form-item_templateProp","form-item_valueKey","form-item_staticWords"]);}else if(type == "default"){t.$parent.$parent.hideAndShowFormItem([],["form-item_template","form-item_content","form-item_buttons","form-item_file","form-item_templateProp","form-item_valueKey","form-item_staticWords"]);}`},
                    {pbbId:'type',triggerEventName:'mounted',executeArgument:`var type = params[0];if(type == "bb"){t.$parent.$parent.hideAndShowFormItem(["form-item_content"],["form-item_buttons","form-item_template","form-item_file","form-item_templateProp","form-item_valueKey","form-item_staticWords"]);}else if(type == "button-group"){t.$parent.$parent.hideAndShowFormItem(["form-item_buttons"],["form-item_content","form-item_template","form-item_file","form-item_templateProp","form-item_valueKey","form-item_staticWords"]);}else if(type == "template"){t.$parent.$parent.hideAndShowFormItem(["form-item_template"],["form-item_content","form-item_buttons","form-item_file","form-item_templateProp","form-item_valueKey","form-item_staticWords"]);}else if(type == "edit"){t.$parent.$parent.hideAndShowFormItem([],["form-item_template","form-item_content","form-item_buttons","form-item_file","form-item_templateProp","form-item_valueKey","form-item_staticWords"]);}else if(type == "picture"){t.$parent.$parent.hideAndShowFormItem([],["form-item_template","form-item_content","form-item_buttons","form-item_file","form-item_templateProp","form-item_valueKey","form-item_staticWords"]);}else if(type == "default"){t.$parent.$parent.hideAndShowFormItem([],["form-item_template","form-item_content","form-item_buttons","form-item_file","form-item_templateProp","form-item_valueKey","form-item_staticWords"]);}`},
                    {pbbId:'template',triggerEventName:'change',executeArgument:`var type = params[0];if(type == "custom"){t.$parent.$parent.hideAndShowFormItem(["form-item_templateProp","form-item_valueKey"],["form-item_tpl","form-item_file","form-item_staticWords"]);}else if(type == "staticWords"){t.$parent.$parent.hideAndShowFormItem(["form-item_staticWords"],["form-item_templateProp","form-item_valueKey","form-item_file","form-item_tpl"]);}else if(type == "file"){t.$parent.$parent.hideAndShowFormItem(["form-item_file"],["form-item_templateProp","form-item_tpl","form-item_valueKey","form-item_staticWords"]);}else if(type == "tpl"){t.$parent.$parent.hideAndShowFormItem(["form-item_tpl"],["form-item_templateProp","form-item_valueKey","form-item_staticWords","form-item_file"]);}`},
                    {pbbId:'template',triggerEventName:'mounted',executeArgument:`var type = params[0];if(type == "custom"){t.$parent.$parent.hideAndShowFormItem(["form-item_templateProp","form-item_tpl","form-item_valueKey"],["form-item_file","form-item_staticWords"]);}else if(type == "staticWords"){t.$parent.$parent.hideAndShowFormItem(["form-item_staticWords"],["form-item_tpl","form-item_templateProp","form-item_valueKey","form-item_file"]);}else if(type == "file"){t.$parent.$parent.hideAndShowFormItem(["form-item_file"],["form-item_templateProp","form-item_tpl","form-item_valueKey","form-item_staticWords"]);}else if(type == "tpl"){t.$parent.$parent.hideAndShowFormItem(["form-item_tpl"],["form-item_templateProp","form-item_valueKey","form-item_staticWords","form-item_file"]);}`}
                ],
                table:this.value,
            }
        },
        watch: {
            value(val){
                if (typeof val === 'array') {
                    this.table = val;
                } else if (typeof val === 'string') {
                    this.table = (val ? JSON.parse(val) : {});
                }
            },
            table(val){
            }
        },
        created: function () {
        },
        mounted:function(){
        },
        methods: {
            commit:function(array){
                this.$emit('input',array);
            }
        }
    }
</script>