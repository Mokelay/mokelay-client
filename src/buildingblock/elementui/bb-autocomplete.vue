<template>
    <el-autocomplete
      placeholder="请输入内容"
      v-model="valueBase"
      :disabled="option.disabled"
      :size="option.size"
      :fetch-suggestions="querySearchAsync"
      @change="change"
      @select="handleSelect"
      >
    </el-autocomplete>
</template>

<script>
    import Util from '../../libs/util';

    import Vue from 'vue';
    import {
            Autocomplete,
    } from 'element-ui'
    Vue.use(Autocomplete);

    export default {
        name: 'bb-autocomplete',
        props: {
            /*
                disabled 禁用
            */
            disabled:{
                type:Boolean
            },
            /*
                value 支持v-model
            */
            value:{
                type:[String,Number]
            },
            /*
                valueKey 数据查询字段 返回数据中对应的值字段
            */
            valueKey:{
                type:[String,Number],
                default:"value"
            },
            /*
                defaultValTpl 默认值支持模板
            */
            defaultValTpl:{
                type:[String,Number,Boolean]
            },
            /*
                suggestions 静态 模糊搜索数据
                [{
                    value:值  必填字段
                }]
            */
            suggestions:{
                type:Array
            },
            /*
                suggestionsDs 动态 模糊搜索数据配置
            */
            suggestionsDs:{
                type:Object
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
                valueBase: this.value,
                suggestionsBase:this.suggestions || [],
                queryString:null
            }
        },
        watch: {
            value(val){
                this.valueBase=val;
            }
        },
        created: function () {
        },
        mounted:function(){
            let t=this;
            _TY_Tool.buildDefaultValTpl(t,"valueBase");
        },
        methods: {
            change:function(val){
                this.$emit('input',val)
                this.$emit('change',val)
            },
            handleSelect:function(val){
                this.$emit('input',val)
                this.$emit('select',val)
            },
            getData: function (queryString,cb) {
                const t = this;
                if (t.suggestionsDs) {
                    _TY_Tool.getDSData(t.suggestionsDs, _TY_Tool.buildTplParams(t), function (map) {
                        t.suggestionsDs.type = t.suggestionsDs.type?t.suggestionsDs.type:"dynamic";
                        if(t.suggestionsDs.type == "dynamic"){
                            map.forEach((val,key)=>{
                                val.value.forEach((ele,index)=>{
                                    ele.value = ele[t.valueKey];
                                });
                                t.suggestionsBase = val.value;
                                t.getResults(queryString,cb);
                            })
                        }else{
                            t.suggestionsBase = map;
                            t.getResults(queryString,cb);
                        }
                    }, function (code, msg) {
                    });
                }
            },
            //异步检索补全提示
            querySearchAsync:function(queryString, cb){
                const t = this;
                t.queryString = queryString;
                if(t.suggestionsDs){
                    //动态查询
                    t.getData(queryString,cb);
                }else{
                    //静态查询
                    t.getResults(queryString,cb);
                }
            },
            //遍历查询输入字符是否在数据中
            createStateFilter:function(queryString) {
                const t = this;
                return (state) => {
                    if(state.value){
                        return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
                    }else{
                        t.$message({
                            type: 'error',
                            message: "请配置数据的检索字段！"
                        });
                        return false;
                    }
                };
            },
            //输出补全提示
            getResults:function(queryString,cb){
                const t = this;
                //如果有字符串判断 数据中哪些项包含该字符串
                const results = queryString ? t.suggestionsBase.filter(t.createStateFilter(queryString)) : t.suggestionsBase;
                //返回查询结果
                cb(results);
            }
        }
    }
</script>