<script>
    /**
     1. 特效
     2. 背景
     <canvas :value="{
    layoutObject:{
        uuid:'',
        title:'',                   //标题
        shell:true ,                //手机/PC外壳
        bgMusic:"",                 //背景音乐
        grid:{                      //网格配置
            switch:true|false,      //开关
            color:"",               //颜色
            reference:true|false,   //智能参考
            adsorbent:true|false    //自动吸附
        }
    },
    ds:["api-1","api-2"],           //数据源
    content:[{                      //页面内容
        uuid:'',
        alias:'',                   //积木别名
        aliasName:'',               //中文名称
        attributes:{},              //积木属性
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
        layout:{//积木布局
            display:"fixed block inline inline-block absolut none"  //展示类型
            bgColor:"",             //背景颜色
            rotate:0,               //旋转
            transparency:0,         //透明度
            zIndex:0,               //层级
            size:{width:0,height:0},//大小
            position:{x:0,y:0},     //位置
            border:{                //边框
                style:"",           //边框样式
                color:"",           //边框颜色
                size:"",            //边框尺寸
                radian:"",          //边框弧度
                margin:""           //边距
            },
            shadow:{                //阴影
                color:"",           //阴影颜色
                size:"",            //阴影大小
                direction:'',       //阴影方向
                vague:''            //阴影模糊
            },
            font:{                  //阴影
                family:"",           //阴影颜色
                size:"",            //阴影大小
                color:'',       //阴影方向
                align:''            //阴影模糊
            },
            
        }
    }]
}"></canvas>
     **/

    export default {
        name: 'bb-layout-canvas',
        props: {
            content: {
                type: Array,
                default: function () {
                    return [
                        { //页面内容
                            uuid: '111111',
                            alias: 'bb-count', //积木别名
                            aliasName: '', //中文名称
                            attributes: {
                                value: 100,
                                //defaultValTpl:'<%=route.query.param%>'
                                countConfig: {
                                    countType: 'count',
                                    buttonType: 'default',
                                    layout: 'horizontal',
                                    color: '#333',
                                    size: '14px',
                                    icon: 'ty-star-on',
                                    repeat: true
                                },
                            }, //积木属性
                            animation: [{ }],//动画
                            interactives: [{ //触发交互
                                uuid: '',
                                fromContentEvent: '', //触发积木的事件,fromContentUUID为当前content的UUID
                                executeType: '', //执行类型(预定义方法 trigger_method,
                                //自定义方法 custom_script,
                                //容器类方法 container_method)
                                executeScript: '', //执行脚本 executeType = custom_script
                                executeContentUUID: '', //执行积木的UUID executeType = trigger_method
                                executeContentMethodName: '',
                                //执行积木的方法
                                containerMethodName: '' //容器方法 executeType = container_method
                            }],
                            layout: { //积木布局
                                bgColor: "", //背景颜色
                                rotate: 0, //旋转
                                transparency: 1, //透明度
                                zIndex: 100, //层级
                                size: {
                                    width: 200,
                                    height: 200
                                }, //大小
                                position: {
                                    x: 200,
                                    y: 200
                                }, //位置
                                border: { //边框
                                    style: "", //边框样式
                                    color: "", //边框颜色
                                    size: "", //边框尺寸
                                    radian: "", //边框弧度
                                    margin: "" //边距
                                },
                                shadow: { //阴影
                                    color: "", //阴影颜色
                                    size: "", //阴影大小
                                    direction: '', //阴影方向
                                    vague: '' //阴影模糊
                                }
                            }
                        },
                        { //页面内容
                            uuid: '222',
                            alias: 'bb-text', //积木别名
                            aliasName: '', //中文名称
                            attributes: {
                                value: 'bb-text',
                                //defaultValTpl:'<%=route.query.param%>'
                                styleConfig: {
                                    fontFamily: '',
                                    fontSize: '',
                                    fontColor: '',
                                    bload: true,  // 字体加粗
                                    italic: true, // 字体倾斜
                                    lingHeight: 20,   // 行高
                                    'letter-spacing': 3  // 字体间距
                                }
                            }, //积木属性
                            animation: [{ }],//动画
                            interactives: [{ //触发交互
                                uuid: '',
                                fromContentEvent: '', //触发积木的事件,fromContentUUID为当前content的UUID
                                executeType: '', //执行类型(预定义方法 trigger_method,
                                //自定义方法 custom_script,
                                //容器类方法 container_method)
                                executeScript: '', //执行脚本 executeType = custom_script
                                executeContentUUID: '', //执行积木的UUID executeType = trigger_method
                                executeContentMethodName: '',
                                //执行积木的方法
                                containerMethodName: '' //容器方法 executeType = container_method
                            }],
                            layout: { //积木布局
                                bgColor: "", //背景颜色
                                rotate: 0, //旋转
                                transparency: 1, //透明度
                                zIndex: 100, //层级
                                size: {
                                    width: 200,
                                    height: 200
                                }, //大小
                                position: {
                                    x: 500,
                                    y: 200
                                }, //位置
                                border: { //边框
                                    style: "", //边框样式
                                    color: "", //边框颜色
                                    size: "", //边框尺寸
                                    radian: "", //边框弧度
                                    margin: "" //边距
                                },
                                shadow: { //阴影
                                    color: "", //阴影颜色
                                    size: "", //阴影大小
                                    direction: '', //阴影方向
                                    vague: '' //阴影模糊
                                }
                            }
                        }
                    ]
                }
            }
        },
        data() {
            return {}
        },
        render: function (createElement) {
            const el = this;
            const bbList = _TY_Tool.bbCanvasRender(this.content, createElement, this);

            return createElement('div', {}, bbList);
        },
        methods: {
            loadChildBB(){
                let t=this;
                return _TY_Tool.loadChildBB(t);                
            },

            // clickHandler(e) {
            //     window.stop();
            // }
        }
    }
</script>
<style scoped>

</style>