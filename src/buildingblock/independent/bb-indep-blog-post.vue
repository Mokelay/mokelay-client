<template>
 	<div class="bb-indep-blog-post"> 
 		<div class="postMessage"> 
 			<textarea 
 				:style="realStyle"
 				:placeholder="placeholder"
 			> 
 			</textarea>
 			<p>
 				<i 
 				v-for="icon in icons" 
 				:class="icon.class"
 				:style="iconStyle"> 
 				</i>
 			</p>
 			<a
 				v-for="item in items"
 				:href="item.href"
 				class="listStyle"
 			>
 				<i 
 				:style="listLeftIconStyle" 
 				:class="item.leftIcon"></i>
 				<span :style="listTextStyle">{{item.text}}</span>
 				<b :style="listMessageStyle">{{item.message}}</b>
 				<strong 
 				:style="listRightIconStyle"
 				:class="item.rightIcon">
 			</strong> 
 			</a>
 			<h6 class="buttonList"> 
 				<button 
 				:style="canceclStyle" 
 				v-for="button in buttons">
 					{{button.text}}
 				</button>
 			</h6>
 		</div>
 	</div>
</template>

<script> 

export default {
    name:"bb-indep-blog-post",
    props:{
    	//输入框样式
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
                        borderColor:"#eee",
                        borderStyle:"solid",
                        borderRadius:"2px",
                        width:"95%",
                        resize:"none",
                        height:"100px",
                        padding:"5%",
                        margin:"0 2.5%",
                        backgroundColor:"#eee",
                    }
                }
        },
        //按钮样式
        canceclStyleCongig:{
        	type:Object,
        	default:function(){
        		return {
        			width:"50%",
        			height:"40px",
        			lineHeight:"40px",
        			margin:"0",
        			padding:"0",
        			borderWidth:"1px",
        			borderColor:"#eee",
        			borderStyle:"solid",
        			fontFamily:"",
        			fontSize:"14px",
        			fontStyle:"",
        			fontWeight:"",
        			color:"#666",
        		}
        	}
        },
        //输入框默认值
        placeholder:{
        	type:String,
        	default:"说点什么~"
        },
        //图标数据
        icons:{
        	type:Array,
        	default:function(){
        		return[{
        			class:"",
        		},{	
        			class:"",
        		}]
        	}
        },
        //列表数据
        items:{
        	type:Array,
        	default:function(){
        		return [{
        			text:"所在位置",
        			message:"公开",
        			rightIcon:"",
        			href:"",
        			leftIcon:"",
        		},{
        			text:"谁可以看",
        			message:"公开",
        			rightIcon:"",
        			href:"",
        			leftIcon:"",            		
        		}]
        	}
        },
        //按钮数据
        buttons:{
        	type:Array,
        	default:function(){
        		return [{
        			text:"取消",
        		},{
        			text:"发表日记"
        		}]
        	}
        },
        //列表左侧图标样式
        listLeftIconStyleConfig:{
        	type:Object,
        	default:function(){
        		return {
        			width:"20px",
        			height:"20px",
        			margin:"0",
        			padding:"0"
        		}
        	}
        },
        //列表中间文字样式
        listTextStyleConfig:{
        	type:Object,
        	default:function(){
        		return {
        			width:"70%",
        			height:"",
        			lineHeight:"",
        			maigin:"",
        			padding:"",
        			fontFamily:"",
        			fontSize:"14px",
        			color:"#000",
        			fontStyle:"",
        			fontWeight:"normal",
        			display:"inline-block",
        			textAlign:"left",
        		}
        	}
        },
        //列表中间提示文字样式
        listMessageStyleConfig:{
        	type:Object,
        	default:function(){
        		return {
        			width:"20%",
        			height:"",
        			lineHeight:"",
        			maigin:"",
        			padding:"",
        			fontFamily:"",
        			fontSize:"14px",
        			color:"#666",
        			fontStyle:"",
        			fontWeight:"normal",
        			display:"inline-block",
        			textAlign:"right",
        		}
        	}
        },
        //列表右侧图标样式
        listRightIconStyleConfig:{
        	type:Object,
        	default:function(){
        		return {
        			width:"20px",
        			height:"20px",
        			margin:"0",
        			padding:"0"
        		}
        	}        
        },
        //图标样式
        iconStyleConfig:{
        	type:Object,
        	default:function(){
        		return {
        			width:"25px",
        			height:"25px",
        			margin:"0 10px 0 0",
        			padding:"0",
        		}
        	}
        },
    },

   data(){ 
        return{
            
        }
      },
    computed:{
	    //处理输入框字体样式配置
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
                'text-align':t.styleConfig.textAlign,
                'background-color':t.styleConfig.backgroundColor,
            }
            return styles;
        },
        //按钮样式
        canceclStyle:function(){
            const t = this;
            const styles = {
            	"width":t.canceclStyleCongig.width,
            	"height":t.canceclStyleCongig.height,
            	"ling-height":t.canceclStyleCongig.lineHeight,
            	"margin":t.canceclStyleCongig.margin,
            	"padding":t.canceclStyleCongig.padding,
            	"border-width":t.canceclStyleCongig.borderWidth,
            	"border-color":t.canceclStyleCongig.borderColor,
            	"border-style":t.canceclStyleCongig.borderStyle,
            	"font-family":t.canceclStyleCongig.fontFamily,
            	"font-size":t.canceclStyleCongig.fontSize,
            	"font-style":t.canceclStyleCongig.fontStyle,
            	"font-weight":t.canceclStyleCongig.fontWeight,
            	"color":t.canceclStyleCongig.color,
            }
            return styles;
        },
        //图标样式
        iconStyle:function(){
            const t = this;
            const styles = {
            	"width":t.iconStyleConfig.width,
            	"height":t.iconStyleConfig.height,
            	"margin":t.iconStyleConfig.margin,
            	"padding":t.iconStyleConfig.padding,
            }
            return styles;           
        },
        //列表左侧图标样式
        listLeftIconStyle:function(){
            const t = this;
            const styles = {
            	"width":t.listLeftIconStyleConfig.width,
            	"height":t.listLeftIconStyleConfig.height,
            	"margin":t.listLeftIconStyleConfig.margin,
            	"padding":t.listLeftIconStyleConfig.padding,
            }
            return styles;        
        },
        //列表文字样式
        listTextStyle:function(){
            const t = this;
            const styles = {
            	"width":t.listTextStyleConfig.width,
            	"height":t.listTextStyleConfig.height,
            	"display":t.listTextStyleConfig.display,
            	"line-height":t.listTextStyleConfig.lineHeight,
            	"margin":t.listTextStyleConfig.margin,
            	"padding":t.listTextStyleConfig.padding,
            	"font-family":t.listTextStyleConfig.fontFamily,
            	"font-size":t.listTextStyleConfig.fontSize,
            	"color":t.listTextStyleConfig.color,
            	"font-style":t.listTextStyleConfig.fontStyle,
            	"font-weight":t.listTextStyleConfig.fontWeight,         	
            	"text-align":t.listTextStyleConfig.textAlign,         	
            }
            return styles;        
        },
        //列表中提示信息文字样式
        listMessageStyle:function(){
            const t = this;
            const styles = {
            	"width":t.listMessageStyleConfig.width,
            	"height":t.listMessageStyleConfig.height,
            	"display":t.listMessageStyleConfig.display,
            	"line-height":t.listMessageStyleConfig.lineHeight,
            	"margin":t.listMessageStyleConfig.margin,
            	"padding":t.listMessageStyleConfig.padding,
            	"font-family":t.listMessageStyleConfig.fontFamily,
            	"font-size":t.listMessageStyleConfig.fontSize,
            	"color":t.listMessageStyleConfig.color,
            	"font-style":t.listMessageStyleConfig.fontStyle,
            	"font-weight":t.listMessageStyleConfig.fontWeight, 
            	"text-align":t.listMessageStyleConfig.textAlign,         	

            }
            return styles;        
        },    
        //列表中提示信息文字样式
        listRightIconStyle:function(){
            const t = this;
            const styles = {
            	"width":t.listRightIconStyleConfig.width,
            	"height":t.listRightIconStyleConfig.height,
            	"margin":t.listRightIconStyleConfig.margin,
            	"padding":t.listRightIconStyleConfig.padding,

            }
            return styles;        
        },   
    },
    watch:{},
    methods:{

    }
}
</script>
<style>
	.postMessage{
		width:100%;
		height:400px;
		background:#fff;
	}
	.listStyle{
		width:80%;
		height:auto;
		line-height:40px;
		display:flex;
		justify-content:center;
		border-top:1px solid #eee;
		border-bottom:1px solid #eee;
		display:inline-block;
		margin:0 10%;
	}
	.listStyle:nth-child(even){
		border-top:none;
	}
	.buttonList{
		width:100%;
		position:fixed;
		bottom:0;
		left:0;
		display:flex;
		justify-content:center;
	}
</style>