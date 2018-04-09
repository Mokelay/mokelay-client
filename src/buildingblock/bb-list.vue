<template>
    <div class="bb-list">
        <el-row v-if="search">
            <!-- 全局搜索 -->
            <div v-if="searchConfig.searchType == 'searchInput'" class="searchInput">
                <el-input v-model="keywords" @keyup.native.enter="globalSearch"
                       style="width: 100%;" placeholder="请输入搜索内容">
                    <el-button type="primary" slot="append" icon="el-icon-search" @click="globalSearch">{{searchConfig.searchButtonName}}</el-button>
                </el-input>
            </div>
            <!-- 关键词选择搜索 -->
            <div v-if="searchConfig.searchType == 'searchSelection'" class="m10">
                <bb-checkbox-group v-if="searchConfig.type == 'checkbox'" v-model="keywords" type="button" @input="globalSearch" :options="searchConfig.searchKeys" :ds="searchConfig.ds" :optionValue="searchConfig.optionValue" :optionText="searchConfig.optionText" class='searchSelection'>
                </bb-checkbox-group>
                <bb-radio-group v-if="searchConfig.type == 'radio'" v-model="keywords" type="button" @input="globalSearch" :options="searchConfig.searchKeys" :ds="searchConfig.ds" :optionValue="searchConfig.optionValue" :optionText="searchConfig.optionText" class='searchSelection'>
                </bb-radio-group>
            </div>
            <!-- 高级搜索 -->
            <bb-button-form 
                class="advancedSearch"
                @commit="advancedSearchFn"
                v-if="advancedSearch && advancedSearchConfig.layoutType == 'bb-button-form'" 
                :fields="advancedSearchConfig.fields" 
                :startButtonIcon="advancedSearchConfig.startButtonIcon" 
                :settingText="advancedSearchConfig.settingText" 
                :formButtonName="advancedSearchConfig.formButtonName"></bb-button-form>
            <bb-form 
                @commit="advancedSearchFn"
                v-if="advancedSearch && advancedSearchConfig.layoutType == 'inline-form'"
                :labelInline="true"
                :fields="advancedSearchConfig.fields"
                :settingButtonText="advancedSearchConfig.formButtonName"></bb-form>
            
        </el-row>
        <el-row>
            <!-- 列表新增按钮 -->
            <el-button v-if="editConfig&&editConfig.editable[0] == 'add'" type="text" icon="ty-icon_faqi1" class="fr" @click="rowAdd"></el-button>
            <!-- 列表主体 -->
            <el-table :data="tableData" :highlight-current-row="highlightCurrent" :stripe="stripe" :border="border" style="width: 100%;" :class="popup?'popupClass':''" @row-click="rowClick" v-loading="loading" @selection-change="selectionChange" @current-change="radioChange" :ref="alias"  :show-header="showHeader" :height="fixedColumn?fixedColumn:null">
                <el-table-column type="index" v-if="index" :fixed="true" width="55"></el-table-column>
                <el-table-column type="selection" v-if="selection" width="55"></el-table-column>

                <!-- 树状结构支持 -->
                <el-table-tree-column v-if="treeConfig&&treeConfig.support"
                                :remote="loadTreeChild"
                                :childNumKey="treeConfig.childNumKey"
                                :parentKey="treeConfig.parentKey"
                                :prop="treeConfig.prop"
                                :label="treeConfig.label"></el-table-tree-column>

                <el-table-column v-for="(column,key) in realColumns" :fixed="column.fixed" :width="column.width" :prop="column.prop" :label="column.label"
                                 :key="column.prop" :align="column.align">
                    <template slot-scope="scope">
                        <!-- type=button-group 不再扩展 -->
                        <div v-if="column['type'] == 'button-group'" >
                            <span v-for="(button,index) in column.buttons">
                                <!-- 仅针对表单操作 其他业务禁止使用 -->
                                <bb-popup-selection v-if="hideBtn(button,scope.row) && button['buttonType'] == 'popup'"
                                            :valueField="button['popupConfig']['valueField']"
                                            :textField="button['popupConfig']['textField']"
                                            :popupGrid="button['popupConfig']['popupGrid']"
                                            :buttonConfig="button['popupConfig']['buttonConfig']"
                                            :showModal="button['popupConfig']['showModal']"
                                            :parentParams="toChildParams"
                                            :title="button['popupConfig']['title']"
                                            :popupButtons="button['popupConfig']['popupButtons']"
                                            @button-finish="hidePopup"
                                            @showPopup="popupClick(button,scope.row)"></bb-popup-selection>
                                <el-button v-if="hideBtn(button,scope.row) && button['buttonType'] != 'popup'&& button['buttonType'] != 'dialog'"
                                           :type="button.type" :key="index"
                                           :style="{'color':button.wordColor,'user-select':'all'}"
                                           :icon="button.icon" @click.native.prevent="btnClick(button,scope)">
                                    {{button.text?button.text:scope['row'][column.prop]}}
                                </el-button>
                                <!-- 后续业务禁止应用 -->
                                <bb v-if="hideBtn(button,scope.row) && button['buttonType'] == 'dialog'" :alias="button['dialog']['alias']" :config="button['dialog']['config']" :parentData="{'row-data':scope['row'],'rowData':scope['row']}"></bb>
                            </span>
                        </div>
                        <div v-else-if="column['type'] == 'edit' && scope['$index'] != canEditRow">
                            <el-input :value="scope['row'][column.prop]"
                                      @blur="cellSubmit($event,column,scope['row'])"></el-input>
                        </div>
                        <div v-else-if="column['type'] == 'picture' && scope['$index'] != canEditRow">
                            <bb-picture-preview :imgList="scope['row'][column.prop]"></bb-picture-preview>
                        </div>
                        <div v-else-if="column['type'] == 'template' && scope['$index'] != canEditRow">
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
                                <bb-words :text="scope['row'][column.prop]" :parentParams="scope['row']" :templateProp="column.templateProp" :valueKey="column.valueKey"></bb-words>
                            </div>
                            <div v-if="column['template'] == 'customIcon'">
                                <i  v-for="(item,index) in column.showValue" :class="scope['row'][column.prop] == item?column.iconClass[index]:''"></i>
                            </div>
                            <div v-if="column['template'] == 'file'">
                                <bb-custom :customFile="column['file']" :parentData="{row:scope['row'],column:column}"></bb-custom>
                            </div>
                        </div>
                        <div v-else>
                            <!-- 编辑状态 -->
                            <!-- <bb v-if="scope['$index'] == canEditRow" :key="scope['column']['id']" :config="column['etProp']" :alias="column['et']" :on="column['on']"></bb> -->
                            <!-- 只读状态 -->
                            <span v-if="scope['$index'] != canEditRow">
                                {{scope['row'][column.prop]}}
                            </span>
                        </div>
                        <!-- 编辑状态 -->
                        <bb v-if="scope['$index'] == canEditRow" :value="scope['row'][column.prop]" :ref="column['prop']" :key="scope['column']['id']" :config="column['etProp']" :alias="column['et']" :on="column['on']"></bb>
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
    </div>
</template>

<script>
    import Util from '../libs/util';
    import Vue from 'vue'

    export default {
        name: 'bb-list',
        props: {
            lazy:{//初始不加载数据
                type:Boolean,
                default: false
            },
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
            /*表头数组
                [{
                    prop:null,  表头键值
                    label:'默认表单', 表头展示名称
                    fixed:"right",
                    width:"120px",
                    type:"defalut || button-group(操作)",
                    et:"bb-select" 表头编辑器 编辑状态有效
                    etProp:{} 表头编辑器配置 编辑状态有效
                    etOn:[{             //触发交互
                        uuid:'',
                        fromContentEvent:'',//事件
                        executeContentUUID:'',//目标积木的uuid
                        executeContentMethodName:'',//目标方法名称
                    }] 表头编辑器交互 编辑状态有效
                }]
            */
            columns: {
                type: Array,
                default: function () {
                    return [{prop:null,label:'默认表单'}]
                }
            },
            value: {
                type: [Array,String],
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
            //todo 删除
            alias:{
                type:String,//表单id 传参数给buzz时使用
                default:'list'
            },
            //todo 删除
            popup:{//标识是否是弹出表单
                type:Boolean,
                default:false
            },
            //todo 删除
            showHeader:{//是否显示表头
                type:Boolean,
                default:true
            },
            //todo 删除
            highlightCurrent:{//高亮当前选中
                type:Boolean,
                default:false
            },
            //todo 删除
            stripe:{//条纹
                type:Boolean,
                default:true
            },
            fixedColumn:{//固定表头
                type:String
            },
            //todo 删除
            parentParams:{
                type:Object
            },
            //todo 删除
            hiddenValueKey:{
                type:String
            },
            //todo 删除
            hiddenItems:{
                type:Array
            },
            //todo 删除
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
            border:{
                type:Boolean,
                default:true
            },
            advancedSearch:{
                type:Boolean,
                default:false
            },
            advancedSearchConfig: {
                type: Object,
                default: function () {
                    return {
                        layoutType:'bb-button-form'
                    }
                }
            },
            //自动刷新时间间隔
            intervalTime:{
                type:Number
            },
            /*editConfig 列表编辑器配置
                {
                   editable:true,
                   editDs:{ //增删改排序的ds接口
                        add:{},
                        remove:{},
                        update:{},
                        sort:{},
                   }
                }
            */
            editConfig:{
                type:[String,Object],
                default:function(){
                    return {
                        editable:[], // ['add','edit','up','down','remove']
                        editDs:{
                            add:{},
                            remove:{},
                            update:{},
                            sort:{},
                        }
                    }
                }
            },
            returnString:{
                type:Boolean,
                default:false
            }
        },
        data() {
            return {
                realColumns:[].concat(this.columns),
                tableData: (this.value&&typeof(this.value)==='string')?eval(this.value):this.value||[],
                totalItems: this.total,
                pageSize: 10,
                page: 1,
                keywords: '',
                selectArr: [],
                loading: false,
                treeParentId:0,
                toChildParams:null,
                showPopIsShow:false,
                searchFormData:null,
                external:{},
                //第一次渲染处理表头数据
                canPre:true,
                canEditRow:null,
                scope:null,
                adding:false//是否添加状态
            }
        },
        watch: {
            value(val) {
                this.tableData = (val&&typeof(val)==='string')?eval(val):val||[];
            }
        },
        created: function () {
            //可编辑状态下对表头拓展
            if(this.canPre){
                this.canPre = false;
                this.preColumns();
            }
            if(!this.lazy){
                this.startIntervalFresh();
            }
            sessionStorage.removeItem(this.alias+'_selection');//清除上一个表单的脏数据
        },
        methods: {
            getData: function (dataHandler) {
                var t = this;
                if (this.ds) {
                    t.loading = true;
                    var routerParams = t.$route?t.$route.params : {};
                    if(t.treeConfig&&t.treeConfig.support){
                        //树形
                        let inputs = t.ds.inputs;
                        let hasParam = false;
                        inputs.forEach(function(item){
                            if(item.paramName==t.treeConfig.parentKey){
                                hasParam=true;
                                item.constant=t.treeParentId;
                            }
                        });
                        if(!hasParam){
                            //没有这个参数
                            inputs.push({
                                paramName: t.treeConfig.parentKey,
                                valueType: "constant",
                                constant: t.treeParentId
                            });
                        }
                    }
                    Util.getDSData(t.ds, _TY_Tool.buildTplParams(t,{'row-data':t.parentParams,'rowData':t.parentParams}), function (map) {
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
                                        if(item['value']&&item['value']['list']){
                                            list = item['value']['list'];    
                                        }else{
                                            list = item['value'];
                                        }
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
                                    t.totalItems = (item['value']&&item['value']['totalRecords'])?item['value']['totalRecords']:0;
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
            btnClick: function (button, scope) {
                var t = this;
                if(button.action == 'bbListeditorData'){
                    //查询当前按钮，如果是editorData 责为编辑按钮
                    t.editorData(button, scope);
                }else{
                    //否则正常处理
                    t.vue = Vue;
                    Util.resolveButton(button,_TY_Tool.buildTplParams(t,{
                        'row-data':scope.row,
                        'rowData':scope.row,
                        'getData':t.getData
                    }));
                }
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
            rowClick(row){
                //触发父组件的选择
                this.$emit("rowClick", row);
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
                    Util.getDSData(column.ds, _TY_Tool.buildTplParams(t,{"row-data":newRow,"rowData":newRow}), function (map) {
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
                this.$emit("list-select", this.selectArr);
            },
            radioChange:function(val){
                if(!this.selection){
                    this.selectArr = val;
                }
                sessionStorage.setItem(this.alias+'_selection',JSON.stringify(val));
                this.$emit("list-select", this.selectArr);
            },
            // 事件触发
            showPopFn:function(row, index, column) {
                this.clickPopIsShow = true;
                this.$emit("clickProp", row, index,column);
            },
            advancedSearchFn:function(data){
                const t = this;
                t.searchFormData = data;
                t.getData();
            },
            hidePopup:function(button,objValue){
                objValue['bb'].afterCommit(button);
            },
            linkage:function(...data){
                if(data){
                    this.external['linkage'] = data;
                    this.getData();
                }
            },
            loadChildBB(){
                let t=this;
                return _TY_Tool.loadChildBB(t);                
            },
            //定时刷新
            startIntervalFresh(){
                const t = this;
                if(t.intervalTime){
                    t.interval = setInterval(t.getData,t.intervalTime);
                }else{
                    t.getData();
                }
            },
            //停止自动刷新
            stopIntervalFresh(){
                const t = this;
                clearInterval(t.interval);
            },
            //对表头进行预处理
            preColumns(){
                const t = this;
                t.realColumns.forEach((col,key)=>{
                    col.on = {
                        change:t.cellChange.bind(null,col)
                    }
                    if(col.etOn){
                        col.etOn.forEach((val,index)=>{
                            const eventName = val['fromContentEvent'];
                            const fnName = val['executeContentMethodName']; 
                            col['on'][eventName] = ((params)=>{
                                const fn = window._TY_Tool.findBBByUuid(val['executeContentUUID'], true)['$children'][0][fnName];
                                fn(params);
                            }).bind(t);
                        })
                    }
                });
                const buttons = {
                        edit:{
                            action:"bbListeditorData",
                            icon:"el-icon-edit",
                            text:"",
                            type:"text",
                            buzz:"buzzNull",
                            alias:'edit'
                        },
                        remove:{
                            action:"bbListeditorData",
                            icon:"ty-icon_lajitong",
                            text:"",
                            type:"text",
                            buzz:"buzzNull",
                            alias:'remove'
                        },
                        up:{
                            action:"bbListeditorData",
                            icon:"ty-icon_shangyi",
                            text:"",
                            type:"text",
                            buzz:"buzzNull",
                            alias:'up'
                        },
                        down:{
                            action:"bbListeditorData",
                            icon:"ty-icon_xiayi",
                            text:"",
                            type:"text",
                            buzz:"buzzNull",
                            alias:'down'
                        }}
                //如果是可编辑状态，默认添加操作列
                if(t.editConfig&&t.editConfig.editable.length){
                    const editor = {
                        fixed:"right",
                        width:"120px",
                        label:"操作",
                        prop:"bbListeditorData",
                        type:"button-group",
                        buttons:[]
                    };
                    t.editConfig.editable.forEach((ele,index)=>{
                        if(buttons[ele]){
                            editor.buttons.push(buttons[ele]);
                        }
                    })
                    if(t.realColumns.length == t.columns.length){
                        t.realColumns.push(editor);
                    }
                }
            },
            //编辑状态，更新数据
            cellChange:function(column,val){
                const t = this;
                if(t.scope){
                    //修改
                    const scope = t.scope;
                    //实现添加事件，配合bb-form实现表单v-model
                    t.$set(t.tableData[scope['$index']],column.prop,val);
                    t.$emit('input',t._returnStringOrArray());
                    t.$emit('change',t._returnStringOrArray());
                    //通过接口提交修改
                    //t.cellDSSubmit(t.tableData[scope['$index']],t.editConfig.editDs.update);
                }else{
                    //新增
                    t.$set(t.tableData[0],column.prop,val);
                    //通过接口提交修改
                    // t.cellDSSubmit(t.tableData[0],t.editConfig.editDs.add);
                    t.$emit('input',t._returnStringOrArray());
                    t.$emit('change',t._returnStringOrArray());
                }
            },
            /*通过DS保存修改行
                @newRow 当前修改数据的整行数据
                @ds 请求接口配置
            */
            cellDSSubmit:function(newRow,dsName){
                //列表的更新操作
                const t = this;
                let ds = null;
                if(t.editConfig&&t.editConfig.editDs){
                    ds = t.editConfig.editDs[dsName];
                }
                if (ds) {
                    t.loading = true;
                    Util.getDSData(ds, _TY_Tool.buildTplParams(t,{"row-data":newRow,"rowData":newRow}), function (map) {
                        t.loading = false;
                    }, function (code, msg) {
                        t.loading = false;
                    });
                }
            },
            //积木内部新增行数据 列表内编辑器
            rowAdd:function(){
                const t = this;
                const key = t.tableData.length;
                t.tableData.splice(0,0,{});
                t.canEditRow = 0; 
                t.adding = true;
            },
            //外部新增行数据 newRow 列表外编辑器
            rowAddOut:function(newRow){
                const t = this;
                const key = t.tableData.length;
                if(newRow){
                    const newItem = Object.assign({},newRow);
                    t.tableData.push(newItem);
                }
                //t.adding = true;
            },
            //分发编辑列表的各种按钮事件
            editorData:function(button, scope){
                const t = this;
                t.scope = scope;
                switch(button.alias){
                    case 'edit':
                        t.cellEditor(scope);
                        break;
                    case 'remove':
                        t.cellremove(scope);
                        break;
                    case 'up':
                        t.cellUp(scope);
                        break;
                    case 'down':
                        t.cellDown(scope);
                        break;
                }
            },
            //当前行进入编辑装填
            cellEditor:function(scope){
                const t = this;
                t.canEditRow = t.canEditRow == scope['$index']?null:scope['$index'];
                if(!t.canEditRow){
                    if(!t.adding){
                        //修改
                        t.cellDSSubmit(t.tableData[scope['$index']],'update');
                        t.$emit('edit',t.tableData[scope['$index']]);              
                    }else{
                        //新增
                        t.cellDSSubmit(t.tableData[0],'add');
                    }
                }else{
                    t.adding = false;
                }
            },
            //清空数据数据
            cleanData:function(scope){
                const t = this;
                t.tableData = [];
                t.$emit('input',t._returnStringOrArray());
                t.$emit('change',t._returnStringOrArray());
                t.$emit('remove',t._returnStringOrArray());
            },            //删除数据
            cellremove:function(scope){
                const t = this;
                t.$confirm('确认操作?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    const index = scope['$index'] || 0;
                    //调用删除接口
                    t.cellDSSubmit(t.tableData[index],'remove');
                    t.tableData.splice(index,1);
                    t.$emit('input',t._returnStringOrArray());
                    t.$emit('change',t._returnStringOrArray());
                    t.$emit('remove',t._returnStringOrArray());
                }).catch(() => {
                    t.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            //数据向上移动
            cellUp:function(scope){
                const t = this;
                const index = scope['$index'];
                if(index == 0) {
                    return;
                }
                const item = t.tableData[index]
                t.tableData.splice(index,1);
                t.tableData.splice(index-1,0,item);
                t.$emit('input',t._returnStringOrArray());
                t.$emit('change',t._returnStringOrArray());
                t.cellDSSubmit(item,'sort');
            },
            //数据向下移动
            cellDown:function(scope){
                const t = this;
                const index = scope['$index']; 
                if(index == t.tableData.length -1) {
                    return;
                }
                const item = t.tableData[index]
                t.tableData.splice(index,1);
                t.tableData.splice(index+1,0,item);
                t.$emit('input',t._returnStringOrArray());
                t.$emit('change',t._returnStringOrArray());
                t.cellDSSubmit(item,'sort');
            },
            _returnStringOrArray:function(){
                let t=this;
                if(t.returnString){
                    return JSON.stringify(t.tableData);
                }else{
                    return t.tableData;
                }
            }
        }
    }
</script>

<style lang='less' scoped>
    .m10 {
        width: 100%;
    }
    .searchInput,.advancedSearch{
        max-width: 400px;
        float: left;
        margin-right: 20px;
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
    .fr{
        float: right;
    }
</style>