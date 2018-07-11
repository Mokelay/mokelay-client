<script>
import CellSwipe from 'vant/lib/cell-swipe';
import 'vant/lib/cell-swipe/style';

    export default {
        name: 'bb-vant-cell-swipe',
        components: {
          "van-cell-swipe":CellSwipe,
        },
        props: {
            //左侧滑动区域宽度
            leftWidth:{
                type:Number,
                default:65
            },
            //右侧滑动区域宽度
            rightWidth:{
                type:Number,
                default:65
            },
            /*
            content:积木数据,
                content:[{                      //页面内容
                        uuid:'',
                        alias:'',                   //积木别名
                        aliasName:'',               //中文名称
                        group:'',                   //对应slot
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
                type:Array
            },
            //动态模板
            contentDs:{
                type:Object
            }
        },
        data() {
            return {
                valueBase:this.value,
                realContent:this.content || []
            };
        },
        render: function(createElement){
            const t = this;
            const children = [];
            if(t.realContent){
                t.realContent.forEach((ele,key)=>{
                    const child = _TY_Tool.bbRender([ele], createElement, t);
                    if(ele.group == "left" || ele.group == "right"){
                        const outside = createElement('template',{slot:ele.group},[child]);
                        children.push(outside);
                    }else{
                        children.push(child);
                    }
                });
            }
            return createElement('van-cell-swipe',{props:{
                "right-width":t.rightWidth,
                "left-width":t.leftWidth,
                "on-close":t.onClose
            }},[children,t.$slots.default]);
        },
        mounted(){

        },
        //事件click
        methods: {
            //动态获swipe内容
            getAreaList(){
                const t = this;
                if (t.contentDs) {
                    t.loading = true;
                    _TY_Tool.getDSData(t.contentDs, _TY_Tool.buildTplParams(t), function (data) {
                        data.forEach((item) => {
                            t.loading = false;
                            const {dataKey, value} = item;
                            t.realContent = value;
                        });
                    }, function (code, msg) {
                        t.loading = false;
                    });
                }
            },
            onClose(clickPosition, instance) {
                // left right cell outside
                this.instance = instance;
                this.$emit(clickPosition,instance);
            }
        }
    }
</script>

<style lang="less">

</style>