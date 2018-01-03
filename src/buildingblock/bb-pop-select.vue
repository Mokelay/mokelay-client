<template>
    <div class="bbPopSelect">
    <!-- 选择文本显示，编译textTpl -->
    <!-- 清空按钮 -->
        <bb-button :button="{type:'text',icon:'',size:'normal'}" @click="choose">选择</bb-button>
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
            <!-- 放一个确认和一个取消按钮 -->
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
            }
        },
        data() {
            return {
                showText:null,
                popupVisible:false,
                valueBase:this.value,
                selectRow:null,
            }
        },
        mounted:function(){
            let t=this;
            // 1. 处理defaultValueTpl
            _TY_Tool.buildDefaultValTpl(t,"valueBase");

            // 2. 如何显示showText
            var param = {
                "bb": t, 
                "router": t.$route.params
            };
            if(t.selectRowDS){
                Util.getDSData(t.selectRowDS, {"bb": t, "router": t.$route.params}, function (map) {
                    //RowData从map中获取
                    var rowData = null;
                    param['row-data'] = rowData;
                    t.showText = _TY_Tool.tpl(t.textTpl,param);
                }, function (code, msg) {
                    //TODO
                });
            }else{
                t.showText = _TY_Tool.tpl(t.textTpl,param);
            }
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

                var param = {
                    "bb": t, 
                    "router": t.$route.params,
                    "row-data":selectRow
                };

                var _value = _TY_Tool.tpl(t.valueTpl,param);
                t.$emit('input',_value);
                t.$emit('change',_value);

                t.showText = _TY_Tool.tpl(t.textTpl,param);
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
        .buttons{
            display: inline-block;
            width: 100%;
            text-align: right;
        }
    }
</style>