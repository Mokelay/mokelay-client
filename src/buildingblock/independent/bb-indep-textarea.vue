<template>
    <div v-if="isShow">
    	<textarea 
		    class="bb-indep-textrea" 
		    :style="realStyle"
		    v-model="valueBase"
		    :placeholder="placeholder"
		    :showText="onShowText"
            :disabled="realOption.disabled"
		    @keyup="onKeyup"
		    @change="change"
		></textarea>
    	<p v-if="showText" class="limitNumber">{{writeNumber}}/{{limitNumber}}</p>
    </div>
</template>

<script>
    export default {
        name: 'bb-indep-textarea',
        props: {
            /*
                value 支持v-model
            */
            value:{
                type:[String,Number]
            },
            placeholder:{
            	type:[String,Number]
            },
            showText:{
            	type:Number,
            	default:0
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
                        fontColor:'#9a9a9a',
                        bold:false ,
                        italic:false ,
                        underline:false,
                        textAlign:'left',
                        lingHeight:1.5,
                        letterSpacing:0,
                        borderWidth:1,
                        borderColor:"#6298D8",
                        borderStyle:"solid",
                        borderRadius:"2px",
                        width:"100%",
                        resize:"none",
                        height:"50px",
                        padding:"5px",
                        margin:"",
                    }
                }
            },
            //基础配置
            option:{
                type:Object,
                default:function(){
                    return {
                        disabled:false
                    };
                }
            }
            
        },
        data() {
            return {
                valueBase:this.value,
                writeNumber:"0",
                onShowText:this.showText,
                limitNumber:this.showText,
                isShow:true,
                realOption:this.option
            }
        },
        computed:{
            //处理字体样式配置
            realStyle:function(){
                const t = this;
                const styles = {
                	"border-radius":t.styleConfig.borderRadius,
                	"padding":t.styleConfig.padding,
                	"margin":t.styleConfig.margin,
                	"height":t.styleConfig.height,
                	"resize":t.styleConfig.resize,
                	"width":t.styleConfig.width,
                	"border-style":t.styleConfig.borderStyle,
                	"border-color":t.styleConfig.borderColor,
                	"border-width":t.styleConfig.borderWidth,
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
        watch: {},
        methods: {
        	//获取输入的字符串长度,超出设置的长度截取
        	onKeyup:function(){
        		this.writeNumber = this.valueBase.length;
        		var t = this.valueBase;
        		var w = this.writeNumber;
        		var s = this.showText;
        		if(w>s && s != 0){
        			var a = this.valueBase.substring(0,s);
        			this.valueBase = a;
        			this.writeNumber = this.valueBase.length;
        		}
        	},
        	//change事件
        	change:function(val){
        		this.$emit("change",this.valueBase);
        		this.$emit("input",this.valueBase);
        	},
        	//外部设值
        	setNumber:function(...params){
                params.forEach((param,key)=>{
                    if(param.type == "custom"){
                        this.valueBase = param.arguments
                    }
                })        		
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
                this.realOption.disabled = true;
            },
            //启用积木
            enabledFn(){
                this.realOption.disabled = false;
            },
            //外部取值
            getValue:function(){
                return this.valueBase;
            },
            //外部设值
            setValue:function(val){
                this.valueBase = val;
                this.$emit('input',val);
                this.$emit('change',val);
            }
        }
    }
</script>
<style lang='less' scoped>
    .bb-indep-textarea{
        width: 100%;
        display: inline-block;
    }
    .limitNumber{
        text-align: right;
        font-size: 0.3rem;
        color: #909090;
        text-align: right;
    }
</style>