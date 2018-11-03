<template>
    <div class="popup-selection">
        <span v-if="!showSearchInput" class="showResult">{{buttonConfig.showResult ? text : ''}}</span>
        <bb-button v-if="!showSearchInput" @click="showSelect" :button="searchButton"></bb-button>
        <el-input v-if="showSearchInput" v-model="text" @keyup.native.enter="showSelect"
                  style="width: 100%;" placeholder="请输入搜索内容" @focus="showSelect">
            <el-button type="primary" slot="append" icon="search" @click="showSelect">{{buttonName}}</el-button>
        </el-input>
        <bb-dialog v-if="popupVisible" class="dialog" :title="title" :isShow.sync="popupVisible" :modal="showModal" size="tiny" :fullscreen="fullscreen">
            <bb-list :ds="popupGrid.ds" search :popup="true" :parentParams="parentParams" :columns="popupGrid.columns"
                     :selection="popupGrid.selection" :pagination="popupGrid.pagination" @list-select="listSelect"
                     :searchConfig="popupGrid.searchConfig" :showHeader="popupGrid.showHeader"
                     :highlightCurrent="highlightCurrent" :stripe="stripe" :hiddenValueKey="hiddenValueKey"
                     :hiddenItems="hiddenItems"></bb-list>

            <!-- TODO 渲染操作按钮 <bb-button-group/> 数据来自内在的确定，取消按钮的配置，再加上props中的popupButtons配置，同时bb-list去掉popup的配置-->
            <div :style="{textAlign:'right'}">
                <div :style="{display:'inline-block'}">
                    <el-button @click="cancelSelect">取消</el-button>
                    <el-button v-if="!popupButtons" type="primary" @click="confirmSelect(this,buttonConfig)">确定</el-button>
                </div>
                <el-button-group :style="{textAlign:'right',display:'inline-block'}">
                    <el-button v-for="button in realPopupButtons" :type="button.type" @click="confirmSelect(this,button)">{{button.text}}</el-button>
                </el-button-group>
                <!-- <bb-button-group :buttons="realPopupButtons" :style="{textAlign:'right',display:'inline-block'}"></bb-button-group> -->
            </div>
        </bb-dialog>
    </div>
</template>

<script>
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
                        confirmTitle: '提示',
                        confirmText: '确认选择',
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
            },
            fullscreen:{
                type:Boolean
            },
            popupButtons:{
                type:[Array,String]
            }
        },
        data() {
            return {
                text: this.value,
                popupVisible: false,
                buttonName: this.buttonConfig.selectText,
                selectRow:null,
                realPopupButtons:[]
            }
        },
        watch: {
            value(val) {
                this.text = val;
            }
        },
        computed: {
            searchButton:function(){
                let button = {
                    type:this.buttonConfig.type,
                    icon:this.buttonConfig.icon,
                    text:this.buttonConfig.selectText
                }
                return button
            }
        },
        created: function () {
            const t  = this;
            if(t.popupButtons){
                var popupButtons = typeof t.popupButtons == 'string'?eval("("+t.popupButtons+")") : t.popupButtons;
                t.realPopupButtons = t.realPopupButtons.concat(popupButtons);
            }
            t.realPopupButtons.forEach((val,key)=>{
                val.afterClick = t.afterCommit;
                if(val.button){
                   val.button.afterClick = t.afterCommit;
                }
                if(val.alias == 'confirm'){
                    //用buttonConfig 覆盖确认过按钮  兼容老配置
                    val = Object.assign({},t.buttonConfig,val);
                    val.type = 'primary';
                };
                if(t.buttonConfig.action){
                   t.realPopupButtons[key] = val;
                }else{
                    t.realPopupButtons.splice(key,1);
                }
            })
        },
        methods: {
            showSelect: function (row) {
                this.popupVisible = true;
                this.$emit('showPopup');
            },
            listSelect: function (row) {
                const t = this;
                if (typeof row != 'array' && row.length != 0) {
                    t.selectRow = row;
                }
            },
            confirmSelect: function (bb,button) {
                const t = this;
                if (t.selectRow == 'cancelSelect') {
                    t.popupVisible = false;
                } else if (button.action == 'execute-ds' && t.selectRow) {
                    t.selectRow.parentParams = t.parentParams;
                    _TY_Tool.resolveButton(button, _TY_Tool.buildTplParams(t,{
                        'row-data': t.selectRow,
                        'getData': t.getData
                    }));
                } else if(t.selectRow){
                    t.selectRow.parentParams = t.parentParams;
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
            afterCommit: function (button) {
                const t = this;
                if (button['refreshParent'] && t.parentParams) {
                    t.parentParams.getData();
                }
                if (button.goUrl) {
                    t.$router.push(button.goUrl);
                }
                if(t.selectRow){
                    t.outPutValue();
                }
                t.$emit('afterCommit', t);
            },
            outPutValue: function () {
                const t = this;
                const row = t.selectRow
                t.popupVisible = false;
                t.selectRow = null;
                t.text = row[t.textField];
                if (t.buttonConfig.showResult) {
                    t.buttonName = '修改';
                    t.buttonConfig.type = 'text';
                }
                const data = row[t.valueField2] ? row[t.valueField2] : row[t.valueField];//兼容接口选择列表的alias 和 url  支持多参数输出
                t.$emit('input', data);
                t.$emit('change', row);
            },
            cancelSelect:function(){
                const t = this;
                t.popupVisible = false;
                t.selectRow = null;
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









