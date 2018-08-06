<template>
    <el-input
        v-if="isShow"
        :placeholder="realOption.disabled?'':realOption.placeholder"
        v-model="valueBase"
        @change="change"
        :disabled="disabled||realOption.disabled"
        :readonly="realOption.readonly"
        :size="realOption.size"
        :prefix-icon="realOption.prefixIcon"
        :suffix-icon="realOption.suffixIcon"
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
                isShow:true,
                realOption:this.option
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
            //外部取值
            getValue:function(){
                return this.valueBase;
            },
            //外部设值
            setValue:function(val){
                this.valueBase = val;
                this.$emit('input',val);
                this.$emit('change',val);
            }
        }
    }
</script>