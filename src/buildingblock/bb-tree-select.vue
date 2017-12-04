<template>
    <div>
        <el-popover
                width="400"
                placement="right"
                trigger="click"
                ref="popover"
        >
            <bb-tree
                    v-model="bb_value"
                    :nodeValue="nodeValue"
                    :nodeText="nodeText"
                    :parentKey="parentKey"
                    :mainKey="mainKey"
                    :checkedField="checkedField"
                    :multiple="multiple"
                    :opts="opts"
                    :ds="ds"
                    :external="external"
                    @tree-commit="treeCommit"
                    :check-strictly="checkStrictly"
                    ref="bbtree">
            </bb-tree>
            <bb-button class="fr mt20" type="primary" @click="commit">确定</bb-button>
        </el-popover>
        <div>
            <el-input class="wa" placeholder="请选择" disabled v-model="bb_input_value"></el-input>
            <bb-button type="text" v-popover:popover><i class="el-icon-search"></i></bb-button>
            <bb-button type="text" class="ml0" @click="clear"><i class="el-icon-delete"></i></bb-button>
        </div>
    </div>
</template>

<script>
    import Util from '../libs/util.js'

    export default {
        name: 'bb-tree-select',
        props: {
            value: {
                type: [String, Number]
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
            checkedField: {
                type: Array
            },
            multiple: {
                type: Boolean,
                default: false
            },
            checkStrictly: {//是否父子不级联选择
                type: Boolean,
                default: false
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
                bb_value: '',
                bb_input_value: '',
                external: {
                    linkage: 'test'//默认给一个条件,不然查询所有的数据，数据量很大。针对有外部参数的情况
                }
            }
        },
        created: function () {

        },
        mounted: function () {
        },
        watch: {
            value(val) {
                this.bb_value = val;
                this.bb_input_value = val;
            }
        },
        computed: {},
        methods: {
            commit() {
                this.bb_input_value = this.bb_value;
                //触发到父组件处理
                this.$emit("input", this.bb_input_value);//让父组件能用v-model

                this.change(this.bb_input_value);

                this.$refs.popover.doClose();
            },
            change(value) {
                //触发上级change事件
                this.$emit('change', value);
            },
            clear() {
                this.bb_value = '';
                this.bb_input_value = '';
            },
            linkage: function (data) { //提供给外部调用
                if (data) {
                    this.external = Object.assign({}, {linkage: data});
                }
            },
            treeCommit(data){
                //完整数据
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

    .fr {
        float: right;
    }

    .mt20 {
        margin-top: 20px;
    }

</style>