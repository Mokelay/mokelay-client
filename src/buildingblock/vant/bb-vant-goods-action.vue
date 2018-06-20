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
        :key="key"
        @click="miniClick"
    ></vant-goods-action-mini-btn>
    <vant-goods-action-big-btn
        :text="bigBtn.text"
        :primary="bigBtn.primary"
        :url="bigBtn.url"
        :to="bigBtn.to"
        :replace="bigBtn.replace"
        v-for="(bigBtn,key) in bigBtns"
        :keys="bigBtn.text+'key'"
        @click="bigClick"
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
    	//左侧图标静态数组
       mini:{
        type:Array,
       },
       //右侧图标静态数组
       big:{
        type:Array,
       },     
       //左侧图标动态数组
        fieldsDs:{
            type:Object
        }, 
        //右侧图标动态数组
        valueDs:{
        	type:Object
        }   
    },
   data(){ 
        return {
          bigBtns:this.big,
          miniBtns:this.mini,
        }
      },
    computed:{
        
    },
    mounted(){ 
    	this.getData();
    },
    //事件click
    methods: {
    	//获取数据
        getData() {
            const t = this;
            if (t.fieldsDs) {
                Util.getDSData(t.fieldsDs, _TY_Tool.buildTplParams(t), function (data) {
                    data.forEach((item) => {
                        const {dataKey, value} = item;
                        t.realFields = value;
                    });
                }, function (code, msg) {
                });
            }
        },
        getData() {
            const t = this;
            if (t.valueDs) {
                Util.getDSData(t.valueDs, _TY_Tool.buildTplParams(t), function (data) {
                    data.forEach((item) => {
                        const {dataKey, value} = item;
                        t.realFields = value;
                    });
                }, function (code, msg) {
                });
            }
        },    	
        //小图标点击事件
         miniClick:function(val){
         	this.$emit("miniClick",val);
         },
         //大图标点击事件
         bigClick:function(val){
         	this.$emit("bigClick",val);
         } 
    }
}
</script>

