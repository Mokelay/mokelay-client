<!-- <template>
  <van-submit-bar 
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
  </van-submit-bar>
</template> -->
<script>  

import SubmitBar from 'vant/lib/submit-bar';
import 'vant/lib/submit-bar/style';

export default {
    name:"bb-vant-submit-bar",
    components:{
        "van-submit-bar":SubmitBar
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
        /*积木数组
          content:[{                      //页面内容
                uuid:'',
                alias:'',                   //积木别名
                aliasName:'',               //中文名称
                group:'',                   //积木分组 表单项显示的位置
                attributes:{
                    attributeName:''    //表单项键值别名
                    rules:[]            //验证规则
                    width:''            //表单项宽度
                    ........            //其他积木属性
                },              //积木属性
                animation:[{                //动画
                    style:"",               //方式
                    time:0,                 //时间
                    delay:0,                //延迟时间
                    playNum:1               //播放次数
                    loop:true|false,        //循环
                    direction:""            //方向
                }],
                interactives:[{             //触发交互
                    uuid:'',
                    fromContentEvent:'',    //触发积木的事件,fromContentUUID为当前content的UUID
                    executeType:'',         //执行类型(预定义方法 trigger_method,
                                            //自定义方法 custom_script,
                                            //容器类方法 container_method)
                    executeScript:'',       //执行脚本 executeType = custom_script
                    executeContentUUID:'',  //执行积木的UUID executeType = trigger_method
                    executeContentMethodName:'',
                                            //执行积木的方法
                    containerMethodName:''  //容器方法 executeType = container_method
                }],
                layout:{                    //积木布局
                    sort:0,                 //排序 顺序排列布局下有效
                    bgColor:"",             //背景颜色
                    rotate:0,               //旋转
                    transparency:0,         //透明度
                    border:{                //边框
                        style:"",           //边框样式
                        color:"",           //边框颜色
                        size:"",            //边框尺寸
                        radius:"",          //边框弧度
                        margin:""           //边距
                    },
                    shadow:{                //阴影
                        color:"",           //阴影颜色
                        size:"",            //阴影大小
                        direction:'',       //阴影方向
                        vague:''            //阴影模糊
                    }
                }
            }]
        */
        content:{
          type:Array,
          default:function(){
            return [{                      //页面内容
                uuid:'1',
                alias:'bb-words',                   //积木别名
                aliasName:'a',               //中文名称
                group:'',                   //积木分组 表单项显示的位置
                attributes:{
                  value:"123123"
                },              //积木属性
                animation:[],
                interactives:[],
                layout:{                    //积木布局
                }
            }];
          }
        },
        contentDs:{
          type:Object
        }
    },
   data(){ 
        return{
            valueBase:this.value,
            realContent:this.content         
        }
      },
    render: function(createElement){
        const t = this;
        const bb = _TY_Tool.bbRender(t.realContent, createElement, t);
        const bbTpl = createElement('template',{slot:"tip"},[bb]);
        return createElement('van-submit-bar',{props:{
            "price":t.price,
            "label":t.label,
            "buttonText":t.buttonText,
            "buttonType":t.buttonType,
            "tip":t.tip,
            "disabled":t.disabled,
            "loading":t.loading,
            "currency":t.currency,
            "value":t.value
        },on:{
            submit:t.onSubmit
        }},[bbTpl]);
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

