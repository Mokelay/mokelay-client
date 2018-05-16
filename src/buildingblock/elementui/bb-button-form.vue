<script>
import Vue from 'vue';
import Util from '../../libs/util';
    export default {
        name: 'bb-button-form',
        render: function(createElement){
            const t = this;
            const dialog = t.renderForm(createElement);
            const buttonEle = createElement('el-button',{props:{type:t.startButtonType,icon:t.startButtonIcon},on:{click:t.setting}},[t.settingText]);
            const button = createElement('span',{class:this.buttonFormClass},[t.formDesc,buttonEle]);
            return createElement('span',{},[button,dialog]);
        },
        props: {
            value:{
                type:[String,Object]
            },
            fields:{
                type:[String,Array]
            },
            startButtonType:{
                type:String
            },
            startButtonIcon:{
                type:String
            },
            settingText:{
                type:String,
                default:"设置"
            },
            formDescTpl:{
                type:String
            },
            buttonConfig:{
                type:Object
            },
            valueDs:{
                type:Object
            },
            dsFields:{
                type:Object
            },
            showCancelButton:{
                type:Boolean
            },
            showCleanButton:{
                type:Boolean
            },
            hideSubmitButton:{
                type:Boolean
            },
            buttonFormClass:{
                type:String,
                default:'bb-button-form'
            },
            on:{
                type:Array
            },
            parentData:{
                type:Object
            },
            formButtonName:{
                type:String
            },
            labelWidth:{
                type:String
            },
            labelInline:{
                type:Boolean,
                default:false
            },
            content:{
                type:Array
            },
            closeOnClickModal:{
                type:Boolean,
                default:false
            },
        },

        data() {
            return {
                formData:Object.assign({},this.value),
                defaultFormData:Object.assign({},this.value),
                formVisible:false,
            }
        },
        computed: {
            formDesc:function(){
                var t = this;
                if(t.formDescTpl && t.formData){
                    return _TY_Tool.tpl(t.formDescTpl, _TY_Tool.buildTplParams(t,t.formData));
                }
            },
        },
        watch: {
            value(val){
                if (typeof val === 'object') {
                    this.formData = val;
                } else if (typeof val === 'string') {
                    this.formData = (val ? JSON.parse(val) : {});
                }
                //this.$emit("input",val);
            }
        },
        created: function () {
        },
        mounted:function(){

        },
        methods: {
            //渲染dialog表单
            renderForm:function(createElement){
                const t = this;
                const formKey = _TY_Tool.uuid();
                const form = createElement('bb-form',{
                    props:{
                        fields:t.fields,
                        value:t.formData, //传入value
                        buttonConfig:t.buttonConfig,
                        settingButtonText:t.formButtonName,
                        ds:t.valueDs,
                        dsFields:t.dsFields,
                        showCancelButton:t.showCancelButton,
                        showCleanButton:t.showCleanButton,
                        hideSubmitButton:t.hideSubmitButton,
                        on:t.on,
                        parentData:t.parentData,
                        labelWidth:t.labelWidth,
                        labelInline:t.labelInline,
                        content:t.content,
                        size:'mini'
                    },
                    on:{
                        "button-finish-success":function(button, valueobj,map){
                            t.$emit('button-finish-success', button, valueobj);
                        },
                        "button-finish":function(button, valueobj,map){
                            t.$emit('button-finish', button, valueobj);
                            t.formVisible = false;
                        },
                        commit: function(formData){
                            //解决form表单h输出值后不能关闭弹窗
                            setTimeout(()=>{t.$emit('input', formData)},0);
                            t.$emit('commit', formData);
                            t.formData = t.defaultFormData;
                            if(!t.buttonConfig||!t.buttonConfig.ds){
                                t.formVisible = false;
                            }
                        },
                        cancel:function(formData){
                            t.$emit('cancel',formData);
                            t.formVisible = false;
                        }
                    },
                    ref:"form",
                    key:formKey
                },[]);
                const dialog = createElement('bb-dialog',{
                    props:{
                        closeOnClickModal:t.closeOnClickModal,
                        modalAppendToBody:true,
                        appendToBody:true,
                        isShow:t.formVisible,
                        size:"middle"
                    },on:{
                        'update:isShow':(isShow)=>{
                            t.formVisible = isShow;
                            if(!isShow){
                                //下面清空表单数据后  关闭表单会清空表单项的值  暂时注释掉
                                t.formData = t.defaultFormData;
                            }
                        }
                    }
                },[form]);
                return dialog;
            },
            setting:function(){
                var t = this;
                t.formVisible = true;
            },
            loadChildBB(){
                let t=this;
                return _TY_Tool.loadChildBB(t);                
            },
            //外部交互弹出弹窗
            showDialog(formData){
                const t = this;
                t.formData = formData;
                t.setting();
            }
        }
    }
</script>
<style>
    .m10 {
        margin: 10px 0;
    }
    .db{
        display: block;
    }
    .dib{
        display: inline-block;
    }
    .di {
        display: inline;
    }

    .bb-button-form-content{
        height: 500px;
        overflow-y: auto;
    }
    .bb-button-form{
        display: inline-block;
    }
</style>