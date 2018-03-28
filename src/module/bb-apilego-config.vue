<template>
    <el-tabs v-model="p_activeName" @tab-click="tabClick">
        <el-tab-pane label="基础" name="legoInfo">
            <div class="form_item">
                模型:
                <bb-cascader ref="oi" :style="{display:'inline-block'}" valueTpl="<%=value[value.length-1]%>"
                             :casProps="casProps" :dsList="dsList"
                             @change="oiChange"></bb-cascader>
            </div>
            <div class="form_item">
                描述:
                <bb-textarea :bbStyle="{width: '75%'}" v-model="apiLegoDes" @change="desChange"></bb-textarea>
            </div>
        </el-tab-pane>
        <el-tab-pane label="输入" name="inputField">
            <bb-collapse ref="_if" :activeNames="['common','read','create','update','cache','condition']"
                         :itemDs="ifItemDs" :collapseData="ifCollapseData"
            ></bb-collapse>
        </el-tab-pane>
        <el-tab-pane label="输出" name="outputField">
            <bb-collapse ref="_of" :activeNames="['common','read','create','update','cache','condition']"
                         :itemDs="ofItemDs" :collapseData="ofCollapseData"
            ></bb-collapse>
        </el-tab-pane>
    </el-tabs>
</template>

<script>
    const IOFT = ['common', 'read', 'create', 'update', 'condition', 'cache', 'memory']

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
            //刷新 基础
            _refreshBase: function () {
                let t = this;
                t.dsList = [
                    {
                        "type": "ds",
                        "index": 1,
                        "isleaf": false,
                        "ds": {
                            "api": "ty-list-ds-by-lego-alias",
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
                    t.$refs['oi'].loadValue([t.external.linkage[0].data.dsAlias,t.external.linkage[0].data.oiAlias]);
                    //刷新描述
                    t.apiLegoDes = t.external.linkage[0].data.description || "";
                },10);
            },
            _refreshIf: function () {
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
                    t.$refs['_if'].buildTitle();
                }, 300)
            },
            _refreshOf: function () {
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
                            resultApiLego.push({
                                "text":(index+1)+"."+item.data.legoName,
                                "value":item.data.id
                            });
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
                const ds = {
                    "api": "ty-auto-generate-iof",
                    "category": "config",
                    "method": "post",
                    "inputs": [
                        {
                            "paramName": "apiLegoId",
                            "valueType": "constant",
                            "constant": t.external.linkage[0].data.id
                        },
                        {
                            "paramName": "oiAlias",
                            "valueType": "constant",
                            "constant": val
                        }
                    ],
                    "outputs": []
                };
                _TY_Tool.getDSData(ds, _TY_Tool.buildTplParams(t), function (map) {
                    //刷新输入 输出字段配置
                    t._refreshIf();
                    t._refreshOf();
                }, function (code, msg) {
                });
            },
            desChange: function (val, textarea) {
                let t = this;
                const ds = {
                    "api": "update-apilego-des-by-id",
                    "category": "config",
                    "method": "post",
                    "inputs": [
                        {
                            "paramName": "description",
                            "valueType": "constant",
                            "constant": val
                        },
                        {
                            "paramName": "id",
                            "valueType": "constant",
                            "constant": t.external.linkage[0].data.id
                        }
                    ],
                    "outputs": []
                };
                _TY_Tool.getDSData(ds, _TY_Tool.buildTplParams(t), function (map) {
                }, function (code, msg) {
                });
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
                        return "内存字段"
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
                                preUUID+'fromApiLegoId',
                                preUUID+'fromApiLegoOutputFieldAlias',
                                preUUID+'fieldTpl'
                            ]);
                        break;
                    case 'request':
                        bbForm.hideAndShowFormItem([preUUID+'requestParamName'],
                            [
                                preUUID+'constant',
                                preUUID+'sessionParamName',
                                preUUID+'fromApiLegoId',
                                preUUID+'fromApiLegoOutputFieldAlias',
                                preUUID+'fieldTpl'
                            ]);
                        break;
                    case 'session':
                        bbForm.hideAndShowFormItem([preUUID+'sessionParamName'],
                            [
                                preUUID+'constant',
                                preUUID+'requestParamName',
                                preUUID+'fromApiLegoId',
                                preUUID+'fromApiLegoOutputFieldAlias',
                                preUUID+'fieldTpl'
                            ]);
                        break;
                    case 'output':
                        bbForm.hideAndShowFormItem([preUUID+'fromApiLegoId',preUUID+'fromApiLegoOutputFieldAlias'],
                            [
                                preUUID+'constant',
                                preUUID+'requestParamName',
                                preUUID+'sessionParamName',
                                preUUID+'fieldTpl'
                            ]);
                        break;
                    case 'template':
                        bbForm.hideAndShowFormItem([preUUID+'fromApiLegoId',preUUID+'fieldTpl'],
                            [
                                preUUID+'constant',
                                preUUID+'requestParamName',
                                preUUID+'sessionParamName',
                                preUUID+'fromApiLegoOutputFieldAlias'
                            ]);
                        break;
                }
            },
            //构建输入的 colopseData
            buildIfCollopaseData: function () {
                let t = this;
                t.ifCollapseData = [];
                for (let i in IOFT) {
                    const _ioft = IOFT[i];
                    let item = {
                        title: t._buildTitle(_ioft),
                        name: _ioft,
                        "content": [
                            {
                                "uuid": t.external.linkage[0].data.id + "-if-" + _ioft,
                                "alias": "bb-button-group",
                                "aliasName": t._buildTitle(_ioft),
                                "attributes": {
                                    "buttonDs": {
                                        "api": "ty-list-if-by-apilegoIdAndIft",
                                        "method": "get",
                                        "inputs": [
                                            {
                                                "paramName": "apiLegoId",
                                                "valueType": "constant",
                                                "constant": t.external.linkage[0].data.id
                                            },
                                            {
                                                "paramName": "ift",
                                                "valueType": "constant",
                                                "constant": _ioft
                                            }
                                        ],
                                        "outputs": [
                                            {
                                                "dataKey": "tableData",
                                                "valueKey": "data_list",
                                                "handle": "ty-data-transfer-iof-to-button"
                                            }
                                        ],
                                        "category": "config"
                                    }
                                },
                                "animation": [],
                                "interactives": [
                                    {
                                        "uuid": "",
                                        "fromContentUUID": t.external.linkage[0].data.id + "-if-" + _ioft,
                                        "executeType": "trigger_method",
                                        "fromContentEvent": "iconClick",
                                        "executeContentUUID": "Page_Ref_Root",
                                        "executeContentMethodName": "executeDS",
                                        "executeArgument": {
                                            "api": "delete-inputField",
                                            "category": "config",
                                            "method": "post",
                                            "inputs": [
                                                {
                                                    "paramName": "fieldId",
                                                    "valueType": "template",
                                                    "variable": "<%=args[0].data.id%>"
                                                }
                                            ],
                                            "outputs": []
                                        }
                                    },
                                    {
                                        "uuid": "",
                                        "fromContentUUID": t.external.linkage[0].data.id + "-if-" + _ioft,
                                        "executeType": "trigger_method",
                                        "fromContentEvent": "click",
                                        "executeContentUUID": "Page_Ref_Root",
                                        "executeContentMethodName": "openDialog",
                                        "executeArgument": [
                                            {
                                                "uuid": t.external.linkage[0].data.id + "-if-form-"+_ioft,
                                                "alias": "bb-form",
                                                "aliasName": "编辑属性",
                                                "attributes": {
                                                    "settingButtonText": "确定",
                                                    "buttonConfig": {
                                                        "action": "execute-ds",
                                                        "callback": "refresh",
                                                        "ds": {
                                                            "api": "update-inputfield",
                                                            "category": "config",
                                                            "method": "post",
                                                            "inputs": [
                                                                {
                                                                    "paramName": "id",
                                                                    "valueType": "template",
                                                                    "variable": "<%=_TY_Root._TY_args[0].data.id%>"
                                                                },
                                                                {
                                                                    "paramName": "name",
                                                                    "valueType": "inputValueObj",
                                                                    "valueKey": "bb",
                                                                    "variable": "formData.name"
                                                                },
                                                                {
                                                                    "paramName": "description",
                                                                    "valueType": "inputValueObj",
                                                                    "valueKey": "bb",
                                                                    "variable": "formData.description"
                                                                },
                                                                {
                                                                    "paramName": "fieldName",
                                                                    "valueType": "inputValueObj",
                                                                    "valueKey": "bb",
                                                                    "variable": "formData.fieldName"
                                                                },
                                                                {
                                                                    "paramName": "constant",
                                                                    "valueType": "inputValueObj",
                                                                    "valueKey": "bb",
                                                                    "variable": "formData.constant"
                                                                },
                                                                {
                                                                    "paramName": "ct",
                                                                    "valueType": "inputValueObj",
                                                                    "valueKey": "bb",
                                                                    "variable": "formData.ct"
                                                                },
                                                                {
                                                                    "paramName": "fvt",
                                                                    "valueType": "inputValueObj",
                                                                    "valueKey": "bb",
                                                                    "variable": "formData.fvt"
                                                                },
                                                                {
                                                                    "paramName": "fromApiLegoId",
                                                                    "valueType": "inputValueObj",
                                                                    "valueKey": "bb",
                                                                    "variable": "formData.fromApiLegoId"
                                                                },
                                                                {
                                                                    "paramName": "alias",
                                                                    "valueType": "inputValueObj",
                                                                    "valueKey": "bb",
                                                                    "variable": "formData.alias"
                                                                },
                                                                {
                                                                    "paramName": "validate",
                                                                    "valueType": "inputValueObj",
                                                                    "valueKey": "bb",
                                                                    "variable": "formData.validate"
                                                                },
                                                                {
                                                                    "paramName": "connectorPath",
                                                                    "valueType": "inputValueObj",
                                                                    "valueKey": "bb",
                                                                    "variable": "formData.connectorPath"
                                                                },
                                                                {
                                                                    "paramName": "dt",
                                                                    "valueType": "inputValueObj",
                                                                    "valueKey": "bb",
                                                                    "variable": "formData.dt"
                                                                },
                                                                {
                                                                    "paramName": "fromApiLegoOutputFieldAlias",
                                                                    "valueType": "inputValueObj",
                                                                    "valueKey": "bb",
                                                                    "variable": "formData.fromApiLegoOutputFieldAlias"
                                                                },
                                                                {
                                                                    "paramName": "requestParamName",
                                                                    "valueType": "inputValueObj",
                                                                    "valueKey": "bb",
                                                                    "variable": "formData.requestParamName"
                                                                },
                                                                {
                                                                    "paramName": "sessionParamName",
                                                                    "valueType": "inputValueObj",
                                                                    "valueKey": "bb",
                                                                    "variable": "formData.sessionParamName"
                                                                },
                                                                {
                                                                    "paramName": "fieldTpl",
                                                                    "valueType": "inputValueObj",
                                                                    "valueKey": "bb",
                                                                    "variable": "formData.fieldTpl"
                                                                }
                                                            ]
                                                        },
                                                        "confirmTitle": "确认更新",
                                                        "confirmText": "提示"
                                                    },
                                                    "ds": {
                                                        "api": "ty-read-if",
                                                        "category": "config",
                                                        "method": "get",
                                                        "inputs": [
                                                            {
                                                                "paramName": "id",
                                                                "valueType": "template",
                                                                "variable": "<%=_TY_Root._TY_args[0].data.id%>"
                                                            }
                                                        ],
                                                        "outputs": [
                                                            {
                                                                "dataKey": "formData",
                                                                "valueKey": "data"
                                                            }
                                                        ]
                                                    },
                                                    "content": [
                                                        {
                                                            "uuid": t.external.linkage[0].data.id + "-if-" + _ioft + '-name',
                                                            "alias": "bb-input",
                                                            "aliasName": "名称",
                                                            "group": "",
                                                            "attributes": {
                                                                "attributeName": "name",
                                                                "rules": []
                                                            },
                                                            "animation": [],
                                                            "interactives": []
                                                        },
                                                        {
                                                            "uuid": t.external.linkage[0].data.id + "-if-" + _ioft + '-fieldName',
                                                            "alias": "bb-input",
                                                            "aliasName": "字段名",
                                                            "group": "",
                                                            "attributes": {
                                                                "attributeName": "fieldName",
                                                                "rules": []
                                                            },
                                                            "animation": [],
                                                            "interactives": []
                                                        },
                                                        {
                                                            "uuid": t.external.linkage[0].data.id + "-if-" + _ioft + '-alias',
                                                            "alias": "bb-input",
                                                            "aliasName": "别名",
                                                            "group": "",
                                                            "attributes": {
                                                                "attributeName": "alias",
                                                                "rules": []
                                                            },
                                                            "animation": [],
                                                            "interactives": []
                                                        },
                                                        {
                                                            "uuid": t.external.linkage[0].data.id + "-if-" + _ioft + '-ct',
                                                            "alias": "bb-select",
                                                            "aliasName": "条件类型",
                                                            "group": "",
                                                            "attributes": {
                                                                "attributeName": "ct",
                                                                "rules": [],
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
                                                            "uuid": t.external.linkage[0].data.id + "-if-" + _ioft + '-dt',
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
                                                            "uuid": t.external.linkage[0].data.id + "-if-" + _ioft + '-ift',
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
                                                            "uuid": t.external.linkage[0].data.id + "-if-" + _ioft + '-fvt',
                                                            "alias": "bb-select",
                                                            "aliasName": "数据来源",
                                                            "group": "",
                                                            "attributes": {
                                                                "attributeName": "fvt",
                                                                "rules": [],
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
                                                                "fromContentUUID": t.external.linkage[0].data.id + "-if-" + _ioft + '-fvt',
                                                                "executeType": "trigger_method",
                                                                "fromContentEvent": "change",
                                                                "executeContentUUID": "r-00001-config",
                                                                "executeContentMethodName": "changeFVT"
                                                            }]
                                                        },
                                                        {
                                                            "uuid": t.external.linkage[0].data.id + "-if-" + _ioft + '-requestParamName',
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
                                                            "uuid": t.external.linkage[0].data.id + "-if-" + _ioft + '-sessionParamName',
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
                                                            "uuid": t.external.linkage[0].data.id + "-if-" + _ioft + '-fromApiLegoId',
                                                            "alias": "bb-select",
                                                            "aliasName": "数据来源ID",
                                                            "group": "",
                                                            "attributes": {
                                                                "attributeName": "fromApiLegoId",
                                                                "rules": [],
                                                                "fields":t.apiLegos,
                                                                 "show":t._show(_ioft,["read"]),
                                                            },
                                                            "animation": [],
                                                            "interactives": []
                                                        },
                                                        {
                                                            "uuid": t.external.linkage[0].data.id + "-if-" + _ioft + '-fromApiLegoOutputFieldAlias',
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
                                                            "uuid": t.external.linkage[0].data.id + "-if-" + _ioft + '-constant',
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
                                                            "uuid": t.external.linkage[0].data.id + "-if-" + _ioft + '-fieldTpl',
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
                                                            "uuid": t.external.linkage[0].data.id + "-if-" + _ioft + '-validate',
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
                                                            "uuid": t.external.linkage[0].data.id + "-if-" + _ioft + '-connectorPath',
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
                                                            "uuid": t.external.linkage[0].data.id + "-if-" + _ioft + '-description',
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
                                                    {}
                                                ],
                                                "layout": {}
                                            }
                                        ]
                                    }

                                ]
                            },
                            {
                                "uuid": t.external.linkage[0].data.id + "-if-add-" + _ioft,
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
                                    "fromContentUUID": t.external.linkage[0].data.id + "-if-add-" + _ioft,
                                    "executeType": "trigger_method",
                                    "fromContentEvent": "click",
                                    "executeContentUUID": "Page_Ref_Root",
                                    "executeContentMethodName": "openDialog",
                                    "executeArgument": [
                                        {
                                            "uuid": "",
                                            "alias": "bb-form",
                                            "aliasName": "编辑属性",
                                            "attributes": {
                                                "value":{
                                                    "ct":"eq"
                                                },
                                                "settingButtonText": "确定",
                                                "buttonConfig": {
                                                    "action": "execute-ds",
                                                    "callback": "refresh",
                                                    "ds": {
                                                        "api": "add-inputfield",
                                                        "category": "config",
                                                        "method": "post",
                                                        "inputs": [
                                                            {
                                                                "paramName": "name",
                                                                "valueType": "inputValueObj",
                                                                "valueKey": "bb",
                                                                "variable": "formData.name"
                                                            },
                                                            {
                                                                "paramName": "description",
                                                                "valueType": "inputValueObj",
                                                                "valueKey": "bb",
                                                                "variable": "formData.description"
                                                            },
                                                            {
                                                                "paramName": "fieldName",
                                                                "valueType": "inputValueObj",
                                                                "valueKey": "bb",
                                                                "variable": "formData.fieldName"
                                                            },
                                                            {
                                                                "paramName": "constant",
                                                                "valueType": "inputValueObj",
                                                                "valueKey": "bb",
                                                                "variable": "formData.constant"
                                                            },
                                                            {
                                                                "paramName": "ct",
                                                                "valueType": "inputValueObj",
                                                                "valueKey": "bb",
                                                                "variable": "formData.ct"
                                                            },
                                                            {
                                                                "paramName": "fvt",
                                                                "valueType": "inputValueObj",
                                                                "valueKey": "bb",
                                                                "variable": "formData.fvt"
                                                            },
                                                            {
                                                                "paramName": "fromApiLegoId",
                                                                "valueType": "inputValueObj",
                                                                "valueKey": "bb",
                                                                "variable": "formData.fromApiLegoId"
                                                            },
                                                            {
                                                                "paramName": "alias",
                                                                "valueType": "inputValueObj",
                                                                "valueKey": "bb",
                                                                "variable": "formData.alias"
                                                            },
                                                            {
                                                                "paramName": "validate",
                                                                "valueType": "inputValueObj",
                                                                "valueKey": "bb",
                                                                "variable": "formData.validate"
                                                            },
                                                            {
                                                                "paramName": "connectorPath",
                                                                "valueType": "inputValueObj",
                                                                "valueKey": "bb",
                                                                "variable": "formData.connectorPath"
                                                            },
                                                            {
                                                                "paramName": "dt",
                                                                "valueType": "inputValueObj",
                                                                "valueKey": "bb",
                                                                "variable": "formData.dt"
                                                            },
                                                            {
                                                                "paramName": "fromApiLegoOutputFieldAlias",
                                                                "valueType": "inputValueObj",
                                                                "valueKey": "bb",
                                                                "variable": "formData.fromApiLegoOutputFieldAlias"
                                                            },
                                                            {
                                                                "paramName": "requestParamName",
                                                                "valueType": "inputValueObj",
                                                                "valueKey": "bb",
                                                                "variable": "formData.requestParamName"
                                                            },
                                                            {
                                                                "paramName": "sessionParamName",
                                                                "valueType": "inputValueObj",
                                                                "valueKey": "bb",
                                                                "variable": "formData.sessionParamName"
                                                            },
                                                            {
                                                                "paramName": "fieldTpl",
                                                                "valueType": "inputValueObj",
                                                                "valueKey": "bb",
                                                                "variable": "formData.fieldTpl"
                                                            },
                                                            {
                                                                "paramName": "ift",
                                                                "valueType": "constant",
                                                                "constant": _ioft
                                                            },
                                                            {
                                                                "paramName": "apiLegoId",
                                                                "valueType": "constant",
                                                                "constant": t.external.linkage[0].data.id
                                                            }
                                                        ]
                                                    },
                                                    "confirmTitle": "确认添加",
                                                    "confirmText": "提示"
                                                },
                                                "content": [
                                                    {
                                                        "uuid": t.external.linkage[0].data.id + "-if-add-" + _ioft + "name",
                                                        "alias": "bb-input",
                                                        "aliasName": "名称",
                                                        "group": "",
                                                        "attributes": {
                                                            "attributeName": "name",
                                                            "rules": []
                                                        },
                                                        "animation": [],
                                                        "interactives": []
                                                    },
                                                    {
                                                        "uuid": t.external.linkage[0].data.id + "-if-add-" + _ioft + "fieldName",
                                                        "alias": "bb-input",
                                                        "aliasName": "字段名",
                                                        "group": "",
                                                        "attributes": {
                                                            "attributeName": "fieldName",
                                                            "rules": []
                                                        },
                                                        "animation": [],
                                                        "interactives": []
                                                    },
                                                    {
                                                        "uuid": t.external.linkage[0].data.id + "-if-add-" + _ioft + "alias",
                                                        "alias": "bb-input",
                                                        "aliasName": "别名",
                                                        "group": "",
                                                        "attributes": {
                                                            "attributeName": "alias",
                                                            "rules": []
                                                        },
                                                        "animation": [],
                                                        "interactives": []
                                                    },
                                                    {
                                                        "uuid": t.external.linkage[0].data.id + "-if-add-" + _ioft + "ct",
                                                        "alias": "bb-select",
                                                        "aliasName": "条件类型",
                                                        "group": "",
                                                        "attributes": {
                                                            "attributeName": "ct",
                                                            "rules": [],
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
                                                        "uuid": t.external.linkage[0].data.id + "-if-add-" + _ioft + "dt",
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
                                                        "uuid": t.external.linkage[0].data.id + "-if-add-" + _ioft + "ift",
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
                                                        "uuid": t.external.linkage[0].data.id + "-if-add-" + _ioft + "fvt",
                                                        "alias": "bb-select",
                                                        "aliasName": "数据来源",
                                                        "group": "",
                                                        "attributes": {
                                                            "attributeName": "fvt",
                                                            "rules": [],
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
                                                                "fromContentUUID": t.external.linkage[0].data.id + "-if-add-" + _ioft + '-fvt',
                                                                "executeType": "trigger_method",
                                                                "fromContentEvent": "change",
                                                                "executeContentUUID": "r-00001-config",
                                                                "executeContentMethodName": "changeFVT"
                                                        }]
                                                    },
                                                    {
                                                        "uuid": t.external.linkage[0].data.id + "-if-add-" + _ioft + "requestParamName",
                                                        "alias": "bb-input",
                                                        "aliasName": "请求参数",
                                                        "group": "",
                                                        "attributes": {
                                                            "attributeName": "requestParamName",
                                                            "rules": []
                                                        },
                                                        "animation": [],
                                                        "interactives": []
                                                    },
                                                    {
                                                        "uuid": t.external.linkage[0].data.id + "-if-add-" + _ioft + "sessionParamName",
                                                        "alias": "bb-input",
                                                        "aliasName": "session参数",
                                                        "group": "",
                                                        "attributes": {
                                                            "attributeName": "sessionParamName",
                                                            "rules": []
                                                        },
                                                        "animation": [],
                                                        "interactives": []
                                                    },
                                                    {
                                                        "uuid": t.external.linkage[0].data.id + "-if-add-" + _ioft + "fromApiLegoId",
                                                        "alias": "bb-select",
                                                        "aliasName": "数据来源ID",
                                                        "group": "",
                                                        "attributes": {
                                                            "attributeName": "fromApiLegoId",
                                                            "rules": [],
                                                            "fields":t.apiLegos
                                                        },
                                                        "animation": [],
                                                        "interactives": []
                                                    },
                                                    {
                                                        "uuid": t.external.linkage[0].data.id + "-if-add-" + _ioft + "fromApiLegoOutputFieldAlias",
                                                        "alias": "bb-input",
                                                        "aliasName": "output参数",
                                                        "group": "",
                                                        "attributes": {
                                                            "attributeName": "fromApiLegoOutputFieldAlias",
                                                            "rules": []
                                                        },
                                                        "animation": [],
                                                        "interactives": []
                                                    },
                                                    {
                                                        "uuid": t.external.linkage[0].data.id + "-if-add-" + _ioft + "constant",
                                                        "alias": "bb-input",
                                                        "aliasName": "常量值",
                                                        "group": "",
                                                        "attributes": {
                                                            "attributeName": "constant",
                                                            "rules": []
                                                        },
                                                        "animation": [],
                                                        "interactives": []
                                                    },
                                                    {
                                                        "uuid": t.external.linkage[0].data.id + "-if-add-" + _ioft + "fieldTpl",
                                                        "alias": "bb-input",
                                                        "aliasName": "模板TPL",
                                                        "group": "",
                                                        "attributes": {
                                                            "attributeName": "fieldTpl",
                                                            "rules": []
                                                        },
                                                        "animation": [],
                                                        "interactives": []
                                                    },
                                                    {
                                                        "uuid": t.external.linkage[0].data.id + "-if-add-" + _ioft + '-validate',
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
                                                        "uuid": t.external.linkage[0].data.id + "-if-add-" + _ioft + "connectorPath",
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
                                                        "uuid": t.external.linkage[0].data.id + "-if-add-" + _ioft + "description",
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
                                                {}
                                            ],
                                            "layout": {}
                                        }
                                    ]
                                }]
                            }
                        ]
                    };
                    t.ifCollapseData.push(item);
                }
            },
            //构建输出的 colopseData
            buildOfCollopaseData: function () {
                let t = this;
                t.ofCollapseData = [];
                for (let i in IOFT) {
                    const _ioft = IOFT[i];
                    let item = {
                        title: t._buildTitle(_ioft),
                        name: _ioft,
                        "content": [
                            {
                                "uuid": t.external.linkage[0].data.id + "-of-" + _ioft,
                                "alias": "bb-button-group",
                                "aliasName": t._buildTitle(_ioft),
                                "attributes": {
                                    "buttonDs": {
                                        "api": "ty-list-of-by-apilegoIdAndIft",
                                        "method": "get",
                                        "inputs": [
                                            {
                                                "paramName": "apiLegoId",
                                                "valueType": "constant",
                                                "constant": t.external.linkage[0].data.id
                                            },
                                            {
                                                "paramName": "oft",
                                                "valueType": "constant",
                                                "constant": _ioft
                                            }
                                        ],
                                        "outputs": [
                                            {
                                                "dataKey": "tableData",
                                                "valueKey": "data_list",
                                                "handle": "ty-data-transfer-iof-to-button"
                                            }
                                        ],
                                        "category": "config"
                                    }
                                },
                                "animation": [],
                                "interactives": [
                                    {
                                        "uuid": "",
                                        "fromContentUUID": t.external.linkage[0].data.id + "-of-" + _ioft,
                                        "executeType": "trigger_method",
                                        "fromContentEvent": "iconClick",
                                        "executeContentUUID": "Page_Ref_Root",
                                        "executeContentMethodName": "executeDS",
                                        "executeArgument": {
                                            "api": "delete-outputField",
                                            "category": "config",
                                            "method": "post",
                                            "inputs": [
                                                {
                                                    "paramName": "fieldId",
                                                    "valueType": "template",
                                                    "variable": "<%=args[0].data.id%>"
                                                }
                                            ],
                                            "outputs": []
                                        }
                                    },
                                    {
                                        "uuid": "",
                                        "fromContentUUID": t.external.linkage[0].data.id + "-of-" + _ioft,
                                        "executeType": "trigger_method",
                                        "fromContentEvent": "click",
                                        "executeContentUUID": "Page_Ref_Root",
                                        "executeContentMethodName": "openDialog",
                                        "executeArgument": [
                                            {
                                                "uuid": "",
                                                "alias": "bb-form",
                                                "aliasName": "编辑属性",
                                                "attributes": {
                                                    "settingButtonText": "确定",
                                                    "buttonConfig": {
                                                        "action": "execute-ds",
                                                        "callback": "refresh",
                                                        "ds": {
                                                            "api": "update-outputfield",
                                                            "category": "config",
                                                            "method": "post",
                                                            "inputs": [
                                                                {
                                                                    "paramName": "id",
                                                                    "valueType": "template",
                                                                    "variable": "<%=_TY_Root._TY_args[0].data.id%>"
                                                                },
                                                                {
                                                                    "paramName": "name",
                                                                    "valueType": "inputValueObj",
                                                                    "valueKey": "bb",
                                                                    "variable": "formData.name"
                                                                },
                                                                {
                                                                    "paramName": "description",
                                                                    "valueType": "inputValueObj",
                                                                    "valueKey": "bb",
                                                                    "variable": "formData.description"
                                                                },
                                                                {
                                                                    "paramName": "fieldName",
                                                                    "valueType": "inputValueObj",
                                                                    "valueKey": "bb",
                                                                    "variable": "formData.fieldName"
                                                                },
                                                                {
                                                                    "paramName": "alias",
                                                                    "valueType": "inputValueObj",
                                                                    "valueKey": "bb",
                                                                    "variable": "formData.alias"
                                                                },
                                                                {
                                                                    "paramName": "handle",
                                                                    "valueType": "inputValueObj",
                                                                    "valueKey": "bb",
                                                                    "variable": "formData.handle"
                                                                },
                                                                {
                                                                    "paramName": "dt",
                                                                    "valueType": "inputValueObj",
                                                                    "valueKey": "bb",
                                                                    "variable": "formData.dt"
                                                                },
                                                                {
                                                                    "paramName": "response",
                                                                    "valueType": "inputValueObj",
                                                                    "valueKey": "bb",
                                                                    "variable": "formData.response"
                                                                }
                                                            ]
                                                        },
                                                        "confirmTitle": "确认更新",
                                                        "confirmText": "提示"
                                                    },
                                                    "ds": {
                                                        "api": "ty-read-of",
                                                        "category": "config",
                                                        "method": "get",
                                                        "inputs": [
                                                            {
                                                                "paramName": "id",
                                                                "valueType": "template",
                                                                "variable": "<%=_TY_Root._TY_args[0].data.id%>"
                                                            }
                                                        ],
                                                        "outputs": [
                                                            {
                                                                "dataKey": "formData",
                                                                "valueKey": "data"
                                                            }
                                                        ]
                                                    },
                                                    "content": [
                                                        {
                                                            "uuid": t.external.linkage[0].data.id + "-of-" + _ioft + '-name',
                                                            "alias": "bb-input",
                                                            "aliasName": "名称",
                                                            "group": "",
                                                            "attributes": {
                                                                "attributeName": "name",
                                                                "rules": []
                                                            },
                                                            "animation": [],
                                                            "interactives": []
                                                        },
                                                        {
                                                            "uuid": t.external.linkage[0].data.id + "-of-" + _ioft + '-fieldName',
                                                            "alias": "bb-input",
                                                            "aliasName": "字段名",
                                                            "group": "",
                                                            "attributes": {
                                                                "attributeName": "fieldName",
                                                                "rules": []
                                                            },
                                                            "animation": [],
                                                            "interactives": []
                                                        },
                                                        {
                                                            "uuid": t.external.linkage[0].data.id + "-of-" + _ioft + '-alias',
                                                            "alias": "bb-input",
                                                            "aliasName": "别名",
                                                            "group": "",
                                                            "attributes": {
                                                                "attributeName": "alias",
                                                                "rules": []
                                                            },
                                                            "animation": [],
                                                            "interactives": []
                                                        },
                                                        {
                                                            "uuid": t.external.linkage[0].data.id + "-of-" + _ioft + '-dt',
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
                                                            "uuid": t.external.linkage[0].data.id + "-of-" + _ioft + '-oft',
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
                                                            "uuid": t.external.linkage[0].data.id + "-of-" + _ioft + '-response',
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
                                                            "uuid": t.external.linkage[0].data.id + "-of-" + _ioft + '-handle',
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
                                                            "uuid": t.external.linkage[0].data.id + "-of-" + _ioft + '-description',
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
                                                    {}
                                                ],
                                                "layout": {}
                                            }
                                        ]
                                    }

                                ]
                            },
                            {
                                "uuid": t.external.linkage[0].data.id + "-of-add-" + _ioft,
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
                                    "fromContentUUID": t.external.linkage[0].data.id + "-of-add-" + _ioft,
                                    "executeType": "trigger_method",
                                    "fromContentEvent": "click",
                                    "executeContentUUID": "Page_Ref_Root",
                                    "executeContentMethodName": "openDialog",
                                    "executeArgument": [
                                        {
                                            "uuid": "",
                                            "alias": "bb-form",
                                            "aliasName": "编辑属性",
                                            "attributes": {
                                                "value":{
                                                    "response":false
                                                },
                                                "settingButtonText": "确定",
                                                "buttonConfig": {
                                                    "action": "execute-ds",
                                                    "callback": "refresh",
                                                    "ds": {
                                                        "api": "add-outputfield",
                                                        "category": "config",
                                                        "method": "post",
                                                        "inputs": [
                                                            {
                                                                "paramName": "name",
                                                                "valueType": "inputValueObj",
                                                                "valueKey": "bb",
                                                                "variable": "formData.name"
                                                            },
                                                            {
                                                                "paramName": "description",
                                                                "valueType": "inputValueObj",
                                                                "valueKey": "bb",
                                                                "variable": "formData.description"
                                                            },
                                                            {
                                                                "paramName": "fieldName",
                                                                "valueType": "inputValueObj",
                                                                "valueKey": "bb",
                                                                "variable": "formData.fieldName"
                                                            },
                                                            {
                                                                "paramName": "alias",
                                                                "valueType": "inputValueObj",
                                                                "valueKey": "bb",
                                                                "variable": "formData.alias"
                                                            },
                                                            {
                                                                "paramName": "handle",
                                                                "valueType": "inputValueObj",
                                                                "valueKey": "bb",
                                                                "variable": "formData.handle"
                                                            },
                                                            {
                                                                "paramName": "dt",
                                                                "valueType": "inputValueObj",
                                                                "valueKey": "bb",
                                                                "variable": "formData.dt"
                                                            },
                                                            {
                                                                "paramName": "response",
                                                                "valueType": "inputValueObj",
                                                                "valueKey": "bb",
                                                                "variable": "formData.response"
                                                            },
                                                            {
                                                                "paramName": "oft",
                                                                "valueType": "constant",
                                                                "constant": _ioft
                                                            },
                                                            {
                                                                "paramName": "apiLegoId",
                                                                "valueType": "constant",
                                                                "constant": t.external.linkage[0].data.id
                                                            }
                                                        ]
                                                    },
                                                    "confirmTitle": "确认添加",
                                                    "confirmText": "提示"
                                                },
                                                "content": [
                                                    {
                                                        "uuid": t.external.linkage[0].data.id + "-of-add-" + _ioft + "name",
                                                        "alias": "bb-input",
                                                        "aliasName": "名称",
                                                        "group": "",
                                                        "attributes": {
                                                            "attributeName": "name",
                                                            "rules": []
                                                        },
                                                        "animation": [],
                                                        "interactives": []
                                                    },
                                                    {
                                                        "uuid": t.external.linkage[0].data.id + "-of-add-" + _ioft + "fieldName",
                                                        "alias": "bb-input",
                                                        "aliasName": "字段名",
                                                        "group": "",
                                                        "attributes": {
                                                            "attributeName": "fieldName",
                                                            "rules": []
                                                        },
                                                        "animation": [],
                                                        "interactives": []
                                                    },
                                                    {
                                                        "uuid": t.external.linkage[0].data.id + "-of-add-" + _ioft + "alias",
                                                        "alias": "bb-input",
                                                        "aliasName": "别名",
                                                        "group": "",
                                                        "attributes": {
                                                            "attributeName": "alias",
                                                            "rules": []
                                                        },
                                                        "animation": [],
                                                        "interactives": []
                                                    },
                                                    {
                                                        "uuid": t.external.linkage[0].data.id + "-of-add-" + _ioft + "dt",
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
                                                        "uuid": t.external.linkage[0].data.id + "-of-add-" + _ioft + "oft",
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
                                                        "uuid": t.external.linkage[0].data.id + "-of-add-" + _ioft + '-response',
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
                                                        "uuid": t.external.linkage[0].data.id + "-of-add-" + _ioft + '-handle',
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
                                                        "uuid": t.external.linkage[0].data.id + "-of-add-" + _ioft + "description",
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
                                                {}
                                            ],
                                            "layout": {}
                                        }
                                    ]
                                }]
                            }
                        ]
                    };
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

