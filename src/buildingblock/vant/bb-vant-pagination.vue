<template>
	<van-pagination
		v-model="currentPage"
		:mode="mode"
		:itemsPerPage="itemsPerPage"
		:previousText="previousText"
		:nextText="nextText"
		:showPageSize="showPageSize"
		:forceEllipses="forceEllipses"
	>
	</van-pagination>
</template>
<script>
	import {Pagination} from 'vant'
	import 'vant/lib/pagination/style';

	export default{
		name: "bb-vant-pagination",
		components:{
			'van-pagination':Pagination
		},
		props:{
			value:{
				type:[Number,String]
			},
			//显示模式，可选值simple multi
			mode:{
				type:String,
				default:"multi"
			},
			//每页记录数
			itemsPerPage:{
				type:Number,
				default:10
			},
			//上一页
			previousText:{
				type:String,
			},
			//下一页
			nextText:{
				type:String,
			},
			//显示的页码个数
		    showPageSize:{
		    	type:Number,
		    	default:5
		    },
		    //显示省略号
		    forceEllipses:{
		    	type:Boolean,
		    	default:false
		    }
		},
	   data(){ 
	        return{
	         currentPage:this.value,
	        }
	      },
	    computed:{
	         
	    },
	    watch:{
	      value(val){
	        this.currentPage = val;
	      }

	    },
	    method:{
	      change:function(val){
	        let t=this;
	        t.$emit('input',val,t);
	        t.$emit('change',val,t);
	       }
	    }

	}
</script>

