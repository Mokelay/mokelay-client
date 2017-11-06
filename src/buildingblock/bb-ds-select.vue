<template>
    <div>
        <bb-button-form :fields="fields" settingText="设置数据源" v-model="ds" formDescTpl="API:<%api%>"></bb-button-form>
    </div>
</template>

<script>
import Vue from 'vue';
    export default {
        name: 'bb-ds-select',
        props: {
            value:{
                type:[String,Object]
            }
        },

        data() {
            return {
                fields:[
                    {name:'API',attributeName:'api',et:'bb-popup-selection',props:{
                        textField:'name',valueField:'alias',valueField2:'url',popupGrid:{ds:{api:'/list-api',method:'post',inputs: [{paramName: 'keywords', valueType: "inputValueObj", valueKey: "bb", variable: "keywords"}],outputs:[{dataKey: 'tableData', valueKey: 'data_list'}]},columns:[{prop:'alias',label:'别名'},{prop:'name',label:'名称'},{prop:'url',label:'地址'}]}
                    }},
                    {name:'接口分类',attributeName:'category',et:'bb-select',props:{fields:[{text:'TY配置',value:'config'},{text:'定制',value:'custom'}]}},
                    {name:'方法',attributeName:'method',et:'bb-select',props:{fields:[{text:'POST',value:'post'},{text:'GET',value:'get'}]}},
                    {name:'请求参数',attributeName:'inputs',et:'bb-array',props:{
                            fields:[
                                {name:'参数名',attributeName:'paramName',et:'bb-input'},
                                {name:'值类型',attributeName:'valueType',et:'bb-select',props:{
                                        fields:[
                                            {text:'常量',value:'constant'},
                                            {text:'值对象',value:'inputValueObj'},
                                            {text:'模板',value:'template'}]}},
                                {name:'常量',attributeName:'constant',et:'bb-input'},
                                {name:'值对象',attributeName:'valueKey',et:'bb-select',props:{
                                        fields:[
                                            {text:'组件对象',value:'bb'},
                                            {text:'路由数据',value:'router'},
                                            {text:'外部数据',value:'external'},
                                            {text:'Local存储',value:'local'},
                                            {text:'Session存储',value:'session'},
                                            {text:'列数据',value:'row-data'}]
                                }},
                                {name:'变量',attributeName:'variable',et:'bb-input'}
                            ]
                        }},
                    {name:'响应数据',attributeName:'outputs',et:'bb-array',props:{
                            fields:[
                                {name:'数据变量',attributeName:'dataKey',et:'bb-input'},
                                {name:'响应变量',attributeName:'valueKey',et:'bb-input'}
                            ]
                    }}
                ],
                ds:this.value
            }
        },
        watch: {
            value(val){
                if (typeof val === 'object') {
                    this.ds = val;
                } else if (typeof val === 'string') {
                    this.ds = (val ? JSON.parse(val) : {});
                }
                this.$emit("input",val);
            },
            ds(val){
                this.$emit("input",val);
                //TODO 通过ds的api去获取input fields list，并且fire出事件
            }
        },
        created: function () {
        },
        mounted:function(){
        },
        methods: {
        }
    }
</script>