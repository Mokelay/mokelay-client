<template>
    <div class="w70 pr">
        <div class="top_btn">
            <el-button type="text" @click="goto('/ty/index/ty-api/ty-api-add/'+apiInfo.alias)">编辑API</el-button>
            <el-button type="text" @click="goto('/ty/index/ty-api/ty-api-config/'+apiInfo.alias)">编辑乐高</el-button>
        </div>
        <el-form label-position="right" label-width="80px" :model="apiInfo" class="b1">
            <el-form-item class="nom bb1">
                <span class="ml44">{{apiInfo.name}}</span>
            </el-form-item>
            <el-form-item label="接口类型:" class="nom bb1">
                <span>{{apiInfo.category}}</span>
            </el-form-item>
            <el-form-item label="URL:" class="nom bb1">
                <span>{{apiInfo.url}}</span>
            </el-form-item>
            <el-form-item label="请求方式:" class="nom bb1">
                <span>{{apiInfo.method}}</span>
            </el-form-item>
            <el-form-item label="描述:" class="nom">
                <span class="des">{{apiInfo.description}}</span>
            </el-form-item>
        </el-form>

        <el-table
                :data="req"
                style="width: 100%">
            <el-table-column
                    prop="param"
                    label="请求参数">
            </el-table-column>
            <el-table-column
                    prop="dt"
                    label="数据类型">
            </el-table-column>
            <el-table-column
                    prop="check"
                    label="数据校验">
            </el-table-column>
            <el-table-column
                    prop="description"
                    label="描述">
            </el-table-column>
            <el-table-column label="测试请求参数">
                <template scope="scope">
                    <el-input v-model="params[scope.row.param]" placeholder="请输入内容"></el-input>
                </template>
            </el-table-column>
        </el-table>

        <div class="right_btn">
            <el-button type="primary" @click="submit">发送请求</el-button>
        </div>

        <div class="b1 p10">
            <tree-view :data="jsonSource" :options="{rootObjectKey:'响应数据'}"></tree-view>
        </div>

        <p></p>
        <div class="b1 p10">
            <tree-view :data="testJsonSource" :options="{rootObjectKey:'测试响应数据'}"></tree-view>
        </div>

    </div>

</template>

<script>
    import * as types from '../store/mutation-types';

    const validateDict = [{
        alias: 'dateTypeCheck',
        name: '日期类型检测'
    }, {
        alias: 'digitalCheck',
        name: '数字类型检测'
    }, {
        alias: 'graphicVCCheck',
        name: '图形验证码检测'
    }, {
        alias: 'integerTypeCheck',
        name: '整数类型检测'
    }, {
        alias: 'lengthCheck',
        name: '长度检测'
    }, {
        alias: 'numRangeCheck',
        name: '数值范围型检测'
    }, {
        alias: 'required',
        name: '必填检测'
    }]

    export default {
        name: 'bb-apiinfo',
        props: {},
        data() {
            return {
                apiInfo: {
                    name: '',
                    url: this.$route.params.param2,
                    method: 'POST',
                    category:'config',
                    description: ''
                },
                req: [],
                jsonSource: {
                    code: 0,
                    ok: true,
                    message: '',
                    data: {}
                },
                testJsonSource: {},
                params: {}
            };
        },
        watch: {},
        computed: {},
        components: {},
        beforeCreate: function () {
        },
        created: function () {
//            require.ensure(['vue-json-tree-view','vue'],function(require) {
            let TreeView = require('vue-json-tree-view');
            let Vue = require('vue');
            Vue.default.use(TreeView)
//            });
        },
        mounted: function () {
            let t = this;
            this.$store.commit(types.CLEAR_STATE_API_CACHE, {});
            //查询api信息
            const apiAlias = this.$route.params.param2;
            this.$store.dispatch('getApiInfo', {
                alias: apiAlias
            }).then(function (data) {
                const _apiInfo = data['data'];
                if(!_apiInfo.data.url){
                    _apiInfo.data.url = t.apiInfo.url;
                }
                if(!_apiInfo.data.category){
                    _apiInfo.data.category = t.apiInfo.category;
                }
                Object.assign(t.apiInfo, _apiInfo.data);

                const apiLegoList = data['data']['data_list']['list'];//apiLegoList[i]['data'] api的所有apiLego
                let apiLegoIds = '';
                for (let i = 0; i < apiLegoList.length; i++) {
                    const item = apiLegoList[i];
                    if (apiLegoIds) {
                        apiLegoIds = apiLegoIds + ",";
                    }
                    apiLegoIds = apiLegoIds + item.id;
                }
                if (apiLegoIds) {
                    //发送请求
                    _TY_Tool.post(_TY_ContentPath+"/list-api-req", {
                        apiLegoId: apiLegoIds
                    }).then(function (response) {
                        let data = response['data'];
                        if (data['ok']) {
                            let list = data['data']['data_list']['list'];
                            t.req = [];
                            for (let i in list) {
                                if(!t._checkRepeat(list[i].requestParamName,t.req)){
                                    t.req.push({
                                        param: list[i].requestParamName,
                                        dt: list[i].dt || '',
                                        check: t._getCheckType(list[i].validate),
                                        description: list[i].description
                                    });
                                }
                            }
                        }
                    }).catch(function (error) {
                    });

                    _TY_Tool.post(_TY_ContentPath+"/list-api-res", {
                        apiLegoId: apiLegoIds
                    }).then(function (response) {
                        let data = response['data'];
                        if (data['ok']) {
                            let list = data['data']['data_list']['list'];
                            t.jsonSource.data = {};
                            for (let i in list) {
                                t.jsonSource.data[(list[i].alias||list[i].fieldName)] = {
                                    '字段': list[i].name,
                                    '描述': list[i].description || ''
                                };
                            }
                        }
                    }).catch(function (error) {
                    });
                }
            }, function (data) {
                t.$message.error(data.message);
            });

        },
        methods: {
            _getCheckType(validate){
                if (!validate) {
                    return '';
                }
                let result = '';
                let validateJson = JSON.parse(validate);
                for (let i = 0; i < validateJson.length; i++) {
                    let item = validateJson[i];
                    for (let j = 0; j < validateDict.length; j++) {
                        if (item.validateName == validateDict[j].alias) {
                            if (result) {
                                result = result + ",";
                            }
                            result = result + validateDict[j].name;
                            break;
                        }
                    }
                }
                return result;
            },
            submit(){
                let t = this;
                this.$confirm('请不要误删基础数据，确认操作?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    var url = t.apiInfo.url;
                    if(t.apiInfo.category=='config'){
                        url=_TY_ContentPath+"/"+t.apiInfo.url;
                    }
                    if (t.apiInfo.method == 'GET') {
                        _TY_Tool.get(url, t.params).then(function (response) {
                            let data = response['data'];
                            t.testJsonSource = data;
                        }).catch(function (error) {
                        });
                    } else {
                        _TY_Tool.post(url, t.params).then(function (response) {
                            let data = response['data'];
                            t.testJsonSource = data;
                        }).catch(function (error) {
                        });
                    }
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消操作'
                    });
                });
            },
            goto(url){
                this.$router.push(url);
            },
            //验重
            _checkRepeat(name,list){
                if(!list||list.length==0){
                    return false;
                }
                for(let o in list){
                    if(list[o].param==name){
                        return true;
                    }
                }
                return false;
            }

        }
    }
</script>

<style scoped>

    .w70 {
        width: 70%;
        margin: 0 auto;
        max-width: 700px;
    }

    .el-form .nom {
        margin: 0;
    }

    .bb1 {
        border-bottom: 1px solid #ccc;
    }

    .b1 {
        border: 1px solid #ccc;
        border-radius: 5px;
    }

    .des {
        overflow-wrap: break-word;
        line-height: 36px;
        padding-right: 20px;
        display: block;
    }

    .ml44 {
        margin-left: -44px;
    }

    .p10 {
        padding: 10px;
    }

    .right_btn {
        text-align: right;
        padding: 5px 20px;
    }
    .pr{
        position:relative;
    }

    .top_btn{
        position: absolute;
        right: 10px;
        line-height: 37px;
        z-index: 100;
    }


</style>