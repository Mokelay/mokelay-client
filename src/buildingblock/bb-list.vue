<template>
    <div>
        <el-row v-if="search">
            <div v-if="searchConfig.searchType == 'searchInput'" class="searchInput">
                <el-input v-model="keywords" @keyup.native.enter="globalSearch"
                       style="width: 100%;" placeholder="请输入搜索内容">
                    <el-button type="primary" slot="append" icon="search" @click="globalSearch">{{searchConfig.searchButtonName}}</el-button>
                </el-input>
            </div>
            <div v-if="searchConfig.searchType == 'searchSelection'" class="m10">
                <bb-checkbox-group v-if="searchConfig.type == 'checkbox'" v-model="keywords" type="button" @input="globalSearch" :options="searchConfig.searchKeys" :ds="searchConfig.ds" :optionValue="searchConfig.optionValue" :optionText="searchConfig.optionText" class='searchSelection'>
                </bb-checkbox-group>
                <bb-radio-group v-if="searchConfig.type == 'radio'" v-model="keywords" type="button" @input="globalSearch" :options="searchConfig.searchKeys" :ds="searchConfig.ds" :optionValue="searchConfig.optionValue" :optionText="searchConfig.optionText" class='searchSelection'>
                </bb-radio-group>
            </div>
        </el-row>
        <el-row>
            <el-table :data="tableData" :highlight-current-row="highlightCurrent" :stripe="stripe" border style="width: 100%;" :class="popup?'popupClass':''" @row-click="chooseLego" v-loading="loading" @selection-change="selectionChange" @current-change="radioChange" :ref="alias"  :show-header="showHeader" :height="fixedColumn">
                <el-table-column type="index" v-if="index" :fixed="true" width="55"></el-table-column>
                <el-table-column type="selection" v-if="selection" width="55"></el-table-column>

                <!-- 树状结构支持 -->
                <el-table-tree-column v-if="treeConfig&&treeConfig.support"
                                :remote="loadTreeChild"
                                :childNumKey="treeConfig.childNumKey"
                                :parentKey="treeConfig.parentKey"
                                :prop="treeConfig.prop"
                                :label="treeConfig.label"></el-table-tree-column>

                <el-table-column v-for="column in columns" :fixed="column.fixed" :width="column.width" :prop="column.prop" :label="column.label"
                                 :key="column.prop" :align="column.align">
                    <template scope="scope">
                        <div v-if="column['type'] == 'button-group'">
                            <bb-popup-selection v-for="(button,index) in column.buttons" v-if="hideBtn(button,scope.row) && button['buttonType'] == 'popup'"
                                        :valueField="button['popupConfig']['valueField']" 
                                        :textField="button['popupConfig']['textField']" 
                                        :popupGrid="button['popupConfig']['popupGrid']" 
                                        :buttonConfig="button['popupConfig']['buttonConfig']" 
                                        :showModal="button['popupConfig']['showModal']" 
                                        :parentParams="toChildParams" 
                                        :title="button['popupConfig']['title']"
                                        @showPopup="popupClick(button,scope.row)"></bb-popup-selection>
                            <el-button v-for="(button,index) in column.buttons" v-if="hideBtn(button,scope.row) && button['buttonType'] != 'popup'"
                                       :type="button.type" :key="index"
                                       :style="{'color':button.wordColor,'user-select':'all'}"
                                       :icon="button.icon" @click.native.prevent="btnClick(button,scope.row)">
                                {{button.text?button.text:scope['row'][column.prop]}}
                            </el-button>
                        </div>
                        <div v-else-if="column['type'] == 'edit'">
                            <el-input :value="scope['row'][column.prop]"
                                      @blur="cellSubmit($event,column,scope['row'])"></el-input>
                        </div>
                        <div v-else-if="column['type'] == 'picture'">
                            <bb-picture-preview :imgList="scope['row'][column.prop]"></bb-picture-preview>
                        </div>
                        <div v-else-if="column['type'] == 'template'">
                            <div v-if="column['template'] == 'judge'">
                                <el-tag :type="scope['row'][column.prop]?'primary':'info'" close-transition>
                                    {{scope['row'][column.prop]?"是":"否"}}
                                </el-tag>
                            </div>
                            <div v-if="column['template'] == 'staticWords'">
                                {{scope['row'][column.prop]}}
                                <div class="staticWords">{{column['staticWords']}}</div>
                            </div>
                            <div v-if="column['template'] == 'custom'">
                                <!-- <bb-tag :showButton="false" :column="column" :prop="scope['row'][column.prop]"></bb-tag> -->
                                <bb-words :text="scope['row'][column.prop]" :parentParams="scope['row']" :templateProp="column.templateProp" :valueKey="column.valueKey"></bb-words>
                            </div>
                            <div v-if="column['template'] == 'customIcon'">
                                <i  v-for="(item,index) in column.showValue" :class="scope['row'][column.prop] == item?column.iconClass[index]:''"></i>
                            </div>
                            <div v-if="column['template'] == 'file'">
                                <!-- TODO Row data 传入bb-custom -> custom vue -->
                                <bb-custom :customFile="column['file']" :parentData="{row:scope['row'],column:column}"></bb-custom>
                            </div>
                        </div>
                        <div v-else>
                            {{scope['row'][column.prop]}}
                        </div>
                    </template>
                </el-table-column>
            </el-table> 
        </el-row>
        <el-row v-if="pagination" type="flex" justify='end'>
            <div >
                <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :page-sizes="[10, 20, 50, 100]"
                        :page-size="pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :style="{float:'right',marginTop:'20px'}"
                        :total="totalItems">
                </el-pagination>
            </div>
        </el-row>
        <el-row v-if="popup" type="flex" justify='end'>
            <div>
                <el-button @click="cancelSelect">取消</el-button>
                <el-button type="primary" @click="confirmSelect">确定</el-button>
            </div>
        </el-row>
    </div>
</template>

<script>
    import Util from '../libs/util';
    import Vue from 'vue'

    export default {
        name: 'bb-list',
        props: {
            index: {
                type: Boolean,
                default: false
            },
            selection: {
                type: Boolean,
                default: false
            },
            ds: {
                type: Object,
                default: function () {
                    return null
                }
            },
            columns: {
                type: Array,
                default: function () {
                    return []
                }
            },
            value: {
                type: Array,
                default: function () {
                    return []
                }
            },
            search: {
                type: Boolean,
                default: false
            },
            searchConfig: {
                type: Object,
                default: function () {
                    return {
                        searchType:'searchInput', //searchSelection
                        searchKeys:null,
                        ds:null,
                        optionText:'',
                        optionValue:'',
                        type:'radio',
                        searchButtonName:'查找'
                    }
                }
            },
            pagination: {
                type: Boolean,
                default: false
            },
            total: {
                type: Number,
                default: 10
            },
            treeConfig:{
                type:Object,
                default: function(){
                    return {}
                }
            },
            alias:{
                type:String,//表单id 传参数给buzz时使用
                default:'list'
            },
            popup:{//标识是否是弹出表单
                type:Boolean,
                default:false
            },
            showHeader:{//是否显示表头
                type:Boolean,
                default:true
            },
            highlightCurrent:{//高亮当前选中
                type:Boolean,
                default:false
            },
            stripe:{//条纹
                type:Boolean,
                default:true
            },
            fixedColumn:{//固定表头
                type:String
            },
            parentParams:{
                type:Object
            },
            hiddenValueKey:{
                type:String
            },
            hiddenItems:{
                type:Array
            },
            confirmButton:{
                type: Object,
                default:function(){
                    return {
                        type:'default',//default primary text
                        action:null,//execute-ds url dialog-page code buzz
                        ds:null,
                        goUrl:null,
                        confirmTitle:null,
                        confirmText:null,
                        callback:'custom',//refresh
                        valueKey:null
                    }
                }
            },
        },
        data() {
            return {
                tableData: this.value,
                totalItems: this.total,
                pageSize: 10,
                page: 1,
                keywords: '',
                selectArr: [],
                loading: false,
                treeParentId:0,
                toChildParams:null,
                showPopIsShow:false
            }
        },
        watch: {
            // value(val) {  
            //     this.tableData = val; 
            // }
        },
        created: function () {
            this.getData();
            sessionStorage.removeItem(this.alias+'_selection');//清除上一个表单的脏数据
        },
        methods: {
            getData: function (dataHandler) {
                var t = this;
                if (this.ds) {
                    t.loading = true;
                    var routerParams = t.$route?t.$route.params : {};
                    Util.getDSData(t.ds, {"bb": t, "router": routerParams,'row-data':t.parentParams}, function (map) {
                        if(dataHandler && typeof dataHandler == 'function'){
                            dataHandler(map);
                        }else{
                            if (t.pagination) {
                                map.forEach(function (item) {
                                    var list = item['value']['currentRecords'];
                                    t[item['dataKey']] = [];
                                    for (var i in list) {
                                        t[item['dataKey']].push(list[i]);
                                    }
                                    t.totalItems = item['value']['totalRecords'];
                                });
                            } else {
                                map.forEach(function (item) {
                                    var list = [];
                                    if(item['valueKey'].split('.').length > 1){//支持定制接口
                                        list = item['value']
                                    }else{
                                        list = item['value']['list'];
                                    }
                                    t[item['dataKey']] = [];
                                    for (var i in list) {
                                        if(t.hiddenValueKey){
                                            t.hiddenItems.forEach((ele)=>{//前端支持列表筛选
                                                if(list[i][t.hiddenValueKey] != ele ){
                                                    t[item['dataKey']].push(list[i]);
                                                }
                                            })
                                        }else{
                                            t[item['dataKey']].push(list[i]);
                                        }
                                    }
                                    t.totalItems = item['value']['totalRecords'];
                                });
                            }
                        }
                        t.loading = false;
                    }, function (code, msg) {
                        t.loading = false;
                    });
                }
            },
            loadData: function (tableData) {
                this.tableData = tableData;
            },
            btnClick: function (button, row) {
                var t = this;
                t.vue = Vue;
                Util.resolveButton(button,{
                    'bb':t,
                    "router": t.$route.params,
                    'row-data':row,
                    'getData':t.getData
                });
            },
            popupClick: function (button, row) {
                var t = this;
                t.toChildParams = row;
                t.toChildParams.getData = t.getData;
            },
            handleSizeChange: function (pageSize) {
                this.pageSize = pageSize;
                this.getData();
            },
            handleCurrentChange: function (page) {
                this.page = page;
                this.getData();
            },
            hideBtn(button, row){
                if (button['hideCheck']) {
                    return button['hideCheck'].call(this, row);
                }
                if(button['showKey']){
                    var showKey = button['showKey'];
                    if(row[showKey] == button['showValue'] || button['showValue'].indexOf(row[showKey]) >= 0){//兼容多个状态
                        return true
                    }else{
                        return false
                    }
                }
                return true;
            },
            chooseLego(row){
                //触发父组件的选择
                //this.$emit("list-select", row);
            },
            globalSearch(){
                this.getData();
            },
            cellSubmit: function (event, column, row) {
                let t=this;
                // 需要配置DS来做更新

                let newRow = {};
                Object.assign(newRow,row);
                newRow[column.prop]=event.target.value;
                //列表的更新操作
                if (column.ds) {
                    t.loading = true;
                    Util.getDSData(column.ds, {"bb": t, "router": t.$route.params,"row-data":newRow}, function (map) {
                        t.loading = false;
                    }, function (code, msg) {
                        t.loading = false;
                    });
                }
            },
            loadTreeChild : function(row,callback){
                var t = this;
                this.treeParentId = row['id'];
                this.getData(function(map){
                    var childList = [];
                    map.forEach(function (item) {
                        var list = item['value']['list'];
                        for (var i in list) {
                            childList.push(list[i]);
                        }
                    });
                    callback(childList);
                    t.treeParentId = 0;
                });
            },
            selectionChange:function(val){
                if(this.selection){
                    this.selectArr = val;
                }
                sessionStorage.setItem(this.alias+'_selection',JSON.stringify(val));
            },
            radioChange:function(val){
                if(!this.selection){
                    this.selectArr = val;
                }
                sessionStorage.setItem(this.alias+'_selection',JSON.stringify(val));
            },
            cancelSelect:function(){
                this.$refs[this.alias].clearSelection()
                this.$emit("list-select", 'cancelSelect');
            },
            confirmSelect:function(){
                this.$emit("list-select", this.selectArr);
            },
            // 事件触发
            showPopFn:function(row, index, column) {
                this.clickPopIsShow = true;
                this.$emit("clickProp", row, index,column);
            }
        }

    }
</script>

<style scoped>
    .m10 {
        width: 100%;
    }
    .searchInput{
        max-width: 400px;
    }
    .el-row{
        margin-bottom: 20px;
    }
    .popupClass{
        max-height: 360px;
        overflow: scroll;
    }
    .staticWords{
        font-family: 'PingFangSC-Regular';
        font-size: 12px;
        color: #999999;
    }
</style>