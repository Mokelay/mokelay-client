<template>
    <span class="bb-indep-sms">
        <bb-vant-field
            :option="fieldOption"
            @change="fieldChange"
            :ref="fieldUUid"
            ></bb-vant-field>
        <bb-indep-button
            :ref="buttonUUid"
            :options="sendButtonOptions"
            :button="sendButton"
            @button-finish-success="buttonSuccess"
        ></bb-indep-button>
    </span>
</template>

<script>
    export default {
        name: 'bb-indep-sms',
        props: {
            fieldConfig:{
                type:Object,
                default:function(){
                    return {
                        "theme": "default",
                        "label": "手机号码",
                        "error": false,
                        "errorMessage": "",
                        "autosize": true,
                        "type": "tel",
                        "maxText": 11,
                        "border": true,
                        "showMessageText": false,
                        "noPadding": false
                    }
                }
            },
            buttonConfig:{
                type:Object,
                default:function(){
                    return {
                        "button":{
                            "selectText": "获取验证码",
                            "buttonType": "default",
                            "type": "text",
                            "size": "mini",
                            "color": "",
                            "action": "execute-ds",
                            "buzz": "buzzNull",
                            "fontSize": "12px",
                            "color":"rgb(26, 173, 25)",
                            "ds": {
                                "api": "test-aliyun-sms",
                                "category": "config",
                                "method": "POST",
                                "url": ""
                            },
                            "confirmText": "请查收您的短信",
                            "callBackStaticWords": "短信发送成功",
                            "style":{
                                "font":{                  //阴影
                                    "size":"50px",            //阴影大小
                                    "color":"#f00",       //阴影方向
                                },
                            }
                        },
                        "options":{
                            "disabled": true,
                            "disabledStyle":{
                                "font":{                  //阴影
                                    "size":"12px",            //阴影大小
                                    "color":"#cccccc",       //阴影方向
                                },
                            }
                        }
                    }
                }
            }
        },
        data() {
            return {
                fieldOption:this.fieldConfig,
                sendButton: this.buttonConfig.button,
                sendButtonOptions:this.buttonConfig.options,
                fieldUUid:_TY_Tool.uuid(),
                buttonUUid:_TY_Tool.uuid()
            }
        },
        watch: {
        },
        created: function () {
        },
        mounted:function(){
            
        },
        methods: {
            fieldChange:function(val){
                const t = this;
                var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
                t.$emit("change",val);
                t.$emit("input",val);
                if (myreg.test(val)){
                    _TY_Tool.findBBByUuid(t.buttonUUid).enabledFn()
                }else {
                    _TY_Tool.findBBByUuid(t.buttonUUid).disabledFn()
                }
            },
            buttonSuccess:function(...args){
                const t = this;
                var msgButton = _TY_Tool.findBBByUuid(t.buttonUUid);
                msgButton.disabledFn();
                var buttonName = msgButton.button.selectText;
                var time = 60;
                var disabledTime = setInterval(() => {
                    time = time - 1;
                    if (time > 0) {
                        msgButton.button.selectText = `获取(${time}s)`;
                    } else {
                        clearInterval(disabledTime);
                        msgButton.button.selectText = buttonName;msgButton.enabledFn();
                    }
                }, 1000)
            }
        }
    }
</script>
<style lang='less'>
    .bb-indep-sms{
        display: block;
        .bb-vant-field{
            width: 78%;
        }
        .bb-indep-button{
            font-size: 12px;
        }
        &>div{
            display: inline-block;
        }
    }  
</style>