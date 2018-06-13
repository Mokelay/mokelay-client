<template>
    <van-cell 
        @click="click"
        :value="valueBase" 
        :icon="option.icon"
        :label="option.label"
        :required="option.required"
        :is-link="option.isLink"
        :center="option.center"
        :url="option.url"
        :clickable="option.clickable"
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
                    required:Boolean 是否显示表单必填星号,
                    isLink:Boolean 展示右侧箭头并开启点击反馈
                    center:Boolean 使内容垂直居中
                    url:""  跳转链接
                    clickable:Boolean 开启点击反馈
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
            //点击事件
            click(param){
                this.$emit('click',param);
            }
        }
    }
</script>

<style scoped>
</style>