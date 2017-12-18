<template>
    <el-switch active-text="是" inactive-text="否" v-model="p_value" @change="switchChange"></el-switch>
</template>

<script>
    export default {
        name : 'bb-editor-switch',
        props:{
            value:{
                type:[Boolean,String],
                default:false
            },
            defaultValTpl:{
                type:[String,Number,Boolean]
            }
        },
        data() {
            return {
                p_value:(typeof this.value==='boolean')?this.value:(this.value=='true')
            };
        },
        watch:{
            value(val){
                this.p_value = (typeof val==='boolean')?val:(val=='true')
            }
        },
        mounted:function(){
            let t=this;
            _TY_Tool.buildDefaultValTpl(t,"p_value");
        },
        methods: {
           switchChange(val){
                this.p_value=val;
                this.$emit("input",val);
           }    
        }
    }
</script>

<style scoped>
   
</style>