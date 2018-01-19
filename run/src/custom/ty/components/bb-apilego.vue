<template>
    <div class="w60 ">
        <el-button type="primary" class="m10" @click="listLego">添加Lego</el-button>

        <div class="lego_container" id="api_lego_box">
            <div v-for="(card,index) in api.apiLego" :key="card.id" class="api_lego_card" :index="card.index" :card-id="card.id">
                <div class="m10 card-border minha">
                    <i class="el-icon-close" style="float: right;" @click="deleteApiLego(card.id)"></i>

                    <bb-inputfield-group class="w70" io-type="input" :api-lego-id="card.id"></bb-inputfield-group>
                    <div class="tac">
                        <!--<el-button type="primary" icon="plus" size="mini" class="vat" @click="inputFieldSet(card)"></el-button>-->
                        <div class="iconfont ty-jiantou-copy vat center" style="font-size:42px;text-align:center;"></div>
                    </div>
                    <el-card class="box-card">

                        <div class="item clearfix">
                            <span style="line-height: 36px;padding: 0 20px;">模块 : {{card.legoAlias}}</span>
                            <span style="line-height: 36px;padding: 0 20px;">数据源 :{{card.oiAlias}}
                                 <bb-editor-oi-select :api-lego-id="card.id"
                                                      :lego-alias="card.legoAlias"></bb-editor-oi-select>
                            </span>
                            <br/>
                            <span style="line-height: 36px;padding: 10px 20px;display:flex;">
                                 <label style="width: 50px;">描述:</label>
                                 <el-input type="textarea" :rows="1" :disabled="false" @change="desChange(card,$event)"
                                           :value="card.description"></el-input>
                                <!--<el-button type="primary" @click="updateDes">更新描述</el-button>-->
                            </span>

                        </div>
                    </el-card>
                    <div class="tac">
                        <!--<el-button type="primary" icon="plus" size="mini" class="vat" @click="outputFieldSet(card)"></el-button>-->
                        <div class="iconfont ty-jiantou-copy vat center" style="font-size:42px;text-align:center;"></div>
                    </div>
                    <bb-inputfield-group class="w70" io-type="output" :api-lego-id="card.id"></bb-inputfield-group>
                </div>

                <div class="iconfont ty-jiantou vat center" style="font-size:42px;text-align:center;"></div>
            </div>

            <div v-if="api.apiLego.length>0" class="card-border minha w50">
                <p class="end">结束</p>
            </div>

        </div>

        <!--step3 lego-->
        <bb-lego-pageselect :dialog-show.sync="legoDialogShow" @on-result-change="onLegoDialogResultChange"
                            @lego-select="legoSelect"></bb-lego-pageselect>


        <div class="m10">
            <el-button type="primary" @click="next">下一步</el-button>
        </div>
    </div>
</template>

<script>
    import bbLegoPageSelect from "./bb-lego-pageselect";
    import bbInputfieldGroup from "./bb-inputfield-group";
    import bbEditorOiSelect from "./bb-editor-oi-select";
    import * as types from '../store/mutation-types';

    export default {
        name: 'bb-apilego',
        components: {
            'bb-lego-pageselect': bbLegoPageSelect,
            'bb-inputfield-group': bbInputfieldGroup,
            'bb-editor-oi-select': bbEditorOiSelect
        },
        data() {
            return {
                legoDialogShow: false,
            };
        },
        computed: {
            api: {
                get: function () {
                    return this.$store.state.api.api;
                },
                set: function (val) {
                }
            }
        },
        mounted: function () {
            let t = this;
            const apiAlias = this.$route.params.param2;
            this.$store.dispatch('getApiInfo', {
                alias: apiAlias
            }).then(function (data) {
                const apiLegoList = data['data']['data_list']['list'];//apiLegoList[i]['data']
                for (let i = 0; i < apiLegoList.length; i++) {
                    let item = apiLegoList[i];
                    (function (item) {
                        //查询输入字段
                        t.$store.dispatch('getApiLegoInputFieldByApiLegoId', {
                            apiLegoId: item.id,
                            apilego: item
                        });
                        //查询输出字段
                        t.$store.dispatch('getApiLegoOutputFieldByApiLegoId', {
                            apiLegoId: item.id,
                            apilego: item
                        });
                        //查询输入输出描述字段
                        t.$store.dispatch('getLegoFieldDescription', {
                            apiLegoId: item.id,
                            legoAlias: item.legoAlias
                        });

                    })(item);

                }
            }, function (data) {
                t.$message.error(data.message);
            });

            //拖拽
            require.ensure(['dragula/dragula', 'jquery'], function (require) {
                var dragula = require("dragula/dragula");
                var JQUERY = require("jquery");
                t.drake = dragula([document.getElementById('api_lego_box')], {
//                    mirrorContainer:document.getElementById("ty-content"),
                    direction: 'vertical',
                });
                t.drake.on('drag',function(el,source){
                    //解决拖拽和滚动条的冲突问题
                    t.changeCss();
                });
                t.drake.on('drop', function (el, target, source, sibling) {
                    //恢复css样式
                    t.recoverCss();
                    if (target == null) {
                        return;
                    }
                    let index = parseInt(JQUERY(el).attr('index'));
                    if (!index) {
                        return;
                    }
                    t.updateIndex(JQUERY);
                });
            });
            //解决拖拽和滚动条的冲突问题
            t.changeCss();
        },
        methods: {
            //为了  解决拖拽和滚动条不兼容问题
            changeCss(){
                const t=this;
                let tyContent = document.getElementById("ty-content");
                let tyContainerRight = document.getElementById("wy-container-right");
                // 去除ty-content 的wy-content类    去除wy-container-right 的wy-container-height类
                let contentClass= tyContent.getAttribute("class");
                tyContent.setAttribute("class",contentClass.replace("wy-content",""));
                let containerClass = tyContainerRight.getAttribute("class");
                tyContainerRight.setAttribute("class",containerClass.replace("wy-container-height",""));
            },
            recoverCss(){
                const t=this;
                debugger;
                let tyContent = document.getElementById("ty-content");
                let tyContainerRight = document.getElementById("wy-container-right");
                // 去除ty-content 的wy-content类    去除wy-container-right 的wy-container-height类
                let contentClass= tyContent.getAttribute("class");
                if(contentClass.indexOf("wy-content")<0){
                    contentClass = contentClass+" wy-content";
                }
                tyContent.setAttribute("class",contentClass);
                let containerClass = tyContainerRight.getAttribute("class");
                if(contentClass.indexOf("wy-container-height")<0){
                    contentClass = contentClass+" wy-container-height";
                }
                tyContainerRight.setAttribute("class",containerClass);
            },
            listLego()
            {
                this.legoDialogShow = true;
            },
            onLegoDialogResultChange(val){
                this.legoDialogShow = val;
            },
            legoSelect(row)
            {
                let api = this.$store.state.api.api;
                this.$store.dispatch('addApiLego', {
                    apiAlias: api.alias,
                    legoAlias: row.alias,
                    index: api.apiLego.length + 1
                });
            },
            deleteApiLego(id){
                let t = this;
                this.$confirm('此操作将永久删除该条记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$store.dispatch('deleteApiLego', {
                        apiLegoId: id,
                    }).then(function () {
                        t.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            next(){
                let t = this;
                //恢复css样式
                t.recoverCss();
                t.$router.push("/ty/index/ty-api-doc/ty-api-info/" + this.$route.params.param2);
            },
            desChange(row, val){
                let t = this;
                _TY_Tool.post(_TY_ContentPath+"/update-apilego-des-by-id", {
                    id: row.id,
                    description: val
                }).then(function (response) {

                }).catch(function (error) {
                });
            },
            updateIndex(JQUERY){
                let t = this;
                //获取每条记录
                let rows = JQUERY('#api_lego_box').find('.api_lego_card');
                let param = [];
                for (let i=0;i<rows.length;i++) {
                    let item = JQUERY(rows[i]);
                    if (item) {
                        param.push({
                            id: item.attr("card-id"),
                            index: i+1//全部重新排序
                        })
                    }
                }
                debugger;
                this.$store.dispatch('updateBatchApiLegoIndex', param);

            }
        }
    }
</script>

<style scoped>
    .w70 {
        width: 70%;
        margin: 0 auto;
    }

    .w60 {
        width: 60%;
        margin: 0 auto;
    }

    .w50 {
        width: 50%;
        margin: 0 auto;
    }

    .card-border {
        border: 2px dashed #444;
        padding: 10px;
        border-radius: 5px;
    }

    .m10 {
        margin: 10px 0;
    }

    .tac {
        text-align: center;
    }

    .vat {
        vertical-align: middle;
    }

    .center {
        margin: 0 auto;
        display: block;
    }

    .minha {
        min-height: auto;
    }

    .end {
        text-align: center;
        font-weight: 900;
        color: red;
        margin: 5px 0;
    }
</style>