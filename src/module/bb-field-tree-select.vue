<template>
    <div class="clearfix">
        <el-tree class="bn"
                 :data="data"
                 :show-checkbox='true'
                 node-key="fieldName"
                 ref="tree"
                 highlight-current
                 :props="defaultProps"
                 :default-checked-keys="p_checkedField"
                 @node-expand="openNode"
                 @check-change="checkChange" 
                :key="randomKey">
        </el-tree>
        <el-button type="primary" class="fr" @click="addField">确定</el-button>
    </div>
</template>

<script>
    export default {
        name: 'bb-field-tree-select',
        components: {},
        computed: {
            randomKey(){
                return this.p_checkedField?this.p_checkedField.join(","):(""+Math.floor(Math.random()*100));
            }
        },
        props: {
            oiAlias: {
                type:String
            },
            multiple: {
                type: Boolean,
                default: false
            },
            checkedField: {
                type: [Array,String]
            },
            ioftType:{
                type:String
            },
            ioft:{
                type:String
            }
        },
        created:function(){
            let t=this;
            let tempVal= _TY_Tool.tpl(this.checkedField, _TY_Tool.buildTplParams(t));
            this.p_checkedField = typeof(tempVal)==='string'?JSON.parse(tempVal):tempVal;
        },
        mounted: function () {
            let t=this;
            if(_TY_Root._TY_Current_Edit_Item.data.oiAlias){
                t.p_oiAlias = _TY_Root._TY_Current_Edit_Item.data.oiAlias;
                t.first_oiAlias = _TY_Root._TY_Current_Edit_Item.data.oiAlias;
            }
            if(!t.p_oiAlias){
                t.$message({
                    type: 'info',
                    message: '请先选择模型'
                });
                //关闭弹窗
                t.$emit("tree-commit", null);
            }else{
                t.loadData();
            }
        },
        data() {
            return {
                p_checkedField:null,
                p_oiAlias: this.oiAlias,
                first_oiAlias:this.oiAlias,
                data: [{
                    id: '',
                    label: '',
                    fieldName: '',
                    oiAlias: '',
                    toOIAlias: '',//目标oi别名
                    dt: '',
                    children: []
                }],
                defaultProps: {
                    children: 'children',
                    label: 'label'
                }
            };
        },
        watch: {
            oiAlias: function (val) {
                this.p_oiAlias = val;
                this.first_oiAlias = val;
                this.loadData();
            },
            checkedField:function(val){
                let t=this;
                let tempVal= _TY_Tool.tpl(val, _TY_Tool.buildTplParams(t));
                this.p_checkedField = typeof(tempVal)==='string'?JSON.parse(tempVal):tempVal;
            }
        },
        methods: {
            openNode(node){
                if (node.toOIAlias) {
                    this.p_oiAlias = node.toOIAlias;
                    this.loadData(node);
                }
            },
            loadData(node){
                let t = this;
                if (this.p_oiAlias) {

                    _TY_Tool.post(_TY_ContentPath + "/list-field-tree", {
                        oiAlias: this.p_oiAlias,
                        fromOIAlias: this.p_oiAlias
                    }).then(function (response) {
                        let data = response['data'];
                        if (data['ok']) {
                            let fieldList = data['data']['field_list']['list'];
                            let connectorList = data['data']['connector_list']['list'];
                            if (t.p_oiAlias == t.first_oiAlias) {
                                //说明是第一级
                                t.data = [];
                            } else {
                                if (node) {
                                    node.children = [];
                                }
                            }
                            for (let i in fieldList) {
                                let row = {
                                    id: fieldList[i].id,
                                    label: fieldList[i].name,
                                    fieldName: fieldList[i].fieldName,
                                    oiAlias: fieldList[i].oiAlias,
                                    toOIAlias: '',
                                    dt: fieldList[i].dt,
                                    connectorAlias: '',//真正值
                                    connTmpAlias: '',//临时变量
                                    children: []
                                };
                                if (node) {
                                    //如果是外键字段，label显示格式 父label-子label
                                    row.label = node.label + "-" + row.label;
                                    row.connectorAlias = node.connTmpAlias;
                                }
                                for (let m = 0; m < connectorList.length; m++) {
                                    let item = connectorList[m];
                                    if (item.fromFieldName == fieldList[i].fieldName) {
                                        //有子节点的情况oiAlias  赋给  toOiAlias
                                        row.toOIAlias = item.toOIAlias;
                                        //临时变量，存储connector路径别名 alias1,alias2,alias3    connTmpAlias是父节点存储的临时connectorAlias, connectorAlias是子节点存储的正式connectorAlias
                                        row.connTmpAlias = row.connectorAlias ? (row.connectorAlias + ',' + item.alias) : item.alias;
                                        //初始化子节点
                                        row.children = [{
                                            id: '',
                                            label: '',
                                            fieldName: '',
                                            oiAlias: '',
                                            toOIAlias: '',
                                            dt: '',
                                            connectorAlias: '',
                                            connTmpAlias: '',//临时变量
                                            children: []
                                        }];
                                        break;
                                    }
                                }

                                if (t.p_oiAlias == t.first_oiAlias) {
                                    //说明是第一级
                                    t.data.push(row);
                                } else {
                                    //不是第一级
                                    if (node) {
                                        node.children.push(row);
                                    }
                                }
                            }
                        }
                    }).catch(function (error) {
                    });
                }
            },
            addField(){
                let checkedNode = this.$refs.tree.getCheckedNodes();
                let newCheckedNode = [];
                //过滤掉空字段的数据  element的bug
                if(checkedNode&&checkedNode.length>0){
                    checkedNode.forEach(function(item){
                        if(item.fieldName){
                            newCheckedNode.push(item);
                        }
                    });
                }
                //触发到父组件处理
                // if (!this.multiple) {
                //     this.$emit("input", newCheckedNode[0].fieldName);//让父组件能用v-model
                // }
                this.$emit("tree-commit", newCheckedNode,this.ioftType,this.ioft);
            },
            //勾选改变后
            checkChange(data, check, childCheck){
                if (check && !this.multiple) {//单选
                    this.$refs.tree.setCheckedKeys([]);
                    this.$refs.tree.setCheckedKeys([data.id]);
                }
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
    .clearfix:after {
      visibility: hidden;
      display: block;
      font-size: 0;
      content: " ";
      clear: both;
      height: 0;
    }

</style>