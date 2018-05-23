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
                    @change="treeChange"
                    :check-strictly="checkStrictly"
                    ref="bbtree">
            </bb-tree>
            <el-button class="fr mt20" type="primary" @click="commit">确定</el-button>
        </el-popover>
        <div>
            <el-input type="hidden"  v-model="bb_input_value"></el-input>
            <el-input class="wa" placeholder="请选择" disabled  v-model="bb_input_text"></el-input>
            <el-button v-popover:popover><i class="el-icon-search"></i></el-button>
            <el-button class="ml0" @click="clear"><i class="el-icon-delete"></i></el-button>
        </div>
    </div>
</template>

<script>
    import Util from '../../libs/util.js'

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
                bb_value: this.value,
                bb_input_value: '',//输入框value值
                bb_input_text:'',//输入框文本
                selectedData:null,//选中的对象
                external: {
                    linkage: ''//默认给一个条件,不然查询所有的数据，数据量很大。针对有外部参数的情况
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
                if(!this.bb_input_text){
                    this.bb_input_text = val;
                }
            }
        },
        computed: {},
        methods: {
            commit() {
                //填充text值
                this.fillInputText();

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
            treeChange:function(values,data){
                let t=this;
                t.selectedData = data;
            },
            //填充bb_input_text 的值
            fillInputText:function(){
                let t=this;
                if(t.bb_value&&t.selectedData){
                    let result=[];
                    if(t.multiple){
                        //多选
                        let _vals = t.bb_value.split(",");
                        _vals.forEach((_val)=>{
                            t.selectedData.forEach((_data)=>{
                                if(_val == _data[t.nodeValue]){
                                    result.push(_data[t.nodeText]);
                                    return false;//终止循环
                                }
                            });
                        });
                    }else{
                        result.push(t.selectedData[t.nodeText]);
                    }
                    t.bb_input_text = result.join(",");
                }
            },
            clear() {
                this.bb_value = '';
                this.bb_input_value = '';
                this.$emit('change', '');
                this.$emit('input', '');
            },
            linkage: function (...data) { //提供给外部调用
                if (data&&data.length>0&&data[0]) {
                    this.external = Object.assign({}, {linkage: data[0]});
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