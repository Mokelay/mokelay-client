<template>
    <el-button v-if="isShow" :style="relButton.style" class="bb-button" :type="relButton.type" :disabled="realOptions.disabled" :size="relButton.size" :icon="relButton.icon" @click.native.prevent="click(relButton)">{{relButton.selectText || relButton.text}}<slot></slot></el-button>
</template>

<script>
    import Util from '../../libs/util';
    import Vue from 'vue'
    import {
            Button
    } from 'element-ui'
    Vue.use(Button);

    export default {
        name: 'bb-button',
        props: {
            /**
             *按钮配置 
                @button:当前点击的按钮配置
                {
                    style:{},//css样式
                    type:'primary',//按钮样式
                    disabled:false,//按钮是否可编辑
                    size:'small',//按钮大小
                    icon:'icon',//按钮图标
                    text:'按钮文字',//
                    action:'url 地址跳转|| execute-ds执行接口 || dialog-page弹窗 || code自定义代码 || buzz 巴斯代码',
                    url:''跳转地址 action:'url’时有效
                    urlType:'openWindow 在新标签中打开 
                    ds:{} //按钮请求的接口配置 action:'execute-ds’时有效
                    confirmTitle:'', //请求接口前的提示语标题   action:'execute-ds’时有效
                    confirmText:'', //请求接口前的提示语内容   action:'execute-ds’时有效
                    callBackStaticWords:'' //请求接口成功提示语
                    dialogPage:'pageAlias',//弹窗中的页面名称   action:'dialog-page’时有效
                    method:fn , //需要执行的方法 action:'code’时有效
                    buzz:'buzzName',  //巴斯方法名称  action:'buzz’时有效
                    noConfirm:true //去除确认框
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
            },
            options:{
                type:Object,
                default:function(){
                    return {
                        disabled:false,
                        readonly:false
                    };
                }
            }
        },
        data() {
            return {
                external:{},//外部参数
                isShow:true,
                realOptions:this.options
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
        watch: {
            options(val){
                this.realOption = val;
            }
        },
        created: function () {
            const t = this;
            const show = _TY_Tool.tpl(t.relButton.showValue, _TY_Tool.buildTplParams(t));
            if(show == "false"){
               t.isShow = false;
            }else{
                t.isShow = true;
            }
        },
        mounted:function(){
        },
        methods: {
            //外部参数，在button中存储
            linkage(...data){
              let t=this;
              if(data){
                this.external['linkage'] = data;
              }
            },
            click:function(button){
                this.vue = Vue;
                Util.resolveButton(button,_TY_Tool.buildTplParams(this),button.afterClick);
                this.$emit('buttonClick',button,this);
                this.$emit('click',button,this);
            },
            loadChildBB(){
                let t=this;
                return _TY_Tool.loadChildBB(t);                
            },
            //隐藏积木
            hideFn(){
                this.isShow = false;
            },
            //展示积木
            showFn(){
                this.isShow = true;
            },
            //禁用积木
            disabledFn(){
                this.realOptions.disabled = true;
            },
            //启用积木
            enabledFn(){
                this.realOptions.disabled = false;
            }
        }
    }
</script>
<style scoped>
    .bb-button{
        margin: 2px;
    }
</style>