<template>
    <van-cell 
        :value="valueBase" 
        :icon="option.icon"
        :label="option.label"
        :required="option.required"
        :title="option.title"/>
</template>

<script>
import Cell from 'vant/lib/cell';
import 'vant/lib/cell/style';

    export default {
        name: 'bb-vant-cell',
        components: {
          "van-cell":Cell,
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
                    icon:String 左侧图标,
                    title:String 左侧标题,
                    label:String 标题下方的描述信息,
                    required:Boolean 是否显示表单必填星号
                }
            */
            option:{
                type:Object,

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
        }
    }
</script>

<style scoped>
</style>