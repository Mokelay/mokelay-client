<template>
  <vant-notice-bar 
    :mode="mode"
    :delay="option.delay"
    :speed="option.speed"
    :scrollable="scrollable"
    :leftIcon="leftIcon"
    :color="color"
    :background='background'
    :text="text"
    @click="click"
  >
  </vant-notice-bar>

</template>
<script>  

import NoticeBar from 'vant/lib/notice-bar';
import 'vant/lib/notice-bar/style';

export default {
    name:"bb-vant-notice-bar",
    components:{
        "vant-notice-bar":NoticeBar
    },
    props:{
      value:{
        type:[Number,String,Boolean]
      },
      //通告栏模式，closeable，右侧显示关闭按钮；link，右侧显示链接箭头
      mode:{
        type:String,
      },
      //动画延迟时间
      /*delay:{
        type:Number,
        default:1
      },
      //滚动速率
      speed:{
        type:Number,
        default:50
      },*/
      //左侧图标URL
      leftIcon:{
        type:String,
      },
      //是否在长度溢出时滚动播放
      scrollable:{
        type:Boolean,
        default:true
      },
      //文本颜色
      color:{
        type:String,
        default:"#f60"
      },
      //滚动条背景
      background:{
        type:String,
        default:"#fff7cc"
      },
      //滚动条文字
      text:{
        type:String,
      },
      //动态数据
      valueDs:{
      	type:Object,
      },
      //其他属性
      option:{
      	type:Object,
      	default:function(){
      		return {
      			delay:1,
      			speed:50,
      		}
      	}
      }
    },
   data(){ 
        return{
            valueBase:this.value
        }
      },
    computed:{
        
    },
    mounted(){
    	const t = this;
    	t.getData();
    },
    //事件click
    methods: {
        //点击事件
        click(param){
            this.$emit('click',param);
        },
        //动态获取展示内容
        getData(){
            const t = this;
            if (t.valueDs) {
                t.loading = true;
                _TY_Tool.getDSData(t.valueDs, _TY_Tool.buildTplParams(t), function (data) {
                    data.forEach((item) => {
                        t.loading = false;
                        const {dataKey, value} = item;
                        t.valueBase = value;
                        t.emit("buttonFinish",t);
                    });
                }, function (code, msg) {
                    t.loading = false;
                });
            }
        },    
    }
}
</script>

