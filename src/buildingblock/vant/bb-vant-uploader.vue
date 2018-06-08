<template>
  <vant-uploader
      :resultType="resultType"
      :accept="accept"
      :disabled="disabled"      
      :maxSize="maxSize"
      @oversize="oversize"
  >
    <vant-icon name="photograph" />
  </vant-uploader>
</template>
<script>  


import Uploader from 'vant/lib/uploader';
import 'vant/lib/uploader/style';
import Icon from 'vant/lib/icon';
import 'vant/lib/icon/style';

export default {
    name:"bb-vant-uploader",
    components:{
        "vant-uploader":Uploader,
        "vant-icon":Icon
    },
    props:{
       value:{
        type:[String,Number]
       },
      //文件读取结果类型，可选值dataUrl，test
       resultType:{
        type:String,
        default:"dataUrl"
       },
       //接受的文件类型。默认值image/*
       accept:{
        type:String,
        default:"image/*"
       },
       //是否禁用图片上传
       disabled:{
        type:Boolean,
        default:false
       },
       //读取前的回调函数
      /* beforeRead:{
        type:function,
        default:function(){
          return {}
        }
       },
       //读取完成后的回调函数
       afterRead:{
        type:function,
        default:function(){
          return {}
        }
       },*/
      //文件大小限制，单位为byte
       maxSize:{
        type:Number
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
    methods: {
      //事件submit
        oversize(val){
          let t=this;
          t.$emit('input',val,t);
          t.$emit('oversize',val,t);
         }   
    }
  }
</script>

