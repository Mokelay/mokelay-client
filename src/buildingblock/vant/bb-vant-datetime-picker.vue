<template>
  <vant-datetime-picker 
    :type="datetimeType"
    :min-date="minDate"
    :max-date="maxDate"
    :min-hour="minHour"
    :max-hour="maxHour"
    :title="title"
    :loading="loading"
    :value="valueBase"
    :item-height="itemHeight"
    :confirm-button-text="confirmButtonText"
    :cancel-button-text="cancelButtonText"
    :visible-item-count="visibleItemCount"
    @change="onChange"
    @confirm="onConfirm"
    @cancel="onCancel"
  />
</template>
<script>  

import DatetimePicker from 'vant/lib/datetime-picker';
import 'vant/lib/datetime-picker/style';

export default {
    name:"bb-vant-datetime-picker",
    components:{
        "vant-datetime-picker":DatetimePicker
    },
    props:{
      //类型 可选值date(日期) time(时间） year-month(年月)
        datetimeType:{
          type:String,
          default:"datetime"
        },
        //可选的最小日期
        minDate:{
          type:Date,
        },
        //可选的最大日期
        maxDate:{
          type:Date,
        },
        //可选的最小小时
        minHour:{
          type:Number,
          default:0
        },
        //可选的最大小时
        maxHour:{
          type:Number,
          default:23
        },
        //顶部栏标题
        title:{
          type:String,
        },
        //是否显示加载状态
        loading:{
          type:Boolean,
          default:false
        },
        //选项高度
        itemHeight:{
          type:Number,
          default:44
        },
        //确认按钮文字
        confirmButtonText:{
          type:String,
          default:"确认"
        },
        //取消按钮文字
        cancelButtonText:{
          type:String,
          default:"取消"
        },
        //可见选项个数
        visibleItemCount:{
          type:Number,
          type:5
        },
        value:{
          type:[String,Number,Date]
        }
    },
   data(){ 
        return{
          valueBase:this.value
        }
      },
      watch:{
        value(val){
          this.valueBase = val;
        }
      }, 
    computed:{

    },
    methods:{
        onChange(val){
          let t=this;
          t.$emit('input',val,t);
          t.$emit('onChange',val,t);
         },  
        onConfirm(val){
          let t=this;
          t.$emit('input',val,t);
          t.$emit('onConfirm',val,t);
         },  
        onCancel(val){
          let t=this;
          t.$emit('input',val,t);
          t.$emit('onCancel',val,t);
         },      }
}
</script>

