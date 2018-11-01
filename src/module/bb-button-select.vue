<template>
    <div>
        <bb-button-form :fields="fields" @commit="commit" settingText="设置按钮" v-model="btn" formDescTpl="按钮:<%=text%>" :on="on" size="mini" labelWidth="80px"></bb-button-form>
    </div>
</template>

<script>
    export default {
        name: 'bb-button-select',
        props: {
            value:{
                type:[String,Object]
            }
        },
        data() {
            return {
                fields: [{
                    pbbId:"text",
                    name: '按钮文字',
                    attributeName: 'selectText',
                    et: 'bb-input',
                    props: {}
                }, {
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
                    hide:true,
                    show:false,
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
                    pbbId:"showValue",
                    name: '显示隐藏',
                    show:true,
                    description:"返回true显示 返回false隐藏 <%=bb.key == 1?true:false%>",
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
                    pbbId:"showKey",
                    name: '状态变量',
                    show:false,
                    description:"根据接口中某个关键字控制按钮展示",
                    attributeName: 'showKey',
                    hide:true,
                    et: 'bb-input',
                }, {
                    pbbId:"showValue",
                    name: '显示值',
                    show:false,
                    description:"按钮展示的值",
                    attributeName: 'showValue',
                    hide:true,
                    et: 'bb-input',
                }],
                btn:this.value,
                on:[
                    {pbbId:'action',triggerEventName:'change',executeArgument:`debugger;var type = params[0];if(type == "url"){t.$parent.$parent.hideAndShowFormItem(["form-item_url","form-item_urlType"],["form-item_dialogTitle","form-item_ds","form-item_callBackStaticWords","form-item_confirmTitle","form-item_confirmText","form-item_buzz","form-item_dialogPage"]);}else if(type == "execute-ds"){t.$parent.$parent.hideAndShowFormItem(["form-item_ds","form-item_callBackStaticWords","form-item_confirmTitle","form-item_confirmText"],["form-item_url","form-item_urlType","form-item_dialogTitle","form-item_buzz","form-item_dialogPage"]);}else if(type == "buzz"){t.$parent.$parent.hideAndShowFormItem(["form-item_buzz"],["form-item_url","form-item_urlType","form-item_dialogTitle","form-item_ds","form-item_callBackStaticWords","form-item_confirmTitle","form-item_confirmText","form-item_dialogPage"]);}else if(type == "dialog-page"){t.$parent.$parent.hideAndShowFormItem(["form-item_dialogTitle","form-item_dialogPage"],["form-item_url","form-item_urlType","form-item_ds","form-item_callBackStaticWords","form-item_confirmTitle","form-item_confirmText","form-item_buzz"]);}`},
                    {pbbId:'action',triggerEventName:'mounted',executeArgument:`debugger;var type = params[0];if(type == "url"){t.$parent.$parent.hideAndShowFormItem(["form-item_url","form-item_urlType"],["form-item_dialogTitle","form-item_ds","form-item_callBackStaticWords","form-item_confirmTitle","form-item_confirmText","form-item_buzz","form-item_dialogPage"]);}else if(type == "execute-ds"){t.$parent.$parent.hideAndShowFormItem(["form-item_ds","form-item_callBackStaticWords","form-item_confirmTitle","form-item_confirmText"],["form-item_url","form-item_urlType","form-item_dialogTitle","form-item_buzz","form-item_dialogPage"]);}else if(type == "buzz"){t.$parent.$parent.hideAndShowFormItem(["form-item_buzz"],["form-item_url","form-item_urlType","form-item_dialogTitle","form-item_ds","form-item_callBackStaticWords","form-item_confirmTitle","form-item_confirmText","form-item_dialogPage"]);}else if(type == "dialog-page"){t.$parent.$parent.hideAndShowFormItem(["form-item_dialogTitle","form-item_dialogPage"],["form-item_url","form-item_urlType","form-item_ds","form-item_callBackStaticWords","form-item_confirmTitle","form-item_confirmText","form-item_buzz"]);}`}
                ]
            }
        },
        watch: {
            value(val){
                if (typeof val === 'object') {
                    this.btn = val;
                } else if (typeof val === 'string') {
                    this.btn = (val ? JSON.parse(val) : {});
                }
                //this.$emit("input",val);
            },
            btn(val){
                //this.$emit("input",val);
            }
        },
        created: function () {
        },
        mounted:function(){
        },
        methods: {
            loadChildBB(){
                let t=this;
                return _TY_Tool.loadChildBB(t);                
            },
            commit(formData){
                const t = this;
                t.$emit('input',formData);
                t.$emit('change',formData);
                t.$emit('commit',formData);
            }
        }
    }
</script>