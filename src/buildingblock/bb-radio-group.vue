<template>
    <el-radio-group :value="p_value" @input="radioChange" :size="option.size" :disabled="option.disabled" @change="radioChange">
        <el-radio v-if="type == 'radio'" v-for="item in p_options" :disabled="item.disabled" :label="item.value" :key="item.value">{{item.text}}</el-radio>
        <el-radio-button v-if="type == 'button'" v-for="item in p_options" :disabled="item.disabled" :label="item.value" :key="item.value" class="searchSelection">{{item.text}}</el-radio-button>
    </el-radio-group>
</template>

<script>
import Util from '../libs/util';

    export default {
        name : 'bb-radio-group',
        props:{
            value:{
                type:[String,Number],
                default:''
            },
            /**
                [{
                    "disabled":false,
                    "text":"text1",
                    "value":"val1"
                }]
            **/
            options:{
                type:Array
            },
            optionText:{
                type:String,
                default:''
            },
            optionValue:{
                type:String,
                default:''
            },
            ds: {
                type: Object,
                default: function () {
                    return null;
                }
            },
            type:{
                type:String,
                default:'radio'
            },
            defaultValTpl:{
                type:[String,Number,Boolean]
            },
            //基础配置
            option:{
                type:Object,
                default:function(){
                    return {
                        disabled:false,
                        size:""
                    };
                }
            }
        },
        data() {
            return {
                p_value:this.value,
                p_options:this.options
            };
        },
        watch:{
            value(val){
               this.p_value = val;
            }
        },
        mounted(){
            let t=this;
            if(this.ds){
                Util.getDSData(t.ds, _TY_Tool.buildTplParams(t), function (map) {
                    map.forEach(function (item) {
                        var list = item['value']['list'];
                        t.p_options = [];
                        for (var i in list) {
                            t.p_options.push({
                                text:list[i][t.optionText],
                                value:list[i][t.optionValue]
                            });
                        }
                    });
                    if(t.type == 'button'){
                        t.p_options.splice(0,0,{value:'',text:'全部'})
                    }
                }, function (code, msg) {
                });
            }
            //初始化默认值
            _TY_Tool.buildDefaultValTpl(t,"p_value");
        },
        methods: {
           radioChange(val){
                this.p_value = val;
                let tempVal = val;
                if(typeof(this.value)==='number'){
                    tempVal = new Number(val);
                }
                this.$emit("input",tempVal);
                this.$emit("change",tempVal);
           }    
        }
    }
</script>

<style>
    .searchSelection{
        margin:5px;
    }
    .searchSelection .el-radio-button__inner{
        border-radius: 20px !important;
        border: 1px solid #0091EA !important;
        color:#0091EA;
        padding: 6px 18px;
    }
</style>