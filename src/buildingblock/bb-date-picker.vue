<template>
    <el-date-picker 
        v-model="valueBase"
        :disabled="option.disabled"
        :editable="option.editable"
        :picker-options="pickerOptions"
        :value-format="option.valueFormat"
        @change="change"
        :type="type" placeholder="选择日期时间"></el-date-picker>
</template>

<script>
    import Util from '../libs/util';

    export default {
        name: 'bb-date-picker',
        props: {
            option:{
                type: Object,
                /*数据格式
                    {
                        disabled:false,
                        editable:false,
                        handle:buzz //处理option 
                    }
                */
            },
            value:{
                type:[String,Date]
            },
            type:{
                type:String,
                default:'datetime'
            },
            defaultValTpl:{
                type:[String,Number,Boolean]
            }
        },
        data() {
            return {
                //默认值 
                valueBase: this.value,
                //日期选择器参数配置
                pickerOptions:null
            }
        },
        watch:{
            value(val){
                this.valueBase = val
            },
            valueBase(val){
                this.change(val);
            }
        },
        created: function () {
            const t = this;
            t.getPickerOptions();
        },
        mounted:function(){
            let t=this;
            _TY_Tool.buildDefaultValTpl(t,"valueBase");
        },
        methods: {
            change:function(val){
                this.$emit('input',val)
                this.$emit('change',val)
            },
            //通过buzz处理PickerOptions，实现返回自定义函数
            getPickerOptions:function(){
                const t = this;
                if(t.option.handle){
                    //日期选择器参数 通过buzz返回配置
                    _TY_Tool.loadBuzz(t.option.handle, function(code) {
                        t.pickerOptions = eval(code);
                    });
                }else{
                    //日期选择器参数配置
                    t.pickerOptions = Object.assign({},t.option);
                }
            }
        }
    }
</script>