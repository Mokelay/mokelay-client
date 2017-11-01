<template>
    <div>
        <div style="margin-bottom:10px;">
            <el-button-group>
                <el-button type="text" icon="plus" @click="showForm">添加</el-button>
            </el-button-group>
        </div>
        <el-table :data="p_value" border style="width: 100%"
                  @selection-change="selectionChange"
                  @current-change="currentChange"
                  :highlight-current-row="arrayProps.selectType == 'radio'"
                  :stripe="arrayProps.stripe">
            <el-table-column type="selection" width="55" v-if="arrayProps.selectType == 'checkbox'"></el-table-column>
            <el-table-column type="index" width="50" v-if="arrayProps.showIndex == true"></el-table-column>
            <el-table-column v-for="field in fields" :prop="field.attributeName" :label="field.name"
                             :key="field.attributeName">
                <template scope="scope">
                    {{scope['row'][field.attributeName]}}
                </template>
            </el-table-column>
            <el-table-column label="操作" key="operation">
                <template scope="scope">
                    <el-button type="text" icon="delete"
                               @click.native.prevent="deleteData(scope.$index)"></el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    import Vue from 'vue';
    export default {
        name: 'bb-editor-array',
        props: {
            value: {
                type: [Array, String],
                default: function () {
                    return [];
                }
            },
            fields: {
                type: Array,
                //required: true
            },
            delete: {
                type:Function,
                default:function(){}
            },
            arrayProps: {
                type: Object,
                default: function () {
                    return {
                        selectType :'default',
                        arrayProps:false,
                        stripe:false
                    };
                }
            }
        },
        data() {
            return {
                dialogVisible: false,
            }
        },
        computed: {
            p_value: {
                get() {
                    return (typeof this.value === 'string') ? (this.value ? JSON.parse(this.value) : []) : this.value;
                }, set(val) {
                }
            }
        },
        beforeCreate: function () {
        },
        created: function () {
        },
        mounted: function () {
        },
        watch: {
            value: function (val) {
                if (typeof val === 'object') {
                    //数组
                    this.p_value = val;
                } else if (typeof val === 'string') {
                    this.p_value = (val ? JSON.parse(val) : []);
                }
            }
        },
        methods: {
            // showForm: function () {
            //     this.dialogVisible = true;
            // },
            showForm:function(){
                var t = this;
                require.ensure(["art-dialog","jquery"],function(require){
                    var _form = new Vue({
                        router: t.$router,
                        render: function(createElement){
                            return createElement('bb-editor-object',{
                                domProps: {
                                    value: t.ds
                                },
                                props:{
                                    fields:t.fields
                                },
                                on:{
                                    commit: t.add
                                },
                                ref:"object_form"
                            },[]);
                        }
                    }).$mount();

                    var dialog = require('art-dialog');
                    var d = dialog({
                        width:800,
                        // height:'100%',
                        title: '编辑数组',
                        content: _form.$el
                    });
                    d.showModal();
                    t.dsDialog = d;
                });
            },
            deleteData: function (index) {
                const t = this;
                t.$confirm('确认操作?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    t.p_value.splice(index, 1);
                    var _td = t.p_value.concat();
                    if (typeof t.value === 'string') {
                        t.$emit('input', JSON.stringify(_td));
                    } else {
                        t.$emit('input', _td);
                    }
                    t.delete(_td);
                }).catch(() => {
                    t.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            add: function (formData) {
                this.dialogVisible = false;
                this.p_value.push(formData);
                var _td = this.p_value.concat();
                if (typeof this.value === 'string') {
                    this.$emit('input', JSON.stringify(_td));
                } else {
                    this.$emit('input', _td);
                }
                this.dsDialog.close();
                this.$refs.object_form.clean();
            },
            selectionChange: function (val) {
            },
            currentChange: function (val) {
            }
        }
    }
</script>