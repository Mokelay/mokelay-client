<template>
  <vant-nav-bar 
    :id="id"
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
          },
          /*各部分的颜色
            {
              leftIcon:"",
              leftText:""
              title:""
              rightIcon:""
              rightText:""
            }
          */
          color:{
            type:Object
          }
    },
   data(){ 
        return{
             showTitle:this.title,
             showLeftText:this.leftText,
             showRightText:this.rightText,
             id:_TY_Tool.uuid()
        }
      },
    computed:{
        
    },
    mounted(){
      this.setColor()
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
        },
        //设置各部分颜色
        setColor(){
          const t = this;
          if(t.color){
            const navBar = document.getElementById(t.id);
            const bar__left = navBar.getElementsByClassName("van-nav-bar__left")[0];
            const bar__left_icon = bar__left.getElementsByTagName("i")[0];
            const bar__left_text = bar__left.getElementsByTagName("span")[0];
            const bar__title = navBar.getElementsByClassName("van-ellipsis van-nav-bar__title")[0];
            const bar_right = navBar.getElementsByClassName("van-nav-bar__right")[0];
            const bar__right_icon = bar_right.getElementsByTagName("i")[0];
            const bar__right_text = bar_right.getElementsByTagName("span")[0];
            if(bar__left_icon){
              bar__left_icon.style.color = t.color.leftIcon;
            }
            if(bar__left_text){
              bar__left_text.style.color = t.color.leftText;
            }
            if(bar__title){
              bar__title.style.color = t.color.title;
            }
            if(bar__right_icon){
              bar__right_icon.style.color = t.color.rightIcon;
            }
            if(bar__right_text){
              bar__right_text.color = t.color.rightText;
            }
          }
        }    
    }
}
</script>

