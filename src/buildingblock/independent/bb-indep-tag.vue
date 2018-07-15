<template>
	<div class="tagContent"> 
		<span class="tagOneLabel" v-for="tag in tags" > 
			<b :style="tag.style || tagOneLabelWrite" @click="toggle(tag)">
				{{tag.title}}
			</b>
			<span v-show="tag.show">
				<i v-for="child in tag.children" :style="tagTwoLabelWrite"
					@click="toggleClass(child)"
					v-bind:class="{checkColor:child.isCheckColor}"
					>
					{{child.text}}
				</i> 
			</span>
		</span>
		<!-- 自定义添加按钮 -->
		<span> 
			<b 
			:style="tagTwoLabelWrite"
			v-for="(custom,key) in customs" 
			@click="customPopShow(key)"
			class="checkColor"			
			>
			{{custom.writeShow}}
			</b>
		</span>
		<span> 
			<b 
			:style="tagTwoLabelWrite" 
			@click="customPopShow('add')"
			v-show="customButton"
			>
			自定义
			</b>
		</span>
		<div class="customPop" v-show="showPop"> 
			<div class="customPopBg"></div>
			<div class="customPopCon">
				<p class="customPopTitleStyle">{{customPopTitle}}</p> 
				<p class="customPopInput">
					<input type="text" 
					v-model="valueBase"> 
				</p>
				<p class="customPopButton">
					<button @click="customPopCancel">取消</button>
					<button @click="customPopSubmit">确认</button>
				</p>
			</div>
		</div>
	</div>
</template>
<script> 
	import Vue from 'vue'
	export default {

		name:"tagContent",
		props:{
			//自定义数组
			customs:{
				type:Array,
				default:function(){
					return []
				}
			},
			//自定义弹框
			showData:{
				type:Boolean,
				default:false,
			},
			//弹框内标题
			customPopTitle:{
				type:String,
				default:"填写自定义标签",
			},
			value:{
				type:[String,Number],
				default:"",
			},
			//一级标签样式
			tagOneLabelWriteConfig:{
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
			//静态数据
			/*
				 [{
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
			*/
			tagsArray:{
				type:Array,
			},
			//动态数据
			tagDs:{
				type:Object,
			},
			//集合数组
			arrayData:{
				type:Array,
			}
		},
		 data() {
            return {
               tags:this.tagsArray,
               valueBase:this.value,
               showPop:this.showData,
               customWriteShow:this.customWrite,
               customEditKey:"add",
               customButton:true, 
       		   show:false,
       		   isCheckColor:false,
       		   tagData:[],
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
		mounted:function(){
          	this.getTag();
        },
        watch:{
        	tagsArray(val){
        		this.tags = val
        	}
        },
		methods:{
			//动态数据
			getTag() {
	            const t = this;
	            if (t.tagDs) {
	                _TY_Tool.getDSData(t.tagDs, _TY_Tool.buildTplParams(t), function (data) {
	                    data.forEach((item) => {
	                        const {dataKey, value} = item;
	                        t.tags = value;
	                    });
	                }, function (code, msg) {
	                });
	            }
	        },
			//父级点击事件
		 	toggle:function(tag) {
		 		Vue.set(tag,'show',true);
		 		if(tag.isCheckColor == true){
		 			Vue.set(tag,'isCheckColor',false);
		 			var val = tag.value;
		 			var j = 0;
		 			for(var i = 0;i < this.tagData.length;i++){
		 				if(this.tagData[i] == val){
		 					j = i;
		 				}
		 			};
		 			this.tagData.splice(j,1);
		 		}else{
		 			Vue.set(tag,'isCheckColor',true);
		 			var val = tag.value;
		 		    this.tagData.push(val);	
		 		};	 		
		 		var valData = this.tagData;
				this.$emit("toggle",tag,valData);
			},
			//子集点击事件
			toggleClass:function(child){
				if(child.isCheckColor == true){
					Vue.set(child,'isCheckColor',false);
		 			var val = child.value;
		 			var j = 0;
		 			for(var i = 0;i < this.tagData.length;i++){
		 				if(this.tagData[i] == val){
		 					j = i;
		 				}
		 			};
		 			this.tagData.splice(j,1);
				}else{
					Vue.set(child,'isCheckColor',true);
					var val= child.value;
				    this.tagData.push(val);
				};
				var valData = this.tagData;
				this.$emit("child",child,valData);
			},
 			//弹框取消点击事件
 			customPopCancel:function(){
 				this.showPop = false;
 			},
 			//弹框确定点击事件
 			customPopSubmit:function(){ 				
 				var val = this.valueBase;
 				this.showPop = false;
 				this.customWriteShow = this.valueBase;
 				if(this.customWriteShow){
 					//点击时将增加的数组放置于原数组前
	 				var c = this.customWriteShow;
	 				if(this.customEditKey == "add"){
	 					var w = { writeShow : c};
	 					this.customs.unshift(w);
	 				}else{
	 					this.customs[this.customEditKey]['writeShow'] = c;
	 				}
 				}else{
 					const arr = this.customEditKey == "add"?null:this.customs.splice(this.customEditKey,1);
 				}; 				
 				//自定义标签不能超过三个
 				var l =this.customs.length;
 				if(l > 3){
 					//console.log(this.customButton);
 					this.customs.splice(3);
 					this.customButton = false;
 				};
 				//清空输入框
 				this.valueBase = null;
 				this.$emit("customPopSubmit");
 			},
 			//点击自定义的事件
 			customPopShow:function(key){
 				this.showPop = true;
 				this.customEditKey = key
 				this.valueBase = key == "add"?"":this.customs[key]['writeShow'];
 			},
 			//外部传值修改tag样式
 			setNumber:function(...params){
 				const t = this;
                params.forEach((param,key)=>{
                    if(param.type == "custom"){
                        this.valData = param.arguments;
                        var tagData = this.valData;
                        var tagsArray = this.tagsArray;
                        tagData.forEach((item,index) =>{
                        	tagsArray.forEach((tagItem,tagIndex)=>{
                        		if(tagItem.value == item.value){
                        			debugger
                        			tagItem.style = t.tagOneLabelWrite;
                        			tagItem.style.borderColor = "#5F9BD5";
                        			tagItem.style.color = "#5F9BD5";
                        			console.log(tagItem.value);
                        			t.tags = t.tagsArray;
                        			//tagItem.value.isCheckColor = true;
                        		}
                        	});
				        }); 
                        console.log(this.tagsArray);
                    }
                })        		
        	},




		},
	}
</script>
<style lang='less' scoped> 
 .tagContent{
 	width:100%;
 	height:500px;
 }
 .tagOneLabel{
 	width:auto;
 	height:auto;
 }
 .customPop{
 	width:100%;
 	height:100%;
 	position:absolute;
 	top:0;
 	left:0; 
 }
.customPopBg{
	width:100%;
	height:100%;
	background:rgba(0,0,0,.3);
}
.customPopCon{
	width:80%; 
	height:135px;
	background:#fff;
	position:absolute;
	left:10%;
	top:50%;
	margin-top:-67.5px;
}
.customPopTitleStyle{
	width:100%;
	text-align:center;
	line-height:40px;
	font-size:16px;
}
.customPopInput{
	width:90%;
	height:auto;
	margin:0 5%;
}
.customPopInput input{
	width:100%;
	line-height:30px;
	color:#666;
	font-size:14px;
	border:1px solid #ddd;
}
.customPopButton{
	border-top:1px solid #ddd;
	margin-top:20px;
	display:flex;
	justify-content:center;
}
.customPopButton button{
	width:50%;
	line-height:40px;
	text-align:center;
	font-size:14px;
	color:#000;
	border-right:1px solid #ddd;
	border-left:none;
	border-top:none;
	border-bottom:none;
	background:#fff;
}
.checkColor{

	color:#5F9BD5!important;
	border-color:#5F9BD5!important;
}


</style>