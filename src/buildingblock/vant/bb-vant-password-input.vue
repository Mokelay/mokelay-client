<template>
    <span>
        <van-password-input
          :value="valueBase"
          info="密码为 6 位数字"
          @focus="showKeyboard = true"
        />

        <!-- 数字键盘 -->
        <van-number-keyboard
          :show="showKeyboard"
          @input="onInput"
          @delete="onDelete"
          @blur="showKeyboard = false"
        />
    </span> 
</template>

<script>
import PasswordInput from 'vant/lib/password-input';
import 'vant/lib/password-input/style';
import NumberKeyboard from 'vant/lib/number-keyboard';
import 'vant/lib/number-keyboard/style';

    export default {
        name: 'bb-vant-password-input',
        components: {
            "van-password-input":PasswordInput,
            "van-number-keyboard":NumberKeyboard
        },
        props: {
            //v-model
            value:{
                type:Number
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
                    };
                }
            }
        },
        data() {
            return {
                valueBase:this.value,
                showKeyboard: false
            };
        },
        mounted(){ 
        },
        //事件click
        methods: {
            onInput(key) {
                this.valueBase = (this.valueBase + key).slice(0, 6);
                this.$emit("input",this.value);
                this.$emit("change",this.value);
            },
            onDelete() {
                this.value = this.value.slice(0, this.value.length - 1);
                this.$emit("delete",this.value);
                this.$emit("change",this.value);
            }
        }
    }
</script>

<style scoped>
</style>