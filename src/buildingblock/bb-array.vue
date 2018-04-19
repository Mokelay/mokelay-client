<template>
    <div>
        <div style="margin-bottom:10px;">
            <bb-button-form ref="object_form" :fields="fields" startButtonIcon="el-icon-plus" startButtonType="text" settingText="添加" @commit="setArray"></bb-button-form>
        </div>
        <el-table :data="array" border style="width: 100%" :height="height" stripe>
            <el-table-column v-for="field in fields" v-if="!field.hide" :prop="field.attributeName" :label="field.name"
                             :key="field.attributeName">
                <template slot-scope="scope">
                    {{scope['row'][field.attributeName]}}
                </template>
            </el-table-column>
            <el-table-column label="操作" width="250" key="operation">
                <template slot-scope="scope">
                    <el-button type="text" icon="el-icon-edit"
                               @click.native.prevent="editData(scope.$index)">修改</el-button>
                    <el-button type="text" icon="el-icon-delete"
                               @click.native.prevent="deleteData(scope.$index)">删除</el-button>
                    <el-button type="text" icon="el-icon-caret-top"
                               @click.native.prevent="upData(scope.$index)">上移</el-button>
                    <el-button type="text" icon="el-icon-caret-bottom"
                               @click.native.prevent="downData(scope.$index)">下移</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-button v-if="showCommit" @click="commit" :style="{display:'block',margin:'auto',marginTop:'50px'}">设置数组</el-button>
    </div>
</template>

<script>
import Vue from 'vue';

    export default {
        name: 'bb-array',
        props: {
            value: {
                type: [Array, String],
                default: function () {
                    return [];
                }
            },
            fields: {
                type: Array
            },
            showCommit: {
                type: Boolean,
                default:false
            },
            height: {
                type: String,//设置列表高度
                default:'300'
            },
            defaultFormData:{
                type:Object
            }
        },
        data() {
            return {
                array:typeof(this.value)==='string'?eval(this.value):this.value,
                formDialog:null,
                valueBase:_TY_Tool.deepClone(this.defaultFormData),
                index:'add'
            }
        },
        computed: {},
        watch: {
            value: function (val) {
                if (typeof val === 'object') {
                    //数组
                    this.array = val;
                } else if (typeof val === 'string') {
                    this.array = (val ? JSON.parse(val) : []);
                }
            }
        },
        created:function(){
            this.array = this.array?this.array:[];
        },
        methods: {
            setArray:function(formData){
                const t = this;
                t.add(formData,t.index);
            },
            deleteData: function (index) {
                const t = this;
                t.$confirm('确认操作?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    t.array.splice(index, 1);
                    var _td = t.array.concat();
                    if (typeof t.value === 'string') {
                        t.$emit('input', JSON.stringify(_td));
                    } else {
                        t.$emit('input', _td);
                    }
                }).catch(() => {
                    t.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            editData: function (index) {
                const t = this;
                const param = {
                       value:t.array[index],
                       index:index
                    }
                t.$refs.object_form.showDialog(t.array[index]);
                t.index = index;
            },
            upData: function (index) {
                const t = this;
                if(index == 0) {
                    return;
                }
                const item = t.array[index]
                t.array.splice(index,1);
                t.array.splice(index-1,0,item);
                t.emitResult();
            },
            downData: function (index) {
                const t = this;
                if(index == t.array.length -1) {
                    return;
                }
                const item = t.array[index]
                t.array.splice(index,1);
                t.array.splice(index+1,0,item);
                t.emitResult();
            },
            add: function (formData,index) {
                var fd = formData;
                if(index != 'add'){
                    this.array.splice(index,1,fd);
                    this.index = 'add';
                }else{
                    this.array.push(fd);
                }
                this.emitResult();
                this.$refs.object_form.$refs.form.clean()
                this.formDialog = null;
            },
            commit:function(){
                var t = this;
                this.$emit('commit', t.array);
            },
            loadChildBB(){
                let t=this;
                return _TY_Tool.loadChildBB(t);                
            },
            //输出事件和数组
            emitResult:function(){
                var _td = this.array.concat();
                if (typeof this.value === 'string' || this.value === null) {
                    this.$emit('input', JSON.stringify(_td));
                } else {
                    this.$emit('input', _td);
                }
            }
        }
    }
</script>
<style>
    .bb-array-content{
        height: 500px;
        overflow-y: auto;
    }
</style>