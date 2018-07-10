<template>
	<ul> 
		<li class="itemList">
			<bb-vant-cell-swipe :content="rightContent" @onClose="onClose(itemData)"> 
			    <div class="itemContent">
			    	<span class="leftStyle"> 
			    		<img :src="items.leftImgShow">
			    	</span>
			    	<span class="centerStyle">				
			    		<h1 :style="centerTitle">{{items.title}}</h1>
			    		<p class="centerContent" v-show="centerIcon">
			    			<b class="centerContentTime">	
			    				<i :class="contentTimeIcon" :style="contentTimeIconStyle"></i>
			    				<strong :style="contentTimeStyle">{{items.time}}</strong>
			    			</b>
			    			<b class="centerContentTime">	
			    				<i :class="userNumberIcon"  :style="userNumberIconStyle"></i>
			    				<strong :style="userNumberStyle"></strong>
			    			</b>	
			    		</p>
			    	</span>
			    	<bb-layout-seriation :content="content"></bb-layout-seriation>
			    	<p>{{items.theme_id}}111</p>	    	
			    </div>	    	
			</bb-vant-cell-swipe>
		</li>
	</ul>

</template>

<script>


    export default {
        name: 'bb-text',
        
        props: {
            //左侧样式
            leftStyleConfig:{
                type:Object,
                default:function(){
                    return {
                        width:"20%",
                        display:"inline-block",
                    }
                }            
            },
            //中间内容样式
            centerTitleConfig:{
                type:Object,
                default:function(){
                    return {
                        width:"100%",
                        display:"inline-block",
                        fontSize:"14px",
                        fontFamily:"",
                        color:"#000",
                        fontWeight:"normal",
                        letterSpacing:"",
                        lineHeight:"18px",
                        wordBreak:"break-word",
                        margin:"0",
                        padding:"0 0 10px 0",
                        //超出显示省略号
                        //overflow:"hidden",
                        //textOverflow:"elipsis",
                    }
                }
            },
            //右侧文字样式
            rightTextConfig:{
                type:Object,
                default:function(){
                    return {
                        display:"inline-block",
                        borderStyle:"solid",
                        borderColor:"#6298D8",
                        borderWidth:"1px",
                        borderRadius:"2px",
                        color:"#6298D8",
                        fontSize:"14px",
                        fontFamily:"",
                        backgroundColor:"",
                        letterSpacing:"",
                        lineHeight:"25px",
                        width:"100%",
                        textAlign:"center",
                        fontWeight:"normal",
                    }
                }            
            },
            //中间时间文字样式
            contentTimeStyleConfig:{
                type:Object,
                default:function(){
                    return {
                    	width:"70%",
                        display:"inline-block",
                        fontSize:"12px",
                        fontFamily:"",
                        color:"#666",
                        fontWeight:"normal",
                        letterSpacing:"",
                        lineHeight:"20px",
                        //默认换行
                        //wordBreak:"break-word",
                        //超出显示省略号
                        overflow:"hidden",
                        textOverflow:"elipsis",
                    }
                }
            },
            //中间用户使用文字样式
            userNumberStyleConfig:{
                type:Object,
                default:function(){
                    return {
                    	width:"70%",
                        display:"inline-block",
                        fontSize:"12px",
                        fontFamily:"",
                        color:"#666",
                        fontWeight:"normal",
                        letterSpacing:"",
                        height:"18px",
                        //默认换行
                        //wordBreak:"break-word",
                        //超出显示省略号
                        overflow:"hidden",
                        textOverflow:"elipsis",
                    }
                }
            },
            //时间icon样式
            contentTimeIconStyleConfig:{
                type:Object,
                default:function(){
                    return {
                        width:"13px",
                        margin:"2px 5px 0 0",
                        padding:"0",
                        fontSize:"14px",
                    }
                }            
            },
            //用户人群icon样式
            userNumberIconStyleConfig:{
                type:Object,
                default:function(){
                    return {
                        width:"13px",
                        margin:"3px 5px",
                        padding:"0",
                        fontSize:"14px",
                    }
                }               
            },
            //内容
            itemData:{
            	type:Object,
            	default:function(){
            		return {
            			title:"这个是一个标题标题标题标题1111",
            			time:"07:00:00",
            			userNumber:"292人打卡",
            			leftImgShow:"http://static.facetool.cn/U/32ad5dce7b5850e062d08af4837f4717.jpg",
            		}
            	}
            },
            content:{
	          type:Array,
	          default:function(){
	            return [{                      //页面内容
	                uuid:'1',
	                alias:'bb-words',                   //积木别名
	                aliasName:'a',               //中文名称
	                group:'',                   //积木分组 表单项显示的位置
	                attributes:{
	                  value:"11"
	                },              //积木属性
	                animation:[],
	                interactives:[],
	                layout:{}
	            }]
	          }
        	},
        	 //初始化动态数据
            itemDs:{
				type:Object
            },
            //中间第二行数据是否显示
            centerIcon:{
            	type:Boolean,
            	default:true,
            },
            
        },
        data() {
            return {
               items:this.itemData,
               contentTimeIcon:"ty-icon_riqi",
               userNumberIcon:"ty-icon_tongyi",
               rightContent:[{                      //页面内容
                        uuid:'1',
                        alias:'bb-vant-button',                   //积木别名
                        aliasName:'删除',               //中文名称
                        group:'right',                   //积木分组 表单项显示的位置
                        attributes:{
                          selectText:"right",
                          width:"100%",
                        },             
                        animation:[],
                        interactives:[],
                        layout:{
                        	bgColor:"#f00",
                        	height:"1rem",
                        	border:{                
                                color:"#f00",
                                padding:"0" ,     
                            },
                            size:{
                            	width:"60px",
                            	height:"59px",
                            }          
                        }
                    }],
            }
        },
        computed:{
           //样式配置
            leftStyle:function(){
            	const t = this;
                const styles = {
                    'width':t.leftStyleConfig.width,
                    "display":t.leftStyleConfig.display,
                }
                return styles;
            },
            centerTitle:function(){
               	const t = this;
                const styles = {
                    'width':t.centerTitleConfig.width,
                    "display":t.centerTitleConfig.display,
                    "font-size":t.centerTitleConfig.fontSize,
                    "font-family":t.centerTitleConfig.fontFamily,
                    "color":t.centerTitleConfig.color,
                    "font-weight":t.centerTitleConfig.fontWeight,
                    "letter-spacing":t.centerTitleConfig.letterSpacing,
                    "line-height":t.centerTitleConfig.lineHeight,
                    "word-break":t.centerTitleConfig.wordBreak,
                    "overflow":t.centerTitleConfig.overflow,
                    "text-overflow":t.centerTitleConfig.textOverflow,
                    "margin":t.centerTitleConfig.margin,
                    "padding":t.centerTitleConfig.padding,
                }
                return styles;     	
            },
            rightText:function(){
               	const t = this;
                const styles = {
                    "display":t.rightTextConfig.display,
                    "border-style":t.rightTextConfig.borderStyle,
                    "border-color":t.rightTextConfig.borderColor,
                    "border-width":t.rightTextConfig.borderWidth,
                    "border-radius":t.rightTextConfig.borderRadius,
                    "color":t.rightTextConfig.color,
                    "font-size":t.rightTextConfig.fontSize,
                    "font-family":t.rightTextConfig.fontFamily,
                    "background-color":t.rightTextConfig.backgroundColor,
                    "letter-spacing":t.rightTextConfig.letterSpacing,
                    "line-height":t.rightTextConfig.lineHeight,
                    "width":t.rightTextConfig.width,
                    "text-align":t.rightTextConfig.textAlign,
                    "font-weight":t.rightTextConfig.fontWeight,
                }
                return styles;             
            },
            contentTimeStyle:function(){
               	const t = this;
                const styles = {
                    'width':t.contentTimeStyleConfig.width,
                    "display":t.contentTimeStyleConfig.display,
                    "font-size":t.contentTimeStyleConfig.fontSize,
                    "font-family":t.contentTimeStyleConfig.fontFamily,
                    "color":t.contentTimeStyleConfig.color,
                    "font-weight":t.contentTimeStyleConfig.fontWeight,
                    "letter-spacing":t.contentTimeStyleConfig.letterSpacing,
                    "line-height":t.contentTimeStyleConfig.lineHeight,
                    "word-break":t.contentTimeStyleConfig.wordBreak,
                    "overflow":t.contentTimeStyleConfig.overflow,
                    "text-overflow":t.contentTimeStyleConfig.textOverflow,
                }
                return styles;   
            },
            userNumberStyle:function(){
               	const t = this;
                const styles = {
                    'width':t.userNumberStyleConfig.width,
                    "display":t.userNumberStyleConfig.display,
                    "font-size":t.userNumberStyleConfig.fontSize,
                    "font-family":t.userNumberStyleConfig.fontFamily,
                    "color":t.userNumberStyleConfig.color,
                    "font-weight":t.userNumberStyleConfig.fontWeight,
                    "letter-spacing":t.userNumberStyleConfig.letterSpacing,
                    "height":t.userNumberStyleConfig.height,
                    "word-break":t.userNumberStyleConfig.wordBreak,
                    "overflow":t.userNumberStyleConfig.overflow,
                    "text-overflow":t.userNumberStyleConfig.textOverflow,
                }
                return styles;               
            },
            contentTimeIconStyle:function(){
               	const t = this;
                const styles = {
                    'width':t.contentTimeIconStyleConfig.width,
                    "margin":t.contentTimeIconStyleConfig.margin,
                    "padding":t.contentTimeIconStyleConfig.padding,
                    "font-size":t.contentTimeIconStyleConfig.fontSize,
                }
                return styles;               
            },
            userNumberIconStyle:function(){
               	const t = this;
                const styles = {
                    'width':t.userNumberIconStyleConfig.width,
                    "margin":t.userNumberIconStyleConfig.margin,
                    "padding":t.userNumberIconStyleConfig.padding,
                    "font-size":t.contentTimeIconStyleConfig.fontSize,
                }
                return styles;                  
            }
        },
        watch: {},
        mounted:function(){
           this.getItem();
        },
        methods: {
            //动态数据
            getItem() {
	            const t = this;
	            if (t.itemDs) {
	                 _TY_Tool.getDSData(t.itemDs, _TY_Tool.buildTplParams(t), function (data) {
	                    data.forEach((item) => {
	                        const {dataKey, value} = item;
	                        t.items = value.itemList[0];
	                        console.log(value.itemList[0]);
	                        //t.userNumber = value.userNumber;
	                    	//console.log(value.userNumber);
	                    });
	                }, function (code, msg) {
	                });
	            }
	        },
	        onClose(right,itemData){
	        	this.$emit("onClose",itemData);
	        },
	        click(){
	        	console.log(1);
	        },

        }
    }
</script>
<style lang='less' scoped>
    .itemContent{
        width: 100%;
        display: flex;
        justify-content:left;
        align-items:center;
        font-size:14px;
    }
    .leftStyle{
    	width:15%;

    }
    .leftStyle img{
    	width:100%;
    }
    .centerStyle{
    	width:60%;
    	padding:0 3%;
    }
    .rightStyle{
    	width:20%;
    	height:auto;
    }
    .centerContent{
    	width:100%;
    	display:flex;
    }
    .centerContentTime{
    	width:50%;
        display: flex;
        justify-content:left;
        align-items:flex-start;
        overflow:hidden;
    }
    .centerContentTime i{
    	display:inline-block;
    	height:10px;
    }
    .centerContentUser{
    	width:50%;
    	display: flex;
        justify-content:center;
        align-items:center;
    }
    .van-cell-swipe__right div{
    	width:100%;
    	height:100%;
    }
</style>