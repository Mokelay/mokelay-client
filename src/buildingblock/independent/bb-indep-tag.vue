<template>
	<div class="tagContent"> 
		<span class="tagOneLabel" v-for="tag in tags"> 
			<b 
			:style="tagOneLabelWrite" 
			@click="toggleChildren(tag)" 
			>
			{{tag.title}}
			</b>
			<span v-if='tag.expanded == true'><i v-for="child in tag.children" :style="tagTwoLabelWrite">{{child.text}}</i></span>
			
		</span>

	</div>
</template>
<script> 
	export default {
		name:"tagContent",
		props:{
			//一级标签样式
			tagOneLabelWriteConfig:{
				type:Object,
				default:function (){
					return {
						display:"inline-block",
						borderColor:"#6298D8",
						borderWidth:"1px",
						borderStyle:"solid",
						borderRadius:"20px",
						color:"#6298D8",
						fontSize:"14px",
						fontFamily:"",
						fontWeight:"normal",
						letterSpacing:"",
						textAlign:"center",
						padding:"3px 15px",
						margin:"0 10px 10px 0",
					}
				}
			},
			//二级标签样式
			tagTwoLabelWriteConfig:{
				type:Object,
				default:function (){
					return {
						display:"inline-block",
						borderColor:"#666",
						borderWidth:"1px",
						borderStyle:"solid",
						borderRadius:"20px",
						color:"#666",
						fontSize:"14px",
						fontFamily:"",
						fontWeight:"normal",
						letterSpacing:"",
						textAlign:"center",
						padding:"3px 15px",
						fontStyle:"normal",
						margin:"0 10px 10px 0",
					}
				}			
			},
			tagsArray:{
				type:Array,
				default:function(){
					return [{
						title:"教育",
						value:1,
						children:[{
							text:"语文",
							value:2,
						},{
							text:"数学",
							value:3,
						}]
					},{
						title:"文化",
						value:4,
						children:[{
							text:"钢琴",
							value:5,
						},{
							text:"小提琴",
							value:6
						}]
					}]
				}
			}
		},
		 data() {
            return {
               tags:this.tagsArray,
               show:false,
            }
        },
		computed:{
			//样式配置
            tagOneLabelWrite:function(){
            	const t = this;
                const styles = {
                    'width':t.tagOneLabelWriteConfig.width,
                    "display":t.tagOneLabelWriteConfig.display,
                    "border-color":t.tagOneLabelWriteConfig.borderColor,
                    "border-width":t.tagOneLabelWriteConfig.borderWidth,
                    "border-style":t.tagOneLabelWriteConfig.borderStyle,
                    "border-radius":t.tagOneLabelWriteConfig.borderRadius,
                    "color":t.tagOneLabelWriteConfig.color,
                    "font-size":t.tagOneLabelWriteConfig.fontSize,
                    "font-family":t.tagOneLabelWriteConfig.fontFamily,
                    "font-weight":t.tagOneLabelWriteConfig.fontWeight,
                    "letter-spacing":t.tagOneLabelWriteConfig.letterSpacing,
                    "line-height":t.tagOneLabelWriteConfig.lineHeight,
                    "text-align":t.tagOneLabelWriteConfig.textAlign,
                    "height":t.tagOneLabelWriteConfig.height,
                    "padding":t.tagOneLabelWriteConfig.padding,
                    "margin":t.tagOneLabelWriteConfig.margin,
                }
                return styles;
            },
            tagTwoLabelWrite:function(){
            	const t = this;
                const styles = {
                    'width':t.tagTwoLabelWriteConfig.width,
                    "display":t.tagTwoLabelWriteConfig.display,
                    "border-color":t.tagTwoLabelWriteConfig.borderColor,
                    "border-width":t.tagTwoLabelWriteConfig.borderWidth,
                    "border-style":t.tagTwoLabelWriteConfig.borderStyle,
                    "border-radius":t.tagTwoLabelWriteConfig.borderRadius,
                    "color":t.tagTwoLabelWriteConfig.color,
                    "font-size":t.tagTwoLabelWriteConfig.fontSize,
                    "font-family":t.tagTwoLabelWriteConfig.fontFamily,
                    "font-weight":t.tagTwoLabelWriteConfig.fontWeight,
                    "letter-spacing":t.tagTwoLabelWriteConfig.letterSpacing,
                    "line-height":t.tagTwoLabelWriteConfig.lineHeight,
                    "text-align":t.tagTwoLabelWriteConfig.textAlign,
                    "height":t.tagTwoLabelWriteConfig.height,
                    "padding":t.tagTwoLabelWriteConfig.padding,
                    "font-style":t.tagTwoLabelWriteConfig.fontStyle,
                    "margin":t.tagTwoLabelWriteConfig.margin,
                }
                return styles;            
            }
		},
		methods:{
			//点击事件
			 toggleChildren: function(tag) {
			 	debugger
			 	//debugger
 				tag.expanded = tag.expanded?false:true;
 			  },
		},
	}
</script>
<style lang='less' scoped> 
 .tagContent{
 	width:100%;
 	height:auto;
 }
 .tagOneLabel{
 	width:auto;
 	height:auto;
 }
</style>