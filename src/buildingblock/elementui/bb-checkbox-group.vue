<template>
    <el-checkbox-group v-if="isShow" v-model="p_value" :size="realOption.size" :disabled="realOption.disabled" @change="checkboxChange">
        <el-checkbox v-if="type == 'checkbox'" v-for="item in p_options" :disabled="item.disabled" :label="item.value" :key="item.value" @change="itemClick(item)">{{item.text}}</el-checkbox>
        <el-checkbox-button v-if="type == 'button'" v-for="item in p_options" :disabled="item.disabled" :label="item.value" :key="item.value" class="searchSelection" @change="itemClick(item)">{{item.text}}</el-checkbox-button>
    </el-checkbox-group>
</template>

<script>
import Util from '../../libs/util';
    export default {
        name : 'bb-checkbox-group',
        props:{
            value:{
                type:[String,Number,Array],
                default:''
            },
            /*options
                [{
                    "disabled":false,
                    "text":"text1",
                    "value":"val1"
                }]
            */
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
                default:'checkbox'
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
            },
            //第一个是不是All，如果是All 应该和其他几项互斥,默认不是，主要用于checkbox作为搜索条件
            firstIsAll:{
                type:Boolean,
                default:false
            }
        },
        data() {
            return {
                p_value:this._changeToArray(this.value),
                p_options:this.options,
                isShow:true,
                realOption:this.option
            };
        },
        watch:{
            value(val){
                this.p_value = this._changeToArray(val)
            },
            options(val){
                this.p_options = val;
            },
            option(val){
                this.realOption = val;
            }
        },
        mounted(){
            let t=this;
            if(this.ds){
                    Util.getDSData(t.ds, _TY_Tool.buildTplParams(t), function (map) {
                            map.forEach(function (item) {
                                var list = item['value']['list'];
                                t[item['dataKey']] = [];
                                for (var i in list) {
                                    t[item['dataKey']].push({
                                        text:list[i][t.optionText],
                                        value:list[i][t.optionValue]
                                    });
                                }
                            });
                    }, function (code, msg) {
                    });
            }

            _TY_Tool.buildDefaultValTpl(t,"p_value");
        },
        methods: {
            checkboxChange(val){
                this.$emit("input",this._changeToStr(val));
            },
            _changeToArray(str){
                let t =this;
                let result = [];
                if(typeof(str)==="number"&&str>=0){
                    result.push(str+"");
                }else if(typeof(str)==="object"){
                    result = str;
                }else{
                    if(str){
                        if(t.p_options&&t.p_options.length>0){
                            for(let i=0;i<t.p_options.length;i++){
                                if(t.p_options[i].value==str){
                                    return [str];
                                }
                            }
                        }
                        let arrayTemp = str.split(',');
                        arrayTemp.forEach(function(item){
                            result.push(item);
                        });
                    }
                }
                return result;
            },
            _changeToStr(array){
                let t =this;
                let result = '';
                if(array.length>1&&t.firstIsAll){
                    //如果选择了多个checkBox,并且第一项是全部，应该和其他几项互斥
                    array.forEach((item,index)=>{
                        let _index = index==0?index+1:index-1;
                        if(item==''||item=='all'||item=='ALL'||item=='All'||item.indexOf(array[_index])>=0){
                            if(index==array.length-1){
                                //表示最后一个点击全部，则清空其他选项
                                array = [];
                                result = [item];
                            }else{
                                array.splice(index,1);
                            }
                            return false;
                        }
                    });
                }
                if(array&&array.length>0){
                    array.forEach(function(item,index){
                        if(index>0){
                            result=result+",";
                        }
                        result=result+item;
                    });
                }
                //设置p_value
                this.p_value = this._changeToArray(result);
                return result;
            },
            itemClick(item){
                this.$emit("itemClick",item);
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

<style>
    .searchSelection{
        margin:5px;
    }
    .searchSelection .el-checkbox-button__inner{
        border-radius: 20px !important;
        border: 1px solid #0091EA !important;
        color:#0091EA;
    }
</style>