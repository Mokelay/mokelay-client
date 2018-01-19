<template>
    <div>
        <el-popover
                ref="popover1"
                placement="right"
                width="400"
                trigger="click">
            <bb-editor-field-tree :oi-alias="p_oiAlias"
                                  @tree-commit="treeCommit"></bb-editor-field-tree>
        </el-popover>

        <el-input v-model="fieldName" placeholder="请选择字段" :disabled="true" class="wa"></el-input>
        <el-button v-popover:popover1><i class="el-icon-search"></i></el-button>
        <el-button @click="fieldName=''" class="ml0"><i class="el-icon-delete"></i></el-button>
    </div>
</template>

<script>
    import bbEditorFieldtree from "./bb-editor-field-tree";
    export default {
        name: 'bb-editor-field-tree-select',
        components: {
            'bb-editor-field-tree': bbEditorFieldtree
        },
        props: {
            oiAlias: {
                required: true
            },
            value:{
                required: true
            }
        },
        data() {
            return {
                p_oiAlias:this.oiAlias,
                fieldName:this.value
            };
        },
        watch: {
            oiAlias: function (val) {
                this.p_oiAlias = val;
            },
            value:function(val){
                this.fieldName = val;
            }
        },
        computed: {},
        beforeCreate: function () {
        },
        created: function () {
        },
        mounted: function () {
        },
        methods: {
            treeCommit(checkedNode){
                this.fieldName = checkedNode[0].fieldName;
                this.$emit("input", checkedNode[0].fieldName);//让父组件能用v-model
                this.$emit("tree-commit", checkedNode);//传给上一级
                this.$refs.popover1.doClose();
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