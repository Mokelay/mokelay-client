<template>
    <div>
        <bb-form :fields="fields" settingText="设置数据源" v-model="ds" :on="interactiveOn" formDescTpl="API:<%api%>" @commit="commit"></bb-form>
    </div>
</template>

<script>
    export default {
        name: 'bb-ds-select',
        props: {
            value:{
                type:[String,Object]
            }
        },

        data() {
            return {
                //API : bb-select => 获得接口别名   支持中文名 和 接口别名搜索，单选
                //接口分类 : bb-words =>（linakge交互） 通过DS查询到当前接口分类并展示 
                //方法 : bb-words =>（linakge交互） 通过DS查询到当前接口方法并展示
                /*请求参数 : bb-list{
                        参数名:bb-field-select,
                        固定  值类型valueType,// template
                        删除  常量:bb-select
                        删除  值对象:bb-select
                        变量:bb-input,//交互隐藏 valueType == 'template'
                }*/
                /*响应数据 : bb-list{
                        数据变量:bb-input,
                        数据处理中间件:bb-select
                        响应变量:bb-field-select,// 联动获取接口别名
                }*/
                fields:[
                    {pbbId:'api',name:'API',attributeName:'api',et:'bb-select',props:{
                        ds:{api:'/list-api',method:'post',inputs: [{paramName: 'keywords', valueType: "inputValueObj", valueKey: "bb", variable: "keywords"}],outputs:[{dataKey: 'tableData', valueKey: 'data_list'}]},
                        textField:'name',
                        valueField:'alias'
                    }},
                    {pbbId:'category',name:'接口分类',attributeName:'category',et:'bb-words',props:{
                        textDs:{api:'/read-api-info',method:'post',inputs: [{paramName: 'alias', valueType: "template", variable: "<%=bb.external.linkage%>"}],outputs:[{dataKey: 'tableData', valueKey: 'data.category'}]},
                    }},
                    {pbbId:'method',name:'方法',attributeName:'method',et:'bb-words',props:{
                        textDs:{api:'/read-api-info',method:'post',inputs: [{paramName: 'alias', valueType: "template", variable: "<%=bb.external.linkage%>"}],outputs:[{dataKey: 'tableData', valueKey: 'data.method'}]},
                    }},
                    {pbbId:'inputs',name:'请求参数',attributeName:'inputs',et:'bb-list',props:{
                        editConfig:{
                            editable:true,
                            editDs:{add:{},remove:{},update:{},sort:{}}
                        },
                        columns:[
                            {prop:'paramName',label:'参数名',type:"defalut",et:"bb-select",etProp:{
                                ds:{api: "/ty-list-api-req",method: "get",
                                    inputs: [{paramName: 'apiAlias', valueType: "template", variable: "<%=bb.$parent.$parent.$parent.$parent.$parent.external.linkage[0]%>"}],
                                    outputs: [{dataKey: "fields", valueKey: "data_list"}]
                                },
                                textField:'alias',
                                valueField:"alias"
                            }},
                            {prop:'variable',label:'变量',type:"defalut",et:"bb-input",etProp:{}}
                        ]
                    }},
                    {pbbId:'outputs',name:'响应数据',attributeName:'outputs',et:'bb-list',props:{
                        editConfig:{
                            editable:true,
                            editDs:{add:{},remove:{},update:{},sort:{}}
                        },
                        columns:[
                            {prop:'dataKey',label:'数据变量',type:"defalut",et:"bb-select",etProp:{
                                fields:[{text:'tableData',value:'tableData'},{text:'value',value:'value'}]
                            }},
                            {prop:'handle',label:'数据处理中间件',type:"defalut",et:"bb-select",etProp:{
                                ds:{api: "/list-buzz",method: "get",inputs: [],outputs: [
                                        {dataKey: "fields", valueKey: "data_list"}]},
                                textField:'name',
                                valueField:"alias"
                            }},
                            {prop:'valueKey',label:'响应变量',type:"defalut",et:"bb-select",etProp:{
                                ds:{api: "/ty-list-api-res",method: "get",
                                    inputs: [{paramName: 'apiAlias', valueType: "template", variable: "<%=bb.$parent.$parent.$parent.$parent.$parent.external.linkage[0]%>"}],
                                    outputs: [{dataKey: "fields", valueKey: "data_list"}]
                                },
                                textField:'alias',
                                valueField:"alias"
                            }}
                        ]
                    }}
                ],
                interactiveOn:[
                    {pbbId:'api',triggerEventName:'change',executePbbId:'category',executeBBMethodName:'linkage'},
                    {pbbId:'api',triggerEventName:'change',executePbbId:'method',executeBBMethodName:'linkage'},
                    {pbbId:'api',triggerEventName:'change',executePbbId:'inputs',executeBBMethodName:'linkage'},
                    {pbbId:'api',triggerEventName:'mounted',executePbbId:'inputs',executeBBMethodName:'linkage'},
                    {pbbId:'api',triggerEventName:'change',executePbbId:'outputs',executeBBMethodName:'linkage'},
                    {pbbId:'api',triggerEventName:'mounted',executePbbId:'outputs',executeBBMethodName:'linkage'}
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
            //增加input 事件
            commit:function(val){
                this.$emit('input', val);
            }
        }
    }
</script>