<template>
  <div class="bb-indep-blog">
		<div class="blogReply"> 
			<i :class="replyIcon" :style="replyIconStyle"></i>
			<span class="replyContent"> 
				<div class="replyUserCss" v-for="reply in replys"> 
					<span class="replyUserStyle"> 
						<img :src="reply.userImg" :style="replyUserImgStyle">
					</span>
					<span class="replyMessagrStyle"> 
						<p :style="replyMessageUserStyle">{{reply.user}}</p>
						<p :style="replyMessageDate">{{reply.date}}</p>
						<h6 :style="replyMessage" @click="replyClick($event)">{{reply.message}}</h6>
						<h5 v-for="comment in reply.children" class="replycomment">
							<b :style="replyUserStyle">{{comment.replyUser}}</b>
							<i :style="replyObjectStyle">{{comment.replyObject}}</i>
							<i :style="replyUserStyle">{{comment.replyObjectName}}</i>
							<i :style="replyObjectStyle">{{comment.replyObjectSymbol}}</i>
							<i :style="replyObjectStyle" @click="replyContentClick">{{comment.replyContent}}</i>
						</h5>						
					</span>
				</div>
			</span>
		</div>
  </div>
</template>
<script>  


export default {
    name:"bb-indep-blog",
    props:{  	
		//评论回复静态数组
		/* [{
    				userImg:"http://static.facetool.cn/U/32ad5dce7b5850e062d08af4837f4717.jpg",
    				user:"aa",
    				date:"一天前",
    				message:"就是这样子",
    				children:[{
    					replyUser:"小明",
    					replyObject:"回复",
    					replyObjectName:"小花",
    					replyObjectSymbol:":",
    					replyContent:"111111111",
    				},{
    					replyUser:"小明",
    					replyObject:"回复",
    					replyObjectName:"小花",
    					replyObjectSymbol:":",
    					replyContent:"111111111",    				
    				}]
    			},{
    				userImg:"http://static.facetool.cn/U/32ad5dce7b5850e062d08af4837f4717.jpg",
    				user:"aa",
    				date:"一天前",
    				message:"就是这样子",
    				children:[{
    					replyUser:"小明",
    					replyObject:"回复",
    					replyObjectName:"小花",
    					replyObjectSymbol:":",
    					replyContent:"111111111",
    				}]   			
    			}]*/
    	replys:{
    		type:Array,
    	},
    	//动态数据
    	commentDs:{
            type:Object,
        },    	
    	//回复内容列表左侧icon样式
    	replyIconStyleConfig:{
    		type:Object,
    		default:function(){
    			return {
    				margin:"5px 5px 0 7px",
    				padding:"0",
    				height:"15px",
    				width:"15px",
    				color:"#666",
    				fontSize:"18px",
    			}
    		}      	
    	},
    	//回复列表用户头像样式
    	replyUserImgStyleConfig:{
    		type:Object,
    		default:function(){
    			return {
    				margin:"5px 5px 0 7px",
    				padding:"0",
    				height:"30px",
    				width:"30px",
    				borderRadius:"50%",
    			}
    		}          	
    	},
    	//回复列表用户名字样式
    	replyMessageUserStyleConfig:{
    		type:Object,
    		default:function(){
    			return {
    				margin:"5px 0 0 5px",
    				padding:"0",
    				height:"",
    				width:"",
    				borderStyle:"",
    				borderColor:"",
    				borderWidth:"", 				
    				borderRadius:"",
    				fontFamily:'',
                    fontSize:'14px',
                    fontColor:'#333',
                    bold:false ,
                    italic:false ,
                    lingHeight:"15px",
                    letterSpacing:0,
                    textAlign:'left',
    			}
    		}    	    	
    	},
    	//评论列表用户发表日期样式
    	replyMessageDateConfig:{
    		type:Object,
    		default:function(){
    			return {
    				margin:"0 0 0 5px",
    				padding:"0",
    				height:"",
    				width:"",
    				borderStyle:"",
    				borderColor:"",
    				borderWidth:"", 				
    				borderRadius:"",
    				fontFamily:'',
                    fontSize:'12px',
                    fontColor:'#666',
                    bold:false ,
                    italic:false ,
                    lingHeight:"15px",
                    letterSpacing:0,
                    textAlign:'left',
    			}
    		}       	
    	},
    	//回复列表回复内容文字样式
    	replyMessageConfig:{
    		type:Object,
    		default:function(){
    			return {
    				margin:"5px 0 0 5px",
    				padding:"0",
    				height:"",
    				width:"",
    				borderStyle:"",
    				borderColor:"",
    				borderWidth:"", 				
    				borderRadius:"",
    				fontFamily:'',
                    fontSize:'14px',
                    fontColor:'#333',
                    bold:false ,
                    italic:false ,
                    lingHeight:"20px",
                    letterSpacing:0,
                    textAlign:'left',
    			}
    		}    
    	},
    	//回复下回复的用户名字样式
    	replyUserStyleConfig:{
    		type:Object,
    		default:function(){
    			return {
    				margin:"0",
    				padding:"0",
    				height:"",
    				width:"",
    				borderStyle:"",
    				borderColor:"",
    				borderWidth:"", 				
    				borderRadius:"",
    				fontFamily:'',
                    fontSize:'12px',
                    fontColor:'rgb(61, 168, 245)',
                    bold:false ,
                    italic:false ,
                    lingHeight:"20px",
                    letterSpacing:0,
                    textAlign:'left',
    			}
    		}    
    	},
    	//回复下回复的内容文字样式
    	replyObjectStyleConfig:{
    		type:Object,
    		default:function(){
    			return {
    				margin:"0",
    				padding:"0",
    				height:"",
    				width:"",
    				borderStyle:"",
    				borderColor:"",
    				borderWidth:"", 				
    				borderRadius:"",
    				fontFamily:'',
                    fontSize:'12px',
                    fontColor:'#333',
                    bold:false ,
                    italic:false ,
                    lingHeight:"20px",
                    letterSpacing:0,
                    textAlign:'left',
    			}
    		}    
    	},
    },
   	data(){ 
        return{    	
        	replyIcon:"ty-icon_xiaoxi1",
        }
    },
    watch:{}, 
    mounted(){ 
	   this.getData();
	},  
    computed:{
        replyIconStyle:function(){
            const t = this;
            const styles = {
            	"padding":t.replyIconStyleConfig.padding,
            	"margin":t.replyIconStyleConfig.margin,
            	"height":t.replyIconStyleConfig.height,
            	"width":t.replyIconStyleConfig.width,
            	"color":t.replyIconStyleConfig.color,
            	"font-size":t.replyIconStyleConfig.fontSize
            }
            return styles;            
        },
        replyUserImgStyle:function(){
            const t = this;
            const styles = {
            	"padding":t.replyUserImgStyleConfig.padding,
            	"margin":t.replyUserImgStyleConfig.margin,
            	"height":t.replyUserImgStyleConfig.height,
            	"width":t.replyUserImgStyleConfig.width,
            	"border-radius":t.replyUserImgStyleConfig.borderRadius,
            }
            return styles;             
        },
        replyMessageUserStyle:function(){
            const t = this;
            const styles = {
            	"padding":t.replyMessageUserStyleConfig.padding,
            	"margin":t.replyMessageUserStyleConfig.margin,
            	"height":t.replyMessageUserStyleConfig.height,
            	"width":t.replyMessageUserStyleConfig.width,
            	"border-style":t.replyMessageUserStyleConfig.borderStyle,
            	"border-color":t.replyMessageUserStyleConfig.borderColor,
            	"border-width":t.replyMessageUserStyleConfig.borderWidth,
            	"border-radius":t.replyMessageUserStyleConfig.borderRadius,
                'font-family':t.replyMessageUserStyleConfig.fontFamily,
                'font-size':t.replyMessageUserStyleConfig.fontSize,
                'color':t.replyMessageUserStyleConfig.fontColor,
                'font-weight':t.replyMessageUserStyleConfig.bold?'bold':'normal',
                'font-style':t.replyMessageUserStyleConfig.italic?'italic':'normal',
                'line-height':t.replyMessageUserStyleConfig.lingHeight,
                'letter-spacing':t.replyMessageUserStyleConfig.letterSpacing,
                'text-align':t.replyMessageUserStyleConfig.textAlign,
            }
            return styles;            
        },
        replyMessageDate:function(){
            const t = this;
            const styles = {
            	"padding":t.replyMessageDateConfig.padding,
            	"margin":t.replyMessageDateConfig.margin,
            	"height":t.replyMessageDateConfig.height,
            	"width":t.replyMessageDateConfig.width,
            	"border-style":t.replyMessageDateConfig.borderStyle,
            	"border-color":t.replyMessageDateConfig.borderColor,
            	"border-width":t.replyMessageDateConfig.borderWidth,
            	"border-radius":t.replyMessageDateConfig.borderRadius,
                'font-family':t.replyMessageDateConfig.fontFamily,
                'font-size':t.replyMessageDateConfig.fontSize,
                'color':t.replyMessageDateConfig.fontColor,
                'font-weight':t.replyMessageDateConfig.bold?'bold':'normal',
                'font-style':t.replyMessageDateConfig.italic?'italic':'normal',
                'line-height':t.replyMessageDateConfig.lingHeight,
                'letter-spacing':t.replyMessageDateConfig.letterSpacing,
                'text-align':t.replyMessageDateConfig.textAlign,
            }
            return styles;           
        },
        replyMessage:function(){
            const t = this;
            const styles = {
            	"padding":t.replyMessageConfig.padding,
            	"margin":t.replyMessageConfig.margin,
            	"height":t.replyMessageConfig.height,
            	"width":t.replyMessageConfig.width,
            	"border-style":t.replyMessageConfig.borderStyle,
            	"border-color":t.replyMessageConfig.borderColor,
            	"border-width":t.replyMessageConfig.borderWidth,
            	"border-radius":t.replyMessageConfig.borderRadius,
                'font-family':t.replyMessageConfig.fontFamily,
                'font-size':t.replyMessageConfig.fontSize,
                'color':t.replyMessageConfig.fontColor,
                'font-weight':t.replyMessageConfig.bold?'bold':'normal',
                'font-style':t.replyMessageConfig.italic?'italic':'normal',
                'line-height':t.replyMessageConfig.lingHeight,
                'letter-spacing':t.replyMessageConfig.letterSpacing,
                'text-align':t.replyMessageConfig.textAlign,
            }
            return styles;           
        },
        replyUserStyle:function(){
            const t = this;
            const styles = {
            	"padding":t.replyUserStyleConfig.padding,
            	"margin":t.replyUserStyleConfig.margin,
            	"height":t.replyUserStyleConfig.height,
            	"width":t.replyUserStyleConfig.width,
            	"border-style":t.replyUserStyleConfig.borderStyle,
            	"border-color":t.replyUserStyleConfig.borderColor,
            	"border-width":t.replyUserStyleConfig.borderWidth,
            	"border-radius":t.replyUserStyleConfig.borderRadius,
                'font-family':t.replyUserStyleConfig.fontFamily,
                'font-size':t.replyUserStyleConfig.fontSize,
                'color':t.replyUserStyleConfig.fontColor,
                'font-weight':t.replyUserStyleConfig.bold?'bold':'normal',
                'font-style':t.replyUserStyleConfig.italic?'italic':'normal',
                'line-height':t.replyUserStyleConfig.lingHeight,
                'letter-spacing':t.replyUserStyleConfig.letterSpacing,
                'text-align':t.replyUserStyleConfig.textAlign,
            }
            return styles;           
        },
        replyObjectStyle:function(){
            const t = this;
            const styles = {
            	"padding":t.replyObjectStyleConfig.padding,
            	"margin":t.replyObjectStyleConfig.margin,
            	"height":t.replyObjectStyleConfig.height,
            	"width":t.replyObjectStyleConfig.width,
            	"border-style":t.replyObjectStyleConfig.borderStyle,
            	"border-color":t.replyObjectStyleConfig.borderColor,
            	"border-width":t.replyObjectStyleConfig.borderWidth,
            	"border-radius":t.replyObjectStyleConfig.borderRadius,
                'font-family':t.replyObjectStyleConfig.fontFamily,
                'font-size':t.replyObjectStyleConfig.fontSize,
                'color':t.replyObjectStyleConfig.fontColor,
                'font-weight':t.replyObjectStyleConfig.bold?'bold':'normal',
                'font-style':t.replyObjectStyleConfig.italic?'italic':'normal',
                'line-height':t.replyObjectStyleConfig.lingHeight,
                'letter-spacing':t.replyObjectStyleConfig.letterSpacing,
                'text-align':t.replyObjectStyleConfig.textAlign,
            }
            return styles;           
        },
    },

    methods:{
    	//动态数据获取
        getData() {
            const t = this;
            if (t.commentDs) {
                Util.getDSData(t.commentDs, _TY_Tool.buildTplParams(t), function (data) {
                    data.forEach((item) => {
                        const {dataKey, value} = item;
                        t.replys = value;
                        console.log(value);
                    });
                }, function (code, msg) {
                });
            }
        },  
        //一级回复
        replyClick:function(event){
        	var useName = event.currentTarget.user;
        	console.log(useName);

        }, 
        //二级回复
        replyContentClick:function(){

        },  
    }
}
</script>
<style>

	.blogReply{
		width:100%;
		height:auto;
		display:flex;
		justify-content:left;
		margin-top:10px;	
	}
	.replyUserCss{
		display:flex;
		justify-content:left;	
	}
	.replyUserStyle{
		width:50px;
	}
	.replycomment{
		line-height:20px;
	}

</style>

