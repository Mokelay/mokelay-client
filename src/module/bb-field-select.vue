<template>
    <div>
        <bb-cascader placeholder="请选择字段" @change="change" :dsList="dsList" v-model="field"></bb-cascader>
    </div>
</template>

<script>
    export default {
        name: 'bb-field-select',
        props: {
            value:{
                type:[String,Object,Array]
            },
            apiAlias:{//可以通过属性和下面的set方法来传参
                type:String,
                default:null
            }
        },
        data() {
            return {
                field:this.value,
                p_apiAlias:this.apiAlias,
                dsList:[{
                  type:'ds',                            //级联数据获取方式  接口获取
                  index:1,                              //级联第几层接口，比如第一层数据的获取接口   换用数组长度来表示
                  isleaf:false,                       //是否叶子节点
                  ds:{                                //ds配置
                    "api": "ty-list-api-by-alias",
                    "category": "config",
                    "method": "get",
                    "inputs": [{
                        "paramName": "aliass",
                        "valueType": "inputValueObj",
                        "valueKey": "bb",
                        "variable": "apiAlias"
                    }],
                    "outputs": [{
                        "dataKey": "data",
                        "valueKey": "data_list.list"
                    }]
                  },
                  props:{                               //接口返回字段和级联选择器的字段对应（字段名转换）
                    value:'alias',
                    label:'name'
                  }
                },{
                  type:'ds',                            //级联数据获取方式  接口获取
                  index:2,                              //级联第几层接口，比如第一层数据的获取接口   换用数组长度来表示
                  isleaf:false,                       //是否叶子节点
                  ds:{                                //ds配置
                    "api": "ty-list-response-by-apiAlias",
                    "category": "config",
                    "method": "get",
                    "inputs": [{
                        "paramName": "apiAlias",
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
                    value:'apiLegoId',
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
                }]
            }
        },
        watch: {
        },
        created: function () {
            let t=this;
            
        },
        mounted:function(){
        },
        methods: {
            change(value){
                let t=this;
                console.log("change value:",value);

                t.$emit('change',value);
                t.$emit('input',value);
            },
            //提供set方法，可以外部设置apiAlias
            setApiAlias(val){
                let t=this;
                t.p_apiAlias = val;
            }
        }
    }
</script>