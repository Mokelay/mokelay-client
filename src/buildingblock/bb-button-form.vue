<template>
    <div :class="buttonFormClass">{{formDesc}}<el-button :type="startButtonType" :icon="startButtonIcon" @click="setting">{{settingText}}</el-button></div>
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
            startButtonType:{
                type:String
            },
            startButtonIcon:{
                type:String
            },
            settingText:{
                type:String,
                default:"设置"
            },
            formDescTpl:{
                type:String
            },
            buttonConfig:{
                type:Object
            },
            valueDs:{
                type:Object
            },
            dsFields:{
                type:Object
            },
            showCancelButton:{
                type:Boolean
            },
            showCleanButton:{
                type:Boolean
            },
            hideSubmitButton:{
                type:Boolean
            },
            buttonFormClass:{
                type:String,
                default:'bb-button-form'
            },
            on:{
                type:Array
            },
            parentData:{
                type:Object
            },
            formButtonName:{
                type:String
            },
            labelWidth:{
                type:String
            },
            labelInline:{
                type:Boolean,
                default:false
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
                    return _TY_Tool.tpl(t.formDescTpl, _TY_Tool.buildTplParams(t));
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
                require.ensure(["art-dialog"],function(require){
                    var _form = new Vue({
                        router: t.$router,
                        render: function(createElement){
                            const formItem = createElement('bb-form',{
                                props:{
                                    fields:t.fields,
                                    value:t.formData, //传入value
                                    buttonConfig:t.buttonConfig,
                                    settingButtonText:t.formButtonName,
                                    ds:t.valueDs,
                                    dsFields:t.dsFields,
                                    showCancelButton:t.showCancelButton,
                                    showCleanButton:t.showCleanButton,
                                    hideSubmitButton:t.hideSubmitButton,
                                    on:t.on,
                                    parentData:t.parentData,
                                    labelWidth:t.labelWidth,
                                    labelInline:t.labelInline
                                },
                                on:{
                                    "button-finish":function(button, valueobj){
                                        t.$emit('button-finish', button, valueobj);
                                    },
                                    commit: function(formData){
                                        t.formData = formData;

                                        t.$emit('input', formData);
                                        t.$emit('commit', formData);
                                        t.dialog.close().remove();
                                        t.dialog = null;
                                    },
                                    cancel:function(formData){
                                        t.$emit('cancel',formData);
                                        t.dialog.close().remove();
                                        t.dialog = null;
                                    }
                                },
                                ref:"form"
                            },[]);
                            return createElement('div',{class:'bb-button-form-content'},[formItem])
                        }
                    }).$mount();
                    var dialog = require('art-dialog');
                    var d = dialog({
                        width:800,
                        zIndex:100,
                        title: '设置',
                        content: _form.$el
                    });
                    d.showModal();

                    //为了解决容器类积木  获取不到 弹窗中的子积木，方案待定
                     t.$refs[_TY_Tool.uuid()]=_form.$children[0];//把bb-form 设置到$refs中

                    t.dialog = d;
                },'art-dialog');
            },
            loadChildBB(){
                let t=this;
                return _TY_Tool.loadChildBB(t);                
            }
        }
    }
</script>
<style>
    .m10 {
        margin: 10px 0;
    }
    .db{
        display: block;
    }
    .dib{
        display: inline-block;
    }
    .di {
        display: inline;
    }

    .bb-button-form-content{
        height: 500px;
        overflow-y: auto;
    }
    .bb-button-form{
        display: inline-block;
    }
</style>