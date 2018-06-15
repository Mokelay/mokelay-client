<template>
    <van-address-edit
        :area-list="areaList"
        :address-info="valueBase"
        :show-postal="option.showPostal"
        :show-delete="option.showPostal"
        :show-set-default="option.showSetDefault"
        :is-saving="option.isSaving"
        :is-deleting="option.showPostal"
        :search-result="searchResult"
        @save="onSave"
        @delete="onDelete"
        @change-detail="onChangeDetail"
      ></van-address-edit>
</template>

<script>
import AddressEdit from 'vant/lib/address-edit';
import 'vant/lib/address-edit/style';

    export default {
        name: 'bb-vant-address-edit',
        components: {
            "van-address-edit":AddressEdit
        },
        props: {
            //当前编辑地址的值  支持v-model
            value:{
                type:Object
            },
            //动态获取省市区数据
            areaListDs:{
                type:Object
            },
            /*其他属性配置
                {
                    showPostal:false, //显示邮政编码
                    showDelete:false, //显示删除按钮
                    showSetDefault:false, //显示默认地址栏
                    showSearchResult：false, //显示搜索结果
                    isSaving:false, //显示保存按钮加载动画
                    isDeleting:false, //显示删除按钮加载动画
                    telValidator:fn //手机号格式校验函数
                }
            */
            option:{
                type:Object,
                default:function () {
                    return {
                        showPostal:false,
                        showDelete:false,
                        showSetDefault:false,
                        showSearchResult:false,
                        isSaving:false,
                        isDeleting:false,
                        telValidator:fn
                    };
                }
            }
        },
        data() {
            return {
                valueBase:this.value,
                areaList:{},
                searchResult:[],
            };
        },
        mounted(){
            let t = this;
            require.ensure(['./bb-vant-area/area.js'], function (require) {
                t.areaList = require("./bb-vant-area/area.js").default;
            });
            t.getAreaList();
            _TY_Tool.buildDefaultValTpl(t,"valueBase");  
            t.$emit('mounted',this.valueBase);
        },
        methods: {
            //动态获取省 市 区 数据
            getAreaList(){
                const t = this;
                if (t.areaListDs) {
                    t.loading = true;
                    _TY_Tool.getDSData(t.areaListDs, _TY_Tool.buildTplParams(t), function (data) {
                        data.forEach((item) => {
                            t.loading = false;
                            const {dataKey, value} = item;
                            t.areaList = value;
                        });
                    }, function (code, msg) {
                        t.loading = false;
                    });
                }
            },
            onSave(address){
                this.$emit('save',address);
                this.$emit('change',address);
                this.$emit('input',address);
            },
            onDelete(address){
                this.$emit('delete',address);
            },
            //需要根据value返回相应的searchResult
            onChangeDetail(value){
                this.$emit('change-detail',value);
            },
            //外部设置searchResult
            setSearchResult(searchResult){
                this.searchResult = searchResult;
            }
        }
    }
</script>

<style scoped>
</style>