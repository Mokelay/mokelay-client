<template>
    <div class="bb-vant-field" :class="{
        'noPadding':option.noPadding,
        't_right':option.t_right
    }">
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
            :maxText="maxTextShow"
            @change="onInput" 
            @click-icon="clickIcon" 
            @keyup="keyup"/>
         <p v-if="messageText" class="showText">{{writeText}}/{{messageText}}</p>
     </div>


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
                type:String,
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
                    border:true,
                    error:false,  是否将输入内容标红
                    errorMessage:"错误提示文案", 底部错误提示文案 
                    autosize:true 自适应内容高度，只对 textarea 有效
                }
            */
            option:{
                type:Object,
                default:function() {
                    return {
                        type:"textarea",
                        placeholder:"",
                        label:"标签名",
                        icon:"",
                        leftIcon:"",
                        required:false,
                        disabled:false,
                        error:false,
                        errorMessage:"",
                        autosize:true,
                        maxText:100000,
                        border:true
                    };
                }
            }
        },
        data() {
            return {
                valueBase:this.value,
                writeText:"0",
                maxTextShow:this.option.maxText,
                messageText:this.option.maxText,
                isShowText:true
            };
        },
        mounted(){
            console.log("this.value:",this.value);
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
                this.$emit('input',this.valueBase);
                this.$emit('change',this.valueBase);
            },
            //显示字符，超出限制字符截取
            keyup(){
                this.writeText = this.valueBase.length;
                var t = this.valueBase;
        		var w = this.writeText;
        		var s = this.option.maxText;
        		if(w>s){
        			var a = this.valueBase.substring(0,s);
        			this.valueBase = a;
        			this.writeText = this.valueBase.length;
        		}                
            }

        }
    }
</script>

<style scoped>
    .showText{text-align:right; margin-right:5%;font-size: 0.2rem;}
</style>

<style>
    .bb-vant-field.noPadding .van-field{
        padding: 0;
    }
    .bb-vant-field.t_right .van-field input{
        text-align: right
    }
</style>