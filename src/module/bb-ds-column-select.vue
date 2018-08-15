<template>
    <div>
        <bb-cascader :ref="uuid" placeholder="请选择字段" @change="change" :dsList="dsList" :staticOptions="firstOpts" v-model="valueBase"></bb-cascader>
    </div>
</template>

<script>
    export default {
        name: 'bb-ds-column-select',
        props: {
            value:{
                type:[String,Object,Array]
            },
            //设置value的取值，input返回的是一个对象，valueTpl设置返回的取值
            valueTpl:{
                type:String,
                default:null
            }
        },
        data() {
            return {
                valueBase:this.value,
                uuid:_TY_Tool.uuid(),//生成uuid
                dsList:[],
                firstOpts:[]//第一层下拉数据
            }
        },
        watch: {
            value(val){
                if (typeof val === 'object') {
                    this.valueBase = val;
                } else if (typeof val === 'string') {
                    this.valueBase = (val ? JSON.parse(val) : {});
                }
            }
        },
        created: function () {
            let t=this;
            debugger;
            t.buildDsList();
        },
        mounted:function(){
        },
        methods: {
            //构建ds list
            buildDsList:function(){
                let t=this;
                let dss = _TY_DS_Cache;
                if(!dss || !(dss instanceof Array)){
                    return;
                }
                let _opts = [];
                dss.forEach((item)=>{
                    _opts.push({
                        value: item.alias,
                        label: item.name+"("+item.alias+")",
                        children:[]
                    });
                });
                t.firstOpts = _opts;

                t.dsList = [{
                  type:'ds',                            //级联数据获取方式  接口获取
                  index:2,                              //级联第几层接口，比如第一层数据的获取接口   换用数组长度来表示
                  isleaf:false,                       //是否叶子节点
                  ds:{                                //ds配置
                    "api": "ty_list_api_response",
                    "category": "config",
                    "method": "get",
                    "inputs": [{
                        "paramName": "alias",
                        "valueType": "inputValueObj",
                        "valueKey": "bb",
                        "variable": "itemVal"
                    }],
                    "outputs": [{
                        "dataKey": "data",
                        "valueKey": "data_list"
                    }]
                  },
                  props:{                               //接口返回字段和级联选择器的字段对应（字段名转换）
                    value:'apiLegoUuid',
                    label:'name'
                  }
                },{
                  type:'ds',                            //级联数据获取方式  接口获取
                  index:3,                              //级联第几层接口，比如第一层数据的获取接口   换用数组长度来表示
                  isleaf:true,                       //是否叶子节点
                  ds:{                                //ds配置
                    "api": "ty-list-apiLego-field",
                    "category": "config",
                    "method": "get",
                    "inputs": [{
                        "paramName": "apiLegoId",
                        "valueType": "inputValueObj",
                        "valueKey": "bb",
                        "variable": "itemVal"
                    }],
                    "outputs": [{
                        "dataKey": "data",
                        "valueKey": "data_list.list"
                    }]
                  },
                  props:{                               //接口返回字段和级联选择器的字段对应（字段名转换）
                    value:'fieldName',
                    label:'name'
                  }
                }];
            },
            //级联选择change事件
            change(value){
                let t=this;
                console.log("change value:",value);
                if(t.valueTpl){
                    t.$emit('change',_TY_Tool.tpl(t.valueTpl,_TY_Tool.buildTplParams(t,value)));
                    t.$emit('input',_TY_Tool.tpl(t.valueTpl,_TY_Tool.buildTplParams(t,value)));
                }else{
                    t.$emit('change',value);
                    t.$emit('input',value);
                }
            }
           
        }
    }
</script>

<style scoped>
    
</style>