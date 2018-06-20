<template>
  <vant-circle 
    v-model="setCurrentRate"
    :rate="showRate"
    :size="circleSize"
    :color="color"
    :layer-color="layerColor"
    :fill="fill"
    :speed="speed"
    :stroke-width="strokeWidth"
    :clockwise="clockwise"
    :text="text"
  />
</template>
<script>  

import Circle from 'vant/lib/circle';
import 'vant/lib/circle/style';

export default {
    name:"bb-vant-circle",
    components:{
        "vant-circle":Circle
    },
    props:{
       // 目标进度 
       rate:{
        type:Number,
        default:0,
       },
       // 圆环直径
       circleSize:{
        type:String,
        default:"100px",
       },
       // 进度条颜色
       color:{
        type:String,
        default:"#38f",
       },
       // 轨道颜色
       layerColor:{
        type:String,
        default:"#fff"
       },
       // 填充颜色
       fill:{
        type:String
       },
       // 动画速度
       speed:{
        type:Number,
        default:0,
       },
       // 进度条宽度
       strokeWidth:{
        type:Number,
        default:40
       },
       // 是否顺时针增加
       clockwise:{
        type:Boolean,
        default:true
       },
       //当前进度
       currentRate:{
       	type:Number,
       	default:0,
       }
    },
   data(){ 
        return{
          setCurrentRate:this.currentRate,
          showRate:this.rate,
        }
      },
    computed:{
         text() {
            return this.rate.toFixed(0) + '%'
          }
    },
    methods:{
    	//从外部传入的进度条进度
    	setRate:function(rate){
    		this.currentRate = rate;
    	}
    }
}
</script>

