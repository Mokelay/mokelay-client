<template>
    <span class="bb-text" :style="realStyle" :contenteditable="contenteditable" @click="textClick" v-on:dblclick="dblclick" v-on:blur="blur" v-html="relValueBase"></span>
</template>

<script>
    export default {
        name: 'bb-text',
        props: {
            /*
                value 支持v-model
            */
            value:{
                type:[String,Number]
            },
            /*
                defaultValTpl 默认值支持模板
            */
            defaultValTpl:{
                type:[String,Number,Boolean]
            },
            /*
                styleConfig 样式
                {
                    fontFamily:string,
                    fontSize:string,
                    fontColor:string,
                    bload:true || false ,  字体加粗
                    italic：true || false , 字体倾斜
                    lingHeight:number,   行高
                    letter-spacing:number  字体间距
                }
            */
            styleConfig:{
                type:Object,
                default:function(){
                    return {
                        fontFamily:'',
                        fontSize:'14px',
                        fontColor:'#333333',
                        bold:false ,
                        italic:false ,
                        underline:false,
                        textAlign:'left',
                        lingHeight:1.5,
                        letterSpacing:0
                    }
                }
            },
            //不要转换空格和换行
            noTransfer:{
                type:Boolean,
                default:false
            }
        },
        data() {
            return {
                valueBase: this.valueTpl(this.value),
                contenteditable:false,
                relValueBase:null
            }
        },
        computed:{
            //处理字体样式配置
            realStyle:function(){
                const t = this;
                const styles = {
                    'font-family':t.styleConfig.fontFamily,
                    'font-size':t.styleConfig.fontSize,
                    'color':t.styleConfig.fontColor,
                    'font-weight':t.styleConfig.bold?'bold':'normal',
                    'font-style':t.styleConfig.italic?'italic':'normal',
                    'ling-height':t.styleConfig.lingHeight,
                    'letter-spacing':t.styleConfig.letterSpacing,
                    'text-decoration':t.styleConfig.underline?'underline':'none',
                    'text-align':t.styleConfig.textAlign
                }
                return styles;
            }
        },
        watch: {
            value(val){
                this.valueBase = this.valueTpl(val);
                this.relValueBase =this.valueTpl(val);
            }
        },
        created: function () {
        },
        mounted:function(){
            let t=this;
            //渲染默认值模板
            _TY_Tool.buildDefaultValTpl(t,"valueBase");
            //处理字符串中的空格和换行
            if(t.valueBase&&!t.noTransfer){
                t.relValueBase = t.valueTpl(t.valueBase.replace(/\r{0,}\n/g,"<br/>").replace(/\s/g,"&nbsp;"));
            }else{
                t.relValueBase = t.valueTpl(t.valueBase);
            }
        },
        methods: {
            valueTpl:function(val){
                const t=this;
                return _TY_Tool.tpl(val,_TY_Tool.buildTplParams(t));
            },
            dblclick:function(params){
                this.$emit('bb-dblclick');
            },
            //点击事件
            textClick:function(){
                let t=this;
                t.$emit("click",t);
            },
            blur:function(params){
                this.$emit('bb-blur');
            },
            edit:function(params){
                this.contenteditable = true;
            },
            cancel:function(params){
                this.contenteditable = false;
            }
        }
    }
</script>
<style lang='less' scoped>
    .bb-text{
        width: 100%;
        display: inline-block;
    }
</style>