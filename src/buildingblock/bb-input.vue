<template>
    <el-input
      placeholder="请输入内容"
      v-model="valueBase"
      @change="change"
      :disabled="disabled"
      >
    </el-input>
</template>

<script>
    import Util from '../libs/util';

    export default {
        name: 'bb-input',
        props: {
            disabled:{
                type:Boolean
            },
            value:{
                type:[String,Number]
            },
            defaultValTpl:{
                type:[String,Number]
            }
        },
        data() {
            return {
                valueBase: this.value,
            }
        },
        watch: {
            value(val){
                this.valueBase=val;
            }
        },
        created: function () {
        },
        mounted:function(){
            const t=this;
            if(!t.value&&t.defaultValTpl){
                t.valueBase=_TY_Tool.tpl(t.defaultValTpl,{
                    bb:t,
                    router:t.$route ? t.$route.params : {}
                });
                this.$emit('input',t.valueBase);
            }
        },
        methods: {
            change:function(val){
                this.$emit('input',val)
                this.$emit('change',val)
            }
        }
    }
</script>