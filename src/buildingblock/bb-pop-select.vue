<template>
    <div class="bbPopSelect">
        <bb-button :button="startButton" @click="showDia">选择</bb-button>
        <bb-dialog
            class="bbPopSelectDia"
            :isShow.sync="popupVisible" 
            :size="selectionDialogConfig.size"
            :appendToBody="selectionDialogConfig.appendToBody"
            :modalAppendToBody="selectionDialogConfig.modalAppendToBody"
            :title="selectionDialogConfig.title" >
            <bb-list 
                :columns="selectionGridConfig.columns"  
                :ds="selectionGridConfig.ds"  
                :selection="selectionGridConfig.selection"  
                :pagination="selectionGridConfig.pagination"  
                :search="selectionGridConfig.searchConfig.search"  
                :searchConfig="selectionGridConfig.searchConfig"
                :highlightCurrent="true"
                fixedColumn="500"
                @list-select="listSelect" 
                :showHeader="selectionGridConfig.showHeader"></bb-list>
            <span class="buttons">
               <bb-button v-for="(button,index) in selectionButtonGroup" :key="index" :button="button" @button-finish="buttonFinish"></bb-button> 
            </span>
        </bb-dialog>
    </div>
</template>

<script>
    export default {
        name: 'bb-pop-select',
        props: {
            /*
                支持v-model
            */
            value:{
                type:[String,Number,Boolean]
            },
            /*
                表单显示模板
            */
            valueTpl:{
                type:[String,Number,Boolean]
            },/*
                表单显示模板
            */
            textTpl:{
                type:[String,Number,Boolean]
            },
            /*
                selectionDialogConfig 选择器弹窗配置
                字段:{
                    title:弹窗标题
                    size:弹窗大小
                    appendToBody:弹窗基于body标签
                    modalAppendToBody:背景基于body标签
                }

            */
            selectionDialogConfig:{
                type:Object,
                default:function(){
                    return {
                        title:'弹窗选择器',
                        size:'tiny',
                        appendToBody:true,
                        modalAppendToBody:true
                    }
                }
            },
            /*
                selectionGridConfig  表单配置
                字段:{
                    ds: 表单获取数据的ds配置,
                    columns: 表头数组,
                    selection: 是否支持多选,
                    pagination: 是否显示分页,
                    searchConfig: {
                        search:true || false 是否开启搜索功能
                        searchType:searchInput || searchSelection,
                        searchButtonName：String  //searchType = searchInput时
                        type:checkbox || radio  //searchType = searchSelection时
                        
                    }
                    showHeader: 是否显示表头
                }
            */
            selectionGridConfig:{
                type:Object,
                default:function(){
                    return {
                        ds:{},
                        columns: [],
                        selection: false,
                        pagination: false,
                        searchConfig: {
                            search:false,
                            searchType:'searchInput',
                            searchButtonName:'搜索',
                            type:'checkbox'
                        },
                        showHeader: true
                    }
                }
            },
            /*
                selectionButtonGroup 按钮组配置
                字段:{
                    buttons: [{
                        type:primary  按钮风格类型,
                        text:按钮文字,
                        disabled:true || false  按钮是否禁用,
                        size:small large  按钮大小,
                        icon: 按钮图标,
                        action:url || execute-ds || dialog-page || code || buzz,
                        //action = url
                        url:跳转地址,
                        //action = execute-ds
                        ds:{},
                        confirmTitle:提交确认标题,
                        confirmText：提交确认内容,
                        callBackStaticWords:执行成功系统提示,
                        //action = dialog-page
                        dialogPage:页面别名,
                        //action = code
                        method = function
                        //action = buzz
                        buzz:巴斯名称
                    }]
                }
            */
            selectionButtonGroup:{
                type:Array,
                default:function(){
                    return [{
                        type:'default',
                        text:'取消',
                        action:'buzz',
                        buzz:'buzzNull'
                    },{
                        type:'primary',
                        text:'确认',
                        action:'buzz',
                        buzz:'buzzNull'
                    }]
                }
            },
        },
        data() {
            return {
                startButton:{
                    type:'text',
                    icon:'',
                    size:'normal'
                },
                popupVisible:false,
                valueBase:this.value,
                selectValue:this.value,
            }
        },
        methods: {
            showDia:function(){
                this.popupVisible = true;
            },
            cancel:function(){
                this.popupVisible = false;
            },
            buttonFinish:function(button, valueobj){
                const t = this;
                t.popupVisible = false;
                t.$emit("button-finish", button, valueobj);
                t.$emit('input',t.selectValue);
                t.$emit('change',t.selectValue);
            },
            listSelect:function(row){
                this.selectValue = _TY_Tool.tpl(this.valueTpl,row);
            }
        }
    }
</script>
<style lang="less">
    .bbPopSelectDia{
        .buttons{
            display: inline-block;
            width: 100%;
            text-align: right;
        }
    }
</style>