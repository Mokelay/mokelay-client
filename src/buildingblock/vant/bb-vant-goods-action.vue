<template>
  <vant-goods-action>
    <vant-goods-action-mini-btn
        :text="miniBtn.text"
        :icon="miniBtn.icon"
        :iconClass="miniBtn.iconClass"
        :info="miniBtn.info"
        :url="miniBtn.url"
        :to="miniBtn.to"
        :replace="miniBtn.replace"
        v-for="(miniBtn,key) in miniBtns"
    ></vant-goods-action-mini-btn>
    <vant-goods-action-big-btn
        :text="bigBtn.text"
        :primary="bigBtn.primary"
        :url="bigBtn.url"
        :to="bigBtn.to"
        :replace="bigBtn.replace"
        v-for="(bigBtn,key) in bigBtns"
    ></vant-goods-action-big-btn>
  </vant-goods-action>

</template>
<script>  

import GoodsAction from 'vant/lib/goods-action';
import 'vant/lib/goods-action/style';
import GoodsActionBigBtn from 'vant/lib/goods-action-big-btn';
import 'vant/lib/goods-action-big-btn/style';
import GoodsActionMinibtn from 'vant/lib/goods-action-mini-btn';
import 'vant/lib/goods-action-mini-btn/style';

export default {
    name:"bb-vant-goods-action",
    components:{
        "vant-goods-action":GoodsAction,
        "vant-goods-action-big-btn":GoodsActionBigBtn,
        "vant-goods-action-mini-btn":GoodsActionMinibtn
    },
    props:{
       mini:{
        type:Array,
        default:function() {
            return [{
                  text:"service",
                  icon:"chat",
                  iconClass:"10",
                  info:"10",
                  url:"",
                  to:"",
                  replace:true
            },{
                  text:"shop_car",
                  icon:"chat",
                  iconClass:"10",
                  info:"10",
                  url:"",
                  to:"",
                  replace:true
            }];
          }
       },
       big:{
        type:Array,
        default:function(){
          return [{
                text:"joinShopCar",
                primary:false,
                url:"",
                to:"",
                replace:true
            },{
                text:"joinShopCar",
                primary:true,
                url:"",
                to:"",
                replace:true
            }]
        }
       },       
       //按钮文字
       text:{
        type:String,
       },
       //图标
       icon:{
        type:String,
       },
       //图标额外类命
       iconClass:{
        type:String
       },
       //图标右上角提示信息
       info:{
        type:[String,Number]
       },
       //跳转链接
       url:{
        type:String
       },
       //路由跳转对象
       to:{
        type:[String,Object]
       },
       //跳转时是否替换当前history
       replace:{
        type:String
       },
       //是否主行动按钮，主行动按钮默认为红色
       primary:{
        type:Boolean,
        default:false
       },
    },
   data(){ 
        return {
          bigBtns:this.big,
          miniBtns:this.mini,
        }
      },
    computed:{
        
    },
    //事件click
    methods: {
            
    }
}
</script>

