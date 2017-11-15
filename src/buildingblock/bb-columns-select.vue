<template>
    <div>
        <bb-button-array :fields="fields" settingText="设置按钮" v-model="table" arrayDescTpl="按钮:<%text%>"></bb-button-array>
    </div>
</template>

<script>
    export default {
        name: 'bb-columns-select',
        props: {
            value:{
                type:[Array]
            }
        },

        data() {
            return {
                fields: [{
                    name: '表头名称',
                    attributeName: 'label',
                    et: 'bb-input',
                    rules: [],
                    props: {}
                }, {
                    name: '表头变量名',
                    attributeName: 'prop',
                    et: 'bb-input',
                    rules: [],
                    props: {}
                }, {
                    name: '表头宽度',
                    attributeName: 'width',
                    et: 'bb-input',
                    rules: [],
                    props: {}
                }, {
                    name: '表头类型',
                    attributeName: 'type',
                    et: 'bb-select',
                    rules: [],
                    props: {
                        fields: [{
                            text: '默认',
                            value: 'default'
                        }, {
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
                    name: '按钮组',
                    attributeName: 'buttons',
                    et: 'bb-array',
                    rules: [],
                    props: {
                        fields: [{
                            name: '按钮文字',
                            attributeName: 'text',
                            et: 'bb-input',
                            props: {}
                        }, {
                            name: '文字颜色',
                            attributeName: 'wordColor',
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
                                    text: '弹窗',
                                    value: 'dialog'
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
                            name: '点击类型',
                            attributeName: 'action',
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
                            name: '跳转页面',
                            attributeName: 'url',
                            et: 'bb-input',
                            props: {}
                        }, {
                            name: '跳转方式',
                            attributeName: 'urlType',
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
                            name: '执行接口',
                            attributeName: 'ds',
                            et: 'bb-ds-select',
                            props: {}
                        }, {
                            name: '接口执行成功系统提示静态文字',
                            attributeName: 'callBackStaticWords',
                            et: 'bb-input',
                            props: {}
                        }, {
                            name: '提示标题',
                            attributeName: 'confirmTitle',
                            et: 'bb-input',
                            props: {}
                        }, {
                            name: '提示文本',
                            attributeName: 'confirmText',
                            et: 'bb-input',
                            props: {}
                        }, {
                            name: '设置巴斯',
                            attributeName: 'buzz',
                            et: 'bb-input',
                            props: {}
                        }, {
                            name: '页面对话框页面别名',
                            attributeName: 'dialogPage',
                            et: 'bb-input',
                            props: {}
                        }, {
                            name: '执行回调',
                            attributeName: 'callback',
                            et: 'bb-select',
                            props: {
                                fields: [{
                                    value: 'refresh',
                                    text: '刷新'
                                }, {
                                    value: 'custom',
                                    text: '自定义'
                                }]
                            }
                        }, {
                            name: '按钮显示状态控制变量',
                            attributeName: 'showKey',
                            et: 'bb-input',
                        }, {
                            name: '按钮显示变量值',
                            attributeName: 'showValue',
                            et: 'bb-input',
                        }, {
                            name: '弹窗配置',
                            attributeName: 'dialog',
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
                            name: '弹窗选择器配置',
                            attributeName: 'popupConfig',
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
                                    name: '按钮配置',
                                    attributeName: 'buttonConfig',
                                    et: 'bb-button-select'
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
                        }],
                    }
                }, {
                    name: '表头模板类型',
                    attributeName: 'template',
                    et: 'bb-select',
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
                        }]
                    }
                }, {
                    name: '自定义模板参数',
                    attributeName: 'templateProp',
                    et: 'bb-array',
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
                    name: '自定义模板路径',
                    attributeName: 'file',
                    et: 'bb-input',
                    rules: [],
                    props: {}
                }, {
                    name: '静态字段填写',
                    attributeName: 'staticWords',
                    et: 'bb-input'
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
                this.$emit("input",val);
            },
            table(val){
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