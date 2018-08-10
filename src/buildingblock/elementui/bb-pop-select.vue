<template>
    <div class="bbPopSelect">
    <!-- 选择文本显示，编译textTpl -->
        <bb-words class="showText" v-model="showText" tagName="span"></bb-words>
    <!-- 清空按钮 -->
        <bb-button v-if="!selectionDialogConfig.hideClean" :button="{type:'default',size:'normal'}" @click="clean">清空</bb-button>
        <bb-button v-if="!selectionDialogConfig.selectButton || !selectionDialogConfig.selectButton.hide" :button="selectionDialogConfig.selectButton || {type:'primary',size:'normal'}" @click="choose">{{selectionDialogConfig.selectButton && selectionDialogConfig.selectButton.text?"":"选择"}}</bb-button>
        <bb-dialog
            class="bbPopSelectDia"
            :isShow.sync="popupVisible" 
            :autoMaxHeight="true"
            :size="selectionDialogConfig.size"
            :appendToBody="selectionDialogConfig.appendToBody"
            :modalAppendToBody="selectionDialogConfig.modalAppendToBody"
            :title="selectionDialogConfig.title" >
            <bb-list 
                v-if="popupVisible"
                :columns="selectionGridConfig.columns"  
                :ds="selectionGridConfig.ds"  
                :selection="selectionGridConfig.selection"  
                :pagination="selectionGridConfig.pagination"  
                :search="selectionGridConfig.searchConfig.search"  
                :searchConfig="selectionGridConfig.searchConfig"
                :advancedSearch="selectionGridConfig.advancedSearch"
                :advancedSearchConfig="selectionGridConfig.advancedSearchConfig"
                :highlightCurrent="true"
                fixedColumn="500"
                @list-select="listSelect" 
                :showHeader="selectionGridConfig.showHeader"></bb-list>
            <span class="bbPopButtons">
                <!-- 放一个确认和一个取消按钮 -->
                <bb-button :button="{type:'defalut',size:'normal'}" @click="cancel">取消</bb-button>
                <bb-button :button="{type:'primary',size:'normal'}" @click="confirm">确认</bb-button>
            </span>
        </bb-dialog>
    </div>
</template>

<script>
    export default {
        name: 'bb-pop-select',
        props: {
            /*支持v-model*/
            value:{
                type:[String,Number,Boolean]
            },
            /*表单显示模板*/
            valueTpl:{
                type:[String,Number,Boolean]
            },
            /*表单显示模板*/
            textTpl:{
                type:[String,Number,Boolean]
            },
            /*默认值模版*/
            defaultValTpl:{
                type:[String,Number,Boolean]
            },
            /*选择列的DS*/
            selectRowDS:{},
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
                        title:'选择',
                        size:'tiny',
                        appendToBody:true,
                        modalAppendToBody:true,
                        hideClean:false,
                        selectButton:{
                            hide:false,
                            type:'primary',
                            size:'normal',
                            text:'匹配'
                        }
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
                    showHeader: 是否显示表头,
                    advancedSearchConfig:{
                        layoutType:'bb-button-form' || 'inline-form'
                        labelInline:"true || false"
                        labelWidth:"100px"
                        labelPosition:right/left/top
                        fields:"[]"
                        content:"[]"
                        grid:"true || false"
                        size:"medium / small / mini"
                        formButtonName:"选择",
                        defaultValTpl:"默认值"
                    }
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
            }
        },
        data() {
            return {
                showText:this.value,
                popupVisible:false,
                valueBase:this.value,
                selectRow:null,
            }
        },
         watch: {
            value(val){
                let t=this;
                t.valueBase=val;
                // 1. 处理defaultValueTpl
                _TY_Tool.buildDefaultValTpl(t,"valueBase");

                // 2. 如何显示showText
                const param = {
                    "bb": t, 
                    "router": t.$route.params
                };
                if(t.selectRowDS){
                    _TY_Tool.getDSData(t.selectRowDS, _TY_Tool.buildTplParams(t), function (map) {
                        map.forEach((val,key)=>{
                            //RowData从map中获取
                            const rowData = val.value;
                            param['rowData'] = rowData;
                            t.showText = _TY_Tool.tpl(t.textTpl, _TY_Tool.buildTplParams(t,param));
                        })
                    }, function (code, msg) {
                        //TODO
                    });
                }else{
                    const param = _TY_Tool.buildTplParams(t,{
                        "rowData":t.selectRow
                    });
                    t.showText = _TY_Tool.tpl(t.textTpl,param) || val;
                }
            }
        },
        mounted:function(){
            const t = this;
            setTimeout(function(){
               t.$emit('mounted',t.value);
            },300);
        },
        methods: {
            //开始选择
            choose:function(){
                this.popupVisible = true;
            },
            //清空
            clean:function(){
                this.showText = null;
                this.$emit('input',null);
                this.$emit('change',null);
                this.$emit('clean',null);
            },
            //选择取消
            cancel:function(){
                this.popupVisible = false;
                this.selectRow = null;
            },
            //选择确认
            confirm:function(){
                const t = this;
                t.popupVisible = false;
                //编译Value
                const param = _TY_Tool.buildTplParams(t,{
                    "rowData":t.selectRow
                });
                const _value = _TY_Tool.tpl(t.valueTpl ,param);
                t.$emit('input',_value);
                t.$emit('change',_value);
                t.$emit('output',param);
                t.showText = _TY_Tool.tpl(t.textTpl, param);
            },
            //选中数据缓存
            listSelect:function(row){
                this.selectRow = row;
            }
        }
    }
</script>
<style lang="less">
    .bbPopSelectDia{
        .bbPopButtons{
            display: inline-block;
            width: 100%;
            text-align: right;
        }
        .showText{
            margin: 0 5px;
        }
    }
</style>