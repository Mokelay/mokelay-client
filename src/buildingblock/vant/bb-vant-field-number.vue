<template>
    <div>
        <van-field 
            v-model="valueBase" 
            type="number"
            :label="option.label"
            :icon="option.icon"
            :leftIcon="option.leftIcon"
            :required="option.required"
            :disabled="option.disabled"
            :error="option.error" 
            :errorMessage="option.errorMessage" 
            :autosize="option.autosize"
            @focus="showKeyboard"
            @change="onInput" 
            @click-icon="clickIcon" />
        <bb-vant-number-keyboard
            :show="show"
            @showKeyboard="(val)=>{show = false}"
            @input="onInput"
            @delete="onDelete"
            >
        </bb-vant-number-keyboard>
    </div>

        
</template>

<script>
import Field from 'vant/lib/field';
import 'vant/lib/field/style';

    export default {
        name: 'bb-vant-field-number',
        components: {
          "van-field":Field,
        },
        props: {
            //v-model
            value:{
                type:Number
            },
            /*模板默认值*/
            defaultValTpl:{
                type:[String,Number,Boolean]
            },
            /*其他属性配置
                {
                    theme:String 主题,
                    title:String 标题,
                    show-delete-key:Boolean 是否展示删除按钮,
                    hide-on-click-outside:Boolean 点击外部时是否收起键盘
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
                valueBase:typeof this.value == "string"?Number(this.value):this.value,
                valueBaseString:this.value,
                show:false
            };
        },
        mounted(){
            let t=this;
            //解析模板默认值
            _TY_Tool.buildDefaultValTpl(t,"valueBaseString");
            //对模板解析输出的字符串转换格式
            t.valueBase = Number(t.valueBaseString); 
            t.$emit('mounted',this.valueBase); 
        },
        //事件click
        methods: {
            //显示键盘
            showKeyboard(){
                const t = this;
                t.show = true;
            }, 
            //隐藏键盘
            hideKeyboard(){
                const t = this;
                t.show = false;
            },
            //输入事件
            onInput(key){
                const newValueBase = this.valueBase?this.valueBase + '' + key : '' + key;
                this.valueBase = Number(newValueBase);
                this.$emit('input',key);
                this.$emit('change',key);
            },
            //删除事件
            onDelete(key){
                let newValueBase = this.valueBase?this.valueBase + '': null;
                newValueBase = newValueBase?newValueBase.slice(0,newValueBase.length-1):newValueBase;
                this.valueBase = newValueBase?Number(newValueBase):null;
                this.$emit('delete',key);
                this.$emit('change',key);
            },
            onBlur(){
                this.show = false;
            },
            clickIcon(param){
            }
        }
    }
</script>

<style scoped>
</style>