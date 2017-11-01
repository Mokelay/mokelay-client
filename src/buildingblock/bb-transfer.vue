<template>
    <el-dialog title="输入字段选择" :visible.sync="dialogVisible" size="small">
        <el-transfer
                v-model="transferSelection"
                filterable
                :titles="['源字段', '目标字段']"
                :button-texts="['到左边', '到右边']"
                :footer-format="{noChecked:'${total}',hasChecked:'${checked}/${total}'}"
                @change="transferHandleChange"
                :data="tableData">
            <el-button class="transfer-footer transfer-submit" slot="right-footer" @click="submit" size="small">确定</el-button>
        </el-transfer>
    </el-dialog>
</template>

<script>
    import Util from '../libs/util';

    export default {
        name: 'bb-transfer',
        props: {
            dialogShow: {
                type: Boolean,
                default: false
            },
            api: {
                type: String,
                required: true
            },
            params: {
                type: Object
            },
        },
        watch: {
            dialogShow(val) {
                this.dialogVisible = val;//②监听外部对props属性dialogShow的变更，
                if(val){
                    this.getData();
                }
            },
            dialogVisible(val){
                this.$emit("on-result-change", val);//③组件内对myResult变更后向外部发送事件通知
            }
        },
        computed: {},
        data() {
            return {
                dialogVisible: this.dialogShow,
                tableData: [],
                transferSelection:[]
            }
        },
        created: function () {
            this.getData();
        },
        methods: {
            getData: function () {
                var t = this;
                if(this.params&&!this.params.oiAlias){
                    return;
                }
                Util.post(this.api, this.params).then(function (response) {
                    var data = response['data'];
                    if (data['ok']) {
                        var list = data['data']['data_list']['list'];
                        var tableData = [];
                        for (var i in list) {
                            //list[i]['data']
                            tableData.push({
                                key:list[i].fieldName,
                                label:list[i].name
                            });
                        }
                        t.tableData = tableData;
                    }
                }).catch(function (error) {
                });
            },
            transferHandleChange(value, direction, movedKeys){
                //改变选项后触发
                debugger;
            },
            submit(){
                debugger;
            }
        }
    }
</script>

<style scoped>
    .transfer-submit{
        float: right;
        margin: 4px 20px 4px;
    }

</style>