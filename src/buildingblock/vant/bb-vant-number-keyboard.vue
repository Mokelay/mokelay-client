<template>
    <van-number-keyboard
        :show="show"
        theme="option.theme"
        extra-key="."
        close-button-text="完成"
        show-delete-key="option['show-delete-key']"
        hide-on-click-outside="option['hide-on-click-outside']"
        @blur="show = false"
        @input="onInput"
        @delete="onDelete"
        >
    </van-number-keyboard>
        
</template>

<script>
import NumberKeyboard from 'vant/lib/number-keyboard';
import 'vant/lib/number-keyboard/style';

    export default {
        name: 'bb-vant-number-keyboard',
        components: {
          "van-number-keyboard":NumberKeyboard,
        },
        props: {
            //内容
            show:{
                type:Boolean,
                default:true
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
                        "theme":"default",
                        "title":"",
                        "show-delete-key":true,
                        "hide-on-click-outside":true
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

        },
        //事件click
        methods: {
            //输入事件
            onInput(key){
                this.$emit('input',key);
                this.$emit('change',key);
            },
            //删除事件
            onDelete(key){
                this.$emit('delete',key);
                this.$emit('change',key);
            },

        }
    }
</script>

<style scoped>
</style>