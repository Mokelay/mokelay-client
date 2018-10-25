<template>
    <van-number-keyboard
        :show="valueBase"
        :title="option['title']"
        theme="custom"
        extra-key="."
        close-button-text="完成"
        :show-delete-key="option['show-delete-key']"
        :hide-on-click-outside="option['hide-on-click-outside']"
        @blur="onBlur"
        @input="onInput"
        @delete="onDelete"
        @close="hideKeyboard"
        @hide="hideKeyboard"
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
            }
        },
        data() {
            return {
                valueBase:this.show
            };
        },
        watch:{
            show(val){
                this.valueBase = val;
            }
        },
        mounted(){

        },
        //事件click
        methods: {
            //显示键盘
            showKeyboard(){
                const t = this;
                t.valueBase = true;
                t.$emit("showKeyboard",true);
            }, 
            //隐藏键盘
            hideKeyboard(){
                const t = this;
                t.valueBase = false;
                t.$emit("showKeyboard",false);
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
            onBlur(){
                this.valueBase = false;
                this.$emit("showKeyboard",false);
            }

        }
    }
</script>

<style scoped>
</style>