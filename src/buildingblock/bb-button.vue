<template>
    <el-button :style="relButton.style" class="bb-button" :type="relButton.type" :disabled="relButton.disabled" :size="relButton.size" :icon="relButton.icon" @click.native.prevent="click(relButton)">{{relButton.selectText || relButton.text}}<slot></slot></el-button>
</template>

<script>
    import Util from '../libs/util';
    import Vue from 'vue'

    export default {
        name: 'bb-button',
        props: {
            /**
             *按钮配置 
                @button:当前点击的按钮配置
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
            button:{
                type:Object,
                default: function(){
                    return {
                        type:'primary',
                        text:'请设置按钮属性'
                    };
                }
            }
        },
        data() {
            return {

            }
        },
        computed: {
            relButton: function () {
                if(!this.button.style){
                    this.button.style = {};
                }
                if(this.button.color){
                    this.button.style.color=this.button.color;
                }
                if(this.button.fontSize){
                    this.button.style.fontSize=this.button.fontSize;
                }
                return this.button;
            }
        },
        created: function () {
        },
        mounted:function(){
        },
        methods: {
            click:function(button){
                this.vue = Vue;
                Util.resolveButton(button,_TY_Tool.buildTplParams(this),button.afterClick);
                this.$emit('buttonClick',button);
                this.$emit('click',button);
            },
            loadChildBB(){
                let t=this;
                return _TY_Tool.loadChildBB(t);                
            }
        }
    }
</script>
<style scoped>
</style>