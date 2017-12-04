<template>
    <div class="popup-selection">
        <span v-if="!showSearchInput" class="showResult">{{buttonConfig.showResult ? text : ''}}</span>
        <bb-button v-if="!showSearchInput" @click="showSelect" :type="buttonConfig.type" :icon="buttonConfig.icon">{{buttonName}}</bb-button>


        <el-input v-if="showSearchInput" v-model="text" @keyup.native.enter="showSelect"
                  style="width: 100%;" placeholder="请输入搜索内容" @focus="showSelect">
            <bb-button type="primary" slot="append" icon="search" @click="showSelect">{{buttonName}}</bb-button>
        </el-input>
        <el-dialog class="dialog" :title="title" :visible.sync="popupVisible" :modal="showModal" size="tiny">
            <bb-list :ds="popupGrid.ds" search :popup="true" :parentParams="parentParams" :columns="popupGrid.columns"
                     :selection="popupGrid.selection" :pagination="popupGrid.pagination" @list-select="listSelect"
                     :searchConfig="popupGrid.searchConfig" :showHeader="popupGrid.showHeader"
                     :highlightCurrent="highlightCurrent" :stripe="stripe" :hiddenValueKey="hiddenValueKey"
                     :hiddenItems="hiddenItems"></bb-list>
        </el-dialog>
    </div>
</template>

<script>
    import Util from '../libs/util';

    export default {
        name: 'bb-popup-selection',
        props: {
            value: {
                type: [String, Number]
            },
            title: {
                type: String,
                default: '选择列表'
            },
            valueField: {
                type: String,
            },
            valueField2: {
                type: String,
            },
            textField: {
                type: String
            },
            popupGrid: {
                type: Object,
                default: function () {
                    return {
                        ds: null,
                        columns: null,
                        selection: false,
                        pagination: false,
                        searchConfig: null,
                        showHeader: true //是否显示表头
                    }
                }
            },
            buttonConfig: {
                type: Object,
                default: function () {
                    return {
                        type: 'default',//default primary text
                        showResult: false,
                        action: null,//execute-ds url dialog-page code buzz
                        ds: null,
                        goUrl: null,
                        confirmTitle: null,
                        confirmText: null,
                        callback: 'custom',//refresh
                        valueKey: null,
                        selectText: "选择",
                        icon: null,
                        callBackStaticWords: null
                    }
                }
            },
            showModal: {
                type: Boolean,
                default: false
            },
            highlightCurrent: {
                type: Boolean,
                default: true
            },
            stripe: {
                type: Boolean,
                default: false
            },
            showSearchInput: {
                type: Boolean,
                default: false
            },
            parentParams: {
                type: Object
            },
            hiddenValueKey: {
                type: String,
            },
            hiddenItems: {
                type: Array,
            }
        },
        data() {
            return {
                text: this.value,
                popupVisible: false,
                buttonName: this.buttonConfig.selectText
            }
        },
        watch: {
            value(val) {
                this.text = val;
            }
        },
        created: function () {
        },
        methods: {
            showSelect: function (row) {
                this.popupVisible = true;
                this.$emit('showPopup');
            },
            confirmSelect: function (row) {
                const t = this;
                t.row = row;
                if (row == 'cancelSelect') {
                    t.popupVisible = false;
                } else if (t.buttonConfig.action == 'execute-ds') {
                    row.parentParams = t.parentParams;
                    Util.resolveButton(t.buttonConfig, {
                        'bb': t,
                        "router": t.$route.params,
                        'row-data': row,
                        'getData': t.getData
                    }, t.afterCommit);
                } else {
                    row.parentParams = t.parentParams;
                    this.$confirm('确认选择?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        t.outPutValue();
                    }).catch(() => {
                    });
                }
            },
            listSelect: function (row) {
                const t = this;
                if (typeof row != 'array' && row.length != 0) {
                    t.confirmSelect(row)
                }
            },
            afterCommit: function (button) {
                const t = this;
                t.popupVisible = false;
                if (button['refreshParent'] && t.parentParams) {
                    t.parentParams.getData();
                }
                if (button.goUrl) {
                    t.$router.push(button.goUrl);
                }
                t.outPutValue();
                t.$emit('afterCommit', t);
            },
            outPutValue: function () {
                const t = this;
                const row = t.row
                t.popupVisible = false;
                t.text = row[t.textField];
                if (t.buttonConfig.showResult) {
                    t.buttonName = '修改';
                    t.buttonConfig.type = 'text';
                }
                const data = row[t.valueField2] ? row[t.valueField2] : row[t.valueField];//兼容接口选择列表的alias 和 url  支持多参数输出
                t.$emit('input', data);
                t.$emit('change', row);
            }
        }
    }
</script>
<style lang="less">
    .popup-selection {
        //max-width: 420px;
        display: inline-block;
        .el-dialog__body {
            padding: 10px 20px;
        }
    }

    .popup-selection .current-row > td {
        background-color: #edf7ff !important;
        font-family: 'PingFangSC-Regular';
        font-size: 14px;
        color: #0091EA;
    }

    .popup-selection .dialog > div {
        min-width: 500px;
    }
</style>









