<template>
    <div class="bb-pbb">
        <div style="margin-bottom:10px;">
            <el-button-group>
                <el-button type="text" icon="el-icon-plus" @click="showForm">添加</el-button>
            </el-button-group>
        </div>
        <bb-list :ds="ds" :columns="columns" ref="InteractivesLsit"></bb-list>
        <bb-dialog title="添加" size="small" :modal="false"
       :isShow.sync="dialogVisible" style="height:100vh;">
            <bb-form ref="object_form" :fields="interactivefields" @commit="addInteractive" :on="interactiveOn"></bb-form>
        </bb-dialog>
    </div>
</template>
<script>
    import Vue from 'vue';
    export default {
        name: 'bbPbbInteractive',
        data() {
            return {
                ds:{
                    api: "/list-inter-by-pbb-id",
                    method: "get",
                    inputs: [
                        {paramName: 'pbbId',valueType:"constant",constant:this.pbbId}
                    ],
                    outputs: [
                        {dataKey: "tableData", valueKey: "data_list"}
                    ]},
                columns:[
                    {prop: 'name',label: '事件名称'},
                    {prop: 'triggerEventName',label: '事件'},
                    {prop: 'executeType',label: '执行类型'},
                    {prop: 'bbName',label: '目标积木'},
                    {prop: 'executeBBMethodName',label: '目标事件'},
                    {prop: 'executeScript',label: '自定义方法'},
                    {prop: 'containerMethodName',label: '容器类方法名称'},
                    {props:'',label:'操作',type: 'button-group',buttons:[{text: '删除',type: 'text',icon: 'delete',action: 'code',method: this.deleteInteractive}]}],

                    //添加交互字段配置
                interactivefields:[
                    {name: "名称", attributeName: 'name', dt: '', et: 'bb-input'},
                    {name: "描述", attributeName: 'description', dt: '', et: 'bb-input'},
                    {name: "事件", attributeName: 'triggerEventName', dt: '', et: 'bb-select',props:{ds:{
                        api: "/list-ed-by-pbb-id",
                        method: "get",
                        inputs: [
                            {paramName: 'pbbId',valueType:"constant",constant:this.pbbId}
                        ],
                        outputs: [
                            {dataKey: "fields", valueKey: "data_list"}
                        ]
                    },textField:'name',valueField:"eventName"}},
                    {name: "方法类型", attributeName: 'executeType', dt: '', et: 'bb-select',props:{fields:[
                        {text:'预定义方法',value:'trigger_method'},
                        {text:'自定义方法',value:'custom_script'},
                        {text:'容器类方法',value:'container_method'}
                    ]}},

                    {pbbId:'executePbb',name: "目标积木", attributeName: 'executePbb', dt: '', et: 'bb-select',props:{ds:{
                        api: "/list-pbb-by-page",
                        method: "get",
                        inputs: [
                            {paramName: 'pageAlias',valueType:"constant",constant:this.pageAlias}
                        ],
                        outputs: [
                            {dataKey: "fields", valueKey: "data_list"}
                        ]
                    },textField:'bbName',valueField:"id"}},
                    {pbbId:'methodName',name: "目标方法", attributeName: 'methodName', dt: '', et: 'bb-select',props:{ds:{
                        api: "/list-md-by-pbb-id",
                        method: "get",
                        inputs: [
                            {paramName: 'pbbId',valueType:"inputValueObj",valueKey:"external",variable:'linkage'}
                        ],
                        outputs: [
                            {dataKey: "fields", valueKey: "data_list"}
                        ]
                    },textField:'name',valueField:"methodName"}},


                    {name: "巴斯方法", attributeName: 'executeScript', dt: '', et: 'bb-select',props:{ds:{
                        api: "/list-buzz",
                        method: "get",
                        inputs: [],
                        outputs: [
                            {dataKey: "fields", valueKey: "data_list"}
                        ]
                    },textField:'name',valueField:"alias"}},
                    {name: "容器类方法", attributeName: 'containerMethodName', dt: '', et: 'bb-select',props:{fields:[
                        {text:'刷新页面',value:'refresh'},
                        {text:'关闭页面',value:'unload'}
                    ]}}
                ],
                interactiveOn:[
                    {pbbId:'executePbb',triggerEventName:'change',executePbbId:'methodName',executeBBMethodName:'linkage'}
                ],
                
                executePbbId:'',
                dialogVisible:false   
            }
        },
        props: {
            pbbId: {
                type: Number
            },
            pageAlias: {
                type: String
            },
            bb: {
                type: Object,
                default: function () {
                    return {};
                }
            }
        },
        methods: {
            showForm:function(){
                var t = this;
                t.dialogVisible = true;
            },
            deleteInteractive:function(row){
                let t = this;
                this.$confirm('确认操作?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    _TY_Tool.post(_TY_ContentPath+"/delete-pbb-inter", {id: row.id}).then(function () {
                        t.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        //刷新列表
                        t.$refs['InteractivesLsit'].getData();
                    });
                }).catch(() => {
                    t.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            addInteractive:function(val){
                const t = this;
                let params = {
                    name:val.name,
                    description:val.description,
                    pbbId:t.pbbId,
                    triggerEventName:val.triggerEventName,
                    executeType:val.executeType,
                    executePbbId:val.executePbb,
                    executeBBMethodName:val.methodName,
                    executeScript:val.executeScript,
                    containerMethodName:val.containerMethodName
                }
                _TY_Tool.post(_TY_ContentPath+"/add-pbb-inter", params).then(function () {
                        t.dialogVisible = false;
                        t.$message({
                            type: 'success',
                            message: '添加成功!'
                        });
                        //刷新列表
                        t.$refs['InteractivesLsit'].getData();
                    });
            }

        }
    }
</script>