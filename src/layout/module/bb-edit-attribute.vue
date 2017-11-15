<template>
    <el-tabs type="card" active-name="attribute">
        <el-tab-pane label="属性" name="attribute">
            <div class='edit-attribute'>
                <bb-form :value="value.attributes" settingButtonText="保存" @commit="commit"></bb-form>
            </div>
        </el-tab-pane>
        <el-tab-pane label="交互" name="event">
            <div class="edit-interactive">
                <bb-button-form
                    :fields="interactivefields" 
                    :on="interactiveOn" 
                    settingText="添加"
                    startButtonIcon="plus"
                    startButtonType="text"
                    @commit="addInteractive"></bb-button-form>
                <bb-list :ds="ds" :value="interactiveList" :columns="columns" ref="InteractivesLsit"></bb-list>
            </div>
        </el-tab-pane>
    </el-tabs>
</template>
<script>
    export default {
        name: 'bb-edit',
        props: {
            value:{
                type:[String,Object]
            }
        },
        data() {
            return{
                    //添加交互字段配置
                columns:[
                    {prop: 'name',label: '事件名称'},
                    {prop: 'triggerEventName',label: '事件'},
                    {prop: 'executeType',label: '执行类型'},
                    {prop: 'bbName',label: '目标积木'},
                    {prop: 'executeBBMethodName',label: '目标事件'},
                    {prop: 'executeScript',label: '自定义方法'},
                    {props:'',label:'操作',type: 'button-group',buttons:[{text: '删除',type: 'text',icon: 'delete',action: 'code',method: this.deleteInteractive}]}],
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
                        {text:'自定义方法',value:'custom_script'}
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

                ],
                interactiveOn:[
                    {pbbId:'executePbb',triggerEventName:'change',executePbbId:'methodName',executeBBMethodName:'linkage'}
                ],
                readBBDs:{
                    api: "cms-list-bb-by-alias",
                    method: "get",
                    category:"config",
                    inputs: [{
                        paramName: "alias",
                        valueType: "inputValueObj",
                        valueKey: 'bb',
                        variable:'bbAlias'
                    }],
                    outputs: [{dataKey: "tableData", valueKey: "data_list.list"}]
                },
            }
        },
        computed: {
            interactiveList(){
                let newArr = [];
            }
        },
        watch: {},
        created:function(){
            this.readBB();
        },
        methods: {
            commit:function(formData){
                const t = this;
                t.$emit('commit',formData);
            },
            addInteractive:function(formData){
                const t = this;
                t.$emit('addInteractive',formData);
            },
            readBB:function(){
                const t = this;
                t.formDataJSON = JSON.stringify(formData);
                if (t.readBBDs) {
                  Util.getDSData(t.readBBDs, {"bb": t, "router": t.$route.params}, function (map) {
                    map.forEach((val,key)=>{
                      t[val.dataKey] = val.value;
                    });
                  }, function (code, msg) {});
                }
            }
        }    
    }
</script>
<style lang="less" scoped>
    .edit-attribute{
        padding: 11px;
        padding-bottom: 0;
    }
</style>