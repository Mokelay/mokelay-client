<template>
  <vant-circle 
    v-model="currentRate"
    :rate="option.rate"
    :size="option.size"
    :color="option.color"
    :layer-color="option.layer_color"
    :fill="option.fill"
    :speed="option.speed"
    :stroke-width="option.stroke_width"
    :clockwise="option.clockwise"
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
      text:{
        type:String,
        default:"",
      },
       // 目标进度 
       rate:{
        type:Number,
        default:100,
       },
       // 圆环直径
       size:{
        type:String,
        default:"100px",
       },
       // 进度条颜色
       color:{
        type:String,
        default:"#38f",
       },
       // 轨道颜色
       layer_color:{
        type:String,
        default:"#fff"
       },
       // 填充颜色
       fill:{
        type:String,
        default:""
       },
       // 动画速度
       speed:{
        type:Number,
        default:""
       },
       // 进度条宽度
       stroke_width:{
        type:Number,
        default:40
       },
       // 是否顺时针增加
       clockwise:{
        type:Boolean,
        default:true
       }
    },
    data() {
            return {
                currentRate:this.value,
                currentRateString:this.value,
            };
        },
    computed:{
        text(){
            return this.currentRate.toFixed(0) + '%'
        }
    }

}
</script>

