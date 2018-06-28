<template>
  <div class="bb-indep-blog">
		<div class="blogCommetHref"> 
			<b @click="shareClick">
				<i :class="shareIcon" class="actionIcon"></i>
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
				<span :style="shareTextStyle">{{praiseText}}</span> 
			</b>
		</div>
  	</div>  	

</template>
<script>  


export default {
    name:"bb-indep-blog",
    props:{
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
    	}
    },
   	data(){ 
        return{    	
        	commetListIcon:"ty-ico-love-off",
        	replyIcon:"ty-icon_xiaoxi1",
        	shareIcon:"ty-wj_skip_long_questio",
        	isColor:this.praiseColor,
        	praiseText:this.praiseTextShow,
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
   	mounted(){ 
	   this.getData();
	},   
    mounted:function(){
      let t=this;
      _TY_Tool.buildDefaultValTpl(t,"praiseColor");
    },
    methods:{
    	//分享点击事件
    	shareClick:function(val){
    		this.$emit("shareClick",val);
    	},
    	//评论点击事件
    	replyClick:function(val){
    		this.$emit("replyClick",val);
    	},
    	//点赞事件
    	praiseClick:function(val){
    		this.isColor = this.isColor?false:true;
    		this.$emit("praiseClick",val);
    	},
    	//动态数据获取
        getData() {
            const t = this;
            if (t.praiseDs) {
                _TY_Tool.getDSData(t.praiseDs, _TY_Tool.buildTplParams(t), function (data) {
                    data.forEach((item) => {
                        const {dataKey, value} = item;
                        t.blogs = value;
                        //console.log(value);
                    });
                }, function (code, msg) {
                });
            }
        },  
     }
}
</script>
<style>

	.blogCommetHref b{
		cursor:pointer;
	}
	.color{
		color:#f00;
	}
	.actionIcon{
		font-size:18px;
	}
</style>
