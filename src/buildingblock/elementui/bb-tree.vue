<template>
    <div class="bb-tree dib" :id="id">
        <el-tree
                class="bn horizontal"
                :data="data"
                :load="loadData"
                :node-key="nodeValue"
                :current-node-key="nodeValue"
                :props="{
                    label: nodeText,
                    isLeaf: 'leaf'
                }"
                :default-checked-keys="valueBase"
                :default-expanded-keys="expandedKeys"
                :default-expand-all="expandAll"
                :show-checkbox="showCheckbox"
                :check-strictly="checkStrictly"
                highlight-current
                :lazy="lazy"
                accordion
                ref="tree"
                :key="randomKey"
                @check-change="checkChange"
                @node-click="nodeClick"
                @node-expand="nodeExpand"
        >
        </el-tree>
    </div>
</template>

<script>
    import Util from '../../libs/util.js'

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
                type: [Array,String]
            },
            //默认展开项
            expandedKeys: {
                type: [Array,String]
            },
            //默认展开所有
            expandAll:{
                type:Boolean,
                default:false
            },
            opts: {
                type: Array
            },
            ds: {
                type: Object
            },
            //一次性获取全部树形数据ds
            staticDs:{
                type:Object
            },
            //一次性获取全部静态数据
            staticData:{
                type:Array,
                default:function(){
                    return [{
                          id: 1,
                          label: '一级 2',
                          children: [{
                            id: 3,
                            label: '二级 2-1',
                            children: [{
                              id: 4,
                              label: '三级 3-1-1'
                            }, {
                              id: 5,
                              label: '三级 3-1-2',
                              disabled: true
                            }]
                          }, {
                            id: 2,
                            label: '二级 2-2',
                            disabled: true,
                            children: [{
                              id: 6,
                              label: '三级 3-2-1'
                            }, {
                              id: 7,
                              label: '三级 3-2-2',
                              disabled: true
                            }]
                          }]
                        }]
                }
            },
            external: {
                type: Object
            },
            //是否懒加载
            lazy:{
                type:Boolean,
                default:true
            },
            //默认存所有item有三角标
            allHaveChild:{
                type:Boolean,
                default:false
            },
            /*其他属性配置
                {
                    treeStyle:""  整个tree的样式
                    itemStyle:""  最低级选项样式
                }
            */
            option:{
                type:Object,
                default:function(){
                    return {
                        itemStyle:"",
                        rootParentId:0
                    }
                }
            }
        },
        data() {
            const t = this;
            return {
                data: t.staticData,
                id:"bb-tree_" + _TY_Tool.uuid(),
                valueBase:this.value || typeof this.checkedField == 'string'?this.checkedField.split(","):this.checkedField,
                realCheckedField : typeof this.checkedField == 'string'?this.checkedField.split(","):this.checkedField,
                realExpandedKeys : typeof this.expandedKeys == 'string'?this.expandedKeys.split(","):this.expandedKeys
            }
        },
        created: function () {
            let t=this;
            t.refresh();
        },
        mounted:function(){
            const t = this;
            t.setHorizontal();
        },
        watch: {
            //valueBase如果为空，取消勾选所有选中节点
            valueBase(val) {
                if (!val || !val.length) {
                    const treeInstance = this.$refs.tree;
                    const checkedKeys = treeInstance.getCheckedKeys();
                    this.uncheckedKeys(checkedKeys);
                }else{
                    const treeInstance = this.$refs.tree;
                    let tempVals;
                    if(typeof val ==='string'){
                        tempVals = val.split(",");
                    }else if(typeof val ==='number'){
                        tempVals = [val];
                    }else{
                        tempVals=val;
                    }
                    tempVals.forEach(function(item,index){
                        treeInstance.setChecked(item,true);
                    });
                }
            },
            external(val) {
                if(val&&val.linkage){
                    this.getRootData().then((data) => {
                        this.data = data;
                    })
                }
            }
        },
        computed: {
            randomKey() {
                return "" + Math.floor(Math.random() * 10000);
            },
            checkedKeys() {
                let checkedField = this.realCheckedField;
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
        methods: {
            commit(data) {
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

                this.valueBase = checkedNodeVal;
                this.$emit('input', result,data);

                //往上级传送选择的字段
                this.$emit("change", result,data);
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
                this.commit(data);
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
                        const rootParentId = _TY_Tool.tpl(t.option.rootParentId,t);
                        const _parentId = node.level === 0 ? rootParentId : node['data'][t.nodeValue];//默认是0 ，查询根列表
                        t.nowParentId = _parentId;
                        let inputs = t.ds.inputs || [];
                        let hasParam = false;
                        inputs.forEach(function (item) {
                            if (item.paramName === t.parentKey) {
                                hasParam = true;
                                item.variable = _parentId;
                            }
                        });
                        if (!hasParam) {
                            //没有这个参数
                            inputs.push({
                                paramName: t.parentKey,
                                valueType: "constant",
                                variable: _parentId
                            });
                        }
                        Util.getDSData(t.ds, _TY_Tool.buildTplParams(t), function (map) {
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
                                if(t.allHaveChild){
                                    item.leaf = false;
                                }

                                list.push(item);
                            });

                            resolve(list);
                        }, function (code, msg) {
                        });
                    } else if (t.opts && t.opts.length > 0) {
                        resolve(t.opts);
                    } else if(t.staticDs){
                        Util.getDSData(t.staticDs, _TY_Tool.buildTplParams(t), function (map) {
                            const list = [];
                            if (!map || !map.length) {
                                resolve([]);
                                return;
                            }
                            resolve(map[0]['value']);
                        }, function (code, msg) {
                        });
                    }
                });
            },
            //刷新
            refresh:function(){
                let t=this;
                if(!this.lazy&&t.staticDs){
                    //静态资源不是懒加载
                    if(t.staticDs){
                        this.getData().then((data) => {
                            t.data = data;
                        })
                    }
                }else{
                    t.getRootData();
                }
            },
            //懒加载
            loadData: function (node, resolve) {
                let t=this;
                
                if (node.parent && node.isLeaf) {
                    return resolve([]);
                }
                this.getData(node).then((data) => {
                    resolve(data);
                })
            },
            //节点点击事件
            nodeClick:function(data,node,current){
                let t=this;
                if(node.isLeaf){
                    //如果是叶子节点
                    t.$emit('leafClick',data,node,current);
                }
                let result = data[t.nodeValue];
                t.$emit('click',result,data,node,current);
                t.$emit('input', result,data,node,current);

                //往上级传送选择的字段
                t.$emit("change", result,data,node,current);

            },
            //节点展开
            nodeExpand(...params){
                const t = this;
                t.$emit('nodeExpand',params);
                t.setHorizontal();
            },
            //设置水平样式
            setHorizontal:function(){
                const t = this;
                setTimeout(()=>{
                    const bbTree = document.getElementById(t.id);
                    const isLeafs = bbTree.getElementsByClassName("is-leaf");
                    if(isLeafs.length && t.option.itemStyle){
                        //最小一级的样式
                        const itemStyle = _TY_Tool.setStyle({layout:t.option.itemStyle});
                        let itemStyleString = "";
                        Object.keys(itemStyle).forEach((name,index)=>{
                            if(index == 0){
                                itemStyleString = name + ":" + itemStyle[name] + ";";
                            }else{
                                itemStyleString = itemStyleString + name + ":" + itemStyle[name] + ";";
                            }
                        })

                        HTMLCollection.prototype.forEach=function(callback){
                            [].slice.call(this).forEach(callback);
                        };
                        isLeafs.forEach((isLeaf,key)=>{
                            const className = isLeaf.parentNode.parentNode.className + " dib";
                            isLeaf.parentNode.parentNode.setAttribute("style",itemStyleString);
                        })
                    }
                },10);
            },
            //外部设置静态数据
            setData(...params){
                const t = this;
                params.forEach((param,key)=>{
                    if(param.type == "custom"){
                        t.data = param.arguments;
                    }
                })
            },
            //外部设置值
            setValue(...params){
                const t = this;
                params.forEach((param,key)=>{
                    if(param.type == "custom"){
                        t.valueBase = typeof param.arguments == 'string'?eval(param.arguments):param.arguments;
                    }
                })
            },
            //外部获取值
            getValue(){
                return this.valueBase;
            }
        }
    }
</script>

<style lang="less">
    .bn {
        border: none
    }
    .dib{
        display: inline-block;
    }
    .bb-tree{
        .horizontal{
        }
        .el-tree-node{
            white-space: pre-wrap !important;
        }
    }
</style>