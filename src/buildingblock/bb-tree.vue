<template>
    <div>
        <el-tree
                class="bn"
                :data="data"
                :load="loadData"
                :node-key="nodeValue"
                :current-node-key="nodeValue"
                :props="{
                    label: nodeText,
                    isLeaf: 'leaf'
                }"
                :default-checked-keys="checkedKeys"
                :show-checkbox="showCheckbox"
                :check-strictly="checkStrictly"
                highlight-current
                lazy
                accordion
                ref="tree"
                :key="randomKey"
                @check-change="checkChange"
        >
        </el-tree>
    </div>
</template>

<script>
    import Util from '../libs/util.js'

    export default {
        name: 'bb-tree',
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
            checkStrictly: {//是否父子不级联选择
                type: Boolean,
                default: false
            },
            showCheckbox: {
                type: Boolean,
                default: true
            },
            checkedField: {
                type: Array
            },
            opts: {
                type: Array
            },
            ds: {
                type: Object
            },
            external: {
                type: Object
            }
        },
        data() {
            const t = this;
            return {
                data: []
            }
        },
        created: function () {

        },
        watch: {
            //value如果为空，取消勾选所有选中节点
            value(val) {
                if (!val) {
                    const treeInstance = this.$refs.tree;
                    const checkedKeys = treeInstance.getCheckedKeys();
                    this.uncheckedKeys(checkedKeys);
                }
            },
            external() {
                this.getRootData().then((data) => {
                    this.data = data;
                })
            }
        },
        computed: {
            randomKey() {
                return "" + Math.floor(Math.random() * 10000);
            },
            checkedKeys() {
                let checkedField = this.checkedField;
                if (checkedField && checkedField.length) {
                    if (!this.multiple) { //单选默认取最后一个元素
                        checkedField = checkedField.slice(-1);
                    }
                    if (Object.keys(checkedField[0]).length) {
                        const nodeValue = this.nodeValue;
                        return checkedField.map((item) => {
                            return item[nodeValue];
                        });
                    }
                    return checkedField;
                }
                return [];
            }
        },
        mounted: function () {
        },
        methods: {
            commit() {
                const t = this;
                let checkedNode = t.$refs.tree.getCheckedNodes();
                let checkedNodeVal = [];//只有配置的主键字段
                //过滤掉空字段的数据
                if (checkedNode && checkedNode.length > 0) {
                    checkedNode.forEach(function (item) {
                        if (item[t.nodeValue]) {
                            checkedNodeVal.push(item[t.nodeValue]);
                        }
                    });
                }
                let result = '';
                //v-model
                if (!this.multiple) {
                    result = checkedNodeVal[0];
                } else {
                    result = checkedNodeVal.join(",");
                }
                this.$emit('input', result);

                //往上级传送选择的字段
                this.$emit("change", result);
            },
            uncheckedKeys(keys) {
                const treeInstance = this.$refs.tree;
                keys.forEach((key) => {
                    treeInstance.setChecked(key, false, true);
                })
            },
            //勾选改变后
            checkChange(data, check, childCheck) {
                const t = this;
                const {disabled} = data;
                if (!t.multiple) { //单选
                    if (!disabled) {
                        if (check) { //单选
                            const nodeValue = t.nodeValue;
                            const treeInstance = t.$refs.tree;
                            let checkedKeys = treeInstance.getCheckedKeys(true);
                            checkedKeys = checkedKeys.filter((key) => {
                                return key !== data[nodeValue];
                            });
                            t.uncheckedKeys(checkedKeys);
                        }
                    }
                }

                this.commit();
            },
            //获取根节点数据
            getRootData() {
                return this.getData({
                    level: 0
                })
            },
            //获取某个节点的子节点数据
            getData(node) {
                const t = this;
                return new Promise((resolve) => {
                    if (t.ds) {
                        const _parentId = node.level === 0 ? 0 : node['data'][t.nodeValue];//默认是0 ，查询根列表
                        let inputs = t.ds.inputs || [];
                        let hasParam = false;
                        inputs.forEach(function (item) {
                            if (item.paramName === t.parentKey) {
                                hasParam = true;
                                item.constant = _parentId;
                            }
                        });
                        if (!hasParam) {
                            //没有这个参数
                            inputs.push({
                                paramName: t.parentKey,
                                valueType: "constant",
                                constant: _parentId
                            });
                        }
                        Util.getDSData(t.ds, {
                            "bb": t,
                            "router": t.$route.params,
                            "external": t.external
                        }, function (map) {
                            const list = [];
                            if (!map || !map.length) {
                                resolve([]);
                                return;
                            }
                            map[0]['value'].forEach((item, key) => {
                                const childNum = item['child_num'];
                                if (childNum && childNum > 0) {
                                    //单选去掉禁用复选框
//                                    if (!t.multiple) {
//                                        item.disabled = true;
//                                    }
                                } else {
                                    item.leaf = true;
                                }
                                list.push(item);
                            });

                            resolve(list);
                        }, function (code, msg) {
                        });
                    } else if (t.opts && t.opts.length > 0) {
                        resolve(t.opts);
                    }
                });
            },
            //懒加载
            loadData: function (node, resolve) {
                if (node.parent && node.isLeaf) {
                    return resolve([]);
                }
                this.getData(node).then((data) => {
                    resolve(data);
                })
            }
        }
    }
</script>

<style scoped>

    .bn {
        border: none
    }

</style>