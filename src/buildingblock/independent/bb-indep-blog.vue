<template>
  <div class="bb-indep-blog">
  	<div class="content"> 
  		<div class="blogLeft"> 
  			<img :src="user.userImg" :style="userImgStyle">
  		</div>
  		<div class="blogRight">
  			<div class="blogUser"> 
  				<p :style="userStyle">{{user.name}}</p>
  				<h5 class="userTimeDate"> 
  					<b :style="userTime">{{user.time}}</b>
  					<i :style="userDate">{{user.date}}</i>
  				</h5>
  			</div> 
  			<div class="blogContent"> 
  				<p :style="contentWrite">{{blog.write}}</p>
  				<p :style="contentImg"><img :src="blog.img"></p>
  				<!--<div :style="contentVoice"></div>
  				<div :style="contentTheme">
  					<span><img :src="blog.themeImg"></span>
  					<span> 
  						<p>{{blog.themeTitle}}</p>
  						<p>{{blog.themeNumber}}</p>
  					</span>
  					<span :class="blog.themeRightIcon"></span>
  				</div>-->
  			</div>
  			<div class="blogCommetHref"> 
  				<b>
  					<i :class="shareIcon"></i>
  					<span :style="shareTextStyle">{{shareText}}</span>
  				</b>
  				<b>
  					<i :class="replyIcon"></i>
  					<span :style="shareTextStyle">{{commetText}}</span>
  				</b>
  				<b>
  					<i :class="commetListIcon"></i>
  					<span :style="shareTextStyle">{{praiseText}}</span> 
  				</b>
  			</div>
  		</div>  	
  	</div>
	<div class="blogCommet"> 
		<div class="blogCommetList"> 
			<i :class="commetListIcon" :style="commetListIconStyle"></i>
			<span class="commetListImgCss">
				<img 
				:src="img.commetListImg" 
				v-for="img in imgs"
				:style="commetListImgStyle" 
				> 
			</span>
		</div>
		<div class="blogReply"> 
			<i :class="replyIcon" :style="replyIconStyle"></i>
			<span class="replyContent"> 
				<div class="replyUserCss"> 
					<span class="replyUserStyle"> 
						<img :src="reply.userImg" :style="replyUserImgStyle">
					</span>
					<span class="replyMessagrStyle"> 
						<p :style="replyMessageUserStyle">{{reply.user}}</p>
						<p :style="replyMessageDate">{{reply.date}}</p>
						<h6 :style="replyMessage">{{reply.message}}</h6>
						<h5 v-for="comment in comments">
							<b :style="replyUserStyle">{{comment.replyUser}}</b>
							<i :style="replyObjectStyle">{{comment.replyObject}}</i>
							<i :style="replyUserStyle">{{comment.replyObjectName}}</i>
							<i :style="replyObjectStyle">{{comment.replyObjectSymbol}}</i>
							<i :style="replyObjectStyle">{{comment.replyContent}}</i>
						</h5>						
					</span>
				</div>
			</span>
		</div>
	</div>
  </div>
</template>
<script>  


export default {
    name:"bb-indep-blog",
    props:{
    	

    	//发表日记用户信息
    	user:{
    		type:Object,
    		default:function(){
    			return {
	    			userImg:"http://static.facetool.cn/U/32ad5dce7b5850e062d08af4837f4717.jpg",
	    			name:"Slience",
	    			time:"20秒前",
	    			date:"已经坚持100天"    			
    			}
    		}
    	},
    	//日记内容数据
    	blog:{
    		type:Object,
    		default:function(){
    			return {
    				write:"日记内容日记内容日记内容日记内容日记内容日记内容日记内容日记内容日记内容日记内容日记内容日记内容日记内容日记内容日记内容日记内容日记内容日记内容日记内容日记内容日记内容",
    				img:"http://static.facetool.cn/U/32ad5dce7b5850e062d08af4837f4717.jpg",

    			}
    		}
    	},
    	//分享文字
    	shareText:{
    		type:String,
    		default:"分享"
    	},
    	//评论文字
    	commetText:{
    		type:String,
    		default:"评论"
    	},
    	//点赞
    	praiseText:{
    		type:String,
    		default:"点赞"
    	},
    	//点赞用户头像展示数组
    	imgs:{
    		type:Array,
    		default:function(){
    			return [{
    				commetListImg:"http://static.facetool.cn/U/32ad5dce7b5850e062d08af4837f4717.jpg",
    			},{
    				commetListImg:"http://static.facetool.cn/U/32ad5dce7b5850e062d08af4837f4717.jpg",
    			}]
    		}
    	},
    	//评论回复静态数组
    	reply:{
    		type:Object,
    		default:function(){
    			return {
    				userImg:"http://static.facetool.cn/U/32ad5dce7b5850e062d08af4837f4717.jpg",
    				user:"aa",
    				date:"一天前",
    				message:"就是这样子"
    			}
    		}
    	},
    	//评论回复者数组
    	comments:{
    		type:Array,
    		default:function(){
    			return [{
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
    		}
    	},
    	//发表日记用户头像样式
    	userImgStyleConfig:{
    		type:Object,
    		default:function(){
    			return {
    				width:"40px",
    				height:"40px",
    				margin:"5px",
    				padding:"0",
    				borderColor:"",
    				borderWidth:"",
    				borderRadius:"50%",
    				borderStyle:"",
    			}
    		}
    	},
    	//发表日记用户名字样式
    	userStyleConfig:{
    		type:Object,
    		default:function(){
    			return {
    				margin:"0",
    				padding:"5px 10px",
    				height:"",
    				width:"100%",
    				borderStyle:"",
    				borderColor:"",
    				borderWidth:"", 				
    				borderRadius:"",
    				fontFamily:'',
                    fontSize:'16px',
                    fontColor:'#3da8f5',
                    bold:false ,
                    italic:false ,
                    lingHeight:"15px",
                    letterSpacing:0,
                    textAlign:'left',
    			}
    		}
    	},
    	//发表日记用户发布时间
    	userTimeConfig:{
    		type:Object,
    		default:function(){
    			return {
    				margin:"0",
    				padding:"5px 5px 5px 10px",
    				height:"",
    				width:"100%",
    				borderStyle:"",
    				borderColor:"",
    				borderWidth:"", 				
    				borderRadius:"",
    				fontFamily:'',
                    fontSize:'14px',
                    fontColor:'#666',
                    bold:false ,
                    italic:false ,
                    lingHeight:"0",
                    letterSpacing:0,
                    textAlign:'left',
    			}
    		}    	
    	},
    	//发表日记坚持天数
    	userDateConfig:{
    		type:Object,
    		default:function(){
    			return {
    				margin:"0",
    				padding:"5px 5px",
    				height:"",
    				width:"100%",
    				borderStyle:"",
    				borderColor:"",
    				borderWidth:"", 				
    				borderRadius:"",
    				fontFamily:'',
                    fontSize:'14px',
                    fontColor:'#666',
                    bold:false ,
                    italic:false ,
                    lingHeight:"0",
                    letterSpacing:0,
                    textAlign:'left',
    			}
    		}    	
    	},
    	//发表日记文字样式
    	contentWriteConfig:{
    		type:Object,
    		default:function(){
    			return {
    				margin:"0",
    				padding:"10px 5px 5px 10px",
    				height:"",
    				width:"100%",
    				borderStyle:"",
    				borderColor:"",
    				borderWidth:"", 				
    				borderRadius:"",
    				fontFamily:'',
                    fontSize:'16px',
                    fontColor:'#333',
                    bold:false ,
                    italic:false ,
                    lingHeight:"30px",
                    letterSpacing:0,
                    textAlign:'left',
    			}
    		}    	
    	},
    	//发表日记中图片样式
    	contentImgConfig:{
    		type:Object,
    		default:function(){
    			return {
    				margin:"0",
    				padding:"10px 5px 5px 10px",
    				height:"",
    				width:"100%",
    			}
    		}        	
    	},
    	//分享文字样式
    	shareTextStyleConfig:{
    		type:Object,
    		default:function(){
    			return {
    				margin:"0",
    				padding:"10px 20px 5px 0px",
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
                    lingHeight:"30px",
                    letterSpacing:0,
                    textAlign:'left',
    			}
    		}    	    	
    	},
    	//点赞用户头像样式设置
    	commetListImgStyleConfig:{
    		type:Object,
    		default:function(){
    			return {
    				margin:"10px 10px 0 0",
    				padding:"0",
    				height:"30px",
    				width:"30px",
    				borderStyle:"",
    				borderColor:"",
    				borderWidth:"", 				
    				borderRadius:"",
    			}
    		}    	    	    	
    	},
    	//点赞列表左侧icon样式
    	commetListIconStyleConfig:{
    		type:Object,
    		default:function(){
    			return {
    				margin:"-40px 5px 0 5px",
    				padding:"0",
    				height:"15px",
    				width:"15px",
    				display:"inline-block"
    			}
    		}    	  
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
        	commetListIcon:"ty-ico-love-off",
        	replyIcon:"ty-icon_xiaoxi1",
        	shareIcon:"ty-wj_skip_long_questio",
        }
      },
      watch:{

      }, 
    computed:{
    	//处理输入框字体样式配置
        userImgStyle:function(){
            const t = this;
            const styles = {
            	"border-radius":t.userImgStyleConfig.borderRadius,
            	"padding":t.userImgStyleConfig.padding,
            	"margin":t.userImgStyleConfig.margin,
            	"height":t.userImgStyleConfig.height,
            	"width":t.userImgStyleConfig.width,
            	"border-style":t.userImgStyleConfig.borderStyle,
            	"border-color":t.userImgStyleConfig.borderColor,
            	"border-width":t.userImgStyleConfig.borderWidth,
            }
            return styles;
        },
        //发表日记用户名字样式
        userStyle:function(){
            const t = this;
            const styles = {
            	"padding":t.userStyleConfig.padding,
            	"margin":t.userStyleConfig.margin,
            	"height":t.userStyleConfig.height,
            	"width":t.userStyleConfig.width,
            	"border-style":t.userStyleConfig.borderStyle,
            	"border-color":t.userStyleConfig.borderColor,
            	"border-width":t.userStyleConfig.borderWidth,
            	"border-radius":t.userStyleConfig.borderRadius,
                'font-family':t.userStyleConfig.fontFamily,
                'font-size':t.userStyleConfig.fontSize,
                'color':t.userStyleConfig.fontColor,
                'font-weight':t.userStyleConfig.bold?'bold':'normal',
                'font-style':t.userStyleConfig.italic?'italic':'normal',
                'line-height':t.userStyleConfig.lingHeight,
                'letter-spacing':t.userStyleConfig.letterSpacing,
                'text-align':t.userStyleConfig.textAlign,
            }
            return styles;        
        },
        userTime:function(){
            const t = this;
            const styles = {
            	"padding":t.userTimeConfig.padding,
            	"margin":t.userTimeConfig.margin,
            	"height":t.userTimeConfig.height,
            	"width":t.userTimeConfig.width,
            	"border-style":t.userTimeConfig.borderStyle,
            	"border-color":t.userTimeConfig.borderColor,
            	"border-width":t.userTimeConfig.borderWidth,
            	"border-radius":t.userTimeConfig.borderRadius,
                'font-family':t.userTimeConfig.fontFamily,
                'font-size':t.userTimeConfig.fontSize,
                'color':t.userTimeConfig.fontColor,
                'font-weight':t.userTimeConfig.bold?'bold':'normal',
                'font-style':t.userTimeConfig.italic?'italic':'normal',
                'line-height':t.userTimeConfig.lingHeight,
                'letter-spacing':t.userTimeConfig.letterSpacing,
                'text-align':t.userTimeConfig.textAlign,
            }
            return styles;        
        },
        userDate:function(){
            const t = this;
            const styles = {
            	"padding":t.userDateConfig.padding,
            	"margin":t.userDateConfig.margin,
            	"height":t.userDateConfig.height,
            	"width":t.userDateConfig.width,
            	"border-style":t.userDateConfig.borderStyle,
            	"border-color":t.userDateConfig.borderColor,
            	"border-width":t.userDateConfig.borderWidth,
            	"border-radius":t.userDateConfig.borderRadius,
                'font-family':t.userDateConfig.fontFamily,
                'font-size':t.userDateConfig.fontSize,
                'color':t.userDateConfig.fontColor,
                'font-weight':t.userDateConfig.bold?'bold':'normal',
                'font-style':t.userDateConfig.italic?'italic':'normal',
                'line-height':t.userDateConfig.lingHeight,
                'letter-spacing':t.userDateConfig.letterSpacing,
                'text-align':t.userDateConfig.textAlign,
            }
            return styles;        
        }, 
        contentWrite:function(){
            const t = this;
            const styles = {
            	"padding":t.contentWriteConfig.padding,
            	"margin":t.contentWriteConfig.margin,
            	"height":t.contentWriteConfig.height,
            	"width":t.contentWriteConfig.width,
            	"border-style":t.contentWriteConfig.borderStyle,
            	"border-color":t.contentWriteConfig.borderColor,
            	"border-width":t.contentWriteConfig.borderWidth,
            	"border-radius":t.contentWriteConfig.borderRadius,
                'font-family':t.contentWriteConfig.fontFamily,
                'font-size':t.contentWriteConfig.fontSize,
                'color':t.contentWriteConfig.fontColor,
                'font-weight':t.contentWriteConfig.bold?'bold':'normal',
                'font-style':t.contentWriteConfig.italic?'italic':'normal',
                'line-height':t.contentWriteConfig.lingHeight,
                'letter-spacing':t.contentWriteConfig.letterSpacing,
                'text-align':t.contentWriteConfig.textAlign,
            }
            return styles;        
        },     
        contentImg:function(){
            const t = this;
            const styles = {
            	"padding":t.contentImgConfig.padding,
            	"margin":t.contentImgConfig.margin,
            	"height":t.contentImgConfig.height,
            	"width":t.contentImgConfig.width,
            }
            return styles;            
        },
        shareTextStyle:function(){
            const t = this;
            const styles = {
            	"padding":t.shareTextStyleConfig.padding,
            	"margin":t.shareTextStyleConfig.margin,
            	"height":t.shareTextStyleConfig.height,
            	"width":t.shareTextStyleConfig.width,
            	"border-style":t.shareTextStyleConfig.borderStyle,
            	"border-color":t.shareTextStyleConfig.borderColor,
            	"border-width":t.shareTextStyleConfig.borderWidth,
            	"border-radius":t.shareTextStyleConfig.borderRadius,
                'font-family':t.shareTextStyleConfig.fontFamily,
                'font-size':t.shareTextStyleConfig.fontSize,
                'color':t.shareTextStyleConfig.fontColor,
                'font-weight':t.shareTextStyleConfig.bold?'bold':'normal',
                'font-style':t.shareTextStyleConfig.italic?'italic':'normal',
                'line-height':t.shareTextStyleConfig.lingHeight,
                'letter-spacing':t.shareTextStyleConfig.letterSpacing,
                'text-align':t.shareTextStyleConfig.textAlign,
            }
            return styles;           
        },
        commetListImgStyle:function(){
            const t = this;
            const styles = {
            	"padding":t.commetListImgStyleConfig.padding,
            	"margin":t.commetListImgStyleConfig.margin,
            	"height":t.commetListImgStyleConfig.height,
            	"width":t.commetListImgStyleConfig.width,
            	"border-style":t.commetListImgStyleConfig.borderStyle,
            	"border-color":t.commetListImgStyleConfig.borderColor,
            	"border-width":t.commetListImgStyleConfig.borderWidth,
            	"border-radius":t.commetListImgStyleConfig.borderRadius,
            }
            return styles;  
        },
        commetListIconStyle:function(){
            const t = this;
            const styles = {
            	"padding":t.commetListIconStyleConfig.padding,
            	"margin":t.commetListIconStyleConfig.margin,
            	"height":t.commetListIconStyleConfig.height,
            	"width":t.commetListIconStyleConfig.width,
            	"display":t.commetListIconStyleConfig.display
            }
            return styles;          
        },
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

     }
}
</script>
<style>
	.content{

		
		width:95%;
		height:100%;
		display:flex;
		justify-content:center;
		margin:50px 2.5% 0 2.5%;
	}
	
	.blogRight{
		width:90%;
	}
	.blogUser{
		width:100%; 
		height:auto;
	}
	.userTime{
		width:100px;
		height:auto;
	}
	.blogCommetHref{
		width:100%;
		height:auto;
		display:flex;
		justify-content:left;
	}
	.blogCommet{
		width:95%;
		height:auto;
		margin:10px 2.5%;
		background:#eee;
		position:relative;
		padding:0 0 5px 0;
	}
	.blogCommet:after{
		content:"";
		width:0px;
		height:0px;
		border-width:0 10px 10px;
    	border-style:solid;
    	border-color:transparent transparent #eee;
  		position:absolute;
  		top:-10px;
  		left:10px;

	}
	.commetListImgCss{
		display:inline-block;
	}
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
</style>

