<template>
    <div class="bb-indep-pay" @click="payment">
        微信支付
    </div>
</template>

<script>
    export default {
        name: 'bb-indep-pay',
        props: {
            //订单编号
            serialNumber:{
                type:String
            },
            //支付接口 签名等
            payDs:{
                type:Object
            },
            //支付成功跳转地址
            successUrl:{
                type:String
            }
        },
        watch:{
           serialNumber(val){
                this.orderNum = val;
           }
        },
        data() {
            return {
                orderNum:this.serialNumber//订单编号
            }
        },
        mounted:function(){
            
        },
        methods: {
            /**
            *   事件 微信支付
            */
            payment:function(){
                let t=this;
                if(t.orderNum){
                    t.pay(t.orderNum);
                }
            },
            /**
            *   微信支付,
                payDs,必须返回支付所需的对象信息，
                eg:
                    {
                        "appId":"wx2421b1c4370ec43b",     //公众号名称，由商户传入     
                        "timeStamp":"1395712654",         //时间戳，自1970年以来的秒数     
                        "nonceStr":"e61463f8efa94090b1f366cccfbbb444", //随机串     
                        "package":"prepay_id=u802345jgfjsdfgsdg888",     
                        "signType":"MD5",         //微信签名方式：     
                        "paySign":"70EA570631E4BB79628FBCA90534C63FF7FADD89" //微信签名 
                    }
                可外部调用
            */
            pay:function(orderId){
                let t=this;
                if(!t.payDs){
                    console.log('请配置支付接口');
                    return;
                }
                //调接口，根据订单编号获取订单详情，并且返回支付需要的签名等信息
                _TY_Tool.getDSData(t.payDs, _TY_Tool.buildTplParams(t), function (map) {
                    if(map && map[0] && map[0].value){
                        //调用支付接口
                        t.jsPay(map[0].value);
                    }
                }, function (code, msg) {
                     _TY_Modal({
                        title: "提示",
                        message: "支付失败！" + msg,
                        btns: [{
                            text: '确认',
                            $action: (modal) => {
                                modal.doclose();
                            }
                        }]
                    });
                });
            },
            //js 调起支付
            jsPay:function(data){
                const t=this;
                function onBridgeReady(){
                   WeixinJSBridge.invoke(
                      'getBrandWCPayRequest', {
                         "appId":data.appId,     //公众号名称，由商户传入     
                         "timeStamp":data.timeStamp,         //时间戳，自1970年以来的秒数     
                         "nonceStr":data.nonceStr, //随机串     
                         "package":data.package,     
                         "signType":"MD5",         //微信签名方式：     
                         "paySign":data.paySign //微信签名 
                    },
                    function(res){
                        if(res.err_msg == "get_brand_wcpay_request:ok" ){
                        // 使用以上方式判断前端返回,微信团队郑重提示：
                        //res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
                            _TY_Modal({
                                title: "提示",
                                message: "支付成功！",
                                btns: [{
                                    text: '确认',
                                    $action: (modal) => {
                                        modal.doclose();
                                        if(t.successUrl){
                                            //跳转到支付成功页！
                                            t.$router.push(t.successUrl);
                                        }
                                    }
                                }]
                            });
                        } else { 
                            // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
                            _TY_Modal({
                                title: "提示",
                                message: "支付失败！" + res.err_code + ':' + res.err_desc + '-' + res.err_msg,
                                btns: [{
                                    text: '确认',
                                    $action: (modal) => {
                                        modal.doclose();
                                    }
                                }]
                            });
                        }
                    }); 
                }
                if (typeof WeixinJSBridge == "undefined"){
                   if( document.addEventListener ){
                       document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
                   }else if (document.attachEvent){
                       document.attachEvent('WeixinJSBridgeReady', onBridgeReady); 
                       document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
                   }
                }else{
                   onBridgeReady();
                }
            }
        }
    }
</script>
<style lang='less' scoped>


</style>