<template>
    <el-switch v-if="isShow" :active-text="option.activeText" :inactive-text="option.inactiveText" :disabled="option.disabled" :size="option.size" v-model="p_value" @change="switchChange"></el-switch>
</template>

<script>

    import Vue from 'vue';
    import {
            Switch
    } from 'element-ui'
    Vue.use(Switch);

    export default {
        name : 'bb-editor-switch',
        props:{
            value:{
                type:[Boolean,String]
            },
            defaultValTpl:{
                type:[String,Number,Boolean]
            },
            //基础配置
            option:{
                type:Object,
                default:function(){
                    return {
                        size:"",
                        activeText:"是",
                        inactiveText:"否",
                        disabled:false,
                        readonly:false
                    }
                }
            }
        },
        data() {
            return {
                p_value:(typeof this.value==='boolean')?this.value:(this.value == 'true'),
                tpl_value:'',
                isShow:true,
                realOption:this.option
            };
        },
        watch:{
            value(val){
                this.p_value = (typeof val==='boolean')?val:(val == 'true');
            },
            option(val){
                this.realOption = val;
            }
        },
        mounted:function(){
            let t=this; 
            if(this.value != undefined){
                t.p_value = this.value;
            }else{
                _TY_Tool.buildDefaultValTpl(t,"tpl_value");
                t.p_value = (typeof t.tpl_value==='boolean')?t.tpl_value:(t.tpl_value == 'true');
            }
        },
        methods: {
            switchChange(val){
                this.$emit("input",val);
                this.$emit("change",val);
            },
            //隐藏积木
            hideFn(){
                this.isShow = false;
            },
            //展示积木
            showFn(){
                this.isShow = true;
            },
            //禁用积木
            disabledFn(){
                this.realOption.disabled = true;
            },
            //启用积木
            enabledFn(){
                this.realOption.disabled = false;
            },   
        }
    }
</script>

<style scoped>
   
</style>