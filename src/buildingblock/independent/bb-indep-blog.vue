<template>
  <div class="bb-indep-blog">
  	<div class="content"> 
  		<div class="blogLeft"> 
  			<img :src="user.useImg" :style="userImgStyle">
  		</div>
  		<div class="blogRight">
  			<div class="blogUser"> 
  				<p :style="userStyle">{{user.useName}}</p>
  				<h5 class="userTimeDate"> 
  					<b :style="userTime">{{user.blogDate}}</b>
  					<i :style="userDate">已坚持{{user.continuousDate}}天</i>
  				</h5>
  			</div> 
  			<div class="blogContent"> 
  				<p :style="contentWrite">{{user.text}}</p>
  				<bb-layout-seriation :content="user.content"></bb-layout-seriation>
  				<div class="blogJoinPractice" @click="joinPractiveDetails(user)"> 
					<span class="blogJoinPracticeLeft"><img :src="user.practiceImg"></span>
					<span class="blogJoinPracticeCenter"> 
						<p class="practiceTitleStyle">{{user.practiceTitle}}</p>
						<p class="practiceNumberStyle">{{user.practiceNumber}}人参加</p>
					</span>
					<span class="blogJoinPracticeRight">
						<i :class="blogJoinXlxIcon"></i> 
					</span>
  			</div>
  			</div>
  		</div>  	
  	</div>

  </div>
</template>
<script>  


export default {
    name:"bb-indep-blog",
    props:{
    	

    	//发表日记用户信息静态数据
    	/*{
			user_portrait:"http://static.facetool.cn/U/32ad5dce7b5850e062d08af4837f4717.jpg",
			nickname:"Slience",
			time:"20秒前",
			date:"已经坚持100天" ,
			content:"日记内容日记内容日记内容日记内容日记内容日记内容日记内容日记内容日记内容日记内容日记内容日记内容日记内容日记内容日记内容日记内容日记内容日记内容日记内容日记内容日记内容",
			clock_img:"http://static.facetool.cn/U/32ad5dce7b5850e062d08af4837f4717.jpg",   			
    			}*/
    	userObject:{
    		type:Object,
    		default:function(){
    			return {
    				
    			}
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
    	//动态数据
    	blogDs:{
    		type:Object,
    	}
    },
    data(){ 
        return{    	
        	user:this.userObject,
        	blogJoinXlxIcon:"ty-icon_jiantou_right_l", 
        }
    },
    watch:{},
    mounted(){ 
	   this.getData();
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

    },
    methods:{
    	//动态数据获取    	
        getData() {
            const t = this;
            if (t.blogDs) {
                _TY_Tool.getDSData(t.blogDs, _TY_Tool.buildTplParams(t), function (data) {
                    data.forEach((item) => {
                        const {dataKey, value} = item;
                        t.user = value.currentRecords[0];
                        t.user.content = _TY_Tool.transferContent(value.currentRecords[0].content);
                    });
                }, function (code, msg) {
                });
            }
        },  
        //内容列表中点击进入练习详情
        joinPractiveDetails:function(user){
        	var id = user.practiveId;
        	this.$emit("joinPractiveDetails",id);
        },

    }
}
</script>
<style scoped>
	.content{
		width:95%;
		height:100%;
		display:flex;
		justify-content:center;
		margin:10px 2.5% 0 2.5%;
		font-size:14px;
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
	.blogJoinPractice{
		width:100%;
		height:auto;
		background:#faf9fa;
		display:flex;
		padding:5px 0 5px 5px;
	}
	.blogJoinPracticeLeft{
		width:45px;
		height:45px;
		overflow:hidden;
	}
	.blogJoinPracticeLeft img{
		max-width:200%;
		margin-left:-50%;		
	}
	.blogJoinPracticeCenter{
		width:70%;
		font-size:14px;
		padding:5px 0 0 10px;
	}
	.blogJoinPracticeRight{
		width:10%;
		padding-top:10px;
		font-size:18px;
		color:#888;
	}
	.practiceNumberStyle{
		color:#888;
		font-size:12px;

	}
	.practiceTitleStyle{
		width:100%;
		overflow:hidden;
	}
</style>

