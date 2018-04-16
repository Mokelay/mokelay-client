<template>
    <div>
        <bb-button-form :fields="fields" settingText="设置数据源" v-model="ds" :on="interactiveOn" formDescTpl="API:<%api%>" @commit="commit"></bb-button-form>
        <!-- <bb-form v-else :fields="fields" settingText="设置数据源" v-model="ds" :on="interactiveOn" formDescTpl="API:<%api%>" @commit="commit"></bb-form> -->
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
                        ds:{api:'/list-api',method:'post',inputs: [{paramName: 'keywords', valueType: "inputValueObj", valueKey: "bb", variable: "keywords"},{paramName: 'type', valueType: "template",variable: "<%=window._TY_Page_Data[route.query.pageAlias]['appAlias']%>"}],outputs:[{dataKey: 'tableData', valueKey: 'data_list'}]},
                        textField:'name',
                        valueField:'alias'
                    }},
                    // {pbbId:'category',name:'接口分类',attributeName:'category',et:'bb-words',props:{
                    //     textDs:{api:'/read-api-info',method:'post',inputs: [{paramName: 'alias', valueType: "template", variable: "<%=bb.external.linkage[0]%>"}],outputs:[{dataKey: 'tableData', valueKey: 'data.category'}]},
                    // }},
                    // {pbbId:'method',name:'方法',attributeName:'method',et:'bb-words',props:{
                    //     textDs:{api:'/read-api-info',method:'post',inputs: [{paramName: 'alias', valueType: "template", variable: "<%=bb.external.linkage[0]%>"}],outputs:[{dataKey: 'tableData', valueKey: 'data.method'}]},
                    // }},
                    {pbbId:'inputs',name:'请求参数',attributeName:'inputs',et:'bb-list',props:{
                        editConfig:{
                            editable:['add','edit','remove']
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
                            editable:['add','edit','remove'],
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
                    }},
                    {pbbId:'host',name:'接口主域名',attributeName:'host',et:'bb-input',props:{defaultValTpl:"<%=window._TY_APIHost%>"}},
                ],
                interactiveOn:[
                    {pbbId:'api',triggerEventName:'change',executePbbId:'inputs',executeBBMethodName:'linkage'},
                    {pbbId:'api',triggerEventName:'mounted',executePbbId:'inputs',executeBBMethodName:'linkage'},
                    {pbbId:'api',triggerEventName:'change',executePbbId:'outputs',executeBBMethodName:'linkage'},
                    {pbbId:'api',triggerEventName:'mounted',executePbbId:'outputs',executeBBMethodName:'linkage'}
                ],
                ds:this.value,
                api:'',
                apiInfo:{
                    api:'/read-api-info',
                    method:'post',
                    inputs: [{paramName: 'alias', valueType: "template", variable: "<%=bb.api%>"}],
                    outputs:[{dataKey: 'tableData', valueKey: 'data'}]
                },
                type:'normal'
            }
        },
        watch: {
            value(val){
                if (typeof val === 'object') {
                    this.ds = this.transferOldData(val);
                } else if (typeof val === 'string') {
                    this.ds = this.transferOldData(val ? JSON.parse(val) : {});
                }
                this.$emit("input",val);
                console.log('val:',val);
            },
            ds(val){
                this.$emit("input",val);
                //TODO 通过ds的api去获取input fields list，并且fire出事件
            }
        },
        created: function () {
            const t = this;
            // t.setSelectType();
            t.ds = t.transferOldData(t.value);
        },
        mounted:function(){
        },
        methods: {
            //获取category 和 method
            //获取动态数据
            getData:function (val) {
                const t = this;
                if (t.apiInfo && t.api) {
                    _TY_Tool.getDSData(t.apiInfo, _TY_Tool.buildTplParams(t), function (map) {
                        map.forEach((ele,key)=>{
                            val.category = ele.value.category;
                            val.method = ele.value.method;
                            val.category = ele.value.category;
                            val.url = ele.value.url;
                            t.setDs(val.api);
                            t.$emit('input', val);
                            t.$emit('change', val);
                        })
                    }, function (code, msg) {
                    });
                }
            }, 
            //增加input 事件
            commit:function(val){
                console.log('val:',val);
                this.api = val.api;
                this.getData(val);
            },
            //维护页面DSC数据中心
            setDs:function(api){
                const t = this;
                const dsc = _TY_Page_Data[t.$route.query.pageAlias]?_TY_Page_Data[t.$route.query.pageAlias]['ds']:[];
                //判断_TY_Page_Data中是否存在当前编辑的页面，并且ds中不存在这个api
                if( _TY_Page_Data[t.$route.query.pageAlias] && dsc.indexOf(api) == -1 ){
                    dsc.push(api);
                    _TY_Page_Data[t.$route.query.pageAlias]['ds'] = dsc;
                }
            },
            /*转换老数据
                valueType全部转换成template
                constant => variable
                valueKey + variable => variable
            */ 
            transferOldData:function(val){
                const t = this;
                const ds = val;
                if(ds && ds['inputs']){
                    ds['inputs'].forEach((input,key)=>{
                        input['valueType'] = input['valueType']?input['valueType']:'template';
                        switch(input['valueType']){
                            case "constant":
                                input['valueType'] = 'template';
                                input['variable'] = input['constant'];
                                break;
                            case "inputValueObj":
                                input['valueType'] = 'template';
                                let valueKey = input['valueKey'];
                                valueKey = valueKey == 'row-data'?'rowData':valueKey;
                                const variable = input['variable'];
                                input['variable'] = `<%=${valueKey}.${variable}%>`;
                                break;
                        }
                    })
                }
                return ds;
            },
            // //设置DS选择器类型
            // setSelectType:function(){
            //     const t = this;
            //     const parentTag = t.$parent.$parent.$vnode.componentOptions.tag;
            //     //如果发现父级积木时是table则显示弹窗模式
            //     if(parentTag == "table-body"){
            //         t.type = 'dialog'
            //     }
            // }
        }
    }
</script>