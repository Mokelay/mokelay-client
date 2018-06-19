<template>
	<van-pagination
		v-model="currentPage"
		:mode="mode"
		:itemsPerPage="itemsPerPage"
		:previous-text="previousText"
		:nextText="nextText"
		:showPageSize="showPageSize"
		:forceEllipses="forceEllipses"
		:total-items="realTotalItems"
	>
	</van-pagination>
</template>
<script>
	import Pagination from 'vant/lib/pagination'
	import 'vant/lib/pagination/style';

	export default{
		name: "bb-vant-pagination",
		components:{
			'van-pagination':Pagination
		},
		props:{
			//总条数
			totalItems:{
				type:[Number,String],
				default:0,
			},
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
				default:"11",
			},
			//下一页
			nextText:{
				type:String,
				default:"22",
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
	         realTotalItems:this.totalItems,
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
	       },
	       //从外部传入总条数
	       setTotalItems(totalItems){
	       	this.realTotalItems = totalItems;
	       },
	       //外部传入当前页
	       setVal(val){
	       	this.currentPage = val;
	       }
	    }

	}
</script>

