<template>
    <div class="m10">{{formDesc}}<el-button @click="setting">{{settingText}}</el-button></div>
</template>

<script>
import Vue from 'vue';
import Util from '../libs/util';
    export default {
        name: 'bb-button-form',
        props: {
            value:{
                type:[String,Object]
            },
            fields:{
                type:[String,Array]
            },
            settingText:{
                type:String,
                default:"设置"
            },
            formDescTpl:{
                type:String
            }
        },

        data() {
            return {
                formData:this.value,
                dialog:null
            }
        },
        computed: {
            formDesc:function(){
                var t = this;
                if(t.formDescTpl && t.formData){
                    return Util.tpl(t.formDescTpl, t.formData);
                }
            },
        },
        watch: {
            value(val){
                if (typeof val === 'object') {
                    this.formData = val;
                } else if (typeof val === 'string') {
                    this.formData = (val ? JSON.parse(val) : {});
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
                require.ensure(["art-dialog","jquery"],function(require){
                    var _form = new Vue({
                        router: t.$router,
                        render: function(createElement){
                            return createElement('bb-form',{
                                // domProps: {
                                //     value: t.formData
                                // },
                                props:{
                                    fields:t.fields,
                                    value:t.formData //传入value
                                },
                                on:{
                                    commit: function(formData){
                                        t.formData = formData;
                                        t.$emit('input', formData);
                                        t.$emit('commit', formData);
                                        t.dialog.close().remove();
                                        t.dialog = null;
                                    }
                                },
                                ref:"form"
                            },[]);
                        }
                    }).$mount();

                    var dialog = require('art-dialog');
                    var d = dialog({
                        width:800,
                        // zIndex:2100,
                        // height:'100%',
                        title: '设置',
                        content: _form.$el
                    });
                    d.showModal();
                    t.dialog = d;
                });
            }
        }
    }
</script>
<style scoped>
    .m10 {
        margin: 10px 0;
    }
</style>