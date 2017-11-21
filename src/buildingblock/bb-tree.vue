<template>
    <div>
        <el-tree
                class="bn"
                :data="data"
                :lazy="lazy"
                :load="loadData"
                :node-key="nodeValue"
                :props="{
                    children: 'children',
                    label: nodeText,
                    isLeaf: 'leaf'
                }"
                :default-checked-keys="checkedKeys"
                :show-checkbox="showCheckbox"
                highlight-current
                ref="tree"
                :key="randomKey"
                @check-change="checkChange"
        >
        </el-tree>
        <el-button class="fr mt20" type="primary" @click="formCommit">确定</el-button>
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
            showCheckbox: {
                type: Boolean,
                default: true
            },
            lazy: {
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
            //如果不是懒加载，则获取全部节点数据，暂时不提供此类接口
            if (!this.lazy) {
                this.getRootData().then((data) => {
                    this.data = data;
                })
            }
        },
        watch: {
            //value如果为空，取消勾选所有选中节点
            value(val) {
                if (!val) {
                    const checkedNodes = this.$refs.tree.getCheckedNodes();
                    !!checkedNodes.length && this.uncheckNodes(checkedNodes);
                }
            },
            external() {
                this.getRootData()
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
            formCommit() {
                const t = this;
                let checkedNode = t.$refs.tree.getCheckedNodes();
                let newCheckedNode = [];//所有字段
                let checkedNodeVal = [];//只有配置的主键字段
                //过滤掉空字段的数据  element的bug
                if (checkedNode && checkedNode.length > 0) {
                    checkedNode.forEach(function (item) {
                        if (item[t.nodeValue]) {
                            newCheckedNode.push(item);
                            checkedNodeVal.push(item[t.nodeValue]);
                        }
                    });
                }
                //触发到父组件处理
                if (!this.multiple) {
                    this.$emit("input", checkedNodeVal[0]);//让父组件能用v-model
                } else {
                    this.$emit("input", checkedNodeVal.join(","));//让父组件能用v-model
                }
                //往上级传送选择的字段
                this.$emit("tree-commit", newCheckedNode);
            },
            //取消勾选选中节点
            uncheckNodes(nodes) {
                const treeInstance = this.$refs.tree;
                nodes.forEach((node) => {
                    treeInstance.setChecked(node, false, true);
                })
            },
            //勾选改变后
            checkChange(data, check, childCheck) {
                const t = this;
                if (check && !t.multiple) {//单选的话
                    const nodeValue = t.nodeValue;
                    const treeInstance = t.$refs.tree;
                    const checkedkNodes = treeInstance.getCheckedNodes();
                    const filterNodes = checkedkNodes.filter((node) => {
                        return node[nodeValue] !== data[nodeValue];
                    });
                    this.uncheckNodes(filterNodes);
                }
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
                            let list = [];
                            if (!map || map.length <= 0) {
                                resolve([]);
                                return;
                            }
                            map[0]['value'].forEach((item, key) => {
                                const childNum = item['child_num'];
                                if (childNum && childNum > 0) {

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
            //懒加载执行
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

    .fr {
        float: right;
    }

    .mt20 {
        margin-top: 20px;
    }

</style>