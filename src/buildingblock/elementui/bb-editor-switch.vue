<template>
    <el-switch :active-text="option.activeText" :inactive-text="option.inactiveText" :disabled="option.disabled" :size="option.size" v-model="p_value" @change="switchChange"></el-switch>
</template>

<script>
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
                tpl_value:''
            };
        },
        watch:{
            value(val){
                this.p_value = (typeof val==='boolean')?val:(val == 'true');
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
           }    
        }
    }
</script>

<style scoped>
   
</style>