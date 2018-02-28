<template>
    <div>
        <bb-button-form :fields="fields" settingText="设置数据源" v-model="ds" formDescTpl="API:<%api%>"></bb-button-form>
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
                fields:[
                    {name:'API',attributeName:'api',et:'bb-pop-select',props:{
                        textTpl:'<%=rowData.name%>',valueTpl:"<%print((()=>{var valueData = rowData.category == 'config'?rowData.alias:rowData.url;return valueData})())%>",valueField2:'url',selectionGridConfig:{ds:{api:'/list-api',method:'post',inputs: [{paramName: 'keywords', valueType: "inputValueObj", valueKey: "bb", variable: "keywords"}],outputs:[{dataKey: 'tableData', valueKey: 'data_list'}]},columns:[{prop:'alias',label:'别名'},{prop:'name',label:'名称'},{prop:'url',label:'地址'}],selection: false,
                        pagination: false,searchConfig: {search:true,searchType:'searchInput',searchButtonName:'搜索',type:'checkbox'},showHeader: true}
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
                                            {text:'根路由数据',value:'route'},
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
                                {name:'响应变量',attributeName:'valueKey',et:'bb-input'},
                                {name:'数据处理中间件',attributeName:'handle',et:'bb-input'}
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