<template>
    <bb-module :content="realContent"></bb-module>
</template>

<script>
    export default {
        name: 'bb-sms-verification',
        props: {
        },
        data() {
            return {
                realContent:[{
    "uuid": "6B4B6326-F75E-427C-90BC-981B1189C20E",
    "alias": "bb-layout-seriation",
    "aliasName": "顺序布局",
    "attributes": {
        "horizontal": true,
        "distributeBlock": [
            {
                "alias": "8",
                "name": "8"
            },
            {
                "alias": "2",
                "name": "2"
            }
        ],
        "layoutType": "proportion",
        "content": [
            {
                "uuid": "834E8A8C-1661-4FF3-BEF8-D6C370D3D49C",
                "alias": "bb-vant-field",
                "aliasName": "手机验证",
                "attributes": {
                    "show": true,
                    "option": {
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
                    },
                    "attributeName": "phone"
                },
                "animation": [
                    
                ],
                "interactives": [
                    {
                        "uuid": "73532",
                        "fromContentUUID": "bb-vant-field",
                        "fromContentEvent": "change",
                        "executeArgument": "var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;\n\t\tif (!myreg.test(params[0])) {\n\t\t\t_TY_Tool.findBBByUuid(\"37C8BB8C-55F4-4317-9A62-18C62A84F52F\").disabledFn()\n\t\t} else {\n\t\t\t_TY_Tool.findBBByUuid(\"37C8BB8C-55F4-4317-9A62-18C62A84F52F\").enabledFn()\n\t\t}"
                    }
                ],
                "layout": {
                    
                }
            },
            {
                "uuid": "37C8BB8C-55F4-4317-9A62-18C62A84F52F",
                "alias": "bb-indep-button",
                "aliasName": "获取验证码",
                "attributes": {
                    "show": true,
                    "button": {
                        "selectText": "获取验证码",
                        "buttonType": "default",
                        "type": "text",
                        "size": "mini",
                        "color": "",
                        "action": "execute-ds",
                        "buzz": "buzzNull",
                        "style": {
                            "fontSize": "12px"
                        },
                        "fontSize": "12px",
                        "ds": {
                            "api": "test-aliyun-sms",
                            "category": "config",
                            "method": "POST",
                            "url": ""
                        },
                        "confirmText": "请查收您的短信",
                        "callBackStaticWords": "短信发送成功"
                    },
                    "options": {
                        "disabled": true
                    }
                },
                "animation": [
                    
                ],
                "interactives": [
                    {
                        "uuid": "21075",
                        "fromContentUUID": "bb-indep-button",
                        "fromContentEvent": "button-finish-success",
                        "executeArgument": "var countTime = function() {\n\t\t\tvar msgButton = _TY_Tool.findBBByUuid(\"37C8BB8C-55F4-4317-9A62-18C62A84F52F\");\n\t\t\tmsgButton.disabledFn();\n\t\t\tvar buttonName = msgButton.button.selectText;\n\t\t\tvar time = 60;\n\t\t\tvar disabledTime = setInterval(() => {\n\t\t\t\ttime = time - 1;\n\t\t\t\tif (time > 0) {\n\t\t\t\t\tmsgButton.button.selectText = `获取(${time}s)`;\n\t\t\t\t} else {\n\t\t\t\t\tclearInterval(disabledTime);\n\t\t\t\t\tmsgButton.button.selectText = buttonName;\n\t\t\t\t\tmsgButton.enabledFn();\n\t\t\t\t}\n\t\t\t}, 1000)\n\t\t}\n\t\tcountTime();"
                    }
                ],
                "layout": {
                    "positionType": "absolute"
                }
            }
        ]
    },
    "animation": [
        
    ],
    "interactives": [
        {
            "uuid": "73532",
            "fromContentUUID": "bb-vant-field",
            "fromContentEvent": "change",
            "executeArgument": "var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;\n\t\tif (!myreg.test(params[0])) {\n\t\t\t_TY_Tool.findBBByUuid(\"37C8BB8C-55F4-4317-9A62-18C62A84F52F\").enabledFn()\n\t\t} else {\n\t\t\t_TY_Tool.findBBByUuid(\"37C8BB8C-55F4-4317-9A62-18C62A84F52F\").disabledFn()\n\t\t}"
        },
        {
            "uuid": "21075",
            "fromContentUUID": "bb-indep-button",
            "fromContentEvent": "button-finish-success",
            "executeArgument": "var countTime = function() {\n\t\t\tvar msgButton = _TY_Tool.findBBByUuid(\"37C8BB8C-55F4-4317-9A62-18C62A84F52F\");\n\t\t\tvar buttonName = msgButton.relButton.selectText;\n\t\t\tvar time = 60;\n\t\t\tvar disabledTime = setInterval(() => {\n\t\t\t\ttime = time - 1;\n\t\t\t\tif (tiem > 0) {\n\t\t\t\t\tmsgButton.relButton.selectText = buttonName + `(${time}s)`\n\t\t\t\t} else {\n\t\t\t\t\tclearInterval(disabledTime);\n\t\t\t\t\tmsgButton.enabledFn();\n\t\t\t\t}\n\t\t\t}, 1000)\n\t\t}\n\t\tcountTime();"
        }
    ],
    "layout": {
        
    },
    "onFocus": false
}]
            }
        },
        watch: {
        },
        created: function () {
        },
        mounted:function(){

        },
        methods: {
        }
    }
</script>
<style lang='less'>    
</style>