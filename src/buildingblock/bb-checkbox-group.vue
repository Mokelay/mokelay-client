<template>

            <el-checkbox-group v-model="p_value"  @change="checkboxChange">
                <el-checkbox v-if="type == 'checkbox'" v-for="item in p_options" :label="item.value" :key="item.value">{{item.text}}</el-checkbox>
                <el-checkbox-button v-if="type == 'button'" v-for="item in p_options" :label="item.value" :key="item.value" class="searchSelection">{{item.text}}</el-checkbox-button>
            </el-checkbox-group>

</template>

<script>
import Util from '../libs/util';
    export default {
        name : 'bb-checkbox-group',
        props:{
            value:{
                type:String,
                default:''
            },
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
                    return null
                }
            },
            type:{
                type:String,
                default:'checkbox'
            }
        },
        data() {
            return {
                p_value:this._changeToArray(this.value),
                p_options:this.options,
            };
        },
        mounted(){
            let t=this;
            if(this.ds){
                    Util.getDSData(t.ds, {"bb": t, "router": t.$route.params}, function (map) {
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
        },
        methods: {
           checkboxChange(val){
                this.$emit("input",this._changeToStr(val));
           },
           _changeToArray(str){
                let t =this;
                let result = [];
                if(str){
                    let arrayTemp = str.split(',');
                    arrayTemp.forEach(function(item){
                        result.push(item);
                    });
                }
                return result;
           },
           _changeToStr(array){
                let t =this;
                let result = '';
                if(array&&array.length>0){
                    array.forEach(function(item,index){
                        if(index>0){
                            result=result+",";
                        }
                        result=result+item;
                    });
                }
                return result;
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