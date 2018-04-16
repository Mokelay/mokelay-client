<template>  
    <div>
        <bb-dialog title="积木设置" size="middle" :isShow.sync="showDialog"><bb-config></bb-config></bb-dialog>
        <bb-button @click="add" :button="addButton"></bb-button>
        <bb-list :columns="columns" :value="valueBase" :editConfig="editConfig" @edit="edit" @add="add"></bb-list>
    </div>
</template>

<script>
    export default {
        name: 'bb-config-array',
        props: {
            value:{
                type:Array,
                default:function(){
                    return []
                }
            }
        },
        data() {
            return {
                valueBase:_TY_Tool.deepClone(this.value),
                formFields:[{                      
                    uuid:'bb-config-row',
                    alias:'bb-config',                   
                    aliasName:'积木编辑器',                                 
                    attributes:{
                        attributeName:'bbConfigRow'
                    }
                }],
                columns:[
                    {prop: 'uuid',label: '标识',type:'defalut'},
                    {prop: 'alias',label: '积木别名',type:'defalut'},
                    {prop: 'attributes',label: '属性',type:'defalut'},
                    {prop: 'interactives',label: '交互',type:'defalut'},
                    {prop: 'animation',label: '动画',type:'defalut'}
                ],
                editConfig:{
                   editable:['edit','up','down','remove']
                },
                showDialog:false,
                addButton:{
                    type:'text',
                    text:'添加',
                    icon:'ty-icon_faqi1'
                }
            }
        },
        watch: {
        },
        created: function () {
        },
        mounted:function(){

        },
        methods: {
            //提交表单
            commit:function(formData){
                const t = this;
                t.valueBase = formData['bbConfigRow'];

            },
            edit:function(row){
                const t = this;
                t.showDialog = true;
            },
            add:function(row){
                const t = this;
                t.showDialog = true;
            }
        }
    }
</script>
<style lang='less'>    
</style>