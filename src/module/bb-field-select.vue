<template>
    <div>
        <bb-cascader :ref="uuid" placeholder="请选择字段" @change="change" :dsList="dsList" v-model="field"></bb-cascader>
    </div>
</template>

<script>
    import bbcascader from '../buildingblock/elementui/bb-cascader.vue';

    export default {
        name: 'bb-field-select',
        components:{
            "bb-cascader":bbcascader
        },
        props: {
            value:{
                type:[String,Object,Array]
            },
            apiAlias:{//可以通过属性和下面的set方法来传参
                type:String,
                default:null
            },
            //设置value的取值，input返回的是一个对象，valueTpl设置返回的取值
            valueTpl:{
                type:String,
                default:null
            }
        },
        data() {
            return {
                field:this.value,
                p_apiAlias:_TY_Tool.tpl(this.apiAlias,_TY_Tool.buildTplParams(this)),
                uuid:_TY_Tool.uuid(),//生成uuid
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
                        "valueKey": "external",
                        "variable": "linkage"
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
            apiAlias(val){
                this.getFirstData(_TY_Tool.tpl(val,_TY_Tool.buildTplParams(this)));
            }
        },
        created: function () {
        },
        mounted:function(){
            let t=this;
            t.getFirstData(t.p_apiAlias);
        },
        methods: {
            //获取第一级数据
            getFirstData(val){
                let t=this;
                if(val){
                    let cascader = t.$refs[t.uuid];
                    //刷新级联选择器 第一级
                    cascader.linkage(val);
                }
            },
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
            },
            //提供set方法，可以外部设置apiAlias
            setApiAlias(val){
                let t=this;
                t.p_apiAlias = _TY_Tool.tpl(val,_TY_Tool.buildTplParams(t));
                t.getFirstData(t.p_apiAlias);
            }
        }
    }
</script>