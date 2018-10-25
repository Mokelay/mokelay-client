<template>
    <vant-radio-group 
        class="bb-vant-raido-group"
        v-model="radio"  
        @change="change"
        :disabled="option.disabled">
        <vant-radio
            v-for="(field,key) in realFields"
            :key="key" 
            :name="field.value"
            :disabled="field.disabled"
            class="radioStyle"
            >
            <span>{{field.text}}</span>
            <span class="subTitle">{{field.subDescription}}</span> 
        </vant-radio>
    </vant-radio-group>
</template>

<script>
import RadioGroup from 'vant/lib/radio-group';
import 'vant/lib/radio-group/style';
import Radio from 'vant/lib/radio';
import 'vant/lib/radio/style';

    export default {
        name: 'bb-vant-raido-group',
        components: {
          "vant-radio":Radio,
          "vant-radio-group":RadioGroup
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
            radioData:{
            	type:[String,Number,Boolean],
            	default:'1',
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
                type:Array,
                default:function(){
                	return []
                }
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
                valueBaseString:'',
                radio:this.radioData,
            };
        },
        mounted(){
            //获取数据
            this.getData();
            _TY_Tool.buildDefaultValTpl(this, "valueBaseString");
            this.valueBase = eval(this.valueBaseString);
        },
        //事件 change 
        methods: {
            //获取数据
            getData() {
                const t = this;
                if (this.fieldsDs) {
                    _TY_Tool.getDSData(this.fieldsDs, _TY_Tool.buildTplParams(this), function (map) {
                        t.fieldsDs.type = t.fieldsDs.type?t.fieldsDs.type:"dynamic";
                        if(t.fieldsDs.type == "dynamic"){
                          map.forEach(function (item) {
                            var list;
                            if(item['value']&&item['value']['list']){
                              list = item['value']['list'];
                            }else{
                              list = item['value'];
                            }
                            t.realFields = [];
                            for (var i in list) {
                                var ele = list[i][t.valueField];
                                if(typeof(list[i][t.valueField]) != 'string'){
                                  ele = JSON.stringify(list[i][t.valueField])
                                }
                                let option = {
                                  value:ele,
                                  text:list[i][t.textField]+(t.showValue?"("+ele+")":"")
                                }
                                t.realFields.push(option);
                            }
                            t.totalItems = item['value']['totalRecords'];
                          });
                        }else{
                          t.realFields = map;
                        }
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

<style lang="less" scoped>
    .bb-vant-raido-group{
        font-size: 0.4rem;
        
    }
    .subTitle{
        color: #999999;
        font-size: 0.3rem;
        margin-left:0.5rem;
    }
    .radioStyle{
    	display:flex;
    }
    .van-icon-checked{
    	color:#f00;
    }
</style>