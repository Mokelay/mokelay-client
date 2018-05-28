<template>
    <van-number-keyboard
        :show="valueBase"
        :theme="option.theme"
        extra-key="."
        close-button-text="完成"
        @blur="valueBase = false"
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
                default:false
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
                        "theme":"custom",
                        "title":"",
                        "show-delete-key":true,
                        "hide-on-click-outside":true
                    };
                }
            },
            //css布局样式是否允许自定义
            cssStyleEditable:{
                type:Boolean,
                default:false
            }
        },
        data() {
            return {
                valueBase:this.show
            };
        },
        mounted(){

        },
        //事件click
        methods: {
            //显示键盘
            showKeyboard(){
                const t = this;
                t.valueBase = true;
            }, 
            //隐藏键盘
            hideKeyboard(){
                const t = this;
                t.valueBase = false;
            },
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