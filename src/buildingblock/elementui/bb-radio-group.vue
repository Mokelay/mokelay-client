<template>
    <el-radio-group v-if="isShow" :value="p_value" @input="radioChange" :size="realOption.size" :disabled="realOption.disabled" @change="radioChange" :class="realOption.layout">
        <el-radio v-if="type == 'radio'" v-for="item in p_options" :disabled="item.disabled" :label="item.value" :key="item.value">{{item.text}}</el-radio>
        <el-radio-button v-if="type == 'button'" v-for="item in p_options" :disabled="item.disabled" :label="item.value" :key="item.value" class="searchSelection">{{item.text}}</el-radio-button>
    </el-radio-group>
</template>

<script>
import Util from '../../libs/util';

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
            /*基础配置
                {
                    layout:"bb-radio-group-vertical bb-radio-group-horizontal"
                }
            */
            option:{
                type:Object,
                default:function(){
                    return {
                        disabled:false,
                        size:"",
                        layout:"bb-radio-group-horizontal"
                    };
                }
            }
        },
        data() {
            return {
                p_value:this.value,
                //选项
                p_options:this.options,
                //配置
                realOption:this.option,
                isShow:true
            };
        },
        watch:{
            value(val){
               this.p_value = val;
            },
            option(val){
                this.realOption = val;
            }
        },
        mounted(){
            let t=this;
            if(this.ds){
                Util.getDSData(t.ds, _TY_Tool.buildTplParams(t), function (map) {
                    t.ds.type = t.ds.type?t.ds.type:"dynamic";
                    if(t.ds.type == "dynamic"){
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
                    }else{
                      t.p_options = map;
                    }
                    if(t.type == 'button'){
                        t.p_options.splice(0,0,{value:'',text:'全部'});
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
                    tempVal = Number(val);
                }
                this.$emit("input",tempVal);
                this.$emit("change",tempVal);
            },
            //隐藏积木
            hideFn(){
                this.isShow = false;
            },
            //展示积木
            showFn(){
                this.isShow = true;
            },
            //禁用积木
            disabledFn(){
                this.realOption.disabled = true;
            },
            //启用积木
            enabledFn(){
                this.realOption.disabled = false;
            },
            //外部取值
            getValue:function(){
                return this.p_value;
            },
            //外部设值
            setValue:function(val){
                this.p_value = val;
                this.$emit('input',val);
                this.$emit('change',val);
            }
        }
    }
</script>

<style lang="less">
    .bb-radio-group-vertical{
        .el-radio{
            display: block;
            margin:0 0 5px 0 !important;
        }
    }
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