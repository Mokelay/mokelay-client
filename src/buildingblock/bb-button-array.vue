<template>
    <div>{{arrayDesc}}<el-button @click="setting">{{settingText}}</el-button></div>
</template>

<script>
import Vue from 'vue';
import Util from '../libs/util';
    export default {
        name: 'bb-button-array',
        props: {
            value:{
                type:[Array,String]
            },
            fields:{
                type:[String,Array]
            },
            settingText:{
                type:String,
                default:"设置"
            },
            arrayDescTpl:{
                type:String
            }
        },

        data() {
            return {
                arrayData:this.value,
                dialog:null
            }
        },
        computed: {
            arrayDesc:function(){
                var t = this;
                if(t.arrayDescTpl && t.arrayData){
                    return _TY_Tool.tpl(t.arrayDescTpl, _TY_Tool.buildTplParams(t,t.arrayData));
                }
            },
        },
        watch: {
            value(val){
                if (typeof val === 'array') {
                    this.arrayData = val;
                } else if (typeof val === 'string') {
                    this.arrayData = (val ? JSON.parse(val) : {});
                }
                this.$emit("input",val);
            },
            arrayData(val){
                if (typeof val === 'array') {
                    this.arrayData = val;
                } else if (typeof val === 'string') {
                    this.arrayData = (val ? JSON.parse(val) : {});
                }
                this.$emit("input",val);
            }
        },
        created: function () {
        },
        mounted:function(){
        },
        methods: {
            setting:function(){
                var t = this;
                require.ensure(["art-dialog"],function(require){
                    var _array = new Vue({
                        router: t.$router,
                        render: function(createElement){
                            return createElement('bb-array',{
                                domProps: {
                                    value: t.arrayData,

                                },
                                props:{
                                    fields:t.fields,
                                    showCommit:true,
                                    value: t.arrayData
                                },
                                on:{
                                    commit: function(arrayData){
                                        t.arrayData = arrayData;
                                        t.$emit('input', arrayData);
                                        t.$emit('commit', arrayData);
                                        t.dialog.close().remove();
                                        t.dialog = null;
                                    },
                                },
                                ref:"array"
                            },[]);
                        }
                    }).$mount();

                    var dialog = require('art-dialog');
                    var d = dialog({
                        width:800,
                        zIndex:100,
                        // height:'100%',
                        title: '设置',
                        content: _array.$el
                    });
                    d.showModal();
                    t.dialog = d;
                    //为了解决容器类积木  获取不到 弹窗中的子积木，方案待定
                    t.$refs[_TY_Tool.uuid()]=_array;//把bb-form 设置到$refs中
                },'art-dialog');
            },
             loadChildBB(){
                let t=this;
                return _TY_Tool.loadChildBB(t);                
            }
        }
    }
</script>