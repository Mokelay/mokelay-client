<template>
    <van-switch v-model="valueBase" :disabled="option.disabled" @change="change" />
</template>

<script>
import Switch  from 'vant/lib/switch ';
import 'vant/lib/switch/style';

    export default {
        name: 'bb-vant-button',
        components: {
          "van-switch":Switch
        },
        props: {
            //默认值  支持v-model
            value:{
                type:[Number,String,Boolean]
            },
            /*模板默认值*/
            defaultValTpl:{
                type:[String,Number,Boolean]
            },
            /*其他属性扩展 disabled 等
                {
                    disabled: false禁用,
                    loading: false, 加载状态
                    size: 30px 大小
                }
            */
            option:{
                type:Object,
                default:function(){
                    return {
                        disabled:false
                    }
                }
            }

        },
        data() {
            return {
                valueBase:this.value,
                valueBaseString:''
            };
        },
        mounted(){
            _TY_Tool.buildDefaultValTpl(t, "valueBaseString");
            t.valueBase = eval(t.valueBaseString);
        },
        //事件  change
        methods: {
            //值改变
            change(val){
                this.$emit("change",val);
            }
        }
    }
</script>

<style scoped>
</style>