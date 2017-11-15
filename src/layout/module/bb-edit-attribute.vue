<template>
    <el-tabs type="card" active-name="attribute" class="bb-edit">
        <el-tab-pane label="属性" name="attribute">
            <div class='edit-attribute'>
                <bb-form :value="value.attributes" :fields="attributeFields" settingButtonText="保存" @commit="updateBBAttributes"></bb-form>
            </div>
        </el-tab-pane>
        <el-tab-pane label="交互" name="event">
            <div class="edit-interactive">
                <bb-button-form
                    :fields="interactivefields" 
                    :value="interactiveFormData"
                    :on="interactiveOn" 
                    settingText="添加"
                    startButtonIcon="plus"
                    startButtonType="text"
                    @commit="addInteractive"></bb-button-form>
                <bb-list :value="value.interactive" :columns="columns" ref="InteractivesLsit"></bb-list>
            </div>
        </el-tab-pane>
    </el-tabs>
</template>
<script>
    const Util = window._TY_Tool;
    export default {
        name: 'bb-edit',
        props: {
            value:{
                type:[String,Object]
            }
        },
        data() {
            const t = this;
            return{
                bbAlias:this.value.alias,
                attributeFields:[],
                uuidLenght:5,
                uuidRadix:8,
                addInteractiveUUID:null,
                interactiveFormData:{
                    fromContentUUID:this.value.uuid
                },
                //添加交互字段配置
                columns:[
                    {prop: 'uuid',label: '交互的UUID'},
                    {prop: 'fromContentUUID',label: '触发事件的积木UUID'},
                    {prop: 'fromContentEvent',label: '事件'},
                    {prop: 'executeContentUUID',label: '目标积木的uuid'},
                    {prop: 'executeContentMethodName',label: '目标方法'},
                    {props:'',label:'操作',type: 'button-group',buttons:[{text: '删除',type: 'text',icon: 'delete',action: 'code',method: this.removeInteractive}]}],
                interactivefields:[
                    {name: "交互的UUID", attributeName: 'uuid', dt: '', et: 'bb-uuid',props:{length:5,radix:8}},
                    {name: "触发事件的积木UUID", attributeName: 'fromContentUUID', dt: '', et: 'bb-uuid',props:{length:5,radix:8}},
                    {name: "事件", attributeName: 'fromContentEvent', dt: '', et: 'bb-select',props:{ds:{
                        api: "/list-ed-by-pbb-id",
                        method: "get",
                        inputs: [
                            {paramName: 'pbbId',valueType:"constant",constant:this.pbbId}
                        ],
                        outputs: [
                            {dataKey: "fields", valueKey: "data_list"}
                        ]
                    },textField:'name',valueField:"eventName"}},
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
                    },textField:'name',valueField:"methodName"}}
                ],
                interactiveOn:[
                    {pbbId:'executePbb',triggerEventName:'change',executePbbId:'methodName',executeContentMethodName:'linkage'}
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
                    outputs: [{dataKey: "attributeFields", valueKey: "data_list.list"}]
                },
            }
        },
        watch: {
            value(val){
                const t = this;
                t.bbAlias = val.alias;
                t.readBB();
            }
        },
        created:function(){
            this.readBB();
        },
        methods: {
            updateBBAttributes:function(formData){
                const t = this;
                t.$emit('updateBBAttributes',formData);
            },
            addInteractive:function(formData){
                const t = this;
                t.$emit('addInteractive',formData);
                //初始化表单值
                t.interactiveFormData = {
                    fromContentUUID:this.value.uuid
                }
            },
            removeInteractive:function(formData){
                const t = this;
                t.$emit('removeInteractive',formData);
            },
            readBB:function(){
                const t = this;
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
    .bb-edit{
        padding-left: 10px;
    }
    .edit-attribute{
        padding: 11px;
        padding-bottom: 0;
    }
</style>