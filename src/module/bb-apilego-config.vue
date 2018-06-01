<template>
    <div>
        <el-tabs v-model="p_activeName" @tab-click="tabClick">
            <el-tab-pane label="基础" name="legoInfo">
                <div class="form_item">
                    模型:
                    <bb-cascader ref="oi" :style="{display:'inline-block'}" 
                                 :casProps="casProps" :dsList="dsList"
                                 @change="oiChange"></bb-cascader>
                </div>
                <div class="form_item">
                    描述:
                    <bb-textarea :bbStyle="{width: '75%'}" v-model="apiLegoDes" @change="desChange"></bb-textarea>
                </div>
            </el-tab-pane>
            <el-tab-pane label="输入" name="inputField">
                <bb-collapse ref="_if" :activeNames="['common','read','create','update','cache','condition','unstructured','memory']"
                             :itemDs="ifItemDs" :collapseData="ifCollapseData"
                ></bb-collapse>
            </el-tab-pane>
            <el-tab-pane label="输出" name="outputField">
                <bb-collapse ref="_of" :activeNames="['common','read','create','update','cache','condition','unstructured','memory']"
                             :itemDs="ofItemDs" :collapseData="ofCollapseData"
                ></bb-collapse>
            </el-tab-pane>
        </el-tabs>

    </div>
</template>

<script>
    const IOFT = ['common', 'read', 'create', 'update', 'condition', 'cache', 'memory','unstructured']

    export default {
        name: 'bb-apilego-config',
        props: {
            activeName: {
                type: String,
                default: "legoInfo"
            }
        },
        data() {
            return {
                p_activeName: this.activeName,
                external: {},//外部参数
                casProps: {
                    "value": "alias",
                    "label": "name",
                    "children": "children"
                },
                //级联选择器配置
                dsList: [],
                apiLegoDes: '',//apilego描述
                ifItemDs: {},//输入ift类型
                ifCollapseData: [],//输入 折叠面板内容
                ofItemDs: {},//输入ift类型
                ofCollapseData: [],//输入 折叠面板内容
            }
        },
        computed: {},
        watch: {},
        mounted() {
        },
        methods: {
            //clear 清空oi 输入输出
            clearForm:function(){
                let t=this;
                t._refreshBase(true);
                t._refreshIf(true);
                t._refreshOf(true);
            },
            //刷新 基础
            _refreshBase: function (clear) {
                let t = this;
                t.dsList = [
                    {
                        "type": "ds",
                        "index": 1,
                        "isleaf": false,
                        "ds": {
                            "api": (t.$route.params.pageAlias==='ty-lego-config-self'?"config-list-ds-by-lego-alias":"ty-list-ds-by-lego-alias"),
                            "category": "config",
                            "method": "get",
                            "inputs": [
                                {
                                    "paramName": "alias",
                                    "valueType": "constant",
                                    "constant": t.external.linkage[0].data.legoAlias
                                }
                            ],
                            "outputs": [
                                {
                                    "dataKey": "formData",
                                    "valueKey": "data_list.list"
                                }
                            ]
                        }
                    },
                    {
                        "type": "ds",
                        "index": 2,
                        "isleaf": true,
                        "ds": {
                            "api": "list-oi-by-dsalias",
                            "category": "config",
                            "method": "get",
                            "inputs": [
                                {
                                    "paramName": "dsAlias",
                                    "variable": "itemVal",
                                    "valueType": "inputValueObj",
                                    "valueKey": "bb"
                                }
                            ],
                            "outputs": [
                                {
                                    "dataKey": "formData",
                                    "valueKey": "data_list.list"
                                }
                            ]
                        }
                    }
                ];
                setTimeout(function(){
                    //刷新第一列接口
                    t.$refs['oi'].getNextData(1);
                    let oiData=[];
                    if(t.external.linkage[0].data.dsAlias){
                        oiData.push(t.external.linkage[0].data.dsAlias);
                    }
                    if(t.external.linkage[0].data.oiAlias){
                        oiData.push(t.external.linkage[0].data.oiAlias);
                    }
                    t.$refs['oi'].loadValue(oiData);
                    //刷新描述
                    t.apiLegoDes = t.external.linkage[0].data.description || "";
                    if(clear){
                        t.$refs['oi'].loadValue([]);
                        t.apiLegoDes = "";
                    }
                },10);
            },
            _refreshIf: function (clear) {
                let t = this;
                t.ifItemDs = {
                    "api": "list-ifdByLegoAlias",
                    "method": "get",
                    "inputs": [
                        {
                            "paramName": "legoAlias",
                            "valueType": "constant",
                            "constant": t.external.linkage[0].data.legoAlias
                        }
                    ],
                    "outputs": [
                        {
                            "dataKey": "tableData",
                            "valueKey": "data_list",
                            "handle": "ty-data-transfer-ioft-to-alias"
                        }
                    ],
                    "category": "config"
                };
                
                t.buildIfCollopaseData();
                setTimeout(function () {
                    if(clear){
                        t.ifItemDs ={}; 
                        t.ifCollapseData = [];
                    }
                    t.$refs['_if'].buildTitle();
                }, 300)
            },
            _refreshOf: function (clear) {
                let t = this;
                t.ofItemDs = {
                    "api": "list-ofdByLegoAlias",
                    "method": "get",
                    "inputs": [
                        {
                            "paramName": "legoAlias",
                            "valueType": "constant",
                            "constant": t.external.linkage[0].data.legoAlias
                        }
                    ],
                    "outputs": [
                        {
                            "dataKey": "tableData",
                            "valueKey": "data_list",
                            "handle": "ty-data-transfer-ioft-to-alias"
                        }
                    ],
                    "category": "config"
                };
                
                t.buildOfCollopaseData();
                setTimeout(function () {
                    if(clear){
                        t.ofItemDs ={}; 
                        t.ofCollapseData = [];
                    }
                    t.$refs['_of'].buildTitle();
                }, 300)
            },
            linkage: function (...data) {
                let t = this;
                if (data) {
                    this.external['linkage'] = data;
                    //计算当前api 的apilego列表
                    if(data[2]&&data[2].realContent&&data[2].realContent.length>0){
                        let resultApiLego=[];
                        data[2].realContent.forEach(function(item,index){
                            if(item.hasOwnProperty("data")&&item.data){
                                resultApiLego.push({
                                    "text":(index+1)+"."+item.data.legoName,
                                    "value":item.data.uuid
                                });
                            }
                        });
                        t.apiLegos = resultApiLego;
                    }

                    t._refreshBase();
                    t._refreshIf();
                    t._refreshOf();
                }
            },
            //tab 点击事件
            tabClick: function () {
                let t = this;
            },
            loadChildBB: function () {
                let t = this;
                return _TY_Tool.loadChildBB(t);
            },
            oiChange: function (val, cascader) {
                let t = this;
                if(val&&val instanceof Object){
                    t.external.linkage[0].data.oiAlias = val.alias;
                    t.external.linkage[0].data.dsAlias = val.dsAlias;
                }else{
                    t.external.linkage[0].data.oiAlias = val;
                }
                // const ds = {
                //     "api": "ty-auto-generate-iof",
                //     "category": "config",
                //     "method": "post",
                //     "inputs": [
                //         {
                //             "paramName": "apiLegoId",
                //             "valueType": "constant",
                //             "constant": t.external.linkage[0].data.id
                //         },
                //         {
                //             "paramName": "oiAlias",
                //             "valueType": "constant",
                //             "constant": val
                //         }
                //     ],
                //     "outputs": []
                // };
                // _TY_Tool.getDSData(ds, _TY_Tool.buildTplParams(t), function (map) {
                //     //刷新输入 输出字段配置
                //     t._refreshIf();
                //     t._refreshOf();
                // }, function (code, msg) {
                // });
            },
            desChange: function (val, textarea) {
                let t = this;
                t.external.linkage[0].data.description = val;
                // const ds = {
                //     "api": "update-apilego-des-by-id",
                //     "category": "config",
                //     "method": "post",
                //     "inputs": [
                //         {
                //             "paramName": "description",
                //             "valueType": "constant",
                //             "constant": val
                //         },
                //         {
                //             "paramName": "id",
                //             "valueType": "constant",
                //             "constant": t.external.linkage[0].data.id
                //         }
                //     ],
                //     "outputs": []
                // };
                // _TY_Tool.getDSData(ds, _TY_Tool.buildTplParams(t), function (map) {
                // }, function (code, msg) {
                // });
            },
            _buildTitle: function (ioft) {
                let t = this;
                switch (ioft) {
                    case "common":
                        return "常用字段";
                    case "read":
                        return "读取字段";
                    case "create":
                        return "创建字段";
                    case "update":
                        return "更新字段";
                    case "condition":
                        return "条件字段";
                    case "cache":
                        return "缓存字段";
                    case "memory":
                        return "内存字段";
                    case "unstructured":
                        return "非结构字段";
                }
            },
            //ioft 在参数二中时 隐藏，其他情况显示
            _show:function(ioft,array){
                const t=this;
                if(array && array instanceof Array && array.indexOf(ioft)>=0){
                    return false;
                }
                return true;
            },
            changeFVT:function(...data){
                let t=this;
                if(data.length<4){
                    return;
                }
                const fvt = data[0];//fvt
                let bbForm = data[2].$parent.$parent;
                let preUUID = "form-item_"+data[3].uuid.replace("fvt","");
                switch(fvt){
                    case 'constant':
                        bbForm.hideAndShowFormItem([preUUID+'constant'],
                            [
                                preUUID+'requestParamName',
                                preUUID+'sessionParamName',
                                preUUID+'fromApiLegoUuid',
                                preUUID+'fromApiLegoOutputFieldAlias',
                                preUUID+'fieldTpl'
                            ]);
                        break;
                    case 'request':
                        bbForm.hideAndShowFormItem([preUUID+'requestParamName'],
                            [
                                preUUID+'constant',
                                preUUID+'sessionParamName',
                                preUUID+'fromApiLegoUuid',
                                preUUID+'fromApiLegoOutputFieldAlias',
                                preUUID+'fieldTpl'
                            ]);
                        break;
                    case 'session':
                        bbForm.hideAndShowFormItem([preUUID+'sessionParamName'],
                            [
                                preUUID+'constant',
                                preUUID+'requestParamName',
                                preUUID+'fromApiLegoUuid',
                                preUUID+'fromApiLegoOutputFieldAlias',
                                preUUID+'fieldTpl'
                            ]);
                        break;
                    case 'output':
                        bbForm.hideAndShowFormItem([preUUID+'fromApiLegoUuid',preUUID+'fromApiLegoOutputFieldAlias'],
                            [
                                preUUID+'constant',
                                preUUID+'requestParamName',
                                preUUID+'sessionParamName',
                                preUUID+'fieldTpl'
                            ]);
                        break;
                    case 'template':
                        bbForm.hideAndShowFormItem([preUUID+'fromApiLegoUuid',preUUID+'fieldTpl'],
                            [
                                preUUID+'constant',
                                preUUID+'requestParamName',
                                preUUID+'sessionParamName',
                                preUUID+'fromApiLegoOutputFieldAlias'
                            ]);
                        break;
                }
            },
            //构造bb-button-group的buttons属性
            _buildIOFTButton:function(io,ioft){
                let t=this;
                // let allData = t.external.linkage[2].realContent;
                //当前apilego
                let data = t.external.linkage[0].data;
                let result = [];
                if(io==='inputField'&&data.ifList){
                    //输入字段
                    data.ifList.forEach(function(item,index){
                        if(item.ift == ioft){
                            result.push({
                                text: item.name,
                                value: item.alias,
                                type:'primary',
                                iconName:'ty-icon_cuowu',
                                size:'small',
                                data:item
                            });
                        }
                    });
                }else if(io==='outputField'&&data.ofList){
                    //输出字段
                    data.ofList.forEach(function(item,index){
                        if(item.oft == ioft){
                            result.push({
                                text: item.name,
                                value: item.alias,
                                type:'primary',
                                iconName:'ty-icon_cuowu',
                                size:'small',
                                data:item
                            });
                        }
                    });
                }
                return result;
            },
            removeIOF:function(..._data){
                let t=this;
                let removeData = _data[0].data;
                let data = t.external.linkage[0].data;
                if(removeData.ift){
                    //输入字段
                        data.ifList.forEach(function(item,index){
                            if(item.uuid==removeData.uuid){
                                data.ifList.splice(index,1);
                                return false;
                            }
                        });
                }else if(removeData.oft){
                        data.ofList.forEach(function(item,index){
                            if(item.uuid==removeData.uuid){
                                data.ofList.splice(index,1);
                                return false;
                            }
                        });
                }
                t._refreshIf();//修改字段后，刷新整个字段
                t._refreshOf();
            },
            //保存字段  表单交互用
            saveIOF:function(..._data){
                let t=this;
                let formData = _data[0];
                let data = t.external.linkage[0].data;
                if(formData.ift){
                    //输入字段
                    if(!formData.uuid){
                        //没有uuid 表示新增
                        formData.uuid = _TY_Tool.uuidTimestamp();
                        formData.apiLegoUuid = data.uuid;
                        data.ifList.push(formData);
                    }else{
                        data.ifList.forEach(function(item,index){
                            if(item.uuid==formData.uuid){
                                data.ifList[index] = Object.assign(data.ifList[index],formData);
                                return false;
                            }
                        });
                    }
                }else if(formData.oft){
                     if(!formData.uuid){
                        //没有uuid 表示新增
                        formData.uuid = _TY_Tool.uuidTimestamp();
                        formData.apiLegoUuid = data.uuid;
                        data.ofList.push(formData);
                    }else{
                        data.ofList.forEach(function(item,index){
                            if(item.uuid==formData.uuid){
                                data.ofList[index] = Object.assign(data.ofList[index],formData);
                                return false;
                            }
                        });
                    }
                }
                t._refreshIf();//修改字段后，刷新整个字段
                t._refreshOf();
            },
            //校验级联字段是否重复 fieldConnAlias：输入字段的connectorPath  nodeConnAlias:选中的字段connectorAlias
            _checkFieldConnAliasEQNodeConnAlias:function(fieldConnAlias, nodeConnAlias){
                let t = this;
                if (!fieldConnAlias && !nodeConnAlias) {
                    return true;
                } else if (fieldConnAlias && nodeConnAlias) {
                    let fieldConn = JSON.parse(fieldConnAlias);
                    let result = '';
                    fieldConn.forEach((item, index)=> {
                        if (result) {
                            result = result + ",";
                        }
                        result = result + item.alias;
                    });
                    if (result == nodeConnAlias) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            },
            //将 connectorAlias 转换成 connectorPath [{alias:'xxx'}]
            _transferConnAliasToJsonAlias:function(connAlias){
                let t = this;
                if (connAlias) {
                    let result = [];
                    let aliasArray = connAlias.split(',');
                    aliasArray.forEach((item, index)=> {
                        result.push({
                            alias: item
                        });
                    })
                    return JSON.stringify(result);
                }
                return '';
            },
            //树形字段选择 保存方法
            saveTreeIOF:function(..._data){
                let t=this;
                let treeData = _data[0];
                const ioftType = _data[1];
                const __ioft = _data[2];
                if(!treeData){
                    return;
                }
                let data = t.external.linkage[0].data;
                if(ioftType=='ift'&&treeData.length>0){
                    //输入字段
                    const ifList = data.ifList;
                    treeData.forEach(function(item,index){
                        if(__ioft!='condition'){//条件可以选多次
                            for(let i=0;i<ifList.length;i++){
                                const _ifItem = ifList[i];
                                if(_ifItem.ift==__ioft&&_ifItem.fieldName==item.fieldName&&
                                    t._checkFieldConnAliasEQNodeConnAlias(_ifItem.connectorPath,item.connectorAlias)){
                                    //字段相同，并且连接器相同，说明是同一个字段，不能添加
                                    return true;//继续下一个forEach循环
                                }
                            }
                        }
                        //上面过滤掉相同的字段，下面添加字段到保存的数据中
                        data.ifList.push({
                            id: '',
                            uuid:_TY_Tool.uuidTimestamp(),
                            apiLegoUuid:data.uuid,
                            name: item.label,
                            fieldName: item.fieldName,
                            alias: item.fieldName,
                            fvt: __ioft != 'read' ? 'request' : '',
                            ift: __ioft,
                            ct: 'eq',
                            dt: item.dt||'string',
                            fieldTpl:'',
                            apiLegoId: data.apiLegoId,
                            connectorPath: t._transferConnAliasToJsonAlias(item.connectorAlias),
                            requestParamName: item.fieldName
                        });
                    });
                }else if(ioftType=='oft'){
                    const ofList = data.ofList;
                    treeData.forEach(function(item,index){
                        if(__ioft!='condition'){//条件可以选多次
                            for(let i=0;i<ofList.length;i++){
                                const _ofItem = ofList[i];
                                if(_ofItem.ift==__ioft&&_ofItem.fieldName==item.fieldName&&
                                    t._checkFieldConnAliasEQNodeConnAlias(_ofItem.connectorPath,item.connectorAlias)){
                                    //字段相同，并且连接器相同，说明是同一个字段，不能添加
                                    return true;//继续下一个forEach循环
                                }
                            }
                        }
                        //上面过滤掉相同的字段，下面添加字段到保存的数据中
                        data.ofList.push({
                            id: '',
                            uuid:_TY_Tool.uuidTimestamp(),
                            apiLegoUuid:data.uuid,
                            name: item.label,
                            fieldName: item.fieldName,
                            alias: item.fieldName,
                            oft: __ioft,
                            response: true,
                            apiLegoId: data.apiLegoId,
                            dt: item.dt||'string'
                        });
                    });
                }
                t._refreshIf();//修改字段后，刷新整个字段
                t._refreshOf();
            },
            saveFunIOF:function(..._data){
                let t=this;
                const funField = _data[0];
                let data = t.external.linkage[0].data;
                data.ifList.push({
                            id: '',
                            uuid:_TY_Tool.uuidTimestamp(),
                            apiLegoUuid:data.uuid,
                            name: funField.field.label+"("+funField.fun+")",
                            fieldName: funField.fun+"-"+funField.field.fieldName,
                            alias: funField.field.fieldName,
                            fvt: '',
                            ift: funField.ift,
                            ct: 'eq',
                            dt: 'string',
                            fieldTpl:'',
                            apiLegoId: data.apiLegoId,
                            connectorPath: t._transferConnAliasToJsonAlias(funField.field.connectorAlias),
                            requestParamName: ''
                        });
                t._refreshIf();//修改字段后，刷新整个字段
            },
            checkRule:function(ioft,fieldName){
                let t=this;
                if(!fieldName||!ioft){
                    return
                }
                switch(ioft){
                    case 'condition':
                        if(fieldName=='ct'){
                            return [{ 
                                required: true,
                                message: '请输入条件类型',
                                trigger: 'blur'
                            }]
                        }
                        // else if(fieldName =='fvt'){
                        //     return [{ 
                        //         required: true,
                        //         message: '请输入数据来源',
                        //         trigger: 'blur'
                        //     }]
                        // }
                        break;
                    // case 'create':
                    //     if(fieldName =='fvt'){
                    //         return [{ 
                    //             required: true,
                    //             message: '请输入数据来源',
                    //             trigger: 'blur'
                    //         }]
                    //     }
                    //     break;
                    // case 'update':
                    //     if(fieldName =='fvt'){
                    //         return [{ 
                    //             required: true,
                    //             message: '请输入数据来源',
                    //             trigger: 'blur'
                    //         }]
                    //     }
                    //     break;
                    default:
                        return [];
                }
            },
            //构建输入的 colopseData
            buildIfCollopaseData: function () {
                let t = this;
                t.ifCollapseData = [];
                for (let i in IOFT) {
                    const _ioft = IOFT[i];
                    //输入字段表单编辑
                    const formAdd = {
                                "uuid": t.external.linkage[0].data.uuid + "-if-add-" + _ioft,
                                "alias": "bb-button",
                                "aliasName": "添加" + t._buildTitle(_ioft),
                                "group": "",
                                "attributes": {
                                    "button": {
                                        "icon": "ty-icon_tianjia",
                                        "size": "small",
                                        "style": {}
                                    }
                                },
                                "animation": [],
                                "interactives": [{
                                    "uuid": "",
                                    "fromContentUUID": t.external.linkage[0].data.uuid + "-if-add-" + _ioft,
                                    "executeType": "trigger_method",
                                    "fromContentEvent": "click",
                                    "executeContentUUID": "Page_Ref_Root",
                                    "executeContentMethodName": "openDialog",
                                    "executeArgument": [
                                        {
                                            "uuid": t.external.linkage[0].data.uuid + "-if-add-form-"+_ioft,
                                            "alias": "bb-form",
                                            "aliasName": "编辑属性",
                                            "attributes": {
                                                "value":{
                                                    "dt":"string",
                                                    "ct":"eq",
                                                    "ift":_ioft,
                                                    "apiLegoUuid":t.external.linkage[0].data.uuid
                                                },
                                                "settingButtonText": "确定",
                                                "content": [
                                                    {
                                                        "uuid": t.external.linkage[0].data.uuid + "-if-add-" + _ioft + "name",
                                                        "alias": "bb-input",
                                                        "aliasName": "名称",
                                                        "group": "",
                                                        "attributes": {
                                                            "attributeName": "name",
                                                            "rules": [{ 
                                                                required: true,
                                                                message: '请输入名称',
                                                                trigger: 'blur'
                                                            }]
                                                        },
                                                        "animation": [],
                                                        "interactives": []
                                                    },
                                                    {
                                                        "uuid": t.external.linkage[0].data.uuid + "-if-add-" + _ioft + "fieldName",
                                                        "alias": "bb-input",
                                                        "aliasName": "字段名",
                                                        "group": "",
                                                        "attributes": {
                                                            "attributeName": "fieldName",
                                                            "rules": [{ 
                                                                required: true,
                                                                message: '请输入字段名',
                                                                trigger: 'blur'
                                                            }]
                                                        },
                                                        "animation": [],
                                                        "interactives": []
                                                    },
                                                    {
                                                        "uuid": t.external.linkage[0].data.uuid + "-if-add-" + _ioft + "alias",
                                                        "alias": "bb-input",
                                                        "aliasName": "别名",
                                                        "group": "",
                                                        "attributes": {
                                                            "attributeName": "alias",
                                                            "rules": [{ 
                                                                required: true,
                                                                message: '请输入别名',
                                                                trigger: 'blur'
                                                            }]
                                                        },
                                                        "animation": [],
                                                        "interactives": []
                                                    },
                                                    {
                                                        "uuid": t.external.linkage[0].data.uuid + "-if-add-" + _ioft + "ct",
                                                        "alias": "bb-select",
                                                        "aliasName": "条件类型",
                                                        "group": "",
                                                        "attributes": {
                                                            "attributeName": "ct",
                                                            "rules": t.checkRule(_ioft,'ct'),
                                                            "fields": [
                                                                {
                                                                    "text": "大于",
                                                                    "value": "gt"
                                                                },
                                                                {
                                                                    "text": "大于等于",
                                                                    "value": "ge"
                                                                },
                                                                {
                                                                    "text": "小于",
                                                                    "value": "lt"
                                                                },
                                                                {
                                                                    "text": "小于等于",
                                                                    "value": "le"
                                                                },
                                                                {
                                                                    "text": "等于",
                                                                    "value": "eq"
                                                                },
                                                                {
                                                                    "text": "不等于",
                                                                    "value": "neq"
                                                                },
                                                                {
                                                                    "text": "在什么之中",
                                                                    "value": "In"
                                                                },
                                                                {
                                                                    "text": "不在什么之中",
                                                                    "value": "notIn"
                                                                },
                                                                {
                                                                    "text": "模糊搜索",
                                                                    "value": "like"
                                                                },
                                                                {
                                                                    "text": "左链接搜索",
                                                                    "value": "leftLike"
                                                                },
                                                                {
                                                                    "text": "右链接搜索",
                                                                    "value": "rightLike"
                                                                },
                                                                {
                                                                    "text": "是",
                                                                    "value": "is"
                                                                },
                                                                {
                                                                    "text": "不是",
                                                                    "value": "isnot"
                                                                },
                                                                {
                                                                    "text": "为空",
                                                                    "value": "Null"
                                                                },
                                                                {
                                                                    "text": "不为空",
                                                                    "value": "NotNull"
                                                                },
                                                                {
                                                                    "text": "混合条件",
                                                                    "value": "Multi"
                                                                },
                                                                {
                                                                    "text": "自定义条件",
                                                                    "value": "Custom"
                                                                }
                                                            ]
                                                        },
                                                        "animation": [],
                                                        "interactives": []
                                                    },
                                                    {
                                                        "uuid": t.external.linkage[0].data.uuid + "-if-add-" + _ioft + "dt",
                                                        "alias": "bb-select",
                                                        "aliasName": "数据类型",
                                                        "group": "",
                                                        "attributes": {
                                                            "attributeName": "dt",
                                                            "rules": [],
                                                            "fields": [
                                                                {
                                                                    "text": "整数",
                                                                    "value": "int"
                                                                },
                                                                {
                                                                    "text": "浮点数",
                                                                    "value": "double"
                                                                },
                                                                {
                                                                    "text": "布尔值",
                                                                    "value": "boolean"
                                                                },
                                                                {
                                                                    "text": "字符串",
                                                                    "value": "string"
                                                                },
                                                                {
                                                                    "text": "日期",
                                                                    "value": "date"
                                                                },
                                                                {
                                                                    "text": "日期时间",
                                                                    "value": "time"
                                                                },
                                                                {
                                                                    "text": "对象",
                                                                    "value": "object"
                                                                },
                                                                {
                                                                    "text": "数组",
                                                                    "value": "array"
                                                                },
                                                                {
                                                                    "text": "文件",
                                                                    "value": "multipart"
                                                                }
                                                            ]
                                                        },
                                                        "animation": [],
                                                        "interactives": []
                                                    },
                                                    {
                                                        "uuid": t.external.linkage[0].data.uuid + "-if-add-" + _ioft + "ift",
                                                        "alias": "bb-input",
                                                        "aliasName": "输入类型",
                                                        "group": "",
                                                        "attributes": {
                                                            "attributeName": "ift",
                                                            "rules": [],
                                                            "show": false,
                                                            "value": _ioft
                                                        },
                                                        "animation": [],
                                                        "interactives": []
                                                    },
                                                    {
                                                        "uuid": t.external.linkage[0].data.uuid + "-if-add-" + _ioft + "fvt",
                                                        "alias": "bb-select",
                                                        "aliasName": "数据来源",
                                                        "group": "",
                                                        "attributes": {
                                                            "attributeName": "fvt",
                                                            "rules": t.checkRule(_ioft,'fvt'),
                                                            "fields": [
                                                                {
                                                                    "text": "无",
                                                                    "value": ""
                                                                },
                                                                {
                                                                    "text": "常量",
                                                                    "value": "constant"
                                                                },
                                                                {
                                                                    "text": "http请求",
                                                                    "value": "request"
                                                                },
                                                                {
                                                                    "text": "session会话",
                                                                    "value": "session"
                                                                },
                                                                {
                                                                    "text": "来自前一个节点",
                                                                    "value": "output"
                                                                },
                                                                {
                                                                    "text": "模板",
                                                                    "value": "template"
                                                                }
                                                            ]
                                                        },
                                                        "animation": [],
                                                        "interactives": [{
                                                            "uuid": "",
                                                                "fromContentUUID": t.external.linkage[0].data.uuid + "-if-add-" + _ioft + '-fvt',
                                                                "executeType": "trigger_method",
                                                                "fromContentEvent": "change",
                                                                "executeContentUUID": "r-00001-config",
                                                                "executeContentMethodName": "changeFVT"
                                                        }]
                                                    },
                                                    {
                                                        "uuid": t.external.linkage[0].data.uuid + "-if-add-" + _ioft + "requestParamName",
                                                        "alias": "bb-input",
                                                        "aliasName": "请求参数",
                                                        "group": "",
                                                        "attributes": {
                                                            "attributeName": "requestParamName",
                                                            "show": false,
                                                            "rules": []
                                                        },
                                                        "animation": [],
                                                        "interactives": []
                                                    },
                                                    {
                                                        "uuid": t.external.linkage[0].data.uuid + "-if-add-" + _ioft + "sessionParamName",
                                                        "alias": "bb-input",
                                                        "aliasName": "session参数",
                                                        "group": "",
                                                        "attributes": {
                                                            "attributeName": "sessionParamName",
                                                            "show": false,
                                                            "rules": []
                                                        },
                                                        "animation": [],
                                                        "interactives": []
                                                    },
                                                    {
                                                        "uuid": t.external.linkage[0].data.uuid + "-if-add-" + _ioft + "fromApiLegoUuid",
                                                        "alias": "bb-select",
                                                        "aliasName": "数据来源ID",
                                                        "group": "",
                                                        "attributes": {
                                                            "attributeName": "fromApiLegoUuid",
                                                            "rules": [],
                                                            "show": false,
                                                            "fields":t.apiLegos
                                                        },
                                                        "animation": [],
                                                        "interactives": []
                                                    },
                                                    {
                                                        "uuid": t.external.linkage[0].data.uuid + "-if-add-" + _ioft + "fromApiLegoOutputFieldAlias",
                                                        "alias": "bb-input",
                                                        "aliasName": "output参数",
                                                        "group": "",
                                                        "attributes": {
                                                            "attributeName": "fromApiLegoOutputFieldAlias",
                                                            "show": false,
                                                            "rules": []
                                                        },
                                                        "animation": [],
                                                        "interactives": []
                                                    },
                                                    {
                                                        "uuid": t.external.linkage[0].data.uuid + "-if-add-" + _ioft + "constant",
                                                        "alias": "bb-input",
                                                        "aliasName": "常量值",
                                                        "group": "",
                                                        "attributes": {
                                                            "attributeName": "constant",
                                                            "show": false,
                                                            "rules": []
                                                        },
                                                        "animation": [],
                                                        "interactives": []
                                                    },
                                                    {
                                                        "uuid": t.external.linkage[0].data.uuid + "-if-add-" + _ioft + "fieldTpl",
                                                        "alias": "bb-input",
                                                        "aliasName": "模板TPL",
                                                        "group": "",
                                                        "attributes": {
                                                            "attributeName": "fieldTpl",
                                                            "show": false,
                                                            "rules": []
                                                        },
                                                        "animation": [],
                                                        "interactives": []
                                                    },
                                                    {
                                                        "uuid": t.external.linkage[0].data.uuid + "-if-add-" + _ioft + '-validate',
                                                        "alias": "bb-list",
                                                        "aliasName": "数据校验",
                                                        "group": "",
                                                        "attributes": {
                                                            "attributeName": "validate",
                                                            "rules": [],
                                                            "returnString": true,
                                                            "editConfig": {
                                                                "editable": [
                                                                    "add",
                                                                    "edit",
                                                                    "remove"
                                                                ]
                                                            },
                                                            "columns": [
                                                                {
                                                                    "prop": "validateName",
                                                                    "label": "检验名称",
                                                                    "et": "bb-select",
                                                                    "etProp": {
                                                                        textField: 'name',
                                                                        valueField: 'alias',
                                                                        ds: {
                                                                            "api": "list-validate",
                                                                            "category": "config",
                                                                            "method": "post",
                                                                            "inputs": [],
                                                                            "outputs": [{
                                                                                "dataKey": "fields",
                                                                                "valueKey": "data_list"
                                                                            }]
                                                                        }
                                                                    }
                                                                },
                                                                {
                                                                    "prop": "params",
                                                                    "label": "检验参数",
                                                                    "et": "bb-input"
                                                                }
                                                            ],
                                                            "border": true
                                                        },
                                                        "animation": [],
                                                        "interactives": []
                                                    },
                                                    {
                                                        "uuid": t.external.linkage[0].data.uuid + "-if-add-" + _ioft + "connectorPath",
                                                        "alias": "bb-input",
                                                        "aliasName": "连接器",
                                                        "group": "",
                                                        "attributes": {
                                                            "attributeName": "connectorPath",
                                                            "rules": []
                                                        },
                                                        "animation": [],
                                                        "interactives": []
                                                    },
                                                    {
                                                        "uuid": t.external.linkage[0].data.uuid + "-if-add-" + _ioft + "description",
                                                        "alias": "bb-textarea",
                                                        "aliasName": "描述",
                                                        "group": "",
                                                        "attributes": {
                                                            "attributeName": "description",
                                                            "rules": []
                                                        },
                                                        "animation": [],
                                                        "interactives": []
                                                    }
                                                ]
                                            },
                                            "animation": [
                                                {}
                                            ],
                                            "interactives": [
                                                {
                                                        "uuid": "",
                                                        "fromContentUUID": t.external.linkage[0].data.uuid + "-if-add-form-"+_ioft,
                                                        "executeType": "trigger_method",
                                                        "fromContentEvent": "commit",
                                                        "executeContentUUID": "r-00001-config",
                                                        "executeContentMethodName": "saveIOF"
                                                    },
                                                    {
                                                        "uuid": "",
                                                        "fromContentUUID": t.external.linkage[0].data.uuid + "-if-form-"+_ioft,
                                                        "executeType": "trigger_method",
                                                        "fromContentEvent": "commit",
                                                        "executeContentUUID": "Page_Ref_Root",
                                                        "executeContentMethodName": "closeDialog"
                                                    }
                                            ],
                                            "layout": {}
                                        }
                                    ]
                                }]
                            };
                    //输入字段字段选择
                    const treeAdd ={
                                "uuid": t.external.linkage[0].data.uuid + "-if-tree-add-" + _ioft,
                                "alias": "bb-button",
                                "aliasName": "添加" + t._buildTitle(_ioft),
                                "group": "",
                                "attributes": {
                                    "button": {
                                        "icon": "ty-icon_tianjia",
                                        "size": "small",
                                        "style": {}
                                    }
                                },
                                "animation": [],
                                "interactives": [{
                                    "uuid": "",
                                    "fromContentUUID": t.external.linkage[0].data.uuid + "-if-tree-add-" + _ioft,
                                    "executeType": "trigger_method",
                                    "fromContentEvent": "click",
                                    "executeContentUUID": "Page_Ref_Root",
                                    "executeContentMethodName": "openDialog",
                                    "executeArgument": [
                                        {
                                            "uuid": t.external.linkage[0].data.uuid + "-if-tree-add-form-"+_ioft,
                                            "alias": "bb-field-tree-select",
                                            "aliasName": "选择属性",
                                            "attributes": {
                                                "multiple":true,
                                                "ioftType":'ift',
                                                "ioft":_ioft,
                                                "checkedField":"<%var vals = _TY_Root._TY_Current_Edit_Item.data.ifList;var result=[];for(var i=0;i<vals.length;i++){(vals[i].ift=='"+_ioft+"')&&result.push(vals[i].fieldName);}print(JSON.stringify(result));%>"
                                                // "value":{
                                                //     "ct":"eq",
                                                //     "ift":_ioft,
                                                //     "apiLegoUuid":t.external.linkage[0].data.uuid
                                                // },
                                            },
                                            "animation": [
                                                {}
                                            ],
                                            "interactives": [
                                                {
                                                        "uuid": "",
                                                        "fromContentUUID": t.external.linkage[0].data.uuid + "-if-tree-add-form-"+_ioft,
                                                        "executeType": "trigger_method",
                                                        "fromContentEvent": "tree-commit",
                                                        "executeContentUUID": "r-00001-config",
                                                        "executeContentMethodName": "saveTreeIOF"
                                                    },
                                                    {
                                                        "uuid": "",
                                                        "fromContentUUID": t.external.linkage[0].data.uuid + "-if-tree-add-form-"+_ioft,
                                                        "executeType": "trigger_method",
                                                        "fromContentEvent": "tree-commit",
                                                        "executeContentUUID": "Page_Ref_Root",
                                                        "executeContentMethodName": "closeDialog"
                                                    }
                                            ],
                                            "layout": {}
                                        }
                                    ]
                                }]
                    }

                    const funAdd = {
                                "uuid": t.external.linkage[0].data.uuid + "-if-fun-add-" + _ioft,
                                "alias": "bb-button",
                                "aliasName": "添加" + t._buildTitle(_ioft),
                                "group": "",
                                "attributes": {
                                    "button": {
                                        "icon": "ty-icon_tianjia",
                                        "size": "small",
                                        "text":"Fn",
                                        "style": {}
                                    }
                                },
                                "animation": [],
                                "interactives": [{
                                    "uuid": "",
                                    "fromContentUUID": t.external.linkage[0].data.uuid + "-if-fun-add-" + _ioft,
                                    "executeType": "trigger_method",
                                    "fromContentEvent": "click",
                                    "executeContentUUID": "Page_Ref_Root",
                                    "executeContentMethodName": "openDialog",
                                    "executeArgument": [
                                        {
                                            "uuid": t.external.linkage[0].data.uuid + "-if-fun-add-form-"+_ioft,
                                            "alias": "bb-form",
                                            "aliasName": "编辑属性",
                                            "attributes": {
                                                "value":{
                                                    "ct":"eq",
                                                    "ift":_ioft,
                                                    "apiLegoUuid":t.external.linkage[0].data.uuid
                                                },
                                                "settingButtonText": "确定",
                                                "content": [
                                                    {
                                                        "uuid": t.external.linkage[0].data.uuid + "-if-fun-add-" + _ioft + "fun",
                                                        "alias": "bb-select",
                                                        "aliasName": "函数",
                                                        "group": "",
                                                        "attributes": {
                                                            "attributeName": "fun",
                                                            "rules": [{ 
                                                                required: true,
                                                                message: '请选择函数',
                                                                trigger: 'blur'
                                                            }],
                                                            "filterable":true,
                                                            "fields": [{
                                                                text: "总数(count)",
                                                                value: "count",
                                                            }, {
                                                                text: "最大值(max)",
                                                                value: "max",
                                                            }, {
                                                                text: "最小值(min)",
                                                                value: "min",
                                                            }, {
                                                                text: "总和(sum)",
                                                                value: "sum",
                                                            }]
                                                        },
                                                        "animation": [],
                                                        "interactives": []
                                                    },
                                                    {
                                                        "uuid": t.external.linkage[0].data.uuid + "-if-fun-add-" + _ioft + "field",
                                                        "alias": "bb-field-tree-pop-select",
                                                        "aliasName": "字段名",
                                                        "group": "",
                                                        "attributes": {
                                                            "attributeName": "field",
                                                            "rules": [{ 
                                                                required: true,
                                                                message: '请选择字段',
                                                                trigger: 'blur'
                                                            }]
                                                        },
                                                        "animation": [],
                                                        "interactives": []
                                                    }
                                                ]
                                            },
                                            "animation": [
                                                {}
                                            ],
                                            "interactives": [
                                                {
                                                        "uuid": "",
                                                        "fromContentUUID": t.external.linkage[0].data.uuid + "-if-fun-add-form-"+_ioft,
                                                        "executeType": "trigger_method",
                                                        "fromContentEvent": "commit",
                                                        "executeContentUUID": "r-00001-config",
                                                        "executeContentMethodName": "saveFunIOF"
                                                    },
                                                    {
                                                        "uuid": "",
                                                        "fromContentUUID": t.external.linkage[0].data.uuid + "-if-fun-form-"+_ioft,
                                                        "executeType": "trigger_method",
                                                        "fromContentEvent": "commit",
                                                        "executeContentUUID": "Page_Ref_Root",
                                                        "executeContentMethodName": "closeDialog"
                                                    }
                                            ],
                                            "layout": {}
                                        }
                                    ]
                                }]
                            };

                    const fvtCode = `
                        var bbForm = t.$children[0].$children[0];
                        var preUUID = 'form-item_${t.external.linkage[0].data.uuid}-if-${_ioft}-';
                        switch (_TY_Root._TY_args[0].data.fvt) {
                            case 'constant':
                                bbForm.hideAndShowFormItem([preUUID + 'constant'], [
                                    preUUID + 'requestParamName',
                                    preUUID + 'sessionParamName',
                                    preUUID + 'fromApiLegoUuid',
                                    preUUID + 'fromApiLegoOutputFieldAlias',
                                    preUUID + 'fieldTpl'
                                ]);
                                break;
                            case 'request':
                                bbForm.hideAndShowFormItem([preUUID + 'requestParamName'], [
                                    preUUID + 'constant',
                                    preUUID + 'sessionParamName',
                                    preUUID + 'fromApiLegoUuid',
                                    preUUID + 'fromApiLegoOutputFieldAlias',
                                    preUUID + 'fieldTpl'
                                ]);
                                break;
                            case 'session':
                                bbForm.hideAndShowFormItem([preUUID + 'sessionParamName'], [
                                    preUUID + 'constant',
                                    preUUID + 'requestParamName',
                                    preUUID + 'fromApiLegoUuid',
                                    preUUID + 'fromApiLegoOutputFieldAlias',
                                    preUUID + 'fieldTpl'
                                ]);
                                break;
                            case 'output':
                                bbForm.hideAndShowFormItem([preUUID + 'fromApiLegoUuid', preUUID + 'fromApiLegoOutputFieldAlias'], [
                                    preUUID + 'constant',
                                    preUUID + 'requestParamName',
                                    preUUID + 'sessionParamName',
                                    preUUID + 'fieldTpl'
                                ]);
                                break;
                            case 'template':
                                bbForm.hideAndShowFormItem([preUUID + 'fromApiLegoUuid', preUUID + 'fieldTpl'], [
                                    preUUID + 'constant',
                                    preUUID + 'requestParamName',
                                    preUUID + 'sessionParamName',
                                    preUUID + 'fromApiLegoOutputFieldAlias'
                                ]);
                                break;
                            default :
                                bbForm.hideAndShowFormItem([], [
                                    preUUID + 'constant',
                                    preUUID + 'requestParamName',
                                    preUUID + 'sessionParamName',
                                    preUUID + 'fromApiLegoOutputFieldAlias',
                                    preUUID + 'fromApiLegoUuid',
                                    preUUID + 'fieldTpl'
                                ]);
                        }`;

                    let item = {
                        title: t._buildTitle(_ioft),
                        name: _ioft,
                        "content": [
                            {
                                "uuid": t.external.linkage[0].data.uuid + "-if-" + _ioft,
                                "alias": "bb-button-group",
                                "aliasName": t._buildTitle(_ioft),
                                "attributes": {
                                    "buttons":t._buildIOFTButton('inputField',_ioft)
                                },
                                "animation": [],
                                "interactives": [
                                    {
                                        "uuid": "",
                                        "fromContentUUID": t.external.linkage[0].data.uuid + "-if-" + _ioft,
                                        "executeType": "trigger_method",
                                        "fromContentEvent": "click",
                                        "executeContentUUID": "Page_Ref_Root",
                                        "executeContentMethodName": "openDialog",
                                        "executeArgument": [
                                            {
                                                "uuid": t.external.linkage[0].data.uuid + "-if-form-"+_ioft,
                                                "alias": "bb-form",
                                                "aliasName": "编辑属性",
                                                "attributes": {
                                                    "settingButtonText": "确定",
                                                    "defaultValTpl":"<%=JSON.stringify(_TY_Root._TY_args[0].data)%>",
                                                    "content": [
                                                        {
                                                            "uuid": t.external.linkage[0].data.uuid + "-if-" + _ioft + '-name',
                                                            "alias": "bb-input",
                                                            "aliasName": "名称",
                                                            "group": "",
                                                            "attributes": {
                                                                "attributeName": "name",
                                                                "rules": [{ 
                                                                    required: true,
                                                                    message: '请输入名称',
                                                                    trigger: 'blur'
                                                                }]
                                                            },
                                                            "animation": [],
                                                            "interactives": []
                                                        },
                                                        {
                                                            "uuid": t.external.linkage[0].data.uuid + "-if-" + _ioft + '-fieldName',
                                                            "alias": "bb-input",
                                                            "aliasName": "字段名",
                                                            "group": "",
                                                            "attributes": {
                                                                "attributeName": "fieldName",
                                                                "rules": [{ 
                                                                    required: true,
                                                                    message: '请输入字段名',
                                                                    trigger: 'blur'
                                                                }]
                                                            },
                                                            "animation": [],
                                                            "interactives": []
                                                        },
                                                        {
                                                            "uuid": t.external.linkage[0].data.uuid + "-if-" + _ioft + '-alias',
                                                            "alias": "bb-input",
                                                            "aliasName": "别名",
                                                            "group": "",
                                                            "attributes": {
                                                                "attributeName": "alias",
                                                                "rules": [{ 
                                                                    required: true,
                                                                    message: '请输入别名',
                                                                    trigger: 'blur'
                                                                }]
                                                            },
                                                            "animation": [],
                                                            "interactives": []
                                                        },
                                                        {
                                                            "uuid": t.external.linkage[0].data.uuid + "-if-" + _ioft + '-ct',
                                                            "alias": "bb-select",
                                                            "aliasName": "条件类型",
                                                            "group": "",
                                                            "attributes": {
                                                                "attributeName": "ct",
                                                                "rules": t.checkRule(_ioft,'ct'),
                                                                "show":t._show(_ioft,["read","create","update"]),
                                                                "fields": [
                                                                    {
                                                                        "text": "大于",
                                                                        "value": "gt"
                                                                    },
                                                                    {
                                                                        "text": "大于等于",
                                                                        "value": "ge"
                                                                    },
                                                                    {
                                                                        "text": "小于",
                                                                        "value": "lt"
                                                                    },
                                                                    {
                                                                        "text": "小于等于",
                                                                        "value": "le"
                                                                    },
                                                                    {
                                                                        "text": "等于",
                                                                        "value": "eq"
                                                                    },
                                                                    {
                                                                        "text": "不等于",
                                                                        "value": "neq"
                                                                    },
                                                                    {
                                                                        "text": "在什么之中",
                                                                        "value": "In"
                                                                    },
                                                                    {
                                                                        "text": "不在什么之中",
                                                                        "value": "notIn"
                                                                    },
                                                                    {
                                                                        "text": "模糊搜索",
                                                                        "value": "like"
                                                                    },
                                                                    {
                                                                        "text": "左链接搜索",
                                                                        "value": "leftLike"
                                                                    },
                                                                    {
                                                                        "text": "右链接搜索",
                                                                        "value": "rightLike"
                                                                    },
                                                                    {
                                                                        "text": "是",
                                                                        "value": "is"
                                                                    },
                                                                    {
                                                                        "text": "不是",
                                                                        "value": "isnot"
                                                                    },
                                                                    {
                                                                        "text": "为空",
                                                                        "value": "Null"
                                                                    },
                                                                    {
                                                                        "text": "不为空",
                                                                        "value": "NotNull"
                                                                    },
                                                                    {
                                                                        "text": "混合条件",
                                                                        "value": "Multi"
                                                                    },
                                                                    {
                                                                        "text": "自定义条件",
                                                                        "value": "Custom"
                                                                    }
                                                                ]
                                                            },
                                                            "animation": [],
                                                            "interactives": []
                                                        },
                                                        {
                                                            "uuid": t.external.linkage[0].data.uuid + "-if-" + _ioft + '-dt',
                                                            "alias": "bb-select",
                                                            "aliasName": "数据类型",
                                                            "group": "",
                                                            "attributes": {
                                                                "attributeName": "dt",
                                                                "rules": [],
                                                                "show":t._show(_ioft,["read","create","update","condition","cache"]),
                                                                "fields": [
                                                                    {
                                                                        "text": "整数",
                                                                        "value": "int"
                                                                    },
                                                                    {
                                                                        "text": "浮点数",
                                                                        "value": "double"
                                                                    },
                                                                    {
                                                                        "text": "布尔值",
                                                                        "value": "boolean"
                                                                    },
                                                                    {
                                                                        "text": "字符串",
                                                                        "value": "string"
                                                                    },
                                                                    {
                                                                        "text": "日期",
                                                                        "value": "date"
                                                                    },
                                                                    {
                                                                        "text": "日期时间",
                                                                        "value": "time"
                                                                    },
                                                                    {
                                                                        "text": "对象",
                                                                        "value": "object"
                                                                    },
                                                                    {
                                                                        "text": "数组",
                                                                        "value": "array"
                                                                    },
                                                                    {
                                                                        "text": "文件",
                                                                        "value": "multipart"
                                                                    }
                                                                ]
                                                            },
                                                            "animation": [],
                                                            "interactives": []
                                                        },
                                                        {
                                                            "uuid": t.external.linkage[0].data.uuid + "-if-" + _ioft + '-ift',
                                                            "alias": "bb-input",
                                                            "aliasName": "输入类型",
                                                            "group": "",
                                                            "attributes": {
                                                                "attributeName": "ift",
                                                                "rules": [],
                                                                "show": false,
                                                                "value": _ioft
                                                            },
                                                            "animation": [],
                                                            "interactives": []
                                                        },
                                                        {
                                                            "uuid": t.external.linkage[0].data.uuid + "-if-" + _ioft + '-fvt',
                                                            "alias": "bb-select",
                                                            "aliasName": "数据来源",
                                                            "group": "",
                                                            "attributes": {
                                                                "attributeName": "fvt",
                                                                "rules": t.checkRule(_ioft,'fvt'),
                                                                "show":t._show(_ioft,["read"]),
                                                                "fields": [
                                                                    {
                                                                        "text": "无",
                                                                        "value": ""
                                                                    },
                                                                    {
                                                                        "text": "常量",
                                                                        "value": "constant"
                                                                    },
                                                                    {
                                                                        "text": "http请求",
                                                                        "value": "request"
                                                                    },
                                                                    {
                                                                        "text": "session会话",
                                                                        "value": "session"
                                                                    },
                                                                    {
                                                                        "text": "来自前一个节点",
                                                                        "value": "output"
                                                                    },
                                                                    {
                                                                        "text": "模板",
                                                                        "value": "template"
                                                                    }
                                                                ]
                                                            },
                                                            "animation": [],
                                                            "interactives": [{
                                                                "uuid": "",
                                                                "fromContentUUID": t.external.linkage[0].data.uuid + "-if-" + _ioft + '-fvt',
                                                                "executeType": "trigger_method",
                                                                "fromContentEvent": "change",
                                                                "executeContentUUID": "r-00001-config",
                                                                "executeContentMethodName": "changeFVT"
                                                            }]
                                                        },
                                                        {
                                                            "uuid": t.external.linkage[0].data.uuid + "-if-" + _ioft + '-requestParamName',
                                                            "alias": "bb-input",
                                                            "aliasName": "请求参数",
                                                            "group": "",
                                                            "attributes": {
                                                                "attributeName": "requestParamName",
                                                                "rules": [],
                                                                 "show":t._show(_ioft,["read"]),
                                                            },
                                                            "animation": [],
                                                            "interactives": []
                                                        },
                                                        {
                                                            "uuid": t.external.linkage[0].data.uuid + "-if-" + _ioft + '-sessionParamName',
                                                            "alias": "bb-input",
                                                            "aliasName": "session参数",
                                                            "group": "",
                                                            "attributes": {
                                                                "attributeName": "sessionParamName",
                                                                "rules": [],
                                                                 "show":t._show(_ioft,["read"]),
                                                            },
                                                            "animation": [],
                                                            "interactives": []
                                                        },
                                                        {
                                                            "uuid": t.external.linkage[0].data.uuid + "-if-" + _ioft + '-fromApiLegoUuid',
                                                            "alias": "bb-select",
                                                            "aliasName": "数据来源ID",
                                                            "group": "",
                                                            "attributes": {
                                                                "attributeName": "fromApiLegoUuid",
                                                                "rules": [],
                                                                "fields":t.apiLegos,
                                                                 "show":t._show(_ioft,["read"]),
                                                            },
                                                            "animation": [],
                                                            "interactives": []
                                                        },
                                                        {
                                                            "uuid": t.external.linkage[0].data.uuid + "-if-" + _ioft + '-fromApiLegoOutputFieldAlias',
                                                            "alias": "bb-input",
                                                            "aliasName": "output参数",
                                                            "group": "",
                                                            "attributes": {
                                                                "attributeName": "fromApiLegoOutputFieldAlias",
                                                                "rules": [],
                                                                 "show":t._show(_ioft,["read"]),
                                                            },
                                                            "animation": [],
                                                            "interactives": []
                                                        },
                                                        {
                                                            "uuid": t.external.linkage[0].data.uuid + "-if-" + _ioft + '-constant',
                                                            "alias": "bb-input",
                                                            "aliasName": "常量值",
                                                            "group": "",
                                                            "attributes": {
                                                                "attributeName": "constant",
                                                                "rules": [],
                                                                 "show":t._show(_ioft,["read"]),
                                                            },
                                                            "animation": [],
                                                            "interactives": []
                                                        },
                                                        {
                                                            "uuid": t.external.linkage[0].data.uuid + "-if-" + _ioft + '-fieldTpl',
                                                            "alias": "bb-input",
                                                            "aliasName": "模板TPL",
                                                            "group": "",
                                                            "attributes": {
                                                                "attributeName": "fieldTpl",
                                                                "rules": [],
                                                                 "show":t._show(_ioft,["read"]),
                                                            },
                                                            "animation": [],
                                                            "interactives": []
                                                        },
                                                        {
                                                            "uuid": t.external.linkage[0].data.uuid + "-if-" + _ioft + '-validate',
                                                            "alias": "bb-list",
                                                            "aliasName": "数据校验",
                                                            "group": "",
                                                            "attributes": {
                                                                "attributeName": "validate",
                                                                "rules": [],
                                                                "returnString": true,
                                                                "editConfig": {
                                                                    "editable": [
                                                                        "add",
                                                                        "edit",
                                                                        "remove"
                                                                    ]
                                                                },
                                                                "columns": [
                                                                    {
                                                                        "prop": "validateName",
                                                                        "label": "检验名称",
                                                                        "et": "bb-select",
                                                                        "etProp": {
                                                                            textField: 'name',
                                                                            valueField: 'alias',
                                                                            ds: {
                                                                                "api": "list-validate",
                                                                                "category": "config",
                                                                                "method": "post",
                                                                                "inputs": [],
                                                                                "outputs": [{
                                                                                    "dataKey": "fields",
                                                                                    "valueKey": "data_list"
                                                                                }]
                                                                            }
                                                                        }
                                                                    },
                                                                    {
                                                                        "prop": "params",
                                                                        "label": "检验参数",
                                                                        "et": "bb-input"
                                                                    }
                                                                ],
                                                                "border": true
                                                            },
                                                            "animation": [],
                                                            "interactives": []
                                                        },
                                                        {
                                                            "uuid": t.external.linkage[0].data.uuid + "-if-" + _ioft + '-connectorPath',
                                                            "alias": "bb-input",
                                                            "aliasName": "连接器",
                                                            "group": "",
                                                            "attributes": {
                                                                "attributeName": "connectorPath",
                                                                "rules": [],
                                                                "show":false
                                                            },
                                                            "animation": [],
                                                            "interactives": []
                                                        },
                                                        {
                                                            "uuid": t.external.linkage[0].data.uuid + "-if-" + _ioft + '-description',
                                                            "alias": "bb-textarea",
                                                            "aliasName": "描述",
                                                            "group": "",
                                                            "attributes": {
                                                                "attributeName": "description",
                                                                "rules": []
                                                            },
                                                            "animation": [],
                                                            "interactives": []
                                                        }
                                                    ]
                                                },
                                                "animation": [
                                                    {}
                                                ],
                                                "interactives": [
                                                    {
                                                        "uuid": "",
                                                        "fromContentUUID": t.external.linkage[0].data.uuid + "-if-form-"+_ioft,
                                                        "executeType": "trigger_method",
                                                        "fromContentEvent": "commit",
                                                        "executeContentUUID": "r-00001-config",
                                                        "executeContentMethodName": "saveIOF"
                                                    },
                                                    {
                                                        "uuid": "",
                                                        "fromContentUUID": t.external.linkage[0].data.uuid + "-if-form-"+_ioft,
                                                        "executeType": "trigger_method",
                                                        "fromContentEvent": "commit",
                                                        "executeContentUUID": "Page_Ref_Root",
                                                        "executeContentMethodName": "closeDialog"
                                                    },
                                                    {
                                                        "uuid": "",
                                                        "fromContentUUID": t.external.linkage[0].data.uuid + "-if-form-"+_ioft,
                                                        "executeType": "trigger_method",
                                                        "fromContentEvent": "bb-mounted",
                                                        "executeContentUUID": "Page_Ref_Root",
                                                        "executeContentMethodName": "",//给一个不存在的方法
                                                        "executeArgument":fvtCode//动态改变item的影藏和显示
                                                    }
                                                ],
                                                "layout": {}
                                            }
                                        ]
                                    },
                                    {
                                        "uuid": "",
                                        "fromContentUUID": t.external.linkage[0].data.uuid + "-if-" + _ioft,
                                        "executeType": "trigger_method",
                                        "fromContentEvent": "remove",
                                        "executeContentUUID": "r-00001-config",
                                        "executeContentMethodName": "removeIOF"
                                    }
                                ]
                            }
                        ]
                    };
                    if(_ioft=='common'||_ioft=='cache'||_ioft=='memory'||_ioft=='unstructured'){
                        item.content.push(formAdd);
                    }else{
                        item.content.push(treeAdd);
                    }
                    if(_ioft=='read'){
                        item.content.push(funAdd);
                    }
                    t.ifCollapseData.push(item);
                }
            },
            //构建输出的 colopseData
            buildOfCollopaseData: function () {
                let t = this;
                t.ofCollapseData = [];
                for (let i in IOFT) {
                    const _ioft = IOFT[i];

                    //输出字段表单输入
                    const formAddOf={
                                "uuid": t.external.linkage[0].data.uuid + "-of-add-" + _ioft,
                                "alias": "bb-button",
                                "aliasName": "添加" + t._buildTitle(_ioft),
                                "group": "",
                                "attributes": {
                                    "button": {
                                        "icon": "ty-icon_tianjia",
                                        "size": "small",
                                        "style": {}
                                    }
                                },
                                "animation": [],
                                "interactives": [{
                                    "uuid": "",
                                    "fromContentUUID": t.external.linkage[0].data.uuid + "-of-add-" + _ioft,
                                    "executeType": "trigger_method",
                                    "fromContentEvent": "click",
                                    "executeContentUUID": "Page_Ref_Root",
                                    "executeContentMethodName": "openDialog",
                                    "executeArgument": [
                                        {
                                            "uuid": t.external.linkage[0].data.uuid + "-of-add-form-"+_ioft,
                                            "alias": "bb-form",
                                            "aliasName": "编辑属性",
                                            "attributes": {
                                                "value":{
                                                    "dt":"string",
                                                    "response":false,
                                                    "oft":_ioft
                                                },
                                                "settingButtonText": "确定",
                                                "content": [
                                                    {
                                                        "uuid": t.external.linkage[0].data.uuid + "-of-add-" + _ioft + "name",
                                                        "alias": "bb-input",
                                                        "aliasName": "名称",
                                                        "group": "",
                                                        "attributes": {
                                                            "attributeName": "name",
                                                            "rules": [{ 
                                                                    required: true,
                                                                    message: '请输入名称',
                                                                    trigger: 'blur'
                                                                }]
                                                        },
                                                        "animation": [],
                                                        "interactives": []
                                                    },
                                                    {
                                                        "uuid": t.external.linkage[0].data.uuid + "-of-add-" + _ioft + "fieldName",
                                                        "alias": "bb-input",
                                                        "aliasName": "字段名",
                                                        "group": "",
                                                        "attributes": {
                                                            "attributeName": "fieldName",
                                                            "rules": [{ 
                                                                    required: true,
                                                                    message: '请输入字段名',
                                                                    trigger: 'blur'
                                                                }]
                                                        },
                                                        "animation": [],
                                                        "interactives": []
                                                    },
                                                    {
                                                        "uuid": t.external.linkage[0].data.uuid + "-of-add-" + _ioft + "alias",
                                                        "alias": "bb-input",
                                                        "aliasName": "别名",
                                                        "group": "",
                                                        "attributes": {
                                                            "attributeName": "alias",
                                                            "rules": [{ 
                                                                    required: true,
                                                                    message: '请输入别名',
                                                                    trigger: 'blur'
                                                                }]
                                                        },
                                                        "animation": [],
                                                        "interactives": []
                                                    },
                                                    {
                                                        "uuid": t.external.linkage[0].data.uuid + "-of-add-" + _ioft + "dt",
                                                        "alias": "bb-select",
                                                        "aliasName": "数据类型",
                                                        "group": "",
                                                        "attributes": {
                                                            "attributeName": "dt",
                                                            "rules": [],
                                                            "fields": [
                                                                {
                                                                    "text": "整数",
                                                                    "value": "int"
                                                                },
                                                                {
                                                                    "text": "浮点数",
                                                                    "value": "double"
                                                                },
                                                                {
                                                                    "text": "布尔值",
                                                                    "value": "boolean"
                                                                },
                                                                {
                                                                    "text": "字符串",
                                                                    "value": "string"
                                                                },
                                                                {
                                                                    "text": "日期",
                                                                    "value": "date"
                                                                },
                                                                {
                                                                    "text": "日期时间",
                                                                    "value": "time"
                                                                },
                                                                {
                                                                    "text": "对象",
                                                                    "value": "object"
                                                                },
                                                                {
                                                                    "text": "数组",
                                                                    "value": "array"
                                                                },
                                                                {
                                                                    "text": "文件",
                                                                    "value": "multipart"
                                                                }
                                                            ]
                                                        },
                                                        "animation": [],
                                                        "interactives": []
                                                    },
                                                    {
                                                        "uuid": t.external.linkage[0].data.uuid + "-of-add-" + _ioft + "oft",
                                                        "alias": "bb-input",
                                                        "aliasName": "输出类型",
                                                        "group": "",
                                                        "attributes": {
                                                            "attributeName": "oft",
                                                            "rules": [],
                                                            "show": false,
                                                            "value": _ioft
                                                        },
                                                        "animation": [],
                                                        "interactives": []
                                                    },
                                                    {
                                                        "uuid": t.external.linkage[0].data.uuid + "-of-add-" + _ioft + '-response',
                                                        "alias": "bb-editor-switch",
                                                        "aliasName": "返回客户端",
                                                        "group": "",
                                                        "attributes": {
                                                            "attributeName": "response",
                                                            "rules": []
                                                        },
                                                        "animation": [],
                                                        "interactives": []
                                                    },
                                                    {
                                                        "uuid": t.external.linkage[0].data.uuid + "-of-add-" + _ioft + '-handle',
                                                        "alias": "bb-list",
                                                        "aliasName": "数据处理",
                                                        "group": "",
                                                        "attributes": {
                                                            "attributeName": "handle",
                                                            "rules": [],
                                                            "returnString": true,
                                                            "editConfig": {
                                                                "editable": [
                                                                    "add",
                                                                    "edit",
                                                                    "remove"
                                                                ]
                                                            },
                                                            "columns": [
                                                                {
                                                                    "prop": "handleName",
                                                                    "label": "数据处理名称",
                                                                    "et": "bb-select",
                                                                    "etProp": {
                                                                        textField: 'name',
                                                                        valueField: 'alias',
                                                                        ds: {
                                                                            "api": "list-handle",
                                                                            "category": "config",
                                                                            "method": "post",
                                                                            "inputs": [],
                                                                            "outputs": [{
                                                                                "dataKey": "fields",
                                                                                "valueKey": "data_list"
                                                                            }]
                                                                        }
                                                                    }
                                                                },
                                                                {
                                                                    "prop": "params",
                                                                    "label": "处理参数",
                                                                    "et": "bb-input"
                                                                }
                                                            ],
                                                            "border": true
                                                        },
                                                        "animation": [],
                                                        "interactives": []
                                                    },

                                                    {
                                                        "uuid": t.external.linkage[0].data.uuid + "-of-add-" + _ioft + "description",
                                                        "alias": "bb-textarea",
                                                        "aliasName": "描述",
                                                        "group": "",
                                                        "attributes": {
                                                            "attributeName": "description",
                                                            "rules": []
                                                        },
                                                        "animation": [],
                                                        "interactives": []
                                                    }
                                                ]
                                            },
                                            "animation": [
                                                {}
                                            ],
                                            "interactives": [
                                                    {
                                                        "uuid": "",
                                                        "fromContentUUID": t.external.linkage[0].data.uuid + "-of-add-form-"+_ioft,
                                                        "executeType": "trigger_method",
                                                        "fromContentEvent": "commit",
                                                        "executeContentUUID": "r-00001-config",
                                                        "executeContentMethodName": "saveIOF"
                                                    },
                                                    {
                                                        "uuid": "",
                                                        "fromContentUUID": t.external.linkage[0].data.uuid + "-of-form-"+_ioft,
                                                        "executeType": "trigger_method",
                                                        "fromContentEvent": "commit",
                                                        "executeContentUUID": "Page_Ref_Root",
                                                        "executeContentMethodName": "closeDialog"
                                                    }
                                            ],
                                            "layout": {}
                                        }
                                    ]
                                }]
                            };

                    //输出字段字段选择
                    const treeAddOf ={
                        "uuid": t.external.linkage[0].data.uuid + "-of-tree-add-" + _ioft,
                                "alias": "bb-button",
                                "aliasName": "添加" + t._buildTitle(_ioft),
                                "group": "",
                                "attributes": {
                                    "button": {
                                        "icon": "ty-icon_tianjia",
                                        "size": "small",
                                        "style": {}
                                    }
                                },
                                "animation": [],
                                "interactives": [{
                                    "uuid": "",
                                    "fromContentUUID": t.external.linkage[0].data.uuid + "-of-tree-add-" + _ioft,
                                    "executeType": "trigger_method",
                                    "fromContentEvent": "click",
                                    "executeContentUUID": "Page_Ref_Root",
                                    "executeContentMethodName": "openDialog",
                                    "executeArgument": [
                                        {
                                            "uuid": t.external.linkage[0].data.uuid + "-of-tree-add-form-"+_ioft,
                                            "alias": "bb-field-tree-select",
                                            "aliasName": "选择属性",
                                            "attributes": {
                                                "multiple":true,
                                                "ioftType":'oft',
                                                "ioft":_ioft
                                                // "value":{
                                                //     "ct":"eq",
                                                //     "ift":_ioft,
                                                //     "apiLegoUuid":t.external.linkage[0].data.uuid
                                                // },
                                            },
                                            "animation": [
                                                {}
                                            ],
                                            "interactives": [
                                                {
                                                        "uuid": "",
                                                        "fromContentUUID": t.external.linkage[0].data.uuid + "-of-tree-add-form-"+_ioft,
                                                        "executeType": "trigger_method",
                                                        "fromContentEvent": "tree-commit",
                                                        "executeContentUUID": "r-00001-config",
                                                        "executeContentMethodName": "saveTreeIOF"
                                                    },
                                                    {
                                                        "uuid": "",
                                                        "fromContentUUID": t.external.linkage[0].data.uuid + "-of-tree-add-form-"+_ioft,
                                                        "executeType": "trigger_method",
                                                        "fromContentEvent": "tree-commit",
                                                        "executeContentUUID": "Page_Ref_Root",
                                                        "executeContentMethodName": "closeDialog"
                                                    }
                                            ],
                                            "layout": {}
                                        }
                                    ]
                                }]
                    }
                    let item = {
                        title: t._buildTitle(_ioft),
                        name: _ioft,
                        "content": [
                            {
                                "uuid": t.external.linkage[0].data.uuid + "-of-" + _ioft,
                                "alias": "bb-button-group",
                                "aliasName": t._buildTitle(_ioft),
                                "attributes": {
                                    "buttons":t._buildIOFTButton('outputField',_ioft)
                                },
                                "animation": [],
                                "interactives": [
                                    {
                                        "uuid": "",
                                        "fromContentUUID": t.external.linkage[0].data.uuid + "-of-" + _ioft,
                                        "executeType": "trigger_method",
                                        "fromContentEvent": "click",
                                        "executeContentUUID": "Page_Ref_Root",
                                        "executeContentMethodName": "openDialog",
                                        "executeArgument": [
                                            {
                                                "uuid": t.external.linkage[0].data.uuid + "-of-form-"+_ioft,
                                                "alias": "bb-form",
                                                "aliasName": "编辑属性",
                                                "attributes": {
                                                    "settingButtonText": "确定",
                                                    "defaultValTpl":"<%=JSON.stringify(_TY_Root._TY_args[0].data)%>",
                                                    "content": [
                                                        {
                                                            "uuid": t.external.linkage[0].data.uuid + "-of-" + _ioft + '-name',
                                                            "alias": "bb-input",
                                                            "aliasName": "名称",
                                                            "group": "",
                                                            "attributes": {
                                                                "attributeName": "name",
                                                                "rules": [{ 
                                                                    required: true,
                                                                    message: '请输入名称',
                                                                    trigger: 'blur'
                                                                }]
                                                            },
                                                            "animation": [],
                                                            "interactives": []
                                                        },
                                                        {
                                                            "uuid": t.external.linkage[0].data.uuid + "-of-" + _ioft + '-fieldName',
                                                            "alias": "bb-input",
                                                            "aliasName": "字段名",
                                                            "group": "",
                                                            "attributes": {
                                                                "attributeName": "fieldName",
                                                                "rules": [{ 
                                                                    required: true,
                                                                    message: '请输入字段名',
                                                                    trigger: 'blur'
                                                                }]
                                                            },
                                                            "animation": [],
                                                            "interactives": []
                                                        },
                                                        {
                                                            "uuid": t.external.linkage[0].data.uuid + "-of-" + _ioft + '-alias',
                                                            "alias": "bb-input",
                                                            "aliasName": "别名",
                                                            "group": "",
                                                            "attributes": {
                                                                "attributeName": "alias",
                                                                "rules": [{ 
                                                                    required: true,
                                                                    message: '请输入别名',
                                                                    trigger: 'blur'
                                                                }]
                                                            },
                                                            "animation": [],
                                                            "interactives": []
                                                        },
                                                        {
                                                            "uuid": t.external.linkage[0].data.uuid + "-of-" + _ioft + '-dt',
                                                            "alias": "bb-select",
                                                            "aliasName": "数据类型",
                                                            "group": "",
                                                            "attributes": {
                                                                "attributeName": "dt",
                                                                "rules": [],
                                                                "fields": [
                                                                    {
                                                                        "text": "整数",
                                                                        "value": "int"
                                                                    },
                                                                    {
                                                                        "text": "浮点数",
                                                                        "value": "double"
                                                                    },
                                                                    {
                                                                        "text": "布尔值",
                                                                        "value": "boolean"
                                                                    },
                                                                    {
                                                                        "text": "字符串",
                                                                        "value": "string"
                                                                    },
                                                                    {
                                                                        "text": "日期",
                                                                        "value": "date"
                                                                    },
                                                                    {
                                                                        "text": "日期时间",
                                                                        "value": "time"
                                                                    },
                                                                    {
                                                                        "text": "对象",
                                                                        "value": "object"
                                                                    },
                                                                    {
                                                                        "text": "数组",
                                                                        "value": "array"
                                                                    },
                                                                    {
                                                                        "text": "文件",
                                                                        "value": "multipart"
                                                                    }
                                                                ]
                                                            },
                                                            "animation": [],
                                                            "interactives": []
                                                        },
                                                        {
                                                            "uuid": t.external.linkage[0].data.uuid + "-of-" + _ioft + '-oft',
                                                            "alias": "bb-input",
                                                            "aliasName": "输出类型",
                                                            "group": "",
                                                            "attributes": {
                                                                "attributeName": "oft",
                                                                "rules": [],
                                                                "show": false,
                                                                "value": _ioft
                                                            },
                                                            "animation": [],
                                                            "interactives": []
                                                        },
                                                        {
                                                            "uuid": t.external.linkage[0].data.uuid + "-of-" + _ioft + '-response',
                                                            "alias": "bb-editor-switch",
                                                            "aliasName": "返回客户端",
                                                            "group": "",
                                                            "attributes": {
                                                                "attributeName": "response",
                                                                "rules": []
                                                            },
                                                            "animation": [],
                                                            "interactives": []
                                                        },
                                                        {
                                                            "uuid": t.external.linkage[0].data.uuid + "-of-" + _ioft + '-handle',
                                                            "alias": "bb-list",
                                                            "aliasName": "数据处理",
                                                            "group": "",
                                                            "attributes": {
                                                                "attributeName": "handle",
                                                                "rules": [],
                                                                "returnString": true,
                                                                "editConfig": {
                                                                    "editable": [
                                                                        "add",
                                                                        "edit",
                                                                        "remove"
                                                                    ]
                                                                },
                                                                "columns": [
                                                                    {
                                                                        "prop": "handleName",
                                                                        "label": "数据处理名称",
                                                                        "et": "bb-select",
                                                                        "etProp": {
                                                                            textField: 'name',
                                                                            valueField: 'alias',
                                                                            ds: {
                                                                                "api": "list-handle",
                                                                                "category": "config",
                                                                                "method": "post",
                                                                                "inputs": [],
                                                                                "outputs": [{
                                                                                    "dataKey": "fields",
                                                                                    "valueKey": "data_list"
                                                                                }]
                                                                            }
                                                                        }
                                                                    },
                                                                    {
                                                                        "prop": "params",
                                                                        "label": "处理参数",
                                                                        "et": "bb-input"
                                                                    }
                                                                ],
                                                                "border": true
                                                            },
                                                            "animation": [],
                                                            "interactives": []
                                                        },
                                                        {
                                                            "uuid": t.external.linkage[0].data.uuid + "-of-" + _ioft + '-description',
                                                            "alias": "bb-textarea",
                                                            "aliasName": "描述",
                                                            "group": "",
                                                            "attributes": {
                                                                "attributeName": "description",
                                                                "rules": []
                                                            },
                                                            "animation": [],
                                                            "interactives": []
                                                        }
                                                    ]
                                                },
                                                "animation": [
                                                    {}
                                                ],
                                                "interactives": [
                                                    {
                                                        "uuid": "",
                                                        "fromContentUUID": t.external.linkage[0].data.uuid + "-of-form-"+_ioft,
                                                        "executeType": "trigger_method",
                                                        "fromContentEvent": "commit",
                                                        "executeContentUUID": "r-00001-config",
                                                        "executeContentMethodName": "saveIOF"
                                                    },
                                                    {
                                                        "uuid": "",
                                                        "fromContentUUID": t.external.linkage[0].data.uuid + "-of-form-"+_ioft,
                                                        "executeType": "trigger_method",
                                                        "fromContentEvent": "commit",
                                                        "executeContentUUID": "Page_Ref_Root",
                                                        "executeContentMethodName": "closeDialog"
                                                    }
                                                ],
                                                "layout": {}
                                            }
                                        ]
                                    },
                                    {
                                        "uuid": "",
                                        "fromContentUUID": t.external.linkage[0].data.uuid + "-of-" + _ioft,
                                        "executeType": "trigger_method",
                                        "fromContentEvent": "remove",
                                        "executeContentUUID": "r-00001-config",
                                        "executeContentMethodName": "removeIOF"
                                    }
                                ]
                            }
                        ]
                    };

                    if(_ioft=='common'||_ioft=='cache'||_ioft=='memory'||_ioft=='unstructured'){
                        item.content.push(formAddOf);
                    }else{
                        item.content.push(treeAddOf);
                    }
                    t.ofCollapseData.push(item);
                }
            }
        }
    }
</script>


<style scoped>
    .form_item {
        line-height: 40px;
        font-size: 14px;
        margin-bottom: 22px;
        color: #666;
        vertical-align: middle
    }
</style>

