<template>
    <van-radio-group 
        v-model="valueBase"  
        @change="change"
        :disabled="option.disabled">
        <van-radio
            v-for="(field,key) in realFields"
            :key="key" 
            :name="field.value"
            :disabled="field.disabled"
            >{{field.text}}</van-radio>
    </van-radio-group>
</template>

<script>
import RadioGroup from 'vant/lib/radio-group';
import 'vant/lib/radio-group/style';
import Radio from 'vant/lib/radio';
import 'vant/lib/radio/style';

    export default {
        name: 'bb-vant-button',
        components: {
          "van-radio":Radio,
          "van-radio-group":RadioGroup
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
            /*选项数据 静态
                [{
                    text:'选项1'，
                    value:1,
                    disabled:false
                },{
                    text:'选项2'，
                    value:2,
                    disabled:false
                }]
            */
            fields:{
                type:Array
            },
            /*选项数据 动态
                通过DS接口获取
            */
            fieldsDs:{
                type:Object
            },
            /*其他属性扩展 disabled 等
                disabled: 禁用
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
                realFields:this.fields,
                valueBase:this.value,
                valueBaseString:''
            };
        },
        mounted(){
            //获取数据
            this.getData();
            _TY_Tool.buildDefaultValTpl(t, "valueBaseString");
            t.valueBase = eval(t.valueBaseString);
        },
        //事件 change 
        methods: {
            //获取数据
            getData() {
                const t = this;
                if (t.fieldsDs) {
                    Util.getDSData(t.fieldsDs, _TY_Tool.buildTplParams(t), function (data) {
                        data.forEach((item) => {
                            const {dataKey, value} = item;
                            t.realFields = value;
                        });
                    }, function (code, msg) {
                    });
                }
            },
            //值改变
            change(val){
                this.$emit("change",val);
            }
        }
    }
</script>

<style scoped>
</style>