<template>
  <div class="bb-indep-blog">
		<div class="blogCommetHref"> 
			<b>
				<!-- <i :class="shareIcon" class="actionIcon"></i> -->
                <bb-indep-share 
                    :title="shareConfig.title"
                    :desc="shareConfig.desc"
                    :link="shareConfig.link"
                    :imgUrl="shareConfig.imgUrl"
                    :dataUrl="shareConfig.dataUrl"
                    :option="shareConfig.option"
                    ></bb-indep-share>
				<span :style="shareTextStyle">{{shareText}}</span>
			</b>
			<b @click="replyClick">
				<i :class="replyIcon" class="actionIcon"></i>
				<span :style="shareTextStyle">{{commetText}}</span>
			</b>
			<b @click="praiseClick">
				<strong :class="{'color':isColor}"> 
					<i :class="commetListIcon" class="actionIcon"></i> 
				</strong>
				<span :style="shareTextStyle">{{greatNumber}}</span> 
			</b>
		</div>
		<!--分享点击出现弹框-->
		<div class="blogActionPop" v-show="blog.blogActionPopShow"> 
	  		<div class="blogActionPopBg" @click="blogActionPopHide"></div>
	  		<div class="blogActionPopContent"> 
	  			<div class="blogActionPopContentIcon"> 
	  				<span> 
	  					<i :class="blog.wxFriend" class="actionIcon"></i>
	  					<p>{{blog.actionPopFriend}}</p>
	  				</span>
	  				<span> 
	  					<i :class="blog.wxFriendCircle" class="actionIcon"></i>
	  					<p>{{blog.actionPopFriendCircle}}</p>
	  				</span>
	  			</div>
	  			<p class="blogActionPopCancel" @click="blogActionPopHide">取消</p>
	  		</div>
  		</div>

  	</div>  	

</template>
<script>  


export default {
    name:"bb-indep-blog-action",
    props:{
    	
    	blogData:{
    		type:Object,
    		default:function(){
    			return {
    				wxFriend:"ty-icon_daiban",
			        wxFriendCircle:"ty-icon_chenggong_lv",    
    				actionPopFriend:"微信好友",
    				actionPopFriendCircle:"朋友圈",
    				blogActionPopShow:false,
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
    	praiseTextShow:{
    		type:[String,Number],
    		default:"点赞"
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
    	//初始化拿到该篇文章是否点赞
   		praiseColor:{
   			type:Boolean,
   			default:false,
   		},
   		defaultValTpl:{
            type:String
        },
    	//动态数据
    	praiseDs:{
    		type:Object,
    	},
    	greatNumberShow:{
    		type:Number,
    	},
        shareConfig:{
            type:Object,
            default:function(){
                return {
                    title:"分享标题",
                    desc: "分享描述",
                    // 分享链接
                    link: "",
                    // 分享图标
                    imgUrl: "",
                    // 分享类型,music、video或link，不填默认为link
                    type: "",
                    // 如果type是music或video，则要提供数据链接，默认为空
                    dataUrl: "",
                    /*其他属性设置 
                        {
                            icon：""  触发分享的图标
                            shareArea:"timeline,appMessage,QQ,weibo,qZone"  允许分享范围  默认全部允许
                        }
                    */
                    option:{
                        icon:"ty-riji-fenxiang",
                        shareArea:"timeline,appMessage,QQ,weibo,qZone"
                    }
                }
            }
        }
    },
   	data(){ 
        return{    	
        	commetListIcon:"ty-ico-love-off",
        	replyIcon:"ty-icon_xiaoxi1",
        	shareIcon:"ty-wj_skip_long_questio",
        	isColor:this.praiseColor,
        	praiseText:this.praiseTextShow,
        	blog:this.blogData,
        	greatNumber:this.greatNumberShow,
    		}
      },
    watch:{}, 
    computed:{
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
    },  
    mounted:function(){
      let t=this;
      _TY_Tool.buildDefaultValTpl(t,"praiseColor");
      t.getData();
    },
    methods:{
    	//分享点击事件
    	// shareClick:function(val){
    	// 	this.blog.blogActionPopShow = true;
    	// 	this.$emit("shareClick",val);
    	// },
    	//评论点击事件
    	replyClick:function(val){
    		this.$emit("replyClick",val);
    	},
    	//点赞事件
    	praiseClick:function(val){
    	
    		this.$emit("praiseClick",val);
    	},
    	//点赞动态数据获取
        getData() {
            const t = this;
            if (t.praiseDs) {
                _TY_Tool.getDSData(t.praiseDs, _TY_Tool.buildTplParams(t), function (data) {
                    data.forEach((item) => {
                        const {dataKey, value} = item;
                        t.blogs = value.currentRecords[0].greatState;
                        t.greatNumber = value.currentRecords[0].greatNumber;
                        if(t.blogs == 0){
                        	t.blogs = false;
                        }else{
                        	t.blogs = true;
                        }
  						t.isColor = t.blogs;
                    });
                }, function (code, msg) {
                });
            }
        }, 
        //分享弹框取消事件
        blogActionPopHide:function(){
        	this.blog.blogActionPopShow = false;
        },

     }
}
</script>
<style scoped>
	.bb-indep-blog{
		font-size:14px;
	}
	.blogCommetHref b{
		cursor:pointer;
	}
	.color{
		color:#f00;
	}
	.actionIcon{
		font-size:18px;
	}
	.blogActionPop{
		width:100%;
		height:100%;
		position:fixed;
		top:0;
		left:0;
		z-index:3;
	}
	.blogActionPopBg{
		width:100%; 
		height:100%;
		background:rgba(0,0,0,.3);
		position:absolute;
		top:0;
		left:0;
	}
	.blogActionPopContent{
		width:100%;
		height:auto;
		background:rgba(255,255,255,.86);
		position:absolute;
		bottom:0;
		left:0;
	}
	.blogActionPopCancel{
		width:100%;
		line-height:40px;
		border-top:1px solid #ddd;
		text-align:center;
	}

	.blogActionPopContentIcon{
		width:100%;
		padding:10px 5%;
	}
	.blogActionPopContentIcon span{
		width:25%;
		display:inline-block;
		text-align:center;
		line-height:25px;
	}
</style>
