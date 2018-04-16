<template>  
    <div>
        <bb-button-form ref="bb-config-row" :content="formFields" @commit="commit"></bb-button-form>
        <bb-list :columns="columns" :value="valueBase" :editConfig="editConfig" @edit="edit"></bb-list>
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
                debugger
                const t = this;
                t.$refs['bb-config-row'].showDialog({bbConfigRow:row})
            }
        }
    }
</script>
<style lang='less'>    
</style>