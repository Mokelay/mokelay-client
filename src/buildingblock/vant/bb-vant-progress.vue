<template>
	<van-progress
		:inactive="inactive"
		:percentage="percentage"
		:showPivot="showPivot"
		:color="color"
		:textColor="textColor"
		:pivotText="pivotText"
		:pivotColor="pivotColor"
	>
	</van-progress>
</template>
<script>
	import {Progress} from 'vant'
	import 'vant/lib/progress/style';

	export default{
		name: "bb-vant-progress",
		components:{
			'van-progress':Progress
		},
		props:{
		    inactive:{
		    	type:Boolean,
		    	default:false
		    },
		    percentage:{
		    	type:Number,
		    	default:0
		    },
		    showPivot:{
		    	type:Boolean,
		    	default:false
		    },
		    color:{
		    	type:String,
		    	default:"#38f"
		    },
		    textColor:{
		    	type:String,
		    	default:"#fff"
		    },
		    pivotText:{
		    	type:String,
		    },
		    pivotColor:{
		    	type:String,
		    }
		},
		data(){
			return {};
		},
	  	methods: {
	   
	  	}
	}
</script>

