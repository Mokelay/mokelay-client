<template>
	<van-slider
	v-model="value"
	@change="onChange"
	:disabled='disabled'
	:min='min'
	:step='step'
	:barHeight='barHeight'
	>
	</van-slider>
</template>
<script>
	import {Slider} from 'vant'
	import 'vant/lib/slider/style';

	export default{
		name: "bb-vant-slider",
		components:{
			'van-slider':Slider
		},
		props:{
		    disabled: Boolean,
		    max: {
		      type: Number,
		      default: 100
		    },
		    min: {
		      type: Number,
		      default: 0
		    },
		    step: {
		      type: Number,
		      default: 1
		    },
		    value: {
		      type: Number,
		      default: 50
		    },
		    barHeight: {
		      type: String,
		      default: '2px'
		    }
		},
		data(){
			return {};
		},
		  methods: {
		    onChange(value) {
		      this.$toast('当前值：' + value);
		      this.$emit('change',value);
		    }
		  }
	}
</script>