<template>
    <div>
        <bb-dialog title="Lego列表" :isShow.sync="dialogVisible" size="small">
            <!--<bb-page :api="api" :columns="columns" @page-select="pageSelect"></bb-page>-->
            <bb-list :pagination="true" search :ds="ds" :popup="true" :columns="columns" @list-select="pageSelect" ></bb-list>

        </bb-dialog>
    </div>
</template>

<script>

    export default {
        name: 'legoPageSelect',
        props: {
            dialogShow: {
                type: Boolean,
                default: false
            }
        },
        watch: {
            dialogShow(val) {
                this.dialogVisible = val;//②监听外部对props属性dialogShow的变更，
            },
            dialogVisible(val){
                this.$emit("on-result-change",val);//③组件内对myResult变更后向外部发送事件通知
            }
        },
        data() {
            return {
                dialogVisible:this.dialogShow,
                ds:{
                    api: "/page-lego",
                    method: "post",
                    inputs: [
                        {paramName: 'pageSize', valueType: "inputValueObj", valueKey: "bb", variable: "pageSize"},
                        {paramName: 'page', valueType: "inputValueObj", valueKey: "bb", variable: "page"},
                        {paramName: 'keywords', valueType: "inputValueObj", valueKey: "bb", variable: "keywords"}
                    ],
                    outputs: [
                        {dataKey: "tableData", valueKey: "page_data"}
                    ]
                },
                columns: [{
                    prop: 'name',
                    label: '名称'
                }, {
                    prop: 'alias',
                    label: '别名'
                }, {
                    prop: 'description',
                    label: '描述'
                }],
            };
        },
        methods: {
            pageSelect(row){
                this.$confirm('确认操作?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.dialogVisible = false;
                    this.$emit("lego-select",row);
                }).catch(() => {
                        this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
            }
        }
    }
</script>

<style scoped>

</style>