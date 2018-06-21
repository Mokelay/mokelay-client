<template>
  <vant-nav-bar 
    :title="showTitle"
    :leftText="showLeftText"
    :rightText="showRightText"
    :leftArrow="leftArrow"
    :fixed="fixed"
    :zIndex="zIndex"
    @click-left="onClickLeft"
    @click-right="onClickRight"
  >
  </vant-nav-bar>

</template>
<script>  

import NavBar from 'vant/lib/nav-bar';
import 'vant/lib/nav-bar/style';

export default {
    name:"bb-vant-nav-bar",
    components:{
        "vant-nav-bar":NavBar
    },
    props:{
       	//标题
          title:{
            type:String,
          },
          //左侧文案
          leftText:{
            type:String
          },
          //右侧文案
          rightText:{
            type:String
          },
          //是否显示左侧箭头
          leftArrow:{
            type:Boolean,
            default:false
          },
          //是否固定在顶部
          fixed:{
            type:Boolean,
            default:false
          },
          //元素z-index
          zIndex:{
            type:Number,
            default:1
          }
    },
   data(){ 
        return{
             showTitle:this.title,
             showLeftText:this.leftText,
             showRightText:this.rightText, 
        }
      },
    computed:{
        
    },
    //事件click
    methods: {
    	//左侧点击事件
        onClickLeft(param) {
          this.$emit('onClickLeft',param);
        },
        //右侧点击事件
        onClickRight(param) {
          this.$emit('onClickRight',param);
        },
        //外部传入标题
        setTitle(val){
        	this.title = val;
        }     
    }
}
</script>

