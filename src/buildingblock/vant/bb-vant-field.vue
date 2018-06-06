<template>
     <van-field 
        v-model="valueBase" 
        :type="option.type"
        :label="option.label"
        :icon="option.icon"
        :leftIcon="option.leftIcon"
        :required="option.required"
        :disabled="option.disabled"
        :error="option.error" 
        :errorMessage="option.errorMessage" 
        :autosize="option.autosize"
        @change="onInput" 
        @click-icon="clickIcon" />
</template>

<script>
import Field from 'vant/lib/field';
import 'vant/lib/field/style';

    export default {
        name: 'bb-vant-field',
        components: {
          "van-field":Field,
        },
        props: {
            //内容
            value:{
                type:[Number,String,Boolean]
            },
            /*模板默认值*/
            defaultValTpl:{
                type:[String,Number,Boolean]
            },
            /*其他属性配置
                {
                    type:"defalut", 可设置为任意原生类型 number tel textarea
                    placeholder:"", 
                    label:"标签名",
                    icon:"", 输入框尾部图标
                    leftIcon:"",输入框左侧图标
                    required:false,
                    disabled:false,
                    error:false,  是否将输入内容标红
                    errorMessage:"错误提示文案", 底部错误提示文案 
                    autosize:true 自适应内容高度，只对 textarea 有效
                }
            */
            option:{
                type:Object,
                default:function() {
                    return {
                        type:"number",
                        placeholder:"",
                        label:"标签名",
                        icon:"",
                        leftIcon:"",
                        required:false,
                        disabled:false,
                        error:false,
                        errorMessage:"",
                        autosize:true
                    };
                }
            }
        },
        data() {
            return {
                valueBase:this.value
            };
        },
        mounted(){
            let t=this;
            _TY_Tool.buildDefaultValTpl(t,"valueBase");  
            t.$emit('mounted',this.valueBase); 
        },
        //事件click
        methods: {
            //点击图标
            clickIcon(key){
                this.$emit('clickIcon',key);
            }, 
            //输入事件
            onInput(key){
                this.$emit('input',key);
                this.$emit('change',key);
            }

        }
    }
</script>

<style scoped>
</style>