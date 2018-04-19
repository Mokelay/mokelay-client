<script>
import Vue from 'vue';
import Util from '../libs/util';
    export default {
        name: 'bb-button-array',
        render: function(createElement){
            const t = this;
            const dialog = t.renderDialog(createElement);
            const buttonEle = createElement('el-button',{props:{type:t.startButtonType,icon:t.startButtonIcon},on:{click:t.setting}},[t.settingText]);
            const button = createElement('div',{class:this.buttonFormClass},[t.arrayDesc,buttonEle]);
            return createElement('div',{},[button,dialog]);
        },
        props: {
            value:{
                type:[Array,String]
            },
            fields:{
                type:[String,Array]
            },
            settingText:{
                type:String,
                default:"设置"
            },
            arrayDescTpl:{
                type:String
            }
        },

        data() {
            return {
                arrayData:this.value,
                dialog:null,
                dialogVisible:false
            }
        },
        computed: {
            arrayDesc:function(){
                var t = this;
                if(t.arrayDescTpl && t.arrayData){
                    return _TY_Tool.tpl(t.arrayDescTpl, _TY_Tool.buildTplParams(t,t.arrayData));
                }
            },
        },
        watch: {
            value(val){
                if (typeof val === 'array') {
                    this.arrayData = val;
                } else if (typeof val === 'string') {
                    this.arrayData = (val ? JSON.parse(val) : {});
                }
                //this.$emit("input",val);
            },
            arrayData(val){
                if (typeof val === 'array') {
                    this.arrayData = val;
                } else if (typeof val === 'string') {
                    this.arrayData = (val ? JSON.parse(val) : {});
                }
                //this.$emit("input",val);
            }
        },
        created: function () {
        },
        mounted:function(){
        },
        methods: {
            //渲染弹窗
            renderDialog:function(createElement){
                const t = this;
                t.arrayKey = t.arrayKey?t.arrayKey:_TY_Tool.uuid();
                const array = createElement('bb-array',{
                    domProps: {
                        value: t.arrayData,
                    },
                    props:{
                        fields:t.fields,
                        showCommit:true,
                        value: t.arrayData
                    },
                    on:{
                        commit: function(arrayData){
                            t.arrayData = arrayData;
                            t.$emit('input', arrayData);
                            t.$emit('commit', arrayData);
                            t.dialogVisible = false;
                        },
                    },
                    ref:"array",
                    key:t.arrayKey
                },[]);
                const dialog = createElement('bb-dialog',{props:{isShow:t.dialogVisible,size:"middle",appendToBody:true,modalAppendToBody:true},on:{'update:isShow':(isShow)=>{t.dialogVisible = isShow}}},[array]);
                return dialog;
            },
            setting:function(){
                var t = this;
                t.dialogVisible = true;
            },
             loadChildBB(){
                let t=this;
                return _TY_Tool.loadChildBB(t);                
            }
        }
    }
</script>