<template>
  <vant-datetime-picker 
    :type="datetimeType"
    :min-date="minDate"
    :max-date="maxDate"
    :min-hour="minHour"
    :max-hour="maxHour"
    :title="title"
    :loading="option.loading"
    :value="valueBase"
    :item-height="option.itemHeight"
    :confirm-button-text="confirmButtonText"
    :cancel-button-text="option.cancelButtonText"
    :visible-item-count="option.visibleItemCount"
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
       	  default:0,
        },
        //可选的最大小时
        maxHour:{
          type:Number,
          default:10
        },
        value:{
          type:[String,Number,Date]
        },
        defaultValTpl:{
            type:String
        },
        //其他属性
        option:{
        	type:Object,
        	default:function(){
        		return {
	        		title:"",  //标题
	        		loading:false,  //是否显示加载状态
	        		itemHeight:44,  //行高
	        		confirmButtonText:"确认",  //确认按钮文字
	        		cancelButtonText:"取消",	//取消按钮文字
	        		visibleItemCount:3,		//可显示选项个数
        		}
        	}
        }
    },
   data(){ 
        return{
          valueBase:this.value,
          title:this.option.title,
          confirmButtonText:this.option.confirmButtonText,
        }
      },
      watch:{
        value(val){
          this.valueBase = val         
        }
      }, 
    computed:{},
    mounted:function(){
      let t=this;
      _TY_Tool.buildDefaultValTpl(t,"valueBase");
    },
    methods:{
    	//改变
        onChange(val){
          let t=this;
          t.$emit('input',val,t);
          t.$emit('onChange',val,t);
         },
         //确认  
        onConfirm(val){
          let t=this;
          t.$emit('input',val,t);
          t.$emit('onConfirm',val,t);
         }, 
         //取消 
        onCancel(val){
        	console.log(this.value);
          let t=this;
          t.$emit('input',val,t);
          t.$emit('onCancel',val,t);
         },

    	//外部设值
    	setTime:function(...params){
            params.forEach((param,key)=>{
                if(param.type == "custom"){
                    this.valueBase = param.arguments
                }
            })        		
    	}


     }
}
</script>

