<script>
import Popup from 'vant/lib/popup';
import 'vant/lib/popup/style';

    export default {
        name: 'bb-vant-popup',
        components: {
          "van-popup":Popup,
        },
        props: {
            //当前组件是否显示
            show:{
                type:Boolean,
                default:false
            },
            /*其他属性扩展
                overlay:true, //显示背景蒙层
                lock-scroll:true, 是否锁定背景滚动    Boolean true
                position:'top',    可选值为 top bottom right left  String  -
                overlay-class:'',   自定义蒙层 class String  ``
                overlay-style:{},   自定义蒙层样式 Object  ``
                close-on-click-overlay:true,  点击蒙层是否关闭 Popup  Boolean true
                transition:'popup-slide',  transition 名称   String  popup-slide
                lazy-render:true, 是否在首次显示弹层时才渲染 DOM 节点    Boolean true
                get-container:'function(){}'   指定弹出层挂载的 HTML 节点
            */
            option:{
                type:Object,
                default:function(){
                    return {
                        'overlay':true,
                        'lock-scroll':true,
                        'position':'bottom',
                        'overlay-class':'',
                        'overlay-style':{},
                        'close-on-click-overlay':true,
                        'transition':'popup-slide',
                        'lazy-render':true,
                        'get-container':'function(){}'
                    };
                }
            },
            /*静态内容
                content:[{                      //页面内容
                        uuid:'',
                        alias:'',                   //积木别名 
                        aliasName:'',               //中文名称 
                        group:'',                   //积木分组 对应slot  header main footer
                        attributes:{
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
            /*动态数据源*/
            contentDs:{
                type:Object
            }
        },
        data() {
            return {
                valueBase:this.show,
                realContent:this.content
            };
        },
        render: function (createElement) {
            const t = this;
            //当可以渲染的时候才能渲染
            const popupContent = _TY_Tool.bbRender(t.realContent, createElement, t);
            return createElement('van-popup',{
                props:{
                    'value':t.valueBase,
                    'overlay':t.option['overlay'],
                    'lock-scroll':t.option['lock-scroll'],
                    'position':t.option['position'],
                    'overlay-class':t.option['overlay-class'],
                    'overlay-style':t.option['overlay-style'],
                    'close-on-click-overlay':t.option['close-on-click-overlay'],
                    'transition':t.option['transition'],
                    'lazy-render':t.option['lazy-render'],
                    //'get-container':eval("("+t.option['get-container']+")")
                },
                on:{'click-overlay':t.clickOverlay}
            },[popupContent]);
        },
        mounted(){
            const t = this;
            t.getData();
        },
        //事件change
        methods: {
            //蒙层点击事件
            clickOverlay(param){
                this.$emit('click',param);
                this.showOrHide();
            },
            //动态获取tab内容
            getData(){
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
            //显示或者隐藏弹窗
            showOrHide(){
                this.valueBase = !this.valueBase;
            },
            //显示弹窗
            showPopup(){
                this.valueBase = true;
                this.$emit('show');
            },
            //影藏弹窗
            hidePopup(){
                this.valueBase = false;
                this.$emit('hide');
            },
        }
    }
</script>

<style scoped>
</style>