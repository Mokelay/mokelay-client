 <template>
  <div class="bb-indep-blog">
  	<div class="content" v-for="(user,key) in blogs" :key="key">
  		<div class="blogLeft"> 
  			<img :src="user.useImg" :style="userImgStyle">
  		</div>
  		<div class="blogRight">
  			<div class="blogUser"> 
  				<p :style="userStyle">{{user.useName}}</p>
  				<h5 class="userTimeDate"> 
  					<b :style="userTime">{{user.blogDate}}</b>
  					<i :style="userDate">已坚持{{user.continuousDate}}天</i>
  					<b class="blogDelete" v-show="user.blogDelete"  @click="blogListDelete(user)">删除</b>
  				</h5>
  			</div> 
  			<div class="blogContent"> 
                <p :style="contentWrite" @click="joinBlogDetails(user)">{{user.text}}</p>
                <bb-layout-seriation :content="user.content"></bb-layout-seriation>
            </div>

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
  			<bb-indep-blog-action 
                :blogData="user"
  				@replyClick="replyClick(user)"
  				@praiseClick="praiseClick"
  				:greatNumberShow="user.greatNumber"
  				:praiseColor="user.greatStateNumber"
                :shareConfig="user.shareConfig"
  				> 
  			</bb-indep-blog-action>
  		</div>  	
		<div class="display">
			{{user.log_id}}
			{{user.practiveId}}
			{{user.greatState}}
		</div>
  	</div>
  	<div class="bb_loading" v-show="loading"> 
  		<span></span>
  		<span></span>
  		<span></span>
  		<span></span>
  		<span></span>
  	</div>
  </div>
</template>
<script>  


export default {
    name:"bb-indep-blog",
    props:{
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
    				padding:"5px 0px",
    				height:"",
    				width:"100%",
    				borderStyle:"",
    				borderColor:"",
    				borderWidth:"", 				
    				borderRadius:"",
    				fontFamily:'',
                    fontSize:'16px',
                    fontColor:'#266fb7',
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
    				padding:"5px 5px 5px 0px",
    				height:"",
    				width:"100%",
    				borderStyle:"",
    				borderColor:"",
    				borderWidth:"", 				
    				borderRadius:"",
    				fontFamily:'',
                    fontSize:'14px',
                    fontColor:'#888',
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
                    fontColor:'#888',
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
    				padding:"10px 5px 5px 0px",
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
                    wordBreak:"break-all",
    			}
    		}    	
    	},
    	//发表日记中图片样式
    	contentImgConfig:{
    		type:Object,
    		default:function(){
    			return {
    				margin:"0",
    				padding:"10px 5px 5px 0px",
    				height:"",
    				width:"100%",
    			}
    		}        	
    	},
    	//动态数据
    	blogDs:{
    		type:Object,
    	},
    	//加载更多数据
    	blogMore:{
    		type:Object,
    	},
    	//静态数据
    	 /*[{
	    			user_portrait:"",
	    			nickname:"Slience",
	    			time:"20秒前",
	    			date:"已经坚持100天", 
	    			content:"",
    				clock_img:"",    
    			},{
	    			user_portrait:"",
	    			nickname:"Slience",
	    			time:"20秒前",
	    			date:"已经坚持100天", 
	    			content:"",
    				clock_img:"",        			
    			}]*/
    	blogArray:{
    		type:Array,
    	},
    	seeMore:{
    		type:String,
    		default:"查看更多",
    	},
    },
    data(){ 
        return{    	
        	blogs:this.blogArray,
        	practice:this.practiceData,
        	blogJoinXlxIcon:"ty-icon_jiantou_right_l",
        	seeWrite:this.seeMore,
        	end:false,//是否加载结束
        	loading:false//是否加载中 
        }
    },
    watch:{},
    mounted(){ 
	   this.getData();
	   this.scrollListener();
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
                'word-break':t.contentWriteConfig.wordBreak,
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
                        const newArry = [];
                        value.currentRecords.forEach((blog,key)=>{
                        blog.content = _TY_Tool.transferContent(blog.content);
                            newArry.push(blog);
                        });
                      	//console.log("newArry:",newArry);
                        t.blogs = newArry;
                        t.page = value.currentPage; //当前页码
                        t.pageSize = value.pageSize; //当前页总条数
                        t.totalPages = value.totalPages; //总条数
                    });
                }, function (code, msg) {
                });
            }
        },
        //加载更多数据
        blogMoreClick(){
            const t = this;
            //t.page = t.page + 1;
            if (t.blogMore) {
                _TY_Tool.getDSData(t.blogMore, _TY_Tool.buildTplParams(t), function (data) {
                    data.forEach((item) => {
                        const {dataKey, value} = item;
                        const newArry = [];
                        value.currentRecords.forEach((blog,key)=>{
                        blog.content = _TY_Tool.transferContent(blog.content);
                            newArry.push(blog);
                        });
                        t.blogs = t.blogs.concat(newArry);
                        if(t.page >= t.totalPages){
                           t.end = true;
                        }else{
                           t.end = false;
                        }
                        t.loading = false;
                    });
                }, function (code, msg) {
                });
            };
            if(t.page == t.totalPages){
	        	this.seeWrite = "没有更多内容了";
	        }	      
        },
        //点击内容事件
        joinBlogDetails:function(user){
        	var blogId = user.log_id;
        	var practiveId =user.practiveId;
        	this.$emit("joinBlogDetails",blogId,practiveId);
        },
        //点击回复事件
        replyClick:function(user){
        	var blogId = user.log_id;
        	var practiveId =user.practiveId;
        	this.$emit("joinBlogDetails",blogId,practiveId);
        },
        //点赞事件
        praiseClick:function(t){  
            const user = t.blogData;
            const greatState = t.realGreatState	
        	var clock_in_id = user.log_id;
        	var theme_id =user.practiveId;
        	var param = {  
				theme_id:greatState?theme_id:"", //主题id
				clock_in_id:clock_in_id , //打卡id
			};
			this.uploadUrl = `${_TY_ENV.apiHost}/config/xlx_c_like`;
			_TY_Tool.post(this.uploadUrl,param).then(response=>{
               this.getData();
            }); 
        },
        //内容列表中点击进入练习详情
        joinPractiveDetails:function(user){
        	var id = user.practiveId;
        	this.$emit("joinPractiveDetails",id);
        },
        //日记删除
        blogListDelete(user){
        	var practiveId = user.practiveId; //练习id
        	var log_id = user.log_id; //日记id
        	this.$emit("blogListDelete",log_id,practiveId);
        },
        //监听滚动条事件
        scrollListener:function(){
            let t=this;
            //屏幕高度
            const screenHeight = window.screen.height;
            window.addEventListener('scroll',function(){
            	const totalHeight = document.activeElement.scrollHeight || document.body.scrollHeight;
                const scrollHeight = document.documentElement.scrollTop || document.body.scrollTop;
                if(screenHeight + scrollHeight + 10 >= totalHeight){
                	if(!t.end && !t.loading){
                        t.loading =true;
                        t.page = t.page+1;
                        t.blogMoreClick();
                    }
                }
            });
        },

        
    }
}
</script>
<style scoped>
	.content{		
		width:100%;
		height:100%;
		display:flex;
		justify-content:center;
		margin:0 0 0 0;
		padding:10px 2.5%;
		background:#fff;
		border-top:1px solid #eee;
		font-size:14px;
		overflow-x:hidden;
	}
	.display{
		display:none;
	}
	.userTimeDate{
		margin-top:5px;
		font-size:12px;
		color:#888;
	}
	.blogRight{
		width:90%;
		margin-left:10px;
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
		background:#efefef;
		display:flex;
		padding:5px 0 5px 5px;
		margin-bottom:10px;
		justify-content:left;
		align-items:center;
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
		padding:0px 0 0 10px;
	}
	.blogJoinPracticeRight{
		width:10%;
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
	.blogDelete{
		font-size:0.3rem;
		color:#266fb7;
	}

	    @keyframes load{
        0%{
            opacity: 1;
            -webkit-transform: scale(1.2);
        }
        100%{
            opacity: .2;
            -webkit-transform: scale(.2);
        }
    }
    @-webkit-keyframes load{
        0%{
            opacity: 1;
            -webkit-transform: scale(1.2);
        }
        100%{
            opacity: .2;
            -webkit-transform: scale(.2);
        }
    }
    .bb_loading{
        width: 150px;
        height: 5px;
        margin: 0 auto;
        text-align: center;
        box-sizing: content-box;
        padding-bottom: 1rem;
    }
    .bb_loading span{
        display: inline-block;
        width: 15px;
        height: 100%;
        margin-right: 5px;
        background: lightgreen;
        background:#33BEFE;
        -webkit-animation: load 1.04s ease infinite;
        animation: load 1.04s ease infinite;
    }
    .bb_loading span:last-child{
        margin-right: 0px; 
    }
    
    .bb_loading span:nth-child(1){
        -webkit-animation-delay:0.13s;
        animation-delay:0.13s;
    }
    .bb_loading span:nth-child(2){
        -webkit-animation-delay:0.26s;
        animation-delay:0.26s;
    }
    .bb_loading span:nth-child(3){
        -webkit-animation-delay:0.39s;
        animation-delay:0.39s;
    }
    .bb_loading span:nth-child(4){
        -webkit-animation-delay:0.52s;
        animation-delay:0.52s;
    }
    .bb_loading span:nth-child(5){
        -webkit-animation-delay:0.65s;
        animation-delay:0.65s;
    }
</style>

