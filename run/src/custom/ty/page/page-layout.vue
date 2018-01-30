<template>
    <div>
        <el-row :gutter="0">
            <el-col :span="4">
                <h3>积木列表</h3>
            </el-col>
            <el-col :span="4">
                <h3>布局区域</h3>
            </el-col>
            <el-col :span="15">
                <h3>预览区域
                    <span style="margin-left:5px;"><el-button :plain="true" type="text" @click="refresh">刷新</el-button></span>
                </h3>
            </el-col>
        </el-row>
        <el-row :gutter="0">
            <el-col :span="4">
                <div id="location_bb" class="card-border">
                    <div class="bb" v-for="bb in bbList" :name="bb.name" :alias="bb.alias" :key="bb.alias">
                        <el-button :plain="true" type="info" icon="setting">{{bb.name}}</el-button>
                    </div>
                </div>
            </el-col>
            <el-col :span="4" class="card-border">
                <div id="location_canvas">
                    <h3 class="droa-text" v-if="showDragText">请拖动左边的积木到此区域</h3>
                    <bb-pbb v-for="(pbb,index) in pbbList" :key="pbb.pbbId"  :pageAlias="pageAlias"
                            :bb="{alias:pbb.alias,name:pbb.name,pageBuildingBlockId:pbb.pbbId,attributes:pbb.attributes}":index="index" 
                            :attributes = "pbb.attributes"
                            :attributeDescribeList = "pbb.attributeDescribeList"
                            :pbbId="parseInt(pbb.pbbId)"
                            @remove="remove"></bb-pbb>
                </div>
            </el-col>
            <el-col :span="15" class="card-border">
                <bb-page :pageAlias="pageAlias" ref="TYPage"></bb-page>
            </el-col>
        </el-row>
    </div>
</template>
<script>
    import 'dragula/dist/dragula.css';
    import pbb from "../components/bb-pbb";

    export default {
        data() {
            return {
                showDragText: true,
                bbList: [],
                pbbList: [],
                map: new Map(),
                breadcrumbFields:[{path:'/',name:'a'},{path:'/b',name:'b'}],
            };
        },
        computed:{
            pageAlias:function(){
                return this.$route.query.param2;
            }
        },
        components: {
            'bb-pbb': pbb
        },
        created: function () {
            const t = this;
            this.getData();
            this.getPage();
        },
        watch: {
            pbbList: function (val) {
                this.pbbList = val;
            }
        },
        mounted() {
            var t = this;
            require.ensure(['dragula/dragula', 'jquery'], function (require) {
                var dragula = require("dragula/dragula");
                var $ = require("jquery");
                t.drake = dragula([document.getElementById('location_bb'),
                    document.getElementById('location_canvas')], {
                    copy: function (el, source) {
                        return source !== document.getElementById('location_canvas')
                    },
                    accepts: function (el, target) {
                        return target === document.getElementById('location_canvas')
                    },
                });
                t.drake.on('drop', function (el, target, source, sibling) {
                    if (target == null) {
                        return;
                    }
                    if ($(el).hasClass('bb')) {
                        var siblingIndex = -1;
                        if (sibling != null) {
                            siblingIndex = parseInt($(sibling).find('.bb-setting').attr('index'));
                        }
                        var pbb = {
                            alias: $(el).attr("alias"),
                            name: $(el).attr("name")
                        };

                        var params = {
                            alias: $(el).attr("alias"),
                            name: $(el).attr("name"),
                            pageAlias: t.$route.query.param2,
                            buildingBlockAlias: $(el).attr("alias")
                        };
                        _TY_Tool.post(_TY_ContentPath + "/add_pbb", {
                            pageAlias: params.pageAlias,
                            buildingBlockAlias: params.buildingBlockAlias
                        }).then(function(response) {
                            let data = response.data;
                            if (data.ok) {
                                params.pbbId = data.data.unique_value;
                                if (siblingIndex >= 0) {
                                    t.pbbList.splice(siblingIndex, 0, params);
                                } else {
                                    t.pbbList.push(params);
                                }
                                t.showDragText = !(t.pbbList.length > 0);
                                t.setLayout();
                                t.refresh();
                            } else {
                                t.$message.error(data.message);
                            }
                        });
                        el.remove();
                    } else {
                        //拖动变换顺序
                        var siblingIndex = -1;
                        if (sibling != null) {
                            siblingIndex = parseInt($(sibling).find('.bb-setting').attr('index'));
                        }
                        var sourceIndex = parseInt($(el).find('.bb-setting').attr('index'));
                        t.swapItems(t.pbbList, sourceIndex, siblingIndex);
                        t.setLayout();
                        t.refresh();
                    }
                });
            });
        },
        methods: {//初始化页面获取pbb列表
            getPage: function () {
                const t = this;
                t.loading = true;
                t.pbbList = [];
                 _TY_Tool.get(_TY_ContentPath + "/read-page", {
                    alias: t.$route.query.param2,
                }).then(function(response) {
                    t.loading = false;
                    let data = response.data.data.data;
                    if (response.data.ok) {
                        //更新pageKeys数据
                        const layoutArray = JSON.parse(data.layout) || [];
                        t.createPbbList(layoutArray);
                        t.pageKeys = data;
                    } else {
                        t.$message.error(response.data.message);
                    }
                })
            },
            //初始化pbb列表
            createPbbList: function (layoutArray) {
                const t = this;
                let pbb = {};
                let pbbItems = [];
                let a = 0
                layoutArray.forEach((val, key) => {
                    let pbbId = val[0];
                    const params = {
                        pbbId: pbbId
                    };
                    pbbItems.splice(val[1],0,params);
                    t.pbbList.splice(val[1],0,params);
                });
                t.readPbbItem(pbbItems,a);
            },
            readPbbItem:function(pbbItems,a){
                const t = this;
                let params = pbbItems[a];
                a++;
                if(params){
                    _TY_Tool.get(_TY_ContentPath+'/read-pbb-by-id', params).then(res => {
                        var data = res.data.data.data;
                        var attributeDescribeList = res.data.data.data_list.list;
                        let pbb = {
                            alias: data.alias,
                            name: data.name,
                            pageAlias: data.pageAlias,
                            buildingBlockAlias: data.buildingBlockAlias,
                            pbbId: data.id,
                            attributes:data.attributes,
                            attributeDescribeList:attributeDescribeList
                        };
                        t.pbbList.forEach((ele,index)=>{
                            if(ele.pbbId == data.id){
                                t.pbbList.splice(index,1,pbb);
                            }
                        })
                        t.showDragText = !(t.pbbList.length > 0);
                        t.readPbbItem(pbbItems,a)
                    }).catch((err)=>{
                        t.$message({
                            type: 'error',
                            message: '获取积木信息失败!' + err
                        });
                    })
                }
            },
            remove: function (index) {
                const t = this;
                var params = {
                    id: t.pbbList[index].pbbId
                };

                _TY_Tool.post(_TY_ContentPath + "/delete-pbb", {
                    id: params.id
                }).then(function(response) {
                    let data = response.data;
                    if (data.ok) {
                        t.pbbList.splice(index, 1);
                        t.showDragText = !(t.pbbList.length > 0);
                        t.setLayout();
                        t.refresh();
                    } else {
                        t.$message.error(data.message);
                    }
                });
            },
            refresh: function () {
                this.$refs['TYPage'].refresh();
            },
            //获取线上bb组件列表
            getData: function () {
                const t = this;
                _TY_Tool.post(_TY_ContentPath + "/list-bb", {
                    type:''
                }).then(function(response) {
                    let data = response.data;
                    if (data.ok) {
                        //更新pageKeys数据
                        const newList = data.data.data_list.list;
                        newList.forEach((list, index) => {
                            t.$set(t.bbList, index, list);
                        });
                    } else {
                        t.$message.error(data.message);
                    }
                });
            },
            //选中bb组件到列表
            addPbb: function (params) {
                const t = this;

                _TY_Tool.post(_TY_ContentPath + "/add_pbb", {
                    pageAlias: params.pageAlias,
                    buildingBlockAlias: params.buildingBlockAlias
                }).then(function(response) {
                    let data = response.data;
                    if (data.ok) {
                        params.unique_value = data.data.unique_value;
                        //更新pageKeys数据
                        commit(types.ADD_PBB, params);
                        resolve(data);
                    } else {
                        t.$message.error(data.message);
                    }
                });
            },
            // 交换数组元素
            swapItems: function (arrDefault, index1, index2) {
                const t = this;
                if(index2 <0){
                    index2 = arrDefault.length - 1;
                }
                let arr = arrDefault;
                const ele2 = t.pbbList.splice(index1, 1)[0];
                if (index1 - index2) {
                    t.pbbList.splice(index2, 0, ele2);
                } else {
                    t.pbbList.splice(index2 - 1, 0, ele2);
                }
            },
            // 设置layout 同步到服务端
            setLayout: function () {
                const t = this;
                t.layout = [];
                t.pbbList.forEach((val, key) => {
                    let newArr = [];
                    newArr.push(val.pbbId, key, 0);
                    t.layout.push(newArr);
                });
                const params = t.pageKeys;
                _TY_Tool.post(_TY_ContentPath + "/update-page-layout", {
                    name: params.name,
                    alias: params.alias,
                    description: params.description,
                    layout: JSON.stringify(t.layout),
                    layoutType: params.layoutType
                }).then(function(response) {
                    let data = response.data;
                    if (data.ok) {
                    } else {
                        t.$message.error(data.message);
                    }
                });
            },

        }
    };
</script>

<style scoped>
    .bb {
        margin-bottom: 5px;
        text-align: center;
    }

    .card-border {
        border: 2px dashed #ccc;
        padding-left: 5px;
        padding-top: 5px;
        min-height: 500px;
        max-height: 600px;
        margin-right: 5px;
        overflow: auto;
    }

    .droa-text {
        text-align: center;
        /*margin-top: 200px;*/
    }
</style>