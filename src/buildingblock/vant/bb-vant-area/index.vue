<script>
import Area from 'vant/lib/area';
import 'vant/lib/area/style';

    export default {
        name: 'bb-vant-area',
        components: {
          "van-area":Area
        },
        props: {
            /*默认值 支持v-model*/
            value:{
                type:String,
                default:'110100'
            },
            /*模板默认值*/
            defaultValTpl:{
                type:String
            },
            /*顶部栏标题*/
            title:{
                type:String,
            },
            /*其他属性配置
                {
                    'area-list':{  //省市县数据
                        province_list: {
                            110000: '北京市',
                            120000: '天津市'
                        },
                        city_list: {
                            110100: '北京市',
                            110200: '县',
                            120100: '天津市',
                            120200: '县'
                        },
                        county_list: {
                            110101: '东城区',
                            110102: '西城区',
                            110105: '朝阳区',
                            110106: '丰台区'
                            120101: '和平区',
                            120102: '河东区',
                            120103: '河西区',
                            120104: '南开区',
                            120105: '河北区',
                            // ....
                        }
                    },
                    'columns-num':3-省市县，2-省市，1-省,  //省市县显示列数
                    'loading': false, //显示加载状态
                    'item-height':44, //选项高度
                    'visible-item-count':5, //可见的选项个数
                }
            */
            option:{
                type:Object,
                default:function(){
                    return {
                        'columns-num':3, //省市县显示列数
                        'loading': false, //显示加载状态
                        'item-height':44, //选项高度
                        'visible-item-count':5, //可见的选项个数
                    }
                }
            },
            //动态获取省市区数据
            areaListDs:{
                type:Object
            }
        },
        data() {
            return {
                valueBase:this.value,
                realAreaList:null,
                loading:this.option['loading']
            };
        },
        render: function (createElement) {
            const t = this;
            return createElement('van-area',{
                props:{
                    'value':t.valueBase,
                    'title':t.title,
                    'columns-num':t.option['columns-num'],  //省市县显示列数
                    'loading': t.loading, //显示加载状态
                    'item-height':t.option['item-height'], //选项高度
                    'visible-item-count':t.option['visible-item-count'], //可见的选项个数
                    'area-list':t.realAreaList //省 市 区 数据
                },
                on:{
                    confirm:t.confirm,
                    cancel:t.cancel,
                    change:t.change
                }
            });
        },
        mounted(){
            let t = this;
            require.ensure(['./area.js'], function (require) {
                t.realAreaList = require("./area.js").default;
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
                            t.realAreaList = value;
                        });
                    }, function (code, msg) {
                        t.loading = false;
                    });
                }
            },
            confirm(val){
                this.$emit('input',val);
                this.$emit('change',val);
            },
            cancel(val){
                this.$emit('cancel',val);
            },
            change(val){
                this.$emit('input',val);
                this.$emit('change',val);
            }
        }
    }
</script>

<style scoped>
</style>