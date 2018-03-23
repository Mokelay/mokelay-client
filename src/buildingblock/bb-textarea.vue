<template>
      <el-input
        type="textarea"
        :rows="2"
        placeholder="请输入内容"
        v-model="valueBase"
        @change="change"
        :disabled="disabled"
        :style="p_style"
        >
      </el-input>
</template>

<script>
    import Util from '../libs/util';

    export default {
        name: 'bb-textarea',
        props: {
            disabled:{
                type:Boolean
            },
            value:{
                type:[String,Number]
            },
            defaultValTpl:{
                type:[String,Number,Boolean]
            },
            bbStyle:{
                type:[String,Object],
                default:''
            }
        },
        data() {
            return {
                valueBase: this.value,
                p_style:typeof(this.bbStyle)==='string'?eval(this.bbStyle):this.bbStyle
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
            let t=this;
            _TY_Tool.buildDefaultValTpl(t,"valueBase");
            t.$emit('mounted',t.valueBase);
        },
        methods: {
            change:function(val){
                this.$emit('input',val)
                this.$emit('change',val)
            }
        }
    }
</script>