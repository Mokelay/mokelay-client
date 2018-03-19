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
                type:[String,Number,Boolean]
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
            let t=this;
            _TY_Tool.buildDefaultValTpl(t,"valueBase");  
            t.$emit('mounted',this.valueBase);          
        },
        methods: {
            change:function(val){
                this.$emit('input',val)
                this.$emit('change',val)
            },
            //外部联动 接收交互参数
            linkage:function(data){
                const t = this;
                if(data){
                    t.valueBase = data;
                    t.change(data);
                }
            },
        }
    }
</script>