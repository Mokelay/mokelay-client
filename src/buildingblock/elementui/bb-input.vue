<template>
    <el-input
      :placeholder="option.placeholder"
      v-model="valueBase"
      @change="change"
      :disabled="disabled||option.disabled"
      :readonly="option.readonly"
      :size="option.size"
      :prefix-icon="option.prefixIcon"
      :suffix-icon="option.suffixIcon"
      >
    </el-input>
</template>

<script>
    import Util from '../../libs/util';

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
            },
            //基础配置
            option:{
                type:Object,
                default:function(){
                    return {
                        disabled:false,
                        readonly:false,
                        size:"",
                        prefixIcon:null,
                        suffixIcon:null,
                        placeholder:"请输入内容"
                    };
                }
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