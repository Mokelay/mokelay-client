<template>
    <el-tabs type="card" active-name="attribute" class="bb-tabs">
        <el-tab-pane label="属性" name="attribute" class="bb-pane">
            <div class='edit-attribute'>
                <bb-form :value="value.attributes" :fields="attributeFields" settingButtonText="保存" @commit="updateBBAttributes"></bb-form>
            </div>
        </el-tab-pane>
        <el-tab-pane label="交互" name="event" class="bb-pane">
            <div class="edit-interactive">
                <bb-button-form
                    :fields="interactivefields" 
                    :value="interactiveFormData"
                    :on="interactiveOn" 
                    settingText="添加"
                    startButtonIcon="plus"
                    startButtonType="text"
                    labelWidth="100px"
                    @commit="addInteractive"></bb-button-form>
                <bb-list :value="interactiveValue" :columns="columns" ref="InteractivesLsit"></bb-list>
            </div>
        </el-tab-pane>
    </el-tabs>
</template>
<script>
    const Util = window._TY_Tool;
    export default {
        name: 'edit',
        props: {
            value:{
                type:[String,Object]
            },
            content:{
                type:Array
            },
            isEditShow:{
                type:Boolean
            }
        },
        data() {
            const t = this;
            return{
                isShow:this.isEditShow,
                bbAlias:this.value.alias,
                attributeFields:[],
                uuidLenght:5,
                uuidRadix:8,
                addInteractiveUUID:null,
                interactiveFormData:{
                    fromContentUUID:this.value.uuid
                },
                interactiveValue:this.value.interactive,
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
                        api: "/list-edByBbAlias",
                        method: "get",
                        inputs: [
                            {paramName: 'bbAlias',valueType:"constant",constant:this.value.alias}
                        ],
                        outputs: [
                            {dataKey: "fields", valueKey: "data_list"}
                        ]
                    },textField:'name',valueField:"eventName"}},
                    {pbbId:'executeContent',name: "目标积木", attributeName: 'executeContent', dt: '', et: 'bb-select',props:{fields:this.contentSelect}},
                    {pbbId:'executeContentMethodName',name: "目标方法", attributeName: 'executeContentMethodName', dt: '', et: 'bb-select',props:{ds:{
                        api: "/list-mdByBbAlias",
                        method: "get",
                        inputs: [
                            {paramName: 'bbAlias',valueType:"inputValueObj",valueKey:"external",variable:'linkage'}
                        ],
                        outputs: [
                            {dataKey: "fields", valueKey: "data_list"}
                        ]
                    },textField:'name',valueField:"methodName"}}
                ],
                interactiveOn:[
                    {pbbId:'executeContent',triggerEventName:'change',executePbbId:'executeContentMethodName',executeBBMethodName:'linkage'}
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
        computed:{
            contentSelect:function(){
                const fields = [];
                this.content.forEach((val,index)=>{
                    fields.push({text:val.aliasName,value:val.alias})
                })
                return fields;
            }
        },
        watch: {
            isEditShow(val){
                this.isShow = val;
            },
            value(val){
                const t = this;
                t.bbAlias = val.alias;
                t.readBB();
            },
            'value.interactive':function(val){
                this.interactiveValue = val;
            }
        },
        created:function(){
            this.readBB();
            this.setNewInteractiveFields();
        },
        methods: {
            updateBBAttributes:function(formData){
                const t = this;
                t.$emit('updateBBAttributes',t.value.uuid,formData);
            },
            addInteractive:function(formData){
                const t = this;
                this.interactiveValue.push(formData);
                t.$emit('addInteractive',formData);
                //初始化表单值
                t.interactiveFormData = {
                    fromContentUUID:this.value.uuid
                }
            },
            removeInteractive:function(formData){
                const t = this;
                t.$emit('removeInteractive',formData.uuid);
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
            },
            setNewInteractiveFields:function(){
                const t = this;
                let newInteractivefields = t.interactivefields;
                t.interactivefields = [];
                newInteractivefields.forEach((val,index)=>{
                    if(val.attributeName == 'executeContent'){//更新当前页面积木下拉列表
                        val.props.fields = t.contentSelect;
                    }
                });
                t.interactivefields = newInteractivefields
            },
            closeDia:function(){
                this.$emit('closeDia');
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