<template>
    <div>
        <div class="bg" :class="popBg"></div>
        <el-collapse v-model="activeNames" style="position:relative">
            <div class="up" :style="popStyle">

                <el-popover
                        ref="popover"
                        placement="right"
                        width="450"
                        @show="showingPop">
                    <i class="el-icon-close close" @click="closePop"></i>
                    <div class="mt20">
                        <bb-editor-field-tree v-if="currentPop=='ccurAdd'" multiple
                                              :oi-alias="oiAlias" :checkedField="checkedField"
                                              @tree-commit="treeCommit"></bb-editor-field-tree>
                        <div v-if="ioType=='input'">
                            <bb-editor-field-form
                                    v-if="currentPop=='customEdit'||currentPop=='customAdd'"
                                    :fields="customIFields" :fieldObject="fieldObject"
                                    @commit="commitFieldForm"
                                    @custom-event="customEvent"
                                    @delete-field="deleteFieldEvent"></bb-editor-field-form>

                            <bb-editor-field-form
                                    v-if="currentPop=='ccurEdit' || currentPop=='commonEdit'||currentPop=='commonAdd' ||currentPop=='cacheEdit'||currentPop=='cacheAdd'"
                                    :fields="iFields" :fieldObject="fieldObject"
                                    @commit="commitFieldForm"
                                    @custom-event="customEvent"
                                    @delete-field="deleteFieldEvent"></bb-editor-field-form>

                        </div>
                        <div v-if="ioType=='output'">
                            <bb-editor-field-form
                                    v-if="currentPop=='ccurEdit' || currentPop=='commonEdit'||currentPop=='commonAdd'"
                                    :fields="oFields" :fieldObject="fieldObject"
                                    @commit="commitFieldForm"
                                    @custom-event="customEvent"
                                    @delete-field="deleteFieldEvent"></bb-editor-field-form>
                        </div>
                    </div>
                    <div x-arrow="" class="popper__arrow" style="top: 12px;"></div>
                </el-popover>
            </div>
            <div v-if="ioType=='input'">
                <el-collapse-item v-if="commonInputFields&&commonInputFields.length>0" title="常用字段" name="1">
                    <el-button v-for="c in commonInputFields" v-if="c.fieldName" :key="c.name" class="mt10"
                               @click="openPop('common',c)">
                        {{c.name}}
                    </el-button>
                    <el-button type="primary" icon="el-icon-plus" class="mt10" @click="openPop('commonAdd')"></el-button>
                </el-collapse-item>

                <el-collapse-item v-if="readInputFields&&readInputFields.length>0" title="读取字段" name="2">
                    <el-button v-for="c in readInputFields" v-if="c.fieldName" class="mt10" :key="c.name"
                               @click="openPop('read',c)">{{c.name}}
                    </el-button>
                    <el-button type="primary" icon="el-icon-plus" class="mt10" @click="openPop('readAdd')"></el-button>
                    <el-button type="primary" icon="el-icon-plus" class="mt10" @click="openPop('readAddCustom')">Fn</el-button>
                </el-collapse-item>
                <el-collapse-item v-if="conditionInputFields&&conditionInputFields.length>0" title="条件字段" name="3">
                    <el-button v-for="c in conditionInputFields" v-if="c.fieldName" class="mt10" :key="c.name"
                               @click="openPop('condition',c)">{{c.name}}
                    </el-button>
                    <el-button type="primary" icon="el-icon-plus" class="mt10" @click="openPop('conditionAdd')"></el-button>
                </el-collapse-item>
                <el-collapse-item v-if="createInputFields&&createInputFields.length>0" title="创建字段" name="4">
                    <el-button v-for="c in createInputFields" v-if="c.fieldName" class="mt10" :key="c.name"
                               @click="openPop('create',c)">{{c.name}}
                    </el-button>
                    <el-button type="primary" icon="el-icon-plus" class="mt10" @click="openPop('createAdd')"></el-button>
                </el-collapse-item>
                <el-collapse-item v-if="updateInputFields&&updateInputFields.length>0" title="更新字段" name="5">
                    <el-button v-for="c in updateInputFields" v-if="c.fieldName" class="mt10" :key="c.name"
                               @click="openPop('update',c)">{{c.name}}
                    </el-button>
                    <el-button type="primary" icon="el-icon-plus" class="mt10" @click="openPop('updateAdd')"></el-button>
                </el-collapse-item>
                <el-collapse-item v-if="cacheInputFields&&cacheInputFields.length>0" title="缓存字段" name="6">
                    <el-button v-for="c in cacheInputFields" v-if="c.fieldName" :key="c.name" class="mt10"
                               @click="openPop('cache',c)">
                        {{c.name}}
                    </el-button>
                    <el-button type="primary" icon="el-icon-plus" class="mt10" @click="openPop('cacheAdd')"></el-button>
                </el-collapse-item>

            </div>
            <div v-if="ioType=='output'">
                <el-collapse-item v-if="commonOutputFields&&commonOutputFields.length>0" title="常用字段" name="1">
                    <el-button v-for="c in commonOutputFields" v-if="c.fieldName" :key="c.name" class="mt10"
                               @click="openPop('common',c)">
                        {{c.name}}
                    </el-button>
                    <el-button type="primary" icon="el-icon-plus" class="mt10" @click="openPop('commonAdd')"></el-button>
                </el-collapse-item>

                <el-collapse-item v-if="readOutputFields&&readOutputFields.length>0" title="读取字段" name="2">
                    <el-button v-for="c in readOutputFields" v-if="c.fieldName" class="mt10" :key="c.name"
                               @click="openPop('read',c)">{{c.name}}
                    </el-button>
                    <el-button type="primary" icon="el-icon-plus" class="mt10" @click="openPop('readAdd')"></el-button>
                </el-collapse-item>
                <el-collapse-item v-if="conditionOutputFields&&conditionOutputFields.length>0" title="条件字段" name="3">
                    <el-button v-for="c in conditionOutputFields" v-if="c.fieldName" class="mt10" :key="c.name"
                               @click="openPop('condition',c)">{{c.name}}
                    </el-button>
                    <el-button type="primary" icon="el-icon-plus" class="mt10" @click="openPop('conditionAdd')"></el-button>
                </el-collapse-item>
                <el-collapse-item v-if="createOutputFields&&createOutputFields.length>0" title="创建字段" name="4">
                    <el-button v-for="c in createOutputFields" v-if="c.fieldName" class="mt10" :key="c.name"
                               @click="openPop('create',c)">{{c.name}}
                    </el-button>
                    <el-button type="primary" icon="el-icon-plus" class="mt10" @click="openPop('createAdd')"></el-button>
                </el-collapse-item>
                <el-collapse-item v-if="updateOutputFields&&updateOutputFields.length>0" title="更新字段" name="5">
                    <el-button v-for="c in updateOutputFields" v-if="c.fieldName" class="mt10" :key="c.name"
                               @click="openPop('update',c)">{{c.name}}
                    </el-button>
                    <el-button type="primary" icon="el-icon-plus" class="mt10" @click="openPop('updateAdd')"></el-button>
                </el-collapse-item>

                <el-collapse-item v-if="cacheOutputFields&&cacheOutputFields.length>0" title="缓存字段" name="6">
                    <el-button v-for="c in cacheOutputFields" v-if="c.fieldName" :key="c.name" class="mt10"
                               @click="openPop('cache',c)">
                        {{c.name}}
                    </el-button>
                    <el-button type="primary" icon="el-icon-plus" class="mt10" @click="openPop('cacheAdd')"></el-button>
                </el-collapse-item>

            </div>
        </el-collapse>


    </div>
</template>

<script>
    import bbEditorFieldtree from "./bb-editor-field-tree";
    import bbEditorFieldform from "./bb-editor-field-form";
    import * as types from '../store/mutation-types';
    import {ct, dt, ioft, fvt} from '../constant';

    export default {

        data() {
            return {
                activeNames: ["1"],
                popStyle: {
                    position: "relative",
                    left: 0,
                    top: 0
                },
                currentPop: '',//ccurAdd、commonAdd、commonEdit，ccurEdit
                currentPopType: '',//commonInputFields,readInputFields,conditionInputFields,createInputFields,updateInputFields
                ioft: '',//common,read,condition,create,update,cache
                oiAlias: '',
                popBg: 'hide',//pop的幕布是否显示
                iFields: [{
                    name: "ID",
                    attributeName: "id",
                    dt: "",
                    et: "hide"
                }, {
                    name: "名称",
                    attributeName: "name",
                    dt: "",
                    et: "input"
                }, {
                    name: "字段",
                    attributeName: "fieldName",
                    dt: "",
                    et: 'fieldtree',
                    oiAlias: 'ty_api'
                }, {
                    name: "别名",
                    attributeName: "alias",
                    dt: "",
                    et: "input"
                }, {
                    name: "条件类型",
                    attributeName: "ct",
                    dt: "",
                    et: "hide",
                    options: ct
                }, {
                    name: "数据类型",
                    attributeName: "dt",
                    dt: "",
                    // et: "hide",
                    options: dt
                }, {
                    name: "输入类型",
                    attributeName: "ift",
                    dt: "",
                    et: "hide",
                    options: ioft
                }, {
                    name: "数据来源",
                    attributeName: "fvt",
                    dt: "",
                    et: "select",
                    options: fvt
                }, {
                    name: "请求参数别名",
                    attributeName: "requestParamName",
                    dt: "",
                    et: "hide"
                }, {
                    name: "session参数别名",
                    attributeName: "sessionParamName",
                    dt: "",
                    et: "hide"
                }, {
                    name: "数据来源ID",
                    attributeName: "fromApiLegoId",
                    dt: "",
                    et: "hide",
                    options: [{
                        text: "你好",
                        value: 1,
                    }]
                }, {
                    name: "output参数别名",
                    attributeName: "fromApiLegoOutputFieldAlias",
                    dt: "",
                    et: "hide"
                }, {
                    name: "常量值",
                    attributeName: "constant",
                    dt: "",
                    et: "hide"
                }, {
                    name: "数据校验",
                    attributeName: "validate",
                    dt: "",
                    et: "array",
                    children: [{
                        name: "检验名称",
                        attributeName: "validateName",
                        dt: "",
                        et: "select",
                        options: [{
                            value: '',
                            text: ''
                        }]
                    }, {
                        name: "检验参数",
                        attributeName: "params",
                        dt: "",
                        et: "input",
                    }]
                }, {
                    name: "连接器",
                    attributeName: "connectorPath",
                    dt: "",
                    et: "hide"
                }, {
                    name: "描述",
                    attributeName: "description",
                    dt: "",
                    et: "textarea"
                }],//输入字段表单字段

                customIFields: [{
                    name: "ID",
                    attributeName: "id",
                    dt: "",
                    et: "hide"
                }, {
                    name: "名称",
                    attributeName: "name",
                    dt: "",
                    et: "input"
                }, {
                    name: "字段",
                    attributeName: "fieldName",
                    dt: "",
                    et: 'input',
                }, {
                    name: "别名",
                    attributeName: "alias",
                    dt: "",
                    et: "input"
                }, {
                    name: "连接器",
                    attributeName: "connectorPath",
                    dt: "",
                    et: "input"
                }, {
                    name: "描述",
                    attributeName: "description",
                    dt: "",
                    et: "textarea"
                }],//输入字段表单字段

                //-------------------------输出表单字段配置--------------------------
                oFields: [{
                    name: "ID",
                    attributeName: "id",
                    dt: "",
                    et: "hide"//hidden 表示隐藏字段
                }, {
                    name: "名称",
                    attributeName: "name",
                    dt: "",
                    et: "input"
                }, {
                    name: "字段",
                    attributeName: "fieldName",
                    dt: "",
                    et: 'fieldtree',
                    oiAlias: 'ty_api'
                }, {
                    name: "别名",
                    attributeName: "alias",
                    dt: "",
                    et: "input"
                }, {
                    name: "数据类型",
                    attributeName: "dt",
                    dt: "",
                    // et: "hide",
                    options: dt
                }, {
                    name: "输出类型",
                    attributeName: "oft",
                    dt: "",
                    et: "hide",
                    options: ioft
                }, {
                    name: "数据处理",
                    attributeName: "handle",
                    dt: "",
                    et: "array",
                    children: [{
                        name: "数据处理名称",
                        attributeName: "handleName",
                        dt: "",
                        et: "select",
                        options: [{
                            value: '',
                            text: ''
                        }]
                    }, {
                        name: "数据处理参数",
                        attributeName: "params",
                        dt: "",
                        et: "input",
                    }]
                }, {
                    name: "输出描述id",
                    attributeName: "outputFieldDescribeId",
                    dt: "",
                    et: "hide"
                }, {
                    name: "返回客户端",
                    attributeName: "response",
                    dt: "",
                    et: "boolean"
                }, {
                    name: "描述",
                    attributeName: "description",
                    dt: "",
                    et: "textarea"
                }],
                fieldObject: {
                    alias: '',
                    apiLegoId: '',
                    connectorPath: '',
                    ct: '',
                    dt: "string",
                    fieldName: '',
                    fvt: '',
                    id: '',
                    ift: '',
                    name: '',
                    requestParamName: '',
                    validate: ""
                },//传给编辑器的字段对象
                checkedField: []
            };
        },
        props: {
            apiLegoId: {
                required: true
            },
            ioType: {
                required: true
            }
        },
        components: {
            'bb-editor-field-tree': bbEditorFieldtree,
            'bb-editor-field-form': bbEditorFieldform
        },
        computed: {
            commonInputFields: {
                get: function () {
                    return this.getInputFileds('common', "input");
                },
                set: function (val) {
                }
            },
            cacheInputFields: {
                get: function () {
                    return this.getInputFileds('cache', "input");
                },
                set: function (val) {
                }
            },
            readInputFields: {
                get: function () {
                    return this.getInputFileds('read', "input");
                },
                set: function (val) {
                }
            },
            conditionInputFields: {
                get: function () {
                    return this.getInputFileds('condition', "input");
                },
                set: function (val) {
                }
            },
            createInputFields: {
                get: function () {
                    return this.getInputFileds('create', "input");
                },
                set: function (val) {
                }
            },
            updateInputFields: {
                get: function () {
                    return this.getInputFileds('update', "input");
                },
                set: function (val) {
                }
            },
            cacheOutputFields: {
                get: function () {
                    return this.getInputFileds('cache', "output");
                },
                set: function (val) {
                }
            },
            commonOutputFields: {
                get: function () {
                    return this.getInputFileds('common', "output");
                },
                set: function (val) {
                }
            },
            readOutputFields: {
                get: function () {
                    return this.getInputFileds('read', "output");
                },
                set: function (val) {
                }
            },
            conditionOutputFields: {
                get: function () {
                    return this.getInputFileds('condition', "output");
                },
                set: function (val) {
                }
            },
            createOutputFields: {
                get: function () {
                    return this.getInputFileds('create', "output");
                },
                set: function (val) {
                }
            },
            updateOutputFields: {
                get: function () {
                    return this.getInputFileds('update', "output");
                },
                set: function (val) {
                }
            }
        },
        mounted: function () {
            let t = this;
            _TY_Tool.post(_TY_ContentPath + "/list-validate", {}).then(function (response) {
                let data = response['data'];
                if (data['ok']) {
                    let list = data['data']['data_list']['list'];
                    for (let m = 0; m < t.iFields.length; m++) {
                        if (t.iFields[m].attributeName == 'validate') {
                            t.iFields[m].children[0].options = [];
                            for (let i in list) {
                                t.iFields[m].children[0].options.push({
                                    text: list[i].name,
                                    value: list[i].alias
                                });
                            }
                            break;
                        }
                    }
                }
            }).catch(function (error) {
            });

            _TY_Tool.post(_TY_ContentPath + "/list-handle", {}).then(function (response) {
                let data = response['data'];
                if (data['ok']) {
                    let list = data['data']['data_list']['list'];
                    for (let m = 0; m < t.oFields.length; m++) {
                        if (t.oFields[m].attributeName == 'handle') {
                            t.oFields[m].children[0].options = [];
                            for (let i in list) {
                                t.oFields[m].children[0].options.push({
                                    text: list[i].name,
                                    value: list[i].alias
                                });
                            }
                            break;
                        }
                    }
                }
            }).catch(function (error) {
            });
        },
        methods: {
            getCheckedFields(){
                let t = this;
                let currentApiLego = this.$store.state.api.currentApiLego;
                let _fields = currentApiLego[this.currentPopType];
                if (_fields && _fields.length > 0) {
                    let ids = [];
                    _fields.forEach(function (item) {
                        if (item.fieldName) {
                            ids.push(item.fieldName);
                        }
                    });
                    this.checkedField = ids;
                } else {
                    this.checkedField = [];
                }
            },
            __init(){
                let currentApiLego;
                let apiLegos = this.$store.state.api.api.apiLego;
                for (let i = 0; i < apiLegos.length; i++) {
                    if (this.apiLegoId == apiLegos[i].id) {
                        currentApiLego = apiLegos[i];
                        break;
                    }
                }
                if (!currentApiLego.oiAlias && this.ioft != "common" && this.ioft != "cache") {
                    this.$message.success("请先设置数据源!");
                    return false;
                }
                this.$store.commit(types.SET_CURRENT_APILEGO, currentApiLego);
                this.oiAlias = currentApiLego.oiAlias;
                return true;
            },
            openPop(type, field){

                switch (type) {
                    case "readAdd":
                        if (this.ioType == 'output') {
                            this.currentPopType = "readOutputFields";
                        } else {
                            this.currentPopType = "readInputFields";
                        }
                        this.currentPop = "ccurAdd";
                        this.ioft = "read";
                        break;
                    case "readAddCustom":
                        if (this.ioType == 'output') {
                            this.currentPopType = "readOutputFields";
                        } else {
                            this.currentPopType = "readInputFields";
                        }
                        this.currentPop = "customAdd";
                        this.ioft = "read";
                        break;
                    case "conditionAdd":
                        if (this.ioType == 'output') {
                            this.currentPopType = "conditionOutputFields";
                        } else {
                            this.currentPopType = "conditionInputFields";
                        }
                        this.currentPop = "ccurAdd";
                        this.ioft = "condition";
                        break;
                    case "createAdd":
                        if (this.ioType == 'output') {
                            this.currentPopType = "createOutputFields";
                        } else {
                            this.currentPopType = "createInputFields";
                        }
                        this.currentPop = "ccurAdd";
                        this.ioft = "create";
                        break;
                    case "updateAdd":
                        if (this.ioType == 'output') {
                            this.currentPopType = "updateOutputFields";
                        } else {
                            this.currentPopType = "updateInputFields";
                        }
                        this.currentPop = "ccurAdd";
                        this.ioft = "update";
                        break;
                    case "commonAdd":
                        if (this.ioType == 'output') {
                            this.currentPopType = "commonOutputFields";
                        } else {
                            this.currentPopType = "commonInputFields";
                        }
                        this.currentPop = "commonAdd";
                        this.ioft = "common";
                        break;
                    case "cacheAdd":
                        if (this.ioType == 'output') {
                            this.currentPopType = "cacheOutputFields";
                        } else {
                            this.currentPopType = "cacheInputFields";
                        }
                        this.currentPop = "cacheAdd";
                        this.ioft = "cache";
                        break;
                    case "read":
                        if (this.ioType == 'output') {
                            this.currentPopType = "readOutputFields";
                        } else {
                            this.currentPopType = "readInputFields";
                        }
                        this.currentPop = "ccurEdit";
                        this.ioft = "read";
                        break;
                    case "condition":
                        if (this.ioType == 'output') {
                            this.currentPopType = "conditionOutputFields";
                        } else {
                            this.currentPopType = "conditionInputFields";
                        }
                        this.currentPop = "ccurEdit";
                        this.ioft = "condition";
                        break;
                    case "create":
                        if (this.ioType == 'output') {
                            this.currentPopType = "createOutputFields";
                        } else {
                            this.currentPopType = "createInputFields";
                        }
                        this.currentPop = "ccurEdit";
                        this.ioft = "create";
                        break;
                    case "update":
                        if (this.ioType == 'output') {
                            this.currentPopType = "updateOutputFields";
                        } else {
                            this.currentPopType = "updateInputFields";
                        }
                        this.currentPop = "ccurEdit";
                        this.ioft = "update";
                        break;
                    case "common":
                        if (this.ioType == 'output') {
                            this.currentPopType = "commonOutputFields";
                        } else {
                            this.currentPopType = "commonInputFields";
                        }
                        this.currentPop = "commonEdit";
                        this.ioft = "common";
                        break;
                    case "cache":
                        if (this.ioType == 'output') {
                            this.currentPopType = "cacheOutputFields";
                        } else {
                            this.currentPopType = "cacheInputFields";
                        }
                        this.currentPop = "cacheEdit";
                        this.ioft = "cache";
                        break;
                    default:
                        break;
                }
                if (!this.__init()) {
                    return false;
                }
                this.popBg = "down";
                this.showPop();
                if (!field) {
                    field = {};
                }
                //填充已选择的字段
                this.getCheckedFields();
                if (this.ioType == 'input') {
                    //初始化输入字段
                    field.ift = this.ioft;
                    if (!field.ct) {
                        field.ct = "eq";
                    }
                    if (!field.dt) {
                        field.dt = "string"
                    }
                    if (this.ioft == 'condition') {
                        this._changeFormEditor(this.iFields, 'condition', "ct", "select", "hide");
                    } else {
                        this._changeFormEditor(this.iFields, 'condition', "ct", "hide", "hide");
                    }
                } else {
                    //初始化输出字段
                    field.oft = this.ioft;
                    if (!field.dt) {
                        field.dt = "string"
                    }
                    // if (this.ioft == 'common') {
                    //     //只有常用字段显示数据类型
                    //     this._changeFormEditor(this.oFields, 'common', "dt", "select", "hide");
                    // } else {
                    //     this._changeFormEditor(this.oFields, 'common', "dt", "hide", "hide");
                    // }
                    // if (this.ioft == 'cache') {
                    //     //只有常用字段显示数据类型
                    //     this._changeFormEditor(this.oFields, 'cache', "dt", "select", "hide");
                    // } else {
                    //     this._changeFormEditor(this.oFields, 'cache', "dt", "hide", "hide");
                    // }
                }
                //设置字段
                if (this.ioType == 'input' && field && !field.validate) {
                    field.validate = '';
                }
                if (this.ioType == 'output' && field && !field.handle) {
                    field.handle = '';
                }
                //如果直接 this.fieldObject =field 部分新字段并不是响应式的
//                为什么Object.assign(this.fieldObject,field);  switch会有问题，参考 https://segmentfault.com/a/1190000007787941?_ea=1459649
                this.fieldObject = Object.assign({}, {
                    alias: '',
                    apiLegoId: '',
                    connectorPath: '',
                    ct: '',
                    dt: "string",
                    fieldName: '',
                    fvt: '',
                    id: '',
                    ift: '',
                    name: '',
                    requestParamName: '',
                    validate: ""
                }, field);

                //改变common类型的字段编辑器类型
                this._changeFormEditor(this.iFields, 'common,cache', "fieldName", "input", "fieldtree");
                this._changeFormEditor(this.oFields, 'common,cache', "fieldName", "input", "fieldtree");
                //初始化fvt显示问题
                if (field.fvt) {
                    this._changeFVTEditor(field.fvt);
                }

            },
            _changeFormEditor(fields, ioft, attrName, srcEt, targetEt){
                for (let m = 0; m < fields.length; m++) {
                    let item = fields[m];
                    if (ioft.indexOf(this.ioft) >= 0 && item.attributeName == attrName) {
                        item.et = srcEt;
                        break;
                    } else if (ioft.indexOf(this.ioft) < 0 && item.attributeName == attrName) {
                        item.et = targetEt;
                        break;
                    }
                }
            },
            showPop(){
                //优化pop打开样式
                let current = event.currentTarget;
                let left = current.offsetLeft + current.offsetWidth - 2 + "px";
                let top = current.offsetTop + "px";
                this.popStyle.left = left;
                this.popStyle.top = top;
                let pop = this.$refs.popover;
                pop.doShow();
            },
            closePop(){
                this.popBg = "hide";
                this.$refs.popover.doClose();
            },
            showingPop(){
                let doms = document.getElementsByClassName('el-popover');
                for (let i = 0; i < doms.length; i++) {
                    doms[i].setAttribute("x-placement", "right");
                }
            },
            getInputFileds(type, _ioType) {
                let apiLegos = this.$store.state.api.api.apiLego;
                if (this.apiLegoId) {
                    for (let i = 0; i < apiLegos.length; i++) {
                        if (apiLegos[i].id == this.apiLegoId) {
                            if (type == 'condition') {
                                if (_ioType == "output") {
                                    return apiLegos[i].conditionOutputFields ? apiLegos[i].conditionOutputFields : [];
                                } else {
                                    return apiLegos[i].conditionInputFields ? apiLegos[i].conditionInputFields : [];
                                }
                            } else if (type == 'read') {
                                if (_ioType == "output") {
                                    return apiLegos[i].readOutputFields ? apiLegos[i].readOutputFields : [];
                                } else {
                                    return apiLegos[i].readInputFields ? apiLegos[i].readInputFields : [];
                                }
                            } else if (type == 'create') {
                                if (_ioType == "output") {
                                    return apiLegos[i].createOutputFields ? apiLegos[i].createOutputFields : [];
                                } else {
                                    return apiLegos[i].createInputFields ? apiLegos[i].createInputFields : [];
                                }
                            } else if (type == 'update') {
                                if (_ioType == "output") {
                                    return apiLegos[i].updateOutputFields ? apiLegos[i].updateOutputFields : [];
                                } else {
                                    return apiLegos[i].updateInputFields ? apiLegos[i].updateInputFields : [];
                                }
                            } else if (type == 'cache') {
                                if (_ioType == "output") {
                                    return apiLegos[i].cacheOutputFields ? apiLegos[i].cacheOutputFields : [];
                                } else {
                                    return apiLegos[i].cacheInputFields ? apiLegos[i].cacheInputFields : [];
                                }
                            } else {
                                if (_ioType == "output") {
                                    return apiLegos[i].commonOutputFields ? apiLegos[i].commonOutputFields : [];
                                } else {
                                    return apiLegos[i].commonInputFields ? apiLegos[i].commonInputFields : [];
                                }
                            }
                        }
                    }
                } else {
                    return [];
                }
            },
            _transferConnAliasToJsonAlias(connAlias){
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
            _checkFieldConnAliasEQNodeConnAlias(fieldConnAlias, nodeConnAlias){
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
            treeCommit(selectedNode){
                let t = this;
                this.closePop();
                if (this.ioType == 'input') {

                    if (this.currentPopType != 'commonInputFields' && this.currentPopType != 'cacheInputFields') {
                        //commonInputFields没有树形选择字段

                        let result = [];

                        let apiLegos = this.$store.state.api.api.apiLego;
                        for (let i = 0; i < apiLegos.length; i++) {
                            if (apiLegos[i].id == this.apiLegoId) {
                                let inputFields = apiLegos[i][this.currentPopType];
                                //遍历选择的节点
                                for (let m = 0; m < selectedNode.length; m++) {
                                    let node = selectedNode[m];
                                    if (this.currentPopType != 'conditionInputFields') {
                                        //条件字段可以多选,读取字段只能选择一个
                                        let exist = false;
                                        for (let j = 0; j < inputFields.length; j++) {
                                            let inputField = inputFields[j];
                                            if (inputField.fieldName == node.fieldName && (t._checkFieldConnAliasEQNodeConnAlias(inputField.connectorPath, node.connectorAlias))) {
                                                exist = true;
                                                break;
                                            }
                                        }
                                        if (exist) {
                                            continue;
                                        }
                                    }
                                    result.push({
                                        id: '',
                                        name: node.label,
                                        fieldName: node.fieldName,
                                        alias: node.fieldName,
                                        fvt: this.ioft != 'read' ? 'request' : '',
                                        ift: this.ioft,
                                        ct: 'eq',
                                        apiLegoId: this.apiLegoId,
                                        connectorPath: t._transferConnAliasToJsonAlias(node.connectorAlias),
                                        requestParamName: node.fieldName
                                    });
                                }
                                break;
                            }
                        }
                        if (result && result.length > 0) {
                            // 将result作为参数传给后台添加字段,  请求返回之后更新store中的值，并且将inputFields中 fieldName为null的记录清除(read，condition,create,update组数据)
                            this.$store.dispatch('addBatchInputField', {
                                list: result,
                                type: this.currentPopType
                            });
                        }
                    }
                } else {
                    //output
                    if (this.currentPopType != 'commonOutputFields' && this.currentPopType != 'cacheOutputFields') {
                        //commonOutputFields没有树形选择字段
                        let result = [];

                        let apiLegos = this.$store.state.api.api.apiLego;
                        for (let i = 0; i < apiLegos.length; i++) {
                            if (apiLegos[i].id == this.apiLegoId) {
                                let outputFields = apiLegos[i][this.currentPopType];
                                //遍历选择的节点
                                for (let m = 0; m < selectedNode.length; m++) {
                                    let node = selectedNode[m];
                                    let exist = false;
                                    for (let j = 0; j < outputFields.length; j++) {
                                        let outputField = outputFields[j];
                                        //TODO 校验字段是否重复 级联字段有问题 需要优化  输出字段目前只支持单表
                                        if (outputField.fieldName == node.fieldName) {
                                            exist = true;
                                            break;
                                        }
                                    }
                                    if (exist) {
                                        continue;
                                    }
                                    result.push({
                                        id: '',
                                        name: node.label,
                                        fieldName: node.fieldName,
                                        alias: node.fieldName,
                                        oft: this.ioft,
                                        response: true,
                                        apiLegoId: this.apiLegoId
                                    });
                                }
                                break;
                            }
                        }
                        // 将result作为参数传给后台添加字段,  请求返回之后更新store中的值，并且将inputFields中 fieldName为null的记录清除(read，condition,create,update组数据)
                        this.$store.dispatch('addBatchOutputField', {
                            list: result,
                            type: this.currentPopType
                        });

                    }
                }
            },
            commitFieldForm(formData){
                //currentPopType
                if (!formData.apiLegoId) {
                    formData.apiLegoId = this.apiLegoId;
                }
                if (this.ioType == 'input') {
                    this.$store.dispatch('saveAndUpdateInputField', {
                        apiLegoId: this.apiLegoId,
                        data: formData
                    });
                } else {
                    this.$store.dispatch('saveAndUpdateOutputField', {
                        apiLegoId: this.apiLegoId,
                        data: formData
                    });
                }
                this.closePop();
            },
            customEvent(data){
                if (data && data.args) {
                    const attributeName = data.args[1];
                    switch (attributeName) {
                        case 'fvt':
                            this._changeFVTEditor(data.args[0]);
                            break;
                        case 'fieldName':
                            if (typeof data.args[0] === 'object') {
                                this.fieldObject.alias = data.args[0][0].fieldName;
                                this.fieldObject.dt = data.args[0][0].dt;
                            } else {
                                this.fieldObject.alias = data.args[0];
                            }
                            break;
                        default:
                            break;
                    }
                }
            },
            //根据fvt选择显示或者影藏表单字段
            _changeFVTEditor(fvt){
                let t = this;
                this._changeFormEditor(this.iFields, this.ioft, "constant", "hide", "input");
                this._changeFormEditor(this.iFields, this.ioft, "fromApiLegoId", "hide", "select");
                this._changeFormEditor(this.iFields, this.ioft, "fromApiLegoOutputFieldAlias", "hide", "input");
                this._changeFormEditor(this.iFields, this.ioft, "requestParamName", "hide", "input");
                this._changeFormEditor(this.iFields, this.ioft, "sessionParamName", "hide", "input");
                if (fvt == 'output') {
                    this._changeFormEditor(this.iFields, this.ioft, "fromApiLegoOutputFieldAlias", "input", "hide");
                    this._changeFormEditor(this.iFields, this.ioft, "fromApiLegoId", "select", "hide");
                    //如果是output，发请求获取这个api下的所有apilego
                    let apiLegoList = this.$store.state.api.api.apiLego;
                    let options = [];
                    for (let i = 0; i < apiLegoList.length; i++) {
                        let item = {
                            text: apiLegoList[i].index + '-' + apiLegoList[i].legoAlias,
                            value: apiLegoList[i].id,
                        };
                        options.push(item);
                    }
                    for (let i = 0; i < this.iFields.length; i++) {
                        if (this.iFields[i].attributeName == 'fromApiLegoId') {
                            this.iFields[i].options = options;
                        }
                    }
                } else if (fvt == 'constant') {
                    this._changeFormEditor(this.iFields, this.ioft, "constant", "input", "hide");
                } else if (fvt == 'request') {
                    this._changeFormEditor(this.iFields, this.ioft, "requestParamName", "input", "hide");
                } else if (fvt == 'session') {
                    this._changeFormEditor(this.iFields, this.ioft, "sessionParamName", "input", "hide");
                }
            },
            deleteFieldEvent(data){
                let t = this;
                const id = data.id;
                let url = ';'
                if (this.ioType == 'input') {
                    url = _TY_ContentPath + "/delete-inputField";
                } else {
                    url = _TY_ContentPath + "/delete-outputField";
                }
                this.$confirm('确认操作?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    _TY_Tool.post(url, {
                        fieldId: id
                    }).then(function (response) {
                        let data = response['data'];
                        if (data['ok']) {
                            t.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            t.$store.commit(types.DELETE_INPUTOUTFIELD, {
                                id: id,
                                apiLegoId: t.apiLegoId,
                                type: t.currentPopType
                            });
                            t.closePop();
                        } else {
                            t.$message.error(data.message);
                        }
                    }).catch(function (error) {
                    });

                }).catch(() => {
                    t.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });


            }

        }
    }
</script>

<style scoped>

    .up {
        z-index: 100;
    }

    .down {
        z-index: 10;
    }

    .hide {
        z-index: -1;
    }

    .mt10 {
        margin-top: 10px;
    }

    .pt0 {
        padding-top: 0;
    }

    .bg {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }

    .close {
        position: absolute;
        right: 10px;
        z-index: 100;
    }

    .mt20 {
        margin-top: 20px;
    }
</style>