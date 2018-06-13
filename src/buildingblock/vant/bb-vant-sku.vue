<script>
import Sku from 'vant/lib/sku';
import 'vant/lib/sku/style';

    export default {
        name: 'bb-vant-sku',
        components: {
          "van-sku":Sku
        },
        props: {
            //是否显示sku 支持v-model
            value:{
                type:Boolean,
                default:true
            },
            /*商品sku数据
                sku: {
                    // 所有sku规格类目与其值的从属关系，比如商品有颜色和尺码两大类规格，颜色下面又有红色和蓝色两个规格值。
                    // 可以理解为一个商品可以有多个规格类目，一个规格类目下可以有多个规格值。
                    tree: [
                        {
                        k: '颜色', // skuKeyName：规格类目名称
                        v: [
                            {
                                id: '30349', // skuValueId：规格值 id
                                name: '红色', // skuValueName：规格值名称
                                imgUrl: 'https://img.yzcdn.cn/1.jpg' // 规格类目图片，只有第一个规格类目可以定义图片
                            },
                            {
                                id: '1215',
                                name: '蓝色',
                                imgUrl: 'https://img.yzcdn.cn/2.jpg'
                            }
                        ],
                        k_s: 's1' // skuKeyStr：sku 组合列表（下方 list）中当前类目对应的 key 值，value 值会是从属于当前类目的一个规格值 id
                        }
                    ],
                    // 所有 sku 的组合列表，比如红色、M 码为一个 sku 组合，红色、S 码为另一个组合
                    list: [
                        {
                            id: 2259, // skuId，下单时后端需要
                            price: 100, // 价格（单位分）
                            s1: '1215', // 规格类目 k_s 为 s1 的对应规格值 id
                            s2: '1193', // 规格类目 k_s 为 s2 的对应规格值 id
                            s3: '0', // 最多包含3个规格值，为0表示不存在该规格
                            stock_num: 110 // 当前 sku 组合对应的库存
                        }
                    ],
                    price: '1.00', // 默认价格（单位元）
                    stock_num: 227, // 商品总库存
                    collection_id: 2261, // 无规格商品 skuId 取 collection_id，否则取所选 sku 组合对应的 id
                    none_sku: false, // 是否无规格商品
                    messages: [
                        {
                            // 商品留言
                            datetime: '0', // 留言类型为 time 时，是否含日期。'1' 表示包含
                            multiple: '0', // 留言类型为 text 时，是否多行文本。'1' 表示多行
                            name: '留言', // 留言名称
                            type: 'text', // 留言类型，可选: id_no（身份证）, text, tel, date, time, email
                            required: '1' // 是否必填 '1' 表示必填
                        }
                    ],
                    hide_stock: false // 是否隐藏剩余库存
                }
            */
            sku:{
                type:Object,
                default:function(){
                    return {}
                }
            },
            /*商品默认信息
                goods: {
                    // 商品标题
                    title: '测试商品',
                    // 默认商品 sku 缩略图
                    picture: 'https://img.yzcdn.cn/1.jpg'
                }
            */
            goods:{
                type:Object,
                default:function(){
                    return {
                        // 商品标题
                        title: '测试商品',
                        // 默认商品 sku 缩略图
                        picture: 'https://img.yzcdn.cn/1.jpg'
                    }
                }
            },
            //  商品id
            goodsId:{
                type:[String,Number]
            },
            /*其他属性配置
                {
                    showAddCartBtn:true, //显示加入购物车按钮
                    quota:0, //限购数(0表示不限购) 
                    quotaUsed:0, //已经购买过的数量 
                    resetStepperOnHide:false, //窗口隐藏时重置选择的商品数量
                    resetSelectedSkuOnHide:false, //窗口隐藏时重置已选择的sku
                    disableStepperInput:false, //禁用sku中stepper的input框
                    closeOnClickOverlay:false, //点击popup的overlay后是否关闭弹窗
                    stepperTitle:"购买数量", //数量选择组件左侧文案
                    getContainer:()=>{return } // 指定挂载的 HTML 节点
                    customStepperConfig:{ //步进器相关自定义配置
                        // 自定义限购文案
                        quotaText: '每次限购xxx件',
                        // 自定义步进器超过限制时的回调
                        handleOverLimit: (data) => {
                            const { action, limitType, quota, quotaUsed } = data;
                            if (action === 'minus') {
                                Toast('至少选择一件商品');
                            } else if (action === 'plus') {
                                // const { LIMIT_TYPE } = Sku.skuConstants;
                                if (limitType === LIMIT_TYPE.QUOTA_LIMIT) {
                                    let msg = `单次限购${quota}件`;
                                if (quotaUsed > 0) msg += `，您已购买${quotaUsed}`;
                                    Toast(msg);
                                } else {
                                    Toast('库存不够了~~');
                                }
                            }
                        }
                    },
                    messageConfig:{ //留言相关配置
                         // 图片上传回调，需要返回一个promise，promise正确执行的结果需要是一个图片url
                        uploadImg: () => {
                            return new Promise((resolve) => {
                                setTimeout(() => resolve('https://img.yzcdn.cn/upload_files/2017/02/21/FjKTOxjVgnUuPmHJRdunvYky9OHP.jpg!100x100.jpg'), 1000);
                            });
                        },
                        // 最大上传体积 (MB)
                        uploadMaxSize: 3,
                        // placehold配置
                        placeholderMap: {
                            text: 'xxx',
                            tel: 'xxx',
                            ...
                        }
                    }
                }
            */
            option:{
                type:Object,
                default:function(){
                    return {
                        hideStock:false, //显示商品剩余库存
                        showAddCartBtn:true, //显示加入购物车按钮
                        quota:0, //限购数(0表示不限购) 
                        quotaUsed:0, //已经购买过的数量 
                        resetStepperOnHide:false, //窗口隐藏时重置选择的商品数量
                        resetSelectedSkuOnHide:false, //窗口隐藏时重置已选择的sku
                        disableStepperInput:false, //禁用sku中stepper的input框
                        closeOnClickOverlay:false, //点击popup的overlay后是否关闭弹窗
                        stepperTitle:"购买数量", //数量选择组件左侧文案
                        customStepperConfig:{}, //步进器相关自定义配置
                        messageConfig:{}, //留言相关配置
                        //getContainer:()=>{return } // 指定挂载的 HTML 节点
                    };
                }
            },
            /*动态sku数据*/
            skuDs:{
                type:Object
            }
        },
        data() {
            return {
                valueBase:this.value,
                realSku:this.sku,
                realGoods:this.goods,
                realGoodsId:this.goodsId,
            };
        },
        render: function (createElement) {
            const t = this;
            const props = {
                "value":t.valueBase,
                "sku":t.realSku,
                "goods":t.realGoods,
                "goods-id":t.realGoodsId,
                "hide-stock":t.realSku.hide_stock,
                "quota":t.option.quota,
                "quota-used":t.option.quotaUsed,
                "reset-stepper-on-hide":t.option.resetStepperOnHide,
                "reset-selected-sku-on-hide":t.option.resetSelectedSkuOnHide,
                "close-on-click-overlay":t.option.closeOnClickOverlay,
                "disable-stepper-input":t.option.disableStepperInput,
                "message-config":t.option.messageConfig
            };
            //当可以渲染的时候才能渲染
            return createElement('van-sku',{
                props:props,
                on:{
                    'add-cart':t.addCart,
                    'buy-clicked':t.buyClicked,
                    'input':t.change
                },
            },[]);
        },
        mounted(){
            this.getData();
        },
        //事件click
        methods: {
            //外部获取当前sku数据
            getSku(){
                const t = this;
                return t.getSkuData();
            },
            //动态获取tab内容
            getData(){
                const t = this;
                if (t.skuDs) {
                    t.loading = true;
                    _TY_Tool.getDSData(t.skuDs, _TY_Tool.buildTplParams(t), function (data) {
                        data.forEach((item) => {
                            t.loading = false;
                            const {dataKey, value} = item;
                            t.realSku = value;
                        });
                    }, function (code, msg) {
                        t.loading = false;
                    });
                }
            },
            //添加到购物车
            addCart(data){
                this.$emit("add-cart",data);
            },
            //购买商品
            buyClicked(data){
                this.$emit("buy-clicked",data);
            },
            //外部设置sku展示
            showSku(){
                this.valueBase = true;
            },
            change(show){
                this.valueBase = show;
            }
        }
    }
</script>

<style scoped>
</style>