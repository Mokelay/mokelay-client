<script>
    import Util from '../libs/util.js'
    export default {
        name: 'bb-tree-select',
        render: function (createElement) {
            const t = this;
            if (t.canRender) {

                let treeDom = createElement('bb-tree', {
                    'class': '',
                    attrs: {},
                    domProps: {
                        value: t.p_value
                    },
                    props: {
                        nodeValue: t.nodeValue,
                        nodeText: t.nodeText,
                        parentKey: t.parentKey,
                        mainKey: t.mainKey,
                        multiple: t.multiple,
                        checkedField: t.p_checkedField,
                        opts: t.opts,
                        ds: t.ds
                    },
                    on: {
                        'tree-commit': treeCommit
                    },
                    ref: 'bbtree'
                }, []);

                let popDom = createElement('el-popover', {
                    'class': '',
                    attrs: {
                        width: '400',
                        placement: 'right',
                        trigger: 'click'
                    },
                    props: {},
                    on: {},
                    ref: 'popover1'
                }, [treeDom]);


                let inputBtn = createElement('el-input', {
                    'class': 'wa',
                    domProps: {
                        value: t.p_value
                    },
                    attrs: {
                        placeholder: '请选择',
                        disabled: true
                    },
                    on: {}
                }, []);

                let searchBtn = createElement('el-button', {
                    'class': '',
                    domProps: {
                    },
                    attrs: {},
                    props:{
                        'v-popover':{
                            default:'popover1'
                        }
                    },
                    on: {
                    }
                }, [
                    createElement('i', {
                        'class': 'el-icon-search'
                    }, [])
                ]);

                let clearBtn = createElement('el-button', {
                    'class': 'ml0',
                    domProps: {
                    },
                    attrs: {},
                    props:{
                    },
                    on: {
                        'click':function(){
                            //清空value
                            t.p_value='';
                        }
                    }
                }, [
                    createElement('i', {
                        'class': 'el-icon-delete'
                    }, [])
                ]);

                return createElement('div', {}, [popDom,inputBtn,searchBtn,clearBtn]);
            }
        },
        props: {
            value: {
                type: String
            },
            nodeValue: {
                type: String,
                default: 'id'
            },
            nodeText: {
                type: String,
                default: 'name'
            },
            parentKey: {
                type: String,
                default: 'parentId'
            },
            mainKey: {
                type: String,
                default: 'id'
            },
            multiple: {
                type: Boolean,
                default: false
            },
            checkedField: {
                type: Array
            },
            opts: {
                type: Array
            },
            ds: {
                type: Object
            }
        },
        data() {
            return {
                canRender: false,
                p_value:''
            }
        },
        watch: {
            value:function(val){
                this.p_value = val;
            }
        },
        computed: {
            p_checkedField(){
                const t = this;
                let result = [];
                if (t.value) {
                    result = t.value.split(",");
                }
                return result;
            }
        },
        created: function () {
        },
        mounted: function () {
            const t = this;
        },
        methods: {
            treeCommit(checkedNode){
                let t = this;
                let checkedNodeVal =[];//只有配置的主键字段
                //过滤掉空字段的数据  element的bug
                if(checkedNode&&checkedNode.length>0){
                    checkedNode.forEach(function(item){
                        checkedNodeVal.push(item[t.nodeValue]);
                    });
                }
                //触发到父组件处理
                if (!this.multiple) {
                    this.$emit("input", checkedNode[0][this.nodeValue]);//让父组件能用v-model
                }else{
                    this.$emit("input", checkedNodeVal.join(","));//让父组件能用v-model
                }
                //往上级传送选择的字段
                this.$emit("tree-commit", checkedNode);
                this.$refs.popover1.doClose();
            }
        }
    }
</script>

<style scoped>

    .wa {
        width: auto;
    }

    .ml0 {
        margin-left: 0;
    }

</style>