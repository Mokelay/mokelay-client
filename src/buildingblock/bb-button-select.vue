<template>
    <div>
        <bb-button-form :fields="fields" settingText="设置按钮" v-model="btn" formDescTpl="按钮:<%=text%>"></bb-button-form>
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
                    name: '按钮文字',
                    attributeName: 'selectText',
                    et: 'bb-input',
                    props: {}
                }, {
                    name: '按钮类型',
                    attributeName: 'buttonType',
                    et: 'bb-select',
                    props: {
                        options: [{
                            text: '默认',
                            value: 'default'
                        }, {
                            text: '弹窗选择器',
                            value: 'popup'
                        }]
                    }
                }, {
                    name: '按钮样式',
                    attributeName: 'type',
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
                    name: '图标',
                    attributeName: 'icon',
                    et: 'bb-input',
                    props: {}
                }, {
                    name: '执行动作',
                    attributeName: 'action',
                    et: 'bb-select',
                    props: {
                        options: [{
                            text: '调接口',
                            value: 'execute-ds'
                        }, {
                            text: '地址跳转',
                            value: 'url'
                        }, {
                            text: '弹窗',
                            value: 'dialog-page'
                        }, {
                            text: '执行代码',
                            value: 'code'
                        }, {
                            text: '执行巴斯',
                            value: 'buzz'
                        }]
                    }
                }, {
                    name: '跳转URL',
                    attributeName: 'url',
                    et: 'bb-input',
                    props: {}
                }, {
                    name: '调用接口',
                    attributeName: 'ds',
                    et: 'bb-ds-select',
                    props: {}
                }, {
                    name: '设置巴斯',
                    attributeName: 'buzz',
                    et: 'bb-input',
                    props: {}
                }, {
                    name: '执行动作后刷新父列表',
                    attributeName: 'refreshParent',
                    et: 'bb-editor-switch',
                    props: {}
                },{
                    name: '执行回调',
                    attributeName: 'callback',
                    et: 'bb-select',
                    props: {
                        fields: [{
                            value: 'reflash',
                            text: '刷新'
                        }, {
                            value: 'custom',
                            text: '自定义'
                        }]
                    }
                }, {
                    name: '提交成功后跳转地址',
                    attributeName: 'goUrl',
                    et: 'bb-input',
                    props: {}
                }, {
                    name: '弹窗页面地址',
                    attributeName: 'dialogPage',
                    et: 'bb-input',
                    props: {}
                },  {
                    name: '确认弹窗标题',
                    attributeName: 'confirmTitle',
                    et: 'bb-input',
                    props: {}
                }, {
                    name: '确认弹窗内容',
                    attributeName: 'confirmText',
                    et: 'bb-input',
                    props: {}
                }, {
                    name: '操作成功后系统提示信息',
                    attributeName: 'callBackStaticWords',
                    et: 'bb-input',
                    props: {}
                }, {
                    name: '是否显示选择结果',
                    attributeName: 'showResult',
                    et: 'bb-editor-switch',
                    props: {}
                }, {
                    name: '值对象来源',
                    attributeName: 'valueKey',
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
                }],
                btn:this.value
            }
        },
        watch: {
            value(val){
                if (typeof val === 'object') {
                    this.btn = val;
                } else if (typeof val === 'string') {
                    this.btn = (val ? JSON.parse(val) : {});
                }
                this.$emit("input",val);
            },
            btn(val){
                this.$emit("input",val);
            }
        },
        created: function () {
        },
        mounted:function(){
        },
        methods: {
        }
    }
</script>