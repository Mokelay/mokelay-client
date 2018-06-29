<template>
  <div class="bb-indep-blog">
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

  </div>
</template>
<script>  


export default {
    name:"bb-indep-blog",
    props:{  	
    	//点赞用户头像展示数组
    	//静态数组
    	 	/*[{
    			commetListImg:"http://static.facetool.cn/U/32ad5dce7b5850e062d08af4837f4717.jpg",
    		},{
    			commetListImg:"http://static.facetool.cn/U/32ad5dce7b5850e062d08af4837f4717.jpg",
    		}]*/
    	imgs:{
    		type:Array,
    	},
  		//动态数组
  		praiseDs:{
        	type:Object
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
    				margin:"8px 5px 0 5px",
    				padding:"0",
    				height:"15px",
    				width:"15px",
    				display:"inline-block",
    				fontSize:"18px",
    			}
    		}    	  
    	},
   
    },
    data(){ 
        return{    	
        	commetListIcon:"ty-ico-love-off",
        }
    },
    watch:{}, 
    mounted(){ 
      	this.getData();
    },
    computed:{
    
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
            	"display":t.commetListIconStyleConfig.display,
            	"font-size":t.commetListIconStyleConfig.fontSize,
            }
            return styles;          
        },       
    },
    methods:{
    	//动态数据
        getData() {
            const t = this;
            if (t.praiseDs) {
                Util.getDSData(t.praiseDs, _TY_Tool.buildTplParams(t), function (data) {
                    data.forEach((item) => {
                        const {dataKey, value} = item;
                        t.imgs = value;
                    });
                }, function (code, msg) {
                });
            }
        },
        //外部获取头像数据
        setCommentImg:function(...params){
            params.forEach((param,key)=>{
                if(param.type == "custom"){
                    this.imgs = param.arguments
                }
            })        		
        },
     }
}
</script>
<style scoped>
	.bb-indep-blog{
		font-size:14px;
	}
	.commetListImgCss{
		display:inline-block;
	}
	.blogCommetList{
		display:flex;
		justify-content:left;
	}
	
</style>

