<template>
    <div>
        <el-popover
                ref="popover1"
                placement="right"
                width="400"
                trigger="click">
            <bb-field-tree-select :oi-alias="p_oiAlias" 
                                  @tree-commit="treeCommit"></bb-field-tree-select>
        </el-popover>

        <el-input v-model="fieldName" placeholder="请选择字段" :disabled="true" class="wa"></el-input>
        <el-button v-popover:popover1><i class="el-icon-search"></i></el-button>
        <el-button @click="fieldName=''" class="ml0"><i class="el-icon-delete"></i></el-button>
    </div>
</template>

<script>
    import bbFieldTreeSelect from "./bb-field-tree-select";

    import Vue from 'vue';
    import {
            Input,
            Popover,
            Button
    } from 'element-ui'
    Vue.use(Input);
    Vue.use(Popover);
    Vue.use(Button);

    export default {
        name: 'bb-field-tree-pop-select',
        components: {
            'bb-field-tree-select': bbFieldTreeSelect
        },
        props: {
            oiAlias: {
                type:String
            },
            value:{
                type:[String,Object]
            }
        },
        data() {
            return {
                p_oiAlias:this.oiAlias,
                fieldName:(this.value instanceof Object)?this.value.fieldName:this.value
            };
        },
        watch: {
            oiAlias: function (val) {
                this.p_oiAlias = val;
            },
            value:function(val){
                this.fieldName = (val instanceof Object)?val.fieldName:val;
            }
        },
        computed: {},
        beforeCreate: function () {
        },
        created: function () {
        },
        mounted: function () {
            let t=this;
            if(_TY_Root._TY_Current_Edit_Item.data.oiAlias){
                t.p_oiAlias = _TY_Root._TY_Current_Edit_Item.data.oiAlias;
            }
        },
        methods: {
            treeCommit(checkedNode){
                if(checkedNode&&checkedNode.length>0){
                    this.fieldName = checkedNode[0].fieldName;
                    // this.$emit("input", checkedNode[0].fieldName);//让父组件能用v-model
                    // this.$emit("tree-commit", checkedNode);//传给上一级
                    this.$emit("input", checkedNode[0]);
                    this.$refs.popover1.doClose();
                }
            }
        }
    }
</script>

<style scoped>
    .wa{
        width: auto;
    }
    .ml0{
        margin-left: 0;
    }
</style>