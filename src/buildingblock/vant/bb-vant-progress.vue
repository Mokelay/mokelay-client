<template>
	<div class="bb-vant-progress">
		<vant-progress
			v-if="theme == 'default'"
			:inactive="inactive"
			:percentage="percentageShow"
			:showPivot="showPivot"
			:color="color"
			:textColor="textColor"
			:pivotText="pivotText"
			:pivotColor="pivotColor"
		>
		</vant-progress>
		<div v-if="theme == 'line'" class="line">
			<div class="total">
				<div class="progress" :style="progressStyle"></div>
			</div>
			<div class="desc"></div>
		</div>
		<div v-if="theme == 'disc'" class="disc">
			<div class="total">
				<div v-for="(n,key) in total" class="total-item" :style="{transform:`rotate(${key*3.6}deg)`,transformOrigin:`140px 0`}"></div>
			</div>
			<div class="progress">
				<div v-for="(n,key) in progressTotal" class="progress-item" :style="{transform:`rotate(${key*3.6}deg)`,transformOrigin:`140px 0`,opacity:`${progressOpacity}`}"></div>
			</div>
			<div class="desc"></div>
		</div>
	</div>
</template>
<script>
	import Progress from 'vant/lib/progress';
	import 'vant/lib/progress/style';

	export default{
		name: "bb-vant-progress",
		components:{
			'vant-progress':Progress
		},
		props:{
			//是否置灰
		    inactive:{
		    	type:Boolean,
		    	default:false
		    },
		    //进度百分比
		    percentage:{
		    	type:[Number,String],
		    	default:0
		    },
		    //是否显示进度文字
		    showPivot:{
		    	type:Boolean,
		    	default:false
		    },
		    //进度条颜色
		    color:{
		    	type:String,
		    	default:"#38f"
		    },
		    //进度条文字颜色
		    textColor:{
		    	type:String,
		    	default:"#fff"
		    },
		    //文字显示
		    pivotText:{
		    	type:String,
		    },
		    //文字背景色
		    pivotColor:{
		    	type:String,
		    },
		    /*进度条主题
		    	default 默认线条
		    	line 线条2
		    	disc 圆盘
		    */
		    theme:{
		    	type:String,
		    	default:"disc"
		    }
		},
		data(){
			return {
				percentageShow:_TY_Tool.tpl(this.percentage, _TY_Tool.buildTplParams(this)),
				progressStyle:{
					width:"0%"
				},
				total:50,
				progressTotal:this.total*this.percentage || 25,
				progressOpacity:0

			};
		},
		watch:{
			percentage(val){
				debugger
				this.progressTotal = this.total * _TY_Tool.tpl(this.percentage, _TY_Tool.buildTplParams(this));
			}
		},
		mounted(){
			this.setStyle();
		},
	  	methods: {
	   		setTage:function(tage){
	   			this.percentageShow = tage;
	   		},
	   		setStyle(){
	   			const t = this;
	   			t.progressStyle = {
	   				width:t.percentage +"%"
	   			};
	   			t.progressOpacity = 1;
	   		}
	  	}
	}
</script>
<style lang="less" scoped>
	.bb-vant-progress{
		.line{
			position: relative;
			width:100%;
			.total{
				background-color: #e5e5e5;
				height: 6px;
				border-radius: 3px;
				width:100%;
				position: absolute;
				.progress{
					background-color: #EC74E7;
					height: 6px;
					border-radius: 3px;
					width: 0;
					width:100px;
					transition: width 2s;
					-moz-transition: width 2s; /* Firefox 4 */
					-webkit-transition: width 2s; /* Safari 和 Chrome */
					-o-transition: width 2s; /* Opera */
				}
			}
		}
		.disc{
			position: relative;
			width:100%;
			.total{
				position: absolute;
				.total-item{
					transform: rotate(125deg);
					border-bottom: 1px solid #e5e5e5;
					width: 7px;
					position: absolute;
				}
			}
			.progress{
				position: absolute;
				.progress-item{
					transform: rotate(125deg);
					border-bottom: 1px solid #93D7FF;
					width: 7px;
					opacity: 0;
					position: absolute;
					transition: opacity 2s;
					-moz-transition: opacity 2s; /* Firefox 4 */
					-webkit-transition: opacity 2s; /* Safari 和 Chrome */
					-o-transition: opacity 2s; /* Opera */
				}
			}
		}
	}
</style>

