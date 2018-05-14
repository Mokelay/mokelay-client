<template>
    <div class=" pr">
        <div class="top_btn">
            <el-button type="text" @click="refrash">刷新</el-button>
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
                    v-if="full"
                    prop="dt"
                    label="数据类型">
            </el-table-column>
            <el-table-column
                    v-if="full"
                    prop="check"
                    label="数据校验">
            </el-table-column>
            <el-table-column
                    v-if="full"
                    prop="description"
                    label="描述">
            </el-table-column>
            <el-table-column label="测试请求参数">
                <template slot-scope="scope">
                    <el-input v-model="params[scope.row.param]" placeholder="请输入内容"></el-input>
                </template>
            </el-table-column>
        </el-table>

        <div class="right_btn">
            <el-button type="primary" @click="submit">发送请求</el-button>
        </div>

        <p></p>
        <div class="b1 p10">
            <bb-json :data="testJsonSource" :defaultOpen="1"></bb-json>
        </div>

    </div>

</template>

<script>
    
    import bbjson from "./../buildingblock/vendor/bb-json";

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
        name: 'bb-api-info',
        props: {},
        data() {
            return {
                apiInfo: {
                    name: '',
                    url: this.$route.query.param,
                    method: 'POST',
                    category:'config',
                    description: ''
                },
                req: [],
                full:false,
                testJsonSource: {
                },
                params: {}
            };
        },
        watch: {},
        computed: {},
        components: {
            'bb-json': bbjson,
        },
        beforeCreate: function () {
        },
        created: function () {
        },
        mounted: function () {
            let t = this;
            t.refrash();
        },
        methods: {
            refrash:function(){
                let t=this;
                const apiAlias = this.$route.query.param;
                var ds = {
                    api:"load-api",
                    category:'config',//ds选择器 不是type字段而是category字段
                    method:"get",
                    inputs:[
                        {paramName:'apiAlias',valueType:"constant",constant:apiAlias},
                    ],
                    outputs:[
                        {dataKey:"data",valueKey:"data"},
                        {dataKey:"req_list",valueKey:"req_list"},
                    ]
                };
                _TY_Tool.getDSData(ds, _TY_Tool.buildTplParams(t), function (map) {
                    map.forEach(function(data,index){
                        if(data.dataKey == 'data'){
                            const apiData = data.value;
                            Object.assign(t.apiInfo, apiData);
                            if(apiData.category == 'config'){
                              t.apiInfo.url = apiData.alias
                            }
                        }else if(data.dataKey == 'req_list'){
                            const reqs = data.value.list;
                            t.req = [];
                            for (let i in reqs) {
                                t.req.push({
                                    param: reqs[i].requestParamName,
                                    dt: reqs[i].dt || '',
                                    check: t._getCheckType(reqs[i].validate),
                                    description: reqs[i].description
                                });
                            }
                        }
                    });
                }, function (code, msg) {
                      //接口执行完毕
                });
            },
            toFull:function(){
                let t = this;
                t.full = true;
            },
            toSmall:function(){
                let t = this;
                t.full = false;
            },
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