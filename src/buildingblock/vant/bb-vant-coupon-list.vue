<script>
import CouponCell from 'vant/lib/coupon-list';
import 'vant/lib/coupon-list/style';

    export default {
        name: 'bb-vant-coupon-list',
        components: {
          "van-coupon-list":CouponCell,
        },
        props: {
            /*当前输入的兑换码 支持v-model*/
            value:{
                type:String
            },
            /*当前选中优惠券的索引*/
            chosenCoupon:{
                type:Number,
                default:-1
            }, 
            /*可用优惠券列表
                [{
                    id  优惠券 id  String
                    name    优惠券名称   String
                    discount    折扣（0为满减券）88=>8.8折   Number
                    denominations   面值（0为折扣券）单位分    Number
                    origin_condition    满减条件（0为无门槛，满XX元可用）单位分   Number
                    start_at    卡有效开始时间 (时间戳, 单位秒)  Number
                    end_at  卡失效日期 (时间戳, 单位秒)    Number
                    reason  不可用原因   String
                    value   订单优惠金额，单位分  Number
                }]
            */
            coupons:{
                type:Array,
                default:function(){
                    return [{
                        available: 1,
                        discount: 0,
                        denominations: 150,
                        origin_condition: 0,
                        reason: '',
                        value: 150,
                        name: '优惠券名称',
                        start_at: 1489104000,
                        end_at: 1514592000
                    }]
                }
            },
            /*动态优惠券列表*/
            couponsDs:{
                type:Object
            },
            /*其他属性配置
                {
                    disabledCoupons:[], //不可用优惠券列表
                    exchangeButtonText:'兑换', //兑换按钮文字
                    exchangeButtonLoading:false, // 是否在兑换按钮上显示加载动画
                    exchangeButtonDisabled:false, //是否禁用兑换按钮
                    exchangeMinLength:1, //兑换码最小长度
                    displayedCouponIndex:1, //滚动至特定优惠券位置
                    showCloseButton:false, // 是否显示列表底部按钮
                    closeButtonText:'不使用优惠', //列表底部按钮文字
                    disabledListTitle:'不可用优惠', //不可用券列表标题
                    inputPlaceholder:'请输入优惠码',  //输入框文字提示
                    showExchangeBar:true, //是否展示兑换栏
                }
            */
            option:{
                type:Object,
                default:function(){
                    return {
                        disabledCoupons:[], //不可用优惠券列表
                        exchangeButtonText:'兑换', //兑换按钮文字
                        exchangeButtonLoading:false, // 是否在兑换按钮上显示加载动画
                        exchangeButtonDisabled:false, //是否禁用兑换按钮
                        exchangeMinLength:1, //兑换码最小长度
                        displayedCouponIndex:1, //滚动至特定优惠券位置
                        showCloseButton:true, // 是否显示列表底部按钮
                        closeButtonText:'不使用优惠', //列表底部按钮文字
                        disabledListTitle:'不可用优惠', //不可用券列表标题
                        inputPlaceholder:'请输入优惠码',  //输入框文字提示
                        showExchangeBar:true, //是否展示兑换栏 
                    }
                }
            }
        },
        data() {
            return {
                valueBase:this.value,
                realCoupons:this.coupons,
                realChosenCoupon: this.chosenCoupon,
                realDisabledCoupons: this.option.disabledCoupons
            };
        },
        render: function (createElement) {
            const t = this;
            const props = {
                "value":t.valueBase,
                "chosen-coupon":t.realChosenCoupon,
                "coupons":t.realCoupons,
                "disabled-coupons":t.realDisabledCoupons,
                "exchange-button-text":t.option.exchangeButtonText,
                "exchange-button-loading":t.option.exchangeButtonLoading,
                "exchange-button-disabled":t.option.exchangeButtonDisabled,
                "exchange-min-length":t.option.exchangeMinLength,
                "displayed-coupon-index":t.option.displayedCouponIndex,
                "show-close-button":t.option.showCloseButton,
                "close-button-text":t.option.closeButtonText,
                "disabled-list-title":t.option.disabledListTitle,
                "input-placeholder":t.option.inputPlaceholder,
                "show-exchange-bar":t.option.showExchangeBar
            };
            //当可以渲染的时候才能渲染
            return createElement('van-coupon-list',{
                props:props,
                on:{
                    'change':t.change,
                    'exchange':t.exchange,
                }
            },[]);
        },
        mounted(){
            this.getData();
        },
        //事件click
        methods: {
            //优惠券切换回调
            change(index){
                this.$emit("change",index);
                this.realChosenCoupon = index;
            },
            //兑换优惠券回调
            exchange(code){
                this.$emit("exchange",code);
                
            },
            //外部优惠券兑换成功
            exchangeSuccess(coupon){
                this.realCoupons.push(coupon);
            },
            //动态获取tab内容
            getData(){
                const t = this;
                if (t.couponsDs) {
                    t.loading = true;
                    _TY_Tool.getDSData(t.couponsDs, _TY_Tool.buildTplParams(t), function (data) {
                        data.forEach((item) => {
                            t.loading = false;
                            const {dataKey, value} = item;
                            t.realCoupons = value;
                        });
                    }, function (code, msg) {
                        t.loading = false;
                    });
                }
            },
            //外部设置优惠券列表
            setRealCoupons(coupons){
                const t = this;
                t.realCoupons = coupons;
            }
        }
    }
</script>

<style scoped>
</style>