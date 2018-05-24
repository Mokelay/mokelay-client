<template>
    <van-cell-group>
        <bb-vant-cell v-for="(field,key) in valueBase" :key="key" :value="field.value" :option="field.option"></bb-vant-cell>
    </van-cell-group>
</template>

<script>
import Cell from 'vant/lib/cell';
import 'vant/lib/cell/style';

    export default {
        name: 'bb-vant-cell-group',
        components: {
          "van-cell":Cell,
        },
        props: {
            //内容
            value:{
                type:[Array]
            },
            /*模板默认值*/
            defaultValTpl:{
                type:[String,Number,Boolean]
            },
            /*动态获取内容*/
            ds:{
                type:Object
            },
            /*其他属性配置
                {
                    border:Boolean  是否显示外边框
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