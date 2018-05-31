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
  />{{text}}

</template>

<script>
import Button from 'vant/lib/circle';
import 'vant/lib/circle/style';

export default {
    name:"bb-vant-circle",
    components:{
        "vant-circle"：circle
    },
    data() {
            return {
                currentRate:0,
            };
        },
    props:{
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
       layer-color:{
        type:String,
        default:"#fff"
       },
       // 填充颜色
       fill:{
        type:String,
        default:none
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
    }

}
</script>

