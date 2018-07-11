<template>
    <div class="bb-vant-cell-picker">
        <bb-vant-cell @click="showPopup" :value="valueBase" :option="option" :content="content" :contentDs="contentDs"></bb-vant-cell>
        <van-popup v-model="pickerShow" position="bottom" @click-overlay="onCancel">
            <van-picker
              :show-toolbar="pickerConfig.showToolbar||true"
              :title="pickerConfig.title||''"
              :columns="pickerConfig.columns||[]"
              @cancel="onCancel"
              @confirm="onConfirm"
            />
        </van-popup>
    </div>
</template>
<script>
import Popup from 'vant/lib/popup';
import 'vant/lib/popup/style';
import Picker from 'vant/lib/picker';
import 'vant/lib/picker/style';
import Cell from 'vant/lib/cell';
import 'vant/lib/cell/style';

    export default {
        name: 'bb-vant-cell-picker',
        components: {
          "van-cell":Cell,
          "van-popup":Popup,
          "van-picker":Picker
        },
        props: {
            //内容
            value:{
                type:[Number,String]
            },
            /*模板默认值*/
            defaultValTpl:{
                type:[String,Number,Boolean]
            },
            /*选择器属性
                showToolbar:true //显示头部
              title:"标题"
              columns:
                单级['杭州', '宁波', '温州', '嘉兴', '湖州']
                多级[
                    {
                        values: Object.keys(citys),
                        className: 'column1'
                    },
                    {
                        values: citys['浙江'],
                        className: 'column2',
                        defaultIndex: 2
                    }
                ]
            */
            pickerConfig:{
                type:Object,
                default:function(){
                    return {};
                }
            },
            /*其他属性配置
                {
                    icon:String 左侧图标,
                    title:String 左侧标题,
                    label:String 标题下方的描述信息,
                    required:Boolean 是否显示表单必填星号,
                    isLink:Boolean 展示右侧箭头并开启点击反馈
                    center:Boolean 使内容垂直居中
                    url:""  跳转链接
                    clickable:Boolean 开启点击反馈
                 }
            */
            option:{
                type:Object,
                default:function(){
                    return {}
                }

            },
            /*
            content:积木数据,
                content:[{                      //页面内容
                        uuid:'',
                        alias:'',                   //积木别名
                        aliasName:'',               //中文名称
                        group:'',                   //对应slot  空 对应 内容 icon  自定义icon  title   自定义title  right-icon  自定义右侧按钮，默认是arrow

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

            },
            //动态内容
            contentDs:{
                type:Object
            }
        },
        data() {
            return {
                valueBase:this.value,
                pickerShow:false
            };
        },
        watch:{
            value(val){
                const t = this;
                if(t.pickerConfig.columns){
                   t.pickerConfig.columns.forEach((ele,key)=>{
                        t.valueBase = ele.value == val?ele.text:t.valueBase;
                   });
                }
            }
        },
        mounted(){
            const t = this;
            if(t.pickerConfig.columns){
               t.pickerConfig.columns.forEach((ele,key)=>{
                    t.valueBase = ele.value == t.value?ele.text:t.valueBase;
               });
            }
        },
        //事件click
        methods: {
            onConfirm(value, index) {
                this.valueBase = value.text;
                this.$emit("input",value.value);
                this.$emit("change",value.value);
                this.pickerShow = false;
            },
            onCancel() {
                this.pickerShow = false;
            },
            showPopup(){
                this.pickerShow = true;
            }
}
    }
</script>

<style scoped>
    .bb-vant-cell-picker{
        font-size: 0.5rem;
    }
</style>