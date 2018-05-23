<template>
    <div class="p20">
        <div class="searchInput" style="margin-top: 15px;">
          <el-input placeholder="请输入搜索条件" v-model="keywords">
            <el-button slot="append" icon="el-icon-search" @click="getData">
            搜索
            </el-button>
          </el-input>
        </div>
        <ul class="ty-icon-ul">

            <li class="ty-icon-li" v-for="(item,index) in tableData" @click="iconClick(item)">
                <span>
                    <i class="iconfont" :class="item.iconClass"></i>
                    <span>{{item.iconClass}}</span>
                </span>
            </li>

        </ul>

    </div>
</template>

<script>
    import Util from '../libs/util.js'
    export default {
        name: 'bb-icon',
        props: {
            value: {
                type: String
            },
            ds: {
                type: Object,
                default: function () {
                    return {
                        api: "/ty-list-icon",
                        method: "get",
                        inputs: [
                            {paramName:'keywords',valueType:"template",variable:"<%=bb.keywords%>"}
                        ],
                        outputs: [
                            {dataKey: "tableData", valueKey: "data_list"}
                        ]
                    }
                }
            }
        },
        data() {
            return {
                tableData: [],
                keywords:''
            }
        },
        watch: {

        },
        computed: {},
        created: function () {
            const t=this;
            t.getData();
        },
        mounted: function () {
            const t = this;
        },
        methods: {
            getData: function () {
                var t = this;
                if (this.ds) {
                    t.loading = true;
                    var routerParams = t.$route ? t.$route.params : {};

                    Util.getDSData(t.ds, _TY_Tool.buildTplParams(t,{'row-data': t.parentParams}), function (map) {
                        map.forEach(function (item) {
                            var list = [];
                            if (item['valueKey'].split('.').length > 1) {//支持定制接口
                                list = item['value']
                            } else {
                                list = item['value']['list'];
                            }
                            t[item['dataKey']] = [];
                            for (var i in list) {
                                t[item['dataKey']].push(list[i]);
                            }
                        });
                    }, function (code, msg) {
                    });
                }
            },
            iconClick(item){
                const t=this;
                t.$emit("icon-click",item.iconClass);
            }
        }
    }
</script>


<style>
    .iconfont {
        font-family: "iconfont" !important;
    }
</style>
<style scoped>
    .ty-icon-ul{
        display: -webkit-flex;
        display: flex;
        overflow: hidden;
        list-style: none;
        padding: 0;
        border: 1px solid #eaeefb;
        border-radius: 4px;
        flex-wrap: wrap;
    }
    .ty-icon-ul:not{
        margin: 10px 0;
        padding: 0 0 0 20px;
        font-size: 14px;
        color: #5e6d82;
        line-height: 2em;
    }
    .ty-icon-li{
        flex:1;
        text-align: center;
        height: 120px;
        line-height: 120px;
        color: #666;
        font-size: 13px;
        transition: color .15s linear;
        border-right: 1px solid #eee;
        border-bottom: 1px solid #eee;
        margin-right: -1px;
        margin-bottom: -1px;
        min-width: 160px;
        cursor: pointer;
    }
    .ty-icon-li:hover{
        background: #efefef;
    }
    .ty-icon-li>span{
        display: inline-block;
        line-height: normal;
        vertical-align: middle;
        font-family: Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,SimSun,sans-serif;
        color: #99a9bf;
    }
    .ty-icon-li>span>i{
        display: block;
        font-size: 32px;
        margin-bottom: 15px;
        color: #5a5e66;
    }
    .ty-icon-li>span>span{
        display: inline-block;
        padding: 0 3px;
        height: 1em;
        color: #5a5e66;
        vertical-align: middle;
    }
    .p20 {
        padding: 20px;
    }
    .searchInput{
        max-width: 400px;
        margin-right: 20px;
        margin-bottom: 15px;
    }
</style>