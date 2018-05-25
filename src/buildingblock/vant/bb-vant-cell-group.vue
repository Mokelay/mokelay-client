<template>
    <van-cell-group>
        <bb-vant-cell v-for="(field,key) in valueBase" :key="key" :value="field.value" :option="field.option" click="cellClick"></bb-vant-cell>
    </van-cell-group>
</template>

<script>
import CellGroup from 'vant/lib/cell-group';
import 'vant/lib/cell-group/style';

    export default {
        name: 'bb-vant-cell-group',
        components: {
          "van-cell-group":CellGroup,
        },
        props: {
            /*内容
                [{
                    value:"String" cell中显示的内容,
                    option:{
                        icon:String 左侧图标,
                        title:String 左侧标题,
                        label:String 标题下方的描述信息,
                        required:Boolean 是否显示表单必填星号
                    }
                }]
            */
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
            //获取数据
            getData() {
                const t = this;
                if (t.ds) {
                    Util.getDSData(t.ds, _TY_Tool.buildTplParams(t), function (data) {
                        data.forEach((item) => {
                            const {dataKey, value} = item;
                            t.realFields = value;
                        });
                    }, function (code, msg) {
                    });
                }
            },
            //点击事件
            cellClick(param){
                this.$emit("click",param);
            }
        }
    }
</script>

<style scoped>
</style>