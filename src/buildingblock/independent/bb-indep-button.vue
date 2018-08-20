<template>
    <button v-if="isShow" :id="id" :class="['indep_btn',relButton.type,realOptions.disabled?'is-disabled':'']" :style="realOptions.disabled?disabledStyle:relButton.style" class="bb-indep-button" type="button" :disabled="realOptions.disabled" :size="relButton.size" :icon="relButton.icon" @click="click(relButton)"><i :class="relButton.icon"></i>{{$slots.default?'':relButton.selectText}}<slot></slot></button>
</template>

<script>
    import Util from '../../libs/util';
    import Vue from 'vue'

    export default {
        name: 'bb-indep-button',
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
                    selectText:'按钮文字',
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
                        selectText:'设置按钮'
                    };
                }
            },
            /*其他属性
                disabled:false, //禁用
                readonly:false,  //只读
                disabledStyle:{}  //禁用状态样式
            */
            options:{
                type:Object,
                default:function(){
                    return {
                        disabled:false,
                        readonly:false,
                        disabledStyle:{}
                    };
                }
            }
        },
        data() {
            return {
                external:{},//外部参数
                isShow:true,
                realOptions:this.options,
                id:_TY_Tool.uuid()
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
                return Object.assign({
                        type:'primary',
                        selectText:'设置按钮'
                    },this.button);
            },
            disabledStyle:function(){
                const bb = {
                    layout:this.realOptions.disabledStyle
                }
                const style = _TY_Tool.setStyle(bb,this);
                return style;
            }
        },
        created: function () {
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
                Util.resolveButton(button,_TY_Tool.buildTplParams(this));
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
<style lang="less" scoped>
    .bb-indep-button{
        margin: 0.2rem;
        display: inline-block;
    }
    .indep_btn{
        display: inline-block;
        line-height: 1;
        white-space: nowrap;
        cursor: pointer;
        background: #fff;
        border: 1px solid #dcdfe6;
        border-color: #dcdfe6;
        color: #606266;
        -webkit-appearance: none;
        text-align: center;
        box-sizing: border-box;
        outline: none;
        margin: 0;
        transition: .1s;
        font-weight: 500;
        -moz-user-select: none;
        -webkit-user-select: none;
        -ms-user-select: none;
        padding: 0.4rem 0.5rem;
        font-size: 0.5rem;
        border-radius: 0.2rem;
        &:hover,&:focus{
            background: #fff;
            border-color: #0091EA;
            color: #0091EA;
        }
    }
    .indep_btn.primary{
        color: #fff;
        background-color: #0091EA;
        border-color: #0091EA;
    }
    .indep_btn.primary:hover,.indep_btn.primary:focus{
        background: #33a7ee;
        border-color: #33a7ee;
        color: #fff; 
    }
    .indep_btn.is-disabled, .indep_btn.is-disabled:hover, .indep_btn.is-disabled:focus, .indep_btn.is-disabled:active {
        color: #b4bccc;
        cursor: not-allowed;
        background-image: none;
        background-color: #fff;
        border-color: #efefef;
    }
    .indep_btn.success{
        color: #fff;
        background-color: #67c23a;
        border-color: #67c23a; 
        &:hover,&:focus{
            background: #85ce61;
            border-color: #85ce61;
            color: #fff;
        }
    }
    .indep_btn.warning{
        color: #fff;
        background-color: #eb9e05;
        border-color: #eb9e05;
        &:hover,&:focus{
            background: #efb137;
            border-color: #efb137;
            color: #fff;
        }
    }
    .indep_btn.danger{
        color: #fff;
        background-color: #fa5555;
        border-color: #fa5555;
        &:hover,&:focus{
            background: #fb7777;
            border-color: #fb7777;
            color: #fff;
        }
    }
    .indep_btn.info{
        color: #fff;
        background-color: #878d99;
        border-color: #878d99;
        &:hover,&:focus{
            background: #9fa4ad;
            border-color: #9fa4ad;
            color: #fff;
        }
    }
    .indep_btn.text{
        border-color: transparent;
        color: #0091EA;
        background: transparent;
        padding-left: 0;
        padding-right: 0;
        &:hover,&:focus{
            color: #33a7ee;
            border-color: transparent;
            background-color: transparent;
        }
    }


</style>