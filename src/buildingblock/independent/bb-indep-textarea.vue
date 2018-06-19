<template>
    <div>
    	<textarea 
		    class="bb-indep-textrea" 
		    :style="realStyle"
		    v-model="valueBase"
		    :placeholder="placeholder"
		    :showText="onShowText"
		    @keyup="onKeyup"
		></textarea>
    	<p>{{writeNumber}}/{{limitNumber}}</p>
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

                    }
                }
            },
            limitNumberShow:{
            	type:Number,
            	default:20,
            }
        },
        data() {
            return {
                valueBase:this.value,
                writeNumber:"0",
                onShowText:this.showText,
                limitNumber:this.limitNumberShow,
            }
        },
        computed:{
            //处理字体样式配置
            realStyle:function(){
                const t = this;
                const styles = {
                	"border-radius":t.styleConfig.borderRadius,
                	"padding":t.styleConfig.padding,
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
        	//获取输入的字符串长度
        	onKeyup:function(){
        		this.writeNumber = this.valueBase.length;
        		//this.limitNumber = this.onShowText;
        		//console.log(this.onShowText);
        	},
        	
            
        }
    }
</script>
<style lang='less' scoped>
    .bb-indep-textarea{
        width: 100%;
        display: inline-block;
    }
</style>