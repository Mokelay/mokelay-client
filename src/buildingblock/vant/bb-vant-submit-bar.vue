<template>
  <vant-submit-bar 
    :price="price"
    :label="label"
    :buttonText="buttonText"
    :buttonType="buttonType"
    :tip="tip"
    :disabled="disabled"
    :loading="loading"
    :currency="currency"
    :value="value"
    @submit="onSubmit"
  >
  </vant-submit-bar>

</template>
<script>  

import SubmitBar from 'vant/lib/submit-bar';
import 'vant/lib/submit-bar/style';

export default {
    name:"bb-vant-submit-bar",
    components:{
        "vant-submit-bar":SubmitBar
    },
    props:{
        //价格
        price:{
          type:Number,
        },
        //价格文案
        label:{
          type:String,
          default:"合计："
        },
        //按钮文字
        buttonText:{
          type:String,
        },
        //按钮类型
        buttonType:{
          type:String,
          default:"danger"
        },
        //提示文案
        tip:{
          type:String
        },
        //是否禁用按钮
        disabled:{
          type:Boolean,
          default:false
        },
        //是否显示加载中的按钮
        loading:{
          type:Boolean,
          default:false
        },
        //货币符号
        currency:{
          type:String,
          default:"￥"
        },
        value:{
          type:[Number,String]
        },
    },
   data(){ 
        return{
            valueBase:this.value          
        }
      },
    computed:{
        
    },
    watch:{
        value(val){
          this.valueBase = val;
        }
      },    
    methods: {
      //事件submit
        onSubmit(val){
          let t=this;
          t.$emit('input',val,t);
          t.$emit('onSubmit',val,t);
         }   
    }
}
</script>

