<template>
    <div>
        <el-popover
                width="400"
                placement="right"
                trigger="click"
                ref="popover"
        >
            <bb-tree
                    :value="p_value"
                    :nodeValue="nodeValue"
                    :nodeText="nodeText"
                    :parentKey="parentKey"
                    :mainKey="mainKey"
                    :multiple="multiple"
                    :checkedField="p_checkedField"
                    :opts="opts"
                    :ds="ds"
                    :external="external"
                    @tree-commit="treeCommit"
                    ref="bbtree">
            </bb-tree>
        </el-popover>
        <div>
            <el-input class="wa" placeholder="请选择" disabled v-model="p_value"></el-input>
            <el-button v-popover:popover :value="p_value"><i class="el-icon-search"></i></el-button>
            <el-button class="ml0" @click="p_value = ''"><i class="el-icon-delete"></i></el-button>
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
                p_value: '',
                external: {}
            }
        },
        created: function () {

        },
        mounted: function () {
        },
        watch: {
            value(val) {
                this.p_value = val;
            }
        },
        computed: {
            p_checkedField() {
                let result = [];
                if (typeof value === 'undefined') {
                    return result;
                }
                try {
                    result = `${this.value}`.split(",");
                } catch (e) {
                    console.log('类型错误');
                }
                return result;
            }
        },
        methods: {
            treeCommit(checkedNode) {
                let t = this;
                let checkedNodeVal = [];//只有配置的主键字段
                //过滤掉空字段的数据  element的bug
                if (checkedNode && checkedNode.length > 0) {
                    checkedNode.forEach(function (item) {
                        checkedNodeVal.push(item[t.nodeValue]);
                    });
                }
                let value = '';
                if (!this.multiple) {
                    value = checkedNode[0][this.nodeValue];
                } else {
                    value = checkedNodeVal.join(",");
                }

                this.p_value = value;
                //触发到父组件处理
                this.$emit("input", value);//让父组件能用v-model

                //往上级传送选择的字段
                this.$emit("tree-commit", checkedNode);

                this.$refs.popover.doClose();
            },
            linkage: function (data) { //提供给外部调用
                if (data) {
                    this.external = Object.assign({}, {linkage: data});
                }
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