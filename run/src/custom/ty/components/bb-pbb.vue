<template>
    <div class="bb-pbb">
        <div class="bb-setting" :index="index" :key="pbbId">
            {{bb.name}}
            <el-button type="text" icon="el-icon-delete" @click="remove"></el-button>
            <el-button type="text" icon="el-icon-edit" @click="edit"></el-button>
        </div>
    </div>
</template>
<script>
    import bbPbbTabs from './bb-pbb-tabs.vue';
    import Vue from 'vue';
    export default {
        data() {
            return {
                attributeList: null,
                attrDescribeList: null,
                attributesData:this.attributes
            }
        },
        props: {
            pbbId: {
                type: Number
            },
            pageAlias: {
                type: String
            },
            attributes: {
                type: [Object,String],
                default: function () {
                    return {};
                }
            },
            attributeDescribeList: {
                type: Array,
                default: function () {
                    return [];
                }
            },
            bb: {
                type: Object,
                default: function () {
                    return null;
                }
            },
            index: {
                type: Number,
                default: function () {
                    return 0;
                }
            }
        },
        components: {
            'bb-pbb-tabs': bbPbbTabs
        },
        created: function () {//初始化布局区域属性值
            var t = this;
            t.getAttrDescList(t.attributeDescribeList);
        },
        methods: {
            remove: function () {
                const t = this;
                t.$confirm('确认操作?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$emit("remove", this.index);
                }).catch(() => {
                    t.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            edit: function (index) {
                const t = this;
                let params = {
                    buildingBlockAlias: t.bb.alias
                };
                t.readPbb();
            },
            getAttrDescList(attributeDescribeList){
                const t = this;
                const newArr = [];
                attributeDescribeList.forEach((val,key)=>{
                    newArr.push(val);
                })
                t.attrDescribeList = newArr;
                return newArr
            },
            showForm:function(){
                var t = this;
                if(t.attrDescribeList){
                    require.ensure(["art-dialog"],function(require){
                        Vue.component('bb-pbb-tabs', bbPbbTabs);
                        var _form = new Vue({
                            router: t.$router,
                            render: function(createElement){
                                return createElement('bb-pbb-tabs',{
                                    props:{
                                        pbbId:t.pbbId,
                                        pageAlias:t.pageAlias,
                                        bb:t.bb,
                                        attrDescribeList:t.attrDescribeList,
                                        value:JSON.parse(t.attributesData),
                                        attributeList:t.attributeList
                                    },
                                    on:{
                                        commit: t.submit
                                    },
                                    ref:"attribute_form"
                                },[]);
                            }
                        }).$mount();
                        var dialog = require('art-dialog');
                        var d = dialog({
                            width:800,
                            zIndex:100,
                            // height:'100%',
                            title: '编辑积木',
                            content: _form.$el
                        });
                        d.showModal();
                        t.dsDialog = d;
                        //为了解决容器类积木  获取不到 弹窗中的子积木，方案待定
                        t.$refs[_TY_Tool.uuid()]=_form;//把bb-form 设置到$refs中
                    },'art-dialog'); 
                }
 
            },
            readPbb:function(){
                const t = this;
                _TY_Tool.get(_TY_ContentPath+'/read-pbb-by-id', {pbbId: t.pbbId}).then(res => {
                    const data = res.data.data.data;
                    const attributeDescribeList = res.data.data.data_list.list;
                    t.bb.attributes = data.attributes;
                    t.attrDescribeList = t.getAttrDescList(attributeDescribeList);
                    t.attributesData = data.attributes;
                    t.showForm()
                }).catch((err)=>{
                    t.$message({
                        type: 'error',
                        message: '获取积木信息失败!' + err
                    });
                })
            },
            submit: function (val) {
                const t = this;
                var attributes = JSON.stringify(val);
                _TY_Tool.post(_TY_ContentPath+'/update-pbb',{pbbId:t.pbbId,attributes:attributes}).then((res)=>{
                    t.$message({
                        type: 'success',
                        message: '更新积木信息成功!' 
                    });
                    t.dsDialog.close();

                }).catch((err)=>{
                    t.$message({
                        type: 'error',
                        message: '更新积木信息失败!' + err
                    });
                });
            }
        }
    }
</script>
<style>
    .bb-setting {
        margin-bottom: 5px;
        text-align: center;
        border: 1px dashed #ccc;
    }
</style>