<template>
    <el-autocomplete
      placeholder="请输入内容"
      v-model="valueBase"
      :disabled="disabled"
      :fetch-suggestions="querySearchAsync"
      @change="change"
      @select="handleSelect"
      >
    </el-input>
</template>

<script>
    import Util from '../libs/util';

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
            }
        },
        data() {
            return {
                valueBase: this.value,
                suggestionsBase:this.suggestions
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
            getData: function () {
                const t = this;
                if (t.suggestionsDs) {
                    _TY_Tool.getDSData(t.suggestionsDs, {"bb": t, "router": t.$route.params}, function (map) {
                        map.forEach((val,key)=>{
                            const dataKey = val.dataKey
                            t.suggestionsBase = val.value.list;
                        })
                    }, function (code, msg) {
                    });
                }
            },
            querySearchAsync:function(queryString, cb){
                const t = this;
                if(t.suggestionsDs){
                    t.getData();
                }
            },
            createStateFilter:function(queryString) {
                return (state) => {
                  return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
                };
            },
        }
    }
</script>