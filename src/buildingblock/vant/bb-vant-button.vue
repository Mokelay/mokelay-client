<template>
    <van-button
        :type="type" 
        :size="option.size"
        :tag="option.tag"
        :native-type="option.nativeType"
        :disabled="option.disabled"
        :loading="option.loading"
        :block="option.block"
        :bottom-action="option.bottomAction"
        @click="click"
        >{{text}}</van-button>
</template>

<script>
import Button from 'vant/lib/button';
import 'vant/lib/button/style';

    export default {
        name: 'bb-vant-button',
        components: {
          "van-button":Button
        },
        props: {
            /*按钮文字*/
            text:{
                type:String,
                default:"按钮"
            },
            /*按主题 
                primary default danger
            */
            type:{
                type:String,
                default:"primary"
            },
            /*按钮执行动作
                {
                    action:'url 地址跳转|| execute-ds执行接口 || dialog-page弹窗 || code自定义代码 || buzz 巴斯代码',
                    url:''跳转地址 action:'url’时有效
                    urlType:'openWindow 在新标签中打开 
                    ds:{} //按钮请求的接口配置 action:'execute-ds’时有效
                    confirmTitle:'', //请求接口前的提示语标题   action:'execute-ds’时有效
                    confirmText:'', //请求接口前的提示语内容   action:'execute-ds’时有效
                    callBackStaticWords:'' //请求接口成功提示语
                    dialogPage:'pageAlias',//弹窗中的页面名称   action:'dialog-page’时有效
                    method:fn , //需要执行的方法 action:'code’时有效
                    buzz:'buzzName'  //巴斯方法名称  action:'buzz’时有效
                }
            */
            buttonAction:{
                type:Object,
                default:function() {
                    return {
                        action:"none"
                    };
                }
            },
            /*其他属性配置
                {
                    size:"normal large small mini", 按钮尺寸
                    tag:"",按钮 HTML 标签 
                    label:"标签名",
                    nativeType:"", 按钮类型（原生）
                    disabled:false,是否禁用
                    loading:false 显示为加载状态,
                    block:false,  是否为块级元素
                    bottomAction:false 是否为底部行动按钮
                }
            */
            option:{
                type:Object,
                default:function(){
                    return {
                        size:"normal"
                    };
                }
            }
        },
        data() {
            return {
            };
        },
        methods: {
            //外部参数，在button中存储
            linkage(...data){
              let t=this;
              if(data){
                t.external['linkage'] = data;
              }
            },
            //处理按钮点击
            click(){
                const t = this;
                _TY_Tool.resolveButton(t.buttonAction,_TY_Tool.buildTplParams(this));
                t.$emit('buttonClick',t.buttonAction,t);
                t.$emit('click',t.buttonAction,t);
            },
            //获取弹窗中的子积木
            loadChildBB(){
                let t=this;
                return _TY_Tool.loadChildBB(t);                
            }
        }
    }
</script>

<style scoped>
</style>