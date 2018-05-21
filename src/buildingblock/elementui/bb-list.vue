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
        </el-row>
        <el-row v-if="advancedSearch">
            <!-- 高级搜索 -->
            <bb-button-form 
                class="advancedSearch"
                @commit="advancedSearchFn"
                v-if="advancedSearchConfig.layoutType == 'bb-button-form'" 
                :fields="advancedSearchConfig.fields"
                :content="advancedSearchConfig.content"
                :startButtonIcon="advancedSearchConfig.startButtonIcon" 
                :settingText="advancedSearchConfig.settingText" 
                :formButtonName="advancedSearchConfig.formButtonName"></bb-button-form>
            <bb-form 
                @bb-mounted="advancedSearchFn"
                @commit="advancedSearchFn"
                v-if="advancedSearchConfig.layoutType == 'inline-form'"
                :labelInline="advancedSearchConfig.labelInline"
                :labelWidth="advancedSearchConfig.labelWidth"
                :labelPosition="advancedSearchConfig.labelPosition"
                :fields="advancedSearchConfig.fields"
                :content="advancedSearchConfig.content"
                :grid="advancedSearchConfig.grid"
                :size="advancedSearchConfig.size"
                :defaultValTpl="advancedSearchConfig.defaultValTpl"
                :settingButtonText="advancedSearchConfig.formButtonName"></bb-form>
            
        </el-row>
        <el-row>
            <!-- 列表新增按钮 -->
            <el-button v-if="editConfig && addButton && !editAll" type="text" icon="ty-icon_faqi1" class="fr" @click="rowAdd"></el-button>
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
                <el-table-column 
                    v-for="(column,key) in realColumns" 
                    :fixed="column.fixed" 
                    :width="column.width" 
                    :prop="column.prop" 
                    :label="column.label"
                    :filters="column.filter"
                    :filter-method="column.filter?filterHandler.bind(null,column) : null"
                    filter-placement="bottom-end"
                    :key="column.prop" 
                    :align="column.align">
                    <template slot-scope="scope">
                        <!-- type=button-group 不再扩展 -->
                        <div v-if="column['type'] == 'button-group'" >
                            <span v-for="(button,index) in column.buttons">
                                <!-- 仅针对表单操作 其他业务禁止使用 -->
                                <bb-popup-selection v-if="hideBtn(button,scope) && button['buttonType'] == 'popup'"
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
                                <el-button 
                                    v-if="hideBtn(button,scope) && button['buttonType'] != 'popup' && button['buttonType'] != 'dialog'"
                                   :type="button.type" :key="index"
                                   :style="{'color':button.wordColor,'user-select':'all'}"
                                   :icon="button.icon" @click.native.prevent="btnClick(button,scope)">
                                    {{button.text?button.text:scope['row'][column.prop]}}
                                </el-button>
                                <!-- 后续业务禁止应用 -->
                                <bb v-if="hideBtn(button,scope) && button['buttonType'] == 'dialog'" :alias="button['dialog']['alias']" :config="button['dialog']['config']" :parentData="{'row-data':scope['row'],'rowData':scope['row']}" :on="bbButtonFinishOnObj"></bb>
                            </span>
                        </div>
                        <div v-else-if="column['type'] == 'edit' && (scope['$index'] != canEditRow || !column['et'] || onlyAddEditShow(scope,column))">
                            <el-input :value="scope['row'][column.prop]"
                                      @blur="cellSubmit($event,column,scope['row'])"></el-input>
                        </div>
                        <div v-else-if="column['type'] == 'picture' && (scope['$index'] != canEditRow || !column['et'] || onlyAddEditShow(scope,column))">
                            <bb-picture-preview :imgList="scope['row'][column.prop]"></bb-picture-preview>
                        </div>
                        <div v-else-if="column['type'] == 'template' && (scope['$index'] != canEditRow || !column['et'] || onlyAddEditShow(scope,column))">
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
                            <!-- 只读状态 -->
                            <span v-if="scope['$index'] != canEditRow && !editAll || !column['et'] || onlyAddEditShow(scope,column)">
                                <span v-if="column['et']&&column['et']=='bb-select' && column['etProp'] && checkDsInput(column['etProp'])" :title="canRender">
                                    {{bbSelectFill(scope,column)}}
                                </span>
                                <span v-else>{{scope['row'][column.prop]}}</span>
                            </span>
                        </div>
                        <!-- 编辑状态 -->
                        <bb v-if="scope['$index'] == canEditRow && column['et'] && onlyAddEditShow(scope,column,true) || editAll" v-model="scope['row'][column.prop]" :ref="column['prop']" :key="scope['column']['id']" :config="column['etProp']" :alias="column['et']" @change="cellChange" :parentData="scope"></bb>
                    </template>
                </el-table-column>
            </el-table>
        </el-row>
        <el-row v-if="pagination" type="flex" justify='end'>
            <bb-pagination 
                :pageSizes="pageSizes" 
                :page="page"
                :pageSize="pageSize"
                :totalItems="totalItems"
                @sizeChange="handleSizeChange"
                @pageChange="handleCurrentChange"
                >
            </bb-pagination>
        </el-row>
    </div>
</template>

<script>
    import Util from '../../libs/util';
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
                    filter:"[{ text: '家', value: '家' }, { text: '公司', value: '公司' }]" 列表内数据赛选条件
                    fixed:"right",
                    width:"120px",
                    type:"defalut || button-group(操作)",
                    et:"bb-select", 表头编辑器 编辑状态有效
                    etProp:{}, 表头编辑器配置 编辑状态有效
                    onlyAddEditShow:false,//只有添加的时候显示编辑状态，修改不显示编辑状态
                    etOn:[{             //触发交互
                        uuid:'',
                        fromContentEvent:'',//事件
                        executeContentUUID:'',//目标积木的uuid
                        executeArgument:'',//参数
                        executeContentMethodName:'',//目标方法名称
                    }] 表头编辑器交互 编辑状态有效
                }]
            */
            columns: {
                type: Array,
                default: function () {
                    return [{prop:null,label:'默认列表'}]
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
                    };
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
            /*advancedSearchConfig 高级搜素表单配置
                {
                    layoutType:'bb-button-form' || 'inline-form'
                    labelInline:"true || false"
                    labelWidth:"100px"
                    labelPosition:right/left/top
                    fields:"[]"
                    content:"[]"
                    grid:"true || false"
                    size:"medium / small / mini"
                    formButtonName:"选择"
                }
            */
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
                        editable:[], // ['add','edit','up','down','remove','editAll']
                        editDs:{
                            add:null,
                            remove:null,
                            update:null,
                            sort:null,
                            updateAll:null
                        }
                    }
                }
            },
            returnString:{
                type:Boolean,
                default:false
            },
            //当前列表分页参数 page当前页  pageSize每页条数
            pageConfig:{
                type:Object,
                default:function(){
                    return {
                        page:1,
                        pageSize:10
                    }
                }
            }
        },
        data() {
            return {
                realColumns:_TY_Tool.deepClone(this.columns),
                tableData: (this.value&&typeof(this.value)==='string')?eval(this.value):this.value||[],
                totalItems: 0,
                pageSize:this.pageConfig.pageSize,
                page: this.pageConfig.page,
                pageSizes:[this.pageConfig.pageSize*1, this.pageConfig.pageSize*2, this.pageConfig.pageSize*5, this.pageConfig.pageSize*10],
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
                adding:false,//是否添加状态
                bbButtonFinishOnObj:this.bbButtonFinishOnfun(),//针对列表弹窗类编辑按钮 抛出button-finish的事件
                addButton:false, //对添加按钮进行管理
                canRender:false,//通过这个data来操作render函数执行,主要用来局部刷新bb-select中文填充
                haveEditor:false,
                editAll:false
            }
        },
        watch: {
            value(val) {
                const newData = (val&&typeof(val)==='string')?JSON.parse(val):val||[];
                if(newData && this.editAll){
                    newData.concat([{}]);
                    this.haveEditor = true;
                }
                if(!this.editAll){
                    this.tableData = newData;
                }
            }
        },
        created: function () {
            const t = this;
            //初始化bb-select的数据
            t.initBBSelectFields();
            //可编辑状态下对表头拓展
            if(t.canPre){
                t.canPre = false;
                t.preColumns();
            }
            if(!t.lazy){
                t.startIntervalFresh();
            }
            sessionStorage.removeItem(t.alias+'_selection');//清除上一个表单的脏数据
            t.editConfig.editable = typeof t.editConfig.editable == "string"?t.editConfig.editable.split(','):t.editConfig.editable;
            if(t.editConfig.editable){
                t.editConfig.editable.forEach((val,key)=>{
                    if(val == "editAll"){
                        t.editAll = true;
                    }
                });
            }
            if(t.tableData && t.tableData.length > 0 && t.editAll){
                const arr = Object.keys(t.tableData[t.tableData.length-1]);
                if(arr.length != 0){
                    t.tableData.push({});
                }
            }
        },
        mounted:function(){
            this.$emit('bb-mounted');
        },
        methods: {
            //检查ds的输入是否是否有参数   只填充不带参数的下拉
            checkDsInput:function(etProp){
                let t=this;
                if(etProp&&etProp.ds&&etProp.ds.inputs&&etProp.ds.inputs.length>0){
                    let result = true;
                    etProp.ds.inputs.forEach(function(item,index){
                        switch(item.valueType){
                            case 'template':
                                let str = item.variable;
                                if(str.indexOf('external')>=0||
                                    str.indexOf('linkage')>=0||
                                    str.indexOf('bb')>=0||
                                    str.indexOf('_TY_Root')>=0){
                                    result =  false
                                    return result;
                                }
                                break;
                            case 'inputValueObj':
                                if(item.valueKey==='bb'||
                                    item.valueKey==='row-data'||
                                    item.valueKey==='rowData'){
                                    result =  false
                                    return result;
                                }
                                break;
                        }
                    });
                    return result;
                }else{
                    return true;
                }
            },
            //如果是bb-select，初始化的时候就接口请求下拉数据,并放到_TY_Root 对象中，api作为key
            initBBSelectFields:function(force){
                const t=this;
                if(t.realColumns&&t.realColumns.length>0){
                    let promisArr = [];
                    t.realColumns.forEach(function(column,index){
                        //遍历每个列头
                        if(column['et']&&column['et']==='bb-select'&&column['etProp']&&column['etProp'].ds&&column['etProp'].ds.api){
                            if(!t.checkDsInput(column['etProp'])){
                                return;
                            }
                            if(!force&&_TY_Root["_TY_"+column['etProp'].ds.api]){
                                //如果当前页面全局变量中已经有值了，就不在调接口获取
                                return true;
                            }
                            promisArr.push(
                                new Promise((resolve,reject)=>{
                                    //有接口的需要在初始化的时候加载数据
                                    Util.getDSData(column['etProp'].ds, _TY_Tool.buildTplParams(t), function (map) {
                                        if(map&&map.length>0&&map[0]&&map[0].value){
                                            let columnDatas = map[0].value;
                                            if(columnDatas.hasOwnProperty("list")){
                                                columnDatas = columnDatas.list;
                                            }
                                            //放到当前页面的全局变量中,接口别名作为key
                                            _TY_Root["_TY_"+column['etProp'].ds.api] = columnDatas;
                                            resolve();
                                        }
                                    }, function (code, msg) {
                                    });
                                })
                            );
                        }else{
                            //continue
                            return true;
                        }
                    });
                    Promise.all(promisArr).then(function(){
                        if(t.canRender){
                          t.canRender = false;  
                        }else{
                            t.canRender = true;
                        }
                    });
                }
            },
            //列表如果是bb-select编辑器，显示对应的中文
            bbSelectFill:function(scope,column){
                let t=this;
                let selectProp = column.etProp;
                if(!selectProp){
                    return;
                }
                if(typeof(selectProp)==='string'){
                    selectProp = JSON.parse(selectProp);
                }
                const multiple = selectProp.multiple;//是否多选
                let columnVal = scope['row'][column.prop];
                if(columnVal!=null && columnVal!=''&&columnVal!='[]'){
                    let result = [];//多选返回字符串
                    if(multiple){
                        //如果是多选，转换成数组
                        // columnVal = JSON.parse(columnVal);
                        try{
                          columnVal = JSON.parse(columnVal);
                        }catch(e){
                          columnVal=columnVal.split(",");
                        }
                    }
                    if(selectProp.ds&&selectProp.ds.api){
                        const opts = _TY_Root["_TY_"+selectProp.ds.api];
                        if(opts&&opts.length>0){
                            for(let i=0;i<opts.length;i++){
                                if(multiple){
                                    //多选
                                    columnVal.forEach(function(val,_index){
                                        if(opts[i][selectProp.valueField]==val){
                                            result.push(opts[i][selectProp.textField]);
                                        }
                                    });
                                }else{
                                    //单选直接返回
                                    if(opts[i][selectProp.valueField]==columnVal){
                                        return opts[i][selectProp.textField];
                                    }
                                }
                            }
                            //多选才会走到这里
                            return result.join(",");
                        }
                    }else if(selectProp.fields&&selectProp.fields.length>0){
                        for(let i=0;i<selectProp.fields.length;i++){
                            if(multiple){
                                //多选
                                columnVal.forEach(function(val,_index){
                                    if(selectProp.fields[i].value==val){
                                        result.push(selectProp.fields[i].text);
                                    }
                                });
                            }else{
                                if(selectProp.fields[i].value==columnVal){
                                    return selectProp.fields[i].text;
                                }
                            }
                        }
                        //多选才会走到这里
                        return result.join(",");
                    }
                }
            },
            onlyAddEditShow:function(scope,column,editFlag){
                if(editFlag){
                    return (this.adding || (!this.adding&&!column['onlyAddEditShow']));
                }else{
                    return (!this.adding && column['onlyAddEditShow']);
                }
            },
            //返回一个on 对象（bb组件的事件监听on对象）
            bbButtonFinishOnfun:function(){
                const t = this;
                return {
                    "button-finish":function(button, valueobj){
                        t.$emit('button-finish', button, valueobj);
                    }
                }
            },
            getData: function (dataHandler) {
                var t = this;
                if (this.ds) {
                    t.loading = true;
                    t.canEditRow = null;
                    var routerParams = t.$route?t.$route.params : {};
                    if(t.treeConfig&&t.treeConfig.support){
                        //树形
                        let inputs = t.ds.inputs;
                        let hasParam = false;
                        inputs.forEach(function(item){
                            if(item.paramName==t.treeConfig.parentKey){
                                hasParam=true;
                                item.constant=t.treeParentId;
                                item.variable = t.treeParentId;
                            }
                        });
                        if(!hasParam){
                            //没有这个参数
                            inputs.push({
                                paramName: t.treeConfig.parentKey,
                                valueType: "constant",
                                constant: t.treeParentId,
                                variable: t.treeParentId
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
                                    t.tableData = [];
                                    for (var i in list) {
                                        t.tableData.push(list[i]);
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
                                    t.tableData = [];
                                    for (var i in list) {
                                        if(t.hiddenValueKey){
                                            t.hiddenItems.forEach((ele)=>{//前端支持列表筛选
                                                if(list[i][t.hiddenValueKey] != ele ){
                                                    t.tableData.push(list[i]);
                                                }
                                            })
                                        }else{
                                            t.tableData.push(list[i]);
                                        }
                                    }
                                    t.totalItems = (item['value']&&item['value']['totalRecords'])?item['value']['totalRecords']:0;
                                });
                            }
                        };
                        if(t.tableData && t.editAll){
                            t.tableData.push({});
                        };
                        //初始化bb-select的数据
                        t.initBBSelectFields(true);
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
            handleSizeChange: function (page,pageSize) {
                this.pageSize = pageSize;
                this.getData();
            },
            handleCurrentChange: function (page) {
                this.page = page;
                this.getData();
            },
            hideBtn(button, scope){
                const row = scope.row;
                if (button['hideCheck']) {
                    return button['hideCheck'].call(this, row, scope);
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
                //搜索恢复第一页
                this.page=1;
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
                t.page = 1;//搜索恢复到第一页
                t.searchFormData = data || arguments[1]['bb']['formData'];
                t.getData();
            },
            hidePopup:function(button,objValue){
                objValue['bb'].afterCommit(button);
            },
            linkage:function(...data){
                if(data){
                    this.canEditRow = null;
                    this.external['linkage'] = data;
                    //外部参数请求数据，重新恢复到第一页
                    this.page=1;
                    this.getData();
                }
            },
            //如果需要将行点击的数据放到全局变量中，可以用交互调这个方法,参数是Key
            rowClickDataSave:function(...args){
                const t = this;
                let _key;
                args.forEach((val,key)=>{
                    if(val.type == 'custom' && val.arguments){
                        _key = val.arguments;
                    }  
                })
                if(!_key){
                    _key = "_TY_list_current_item";//默认的key
                }
                window._TY_Root[_key] = args;//将row数据放到全局变量的_TY_Root中
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
                //控制当前行能否进入编辑状态
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
                            text:"编辑",
                            type:"text",
                            buzz:"buzzNull",
                            alias:'edit'
                        },
                        remove:{
                            action:"bbListeditorData",
                            icon:"ty-icon_lajitong",
                            text:"删除",
                            type:"text",
                            buzz:"buzzNull",
                            alias:'remove',
                            hideCheck:function(row,scope){
                                return this.tableData.length != scope.$index + 1 || !this.editAll;
                            }
                        },
                        up:{
                            action:"bbListeditorData",
                            icon:"ty-icon_shangyi",
                            text:"上",
                            type:"text",
                            buzz:"buzzNull",
                            alias:'up'
                        },
                        down:{
                            action:"bbListeditorData",
                            icon:"ty-icon_xiayi",
                            text:"下",
                            type:"text",
                            buzz:"buzzNull",
                            alias:'down'
                        },
                        editAll:{
                            action:"bbListeditorData",
                            icon:"ty-icon_tianjia",
                            text:"新增",
                            type:"text",
                            buzz:"buzzNull",
                            alias:'editAll',
                            hideCheck:function(row,scope){
                                return this.tableData.length == scope.$index + 1 && this.editAll;
                            }
                        }
                    }
                //如果是可编辑状态，默认添加操作列
                if(t.editConfig&&t.editConfig.editable&&t.editConfig.editable[0]){
                    t.editButtons = t.editConfig.editable;
                    t.editButtons = typeof t.editButtons == 'string'?t.editButtons.split(','):t.editButtons;
                    const editor = {
                        width:"auto",
                        label:"操作",
                        prop:"bbListeditorData",
                        type:"button-group",
                        buttons:[]
                    };
                    t.editButtons.forEach((ele,index)=>{
                        if(buttons[ele]){
                            editor.buttons.push(buttons[ele]);
                        };
                        if(ele == 'add'){
                            t.addButton = true
                        }
                    });
                    const lastRow = t.realColumns[t.realColumns.length-1];
                    if(lastRow && lastRow.type == "button-group"){
                        //清除按钮数组中已经存在的bbListeditorData
                        // lastRow.buttons.forEach((val,key)=>{
                        //     if(val.prop == "bbListeditorData"){
                        //         lastRow.buttons.splice(key,1);
                        //     }
                        // })
                        // lastRow.buttons = editor.buttons.concat(lastRow.buttons);
                        // t.realColumns.push(editor);
                    }else{
                        t.realColumns.push(editor);
                    }
                }
            },
            //编辑状态，更新数据
            cellChange:function(val,scope){
                const t = this;
                if(scope){
                    //修改
                    const prop = scope.column.property;
                    //实现添加事件，配合bb-form实现表单v-model
                    t.$set(t.tableData[scope['$index']],prop,val);
                    // t.$emit('input',t._returnStringOrArray());
                    // t.$emit('change',t._returnStringOrArray());
                    //通过接口提交修改
                    //t.cellDSSubmit(t.tableData[scope['$index']],t.editConfig.editDs.update);
                }
            },
            /*通过DS保存修改行
                @newRow 当前修改数据的整行数据
                @ds 请求接口配置
            */
            cellDSSubmit:function(newRow,dsName){
                //列表的更新操作
                const t = this;
                return new Promise(function(resolve, reject){
                    let ds = null;
                    if(t.editConfig&&t.editConfig.editDs){
                        ds = t.editConfig.editDs[dsName];
                    }
                    const dsArr = ds?Object.keys(ds):[];
                    if (dsArr.length) {
                        t.loading = true;
                        Util.getDSData(ds, _TY_Tool.buildTplParams(t,{"row-data":newRow,"rowData":newRow}), function (map) {
                            t.loading = false;
                            resolve((map&&map.length>0)?map[0].value:'');
                            t.$emit("button-finish",dsName,map);
                        }, function (code, msg) {
                            t.loading = false;
                            reject();
                            t.$message({
                                type: 'error',
                                message: msg
                            });
                            t.$emit("button-finish",dsName,code);
                        });
                    }else{
                        resolve();
                    }
                });
            },
            //积木内部新增行数据 列表内编辑器
            rowAdd:function(){
                const t = this;
                const key = t.tableData.length;
                if(t.canEditRow==0 && !t.editAll){
                    //如果是第一行在编辑状态，不能添加
                    return;
                }
                if(t.editAll){
                   t.tableData.push({}); 
                }else{
                    t.tableData.splice(0,0,{});
                }
                t.canEditRow = 0; 
                t.adding = true;
            },
            //外部新增行数据 newRow 列表外编辑器
            rowAddOut:function(newRow){
                const t = this;
                const key = t.tableData.length;
                t.$emit('input',t._returnStringOrArray());
                t.$emit('change',t._returnStringOrArray());
                if(newRow){
                    const newItem = Object.assign({},newRow);
                    if(t.canEditRow != null){
                        t.tableData.splice(t.canEditRow,1,newItem);
                        t.canEditRow = null;
                    }else{
                        t.tableData.push(newItem);
                    }
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
                    case 'editAll':
                        t.rowAdd();
                        break;
                }
            },
            //当前行进入编辑状态
            cellEditor:function(scope){
                const t = this;
                // t.canEditRow = t.canEditRow == scope['$index']?null:scope['$index'];
                t.$emit('edit',t.tableData[scope['$index']],scope['$index']);
                if(t.canEditRow!=null){
                    //当前编辑之后点击提交 
                    t.$emit('change',t.tableData);
                    t.$emit('input',t.tableData); 
                    if(!t.adding){
                        //修改
                        t.cellDSSubmit(t.tableData[scope['$index']],'update').then(function(){
                            if(t.canEditRow == scope['$index']){
                               t.canEditRow = null;
                            }else{
                                //当前行在编辑状态，又点了其他行的编辑按钮
                                t.canEditRow=scope['$index'];
                            }
                        });
                    }else{
                        //新增
                        t.cellDSSubmit(t.tableData[0],'add').then(function(id){
                            if(id){
                                t.tableData[0].id = id;
                            }
                            if(t.canEditRow == scope['$index']){
                               t.canEditRow = null; 
                            }else{
                                //当前行在编辑状态，又点了其他行的编辑按钮
                                t.canEditRow=scope['$index'];
                            }
                            t.adding = false;
                        });
                    }
                }else{
                    t.canEditRow = scope['$index'];
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
                    if(index==0&&t.canEditRow==0&&t.adding){
                        //如果是正在添加的行 删除，直接splice
                        t.canEditRow = null;
                        t.tableData.splice(index,1);
                        t.adding = false;
                        t.$emit('input',t._returnStringOrArray());
                        t.$emit('change',t._returnStringOrArray());
                        t.$emit('remove',t._returnStringOrArray());
                    }else{
                        //调用删除接口
                        t.cellDSSubmit(t.tableData[index],'remove').then(function(){
                            t.canEditRow = null;
                            t.tableData.splice(index,1);
                            t.$emit('input',t._returnStringOrArray());
                            t.$emit('change',t._returnStringOrArray());
                            t.$emit('remove',t._returnStringOrArray());
                        });
                    }
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
                t.cellDSSubmit(item,'sort').then(function(){
                    t.tableData.splice(index,1);
                    t.tableData.splice(index-1,0,item);
                    t.$emit('input',t._returnStringOrArray());
                    t.$emit('change',t._returnStringOrArray());
                });
            },
            //数据向下移动
            cellDown:function(scope){
                const t = this;
                const index = scope['$index']; 
                if(index == t.tableData.length -1) {
                    return;
                }
                const item = t.tableData[index]
                t.cellDSSubmit(item,'sort').then(function(){
                    t.tableData.splice(index,1);
                    t.tableData.splice(index+1,0,item);
                    t.$emit('input',t._returnStringOrArray());
                    t.$emit('change',t._returnStringOrArray());
                });
            },
            _returnStringOrArray:function(){
                let t=this;
                if(t.returnString){
                    return JSON.stringify(t.tableData);
                }else{
                    return t.tableData;
                }
            },
            //列表静态数据筛选方法
            filterHandler(column, value, row) {
                const property = column['prop'];
                return row[property] === value;
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