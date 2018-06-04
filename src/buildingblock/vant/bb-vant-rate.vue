<template>
  <vant-rate 
    v-model="valueRate"
    :count="count"
    :size="layerSize"
    :color="color"
    :voidColor="voidColor"
    :disabledColor="disabledColor"
    :disabled="disabled"
  />
</template>
<script>  

import Rate from 'vant/lib/rate';
import 'vant/lib/rate/style';

export default {
    name:"bb-vant-rate",
    components:{
        "vant-rate":Rate
    },
    props:{
      value:{
        type:[String,Number]
      },
      //图标总数
      count:{
        type:Number,
        default:5
      },
      //图标大小
      layerSize:{
        type:Number,
        default:20
      },
      //选中时的颜色
      color:{
        type:String,
        default:"#ffd21e"
      },
      //未选中时的颜色
      voidColor:{
        default:String,
        default:"#c7c7c7"
      },
      //不可选时的颜色
      disabledColor:{
        type:String,
        default:"#bdbdbd"
      },
      //是否禁用评分
      disabled:{
        type:Boolean,
        default:false
      },       
    },
    data(){ 
        return{
         valueRate:this.value,
        }
      },
    computed:{
         
    },
    watch:{
      value(val){
        this.valueRate = val;
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

