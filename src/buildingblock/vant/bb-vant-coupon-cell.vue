<script>
import CouponCell from 'vant/lib/coupon-cell';
import 'vant/lib/coupon-cell/style';

    export default {
        name: 'bb-vant-coupon-cell',
        components: {
          "van-coupon-cell":CouponCell,
        },
        props: {
            /*标题*/
            title:{
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
                type:Array
            },
            /*动态优惠券列表*/
            couponsDs:{
                type:Object
            },
            /*能否切换优惠券*/
            editable:{
                type:Boolean
            }
        },
        data() {
            return {
                realCoupons:this.coupons,
                realChosenCoupon:this.chosenCoupon
            };
        },
        render: function (createElement) {
            const t = this;
            const props = {
                "title":t.title,
                "chosen-coupon":t.realChosenCoupon,
                "coupons":t.realCoupons,
                "editable":t.editable
            };
            //当可以渲染的时候才能渲染
            return createElement('van-coupon-cell',{
                props:props,
                on:{
                    'click':t.click
                }
            },[]);
        },
        mounted(){
            this.getData();
        },
        //事件click
        methods: {
            //外部获取当前sku数据
            click(){
                this.$emit("click",this.realCoupons);
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
            //外部设置当前选中的优惠券
            setCoupon(coupon){
                const t = this;
                if(typeof coupon == 'object'){
                    t.realCoupons = [coupon];
                    t.realChosenCoupon = 0;
                }else{
                    //如果是数字 则直接修改当前选中优惠券
                    t.realChosenCoupon = coupon;
                }
                t.$emit("change",t.realCoupons[t.realChosenCoupon]);
                t.$emit("input",t.realCoupons[t.realChosenCoupon]);
            }
        }
    }
</script>

<style scoped>
</style>