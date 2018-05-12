<template>
    <div class="bb-view-group">
        <div v-for="(view,key) in viewList">
            <bb-view :key="key" class="bb-view-group-item" :fields="realFields" :value="view"></bb-view>
        </div>
        <el-row v-if="pagination.show" type="flex" justify='end'>
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
    export default {
        name: 'bb-view-group',
        props: {
            /*静态表单项
                [{
                    alias:''表单项键名
                    aliasName:''表单项名称
                    dt:'String,Number,File,Image' 值类型,
                    width:'33.33%'
                }]
            */
            fields:{
                type:Array
            },
            /*动态表单项*/
            fieldsDs:{
                type:Object
            },
            /*静态数据
                {   
                    键名：键值
                    alias1:'测试数据',
                    alias2:1,
                    alias3:[{
                        name:'文件名称.pdf',
                        href:'http://www..../123.pdf'
                    }],
                    alias4:[{
                        name:'图片名称',
                        href:'http://.....123.jpg'
                    }]
                }
            */
            data:{
                type:Array,
            },
            /*动态数据*/
            dataDS:{
                type:Object
            },
            /*分页配置
                {f
                    show:true
                    page:1,
                    pageSize:10,
                }
            */
            pagination:{
                type:Object,
                default:function(){
                    return {
                        show:false,
                        page:1,
                        pageSize:10
                    }
                }
            }
        },
        data() {
            return {
                viewList:this.data,
                realFields:this.fields,
                pageSize:this.pagination.pageSize,
                pageSizes:[this.pagination.pageSize*1, this.pagination.pageSize*2, this.pagination.pageSize*5, this.pagination.pageSize*10],
                page:this.pagination.page,
                totalItems:0
            }
        },
        watch: {
        },
        created: function () {
            const t = this;
            t.getFields();
            t.getData();
        },
        mounted:function(){
        },
        methods: {
            //通过DS获取表单项
            getFields: function () {
                const t = this;
                if (t.fieldsDs) {
                    _TY_Tool.getDSData(t.fieldsDs, _TY_Tool.buildTplParams(t), function (map) {
                        map.forEach((val,key)=>{
                            const dataKey = val.dataKey
                            t.realFields = val.value;
                        })
                    }, function (code, msg) {
                    });
                }
            },
            //通过DS获取表单数据
            getData: function () {
                const t = this;
                if (t.dataDS) {
                    t.loading = true;
                    _TY_Tool.getDSData(t.dataDS,  _TY_Tool.buildTplParams(t), function (map) {
                        if (t.pagination.show) {
                                map.forEach(function (item) {
                                    var list = item['value']['currentRecords'];
                                    t.viewList = [];
                                    for (var i in list) {
                                        t.viewList.push(list[i]);
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
                                    t.viewList = [];
                                    for (var i in list) {
                                        if(t.hiddenValueKey){
                                            t.hiddenItems.forEach((ele)=>{//前端支持列表筛选
                                                if(list[i][t.hiddenValueKey] != ele ){
                                                    t.viewList.push(list[i]);
                                                }
                                            })
                                        }else{
                                            t.viewList.push(list[i]);
                                        }
                                    }
                                    t.totalItems = (item['value']&&item['value']['totalRecords'])?item['value']['totalRecords']:0;
                                });
                            }
                        t.loading = false;
                    }, function (code, msg) {
                        t.loading = false;
                    });
                }
            },
            //外部刷新表单数据
            linkage:function(...data){
                if(data){
                    this.external['linkage'] = data;
                    this.getData();
                }
            },
            handleSizeChange: function (page,pageSize) {
                this.pageSize = pageSize;
                this.getData();
            },
            handleCurrentChange: function (page) {
                this.page = page;
                this.getData();
            },
            //外部设置表单值
            setData:function(...args){
                const t = this;
                args.forEach((val,key)=>{
                    if(val.type == 'custom' && val.arguments){
                        let newData = val.arguments;
                        t.viewList = newData;
                    }
                });
            }
        }
    }
</script>
<style lang='less'>
    .bb-view-group{
        .bb-view-group-item{
            margin-bottom:20px; 
        }
    }
</style>