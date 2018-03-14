<template>
    <div class="bb-layout-canvas">
        <div v-drag="direction" id="drag" class="canvas" v-for="canvasItem in canvasItems"
             v-bind:style="{left: canvasItem.layout.position.x + 'px', top: canvasItem.layout.position.y + 'px'}">

            <bb-canvas-template :content="canvasItem"></bb-canvas-template>

            <div class="operate operate-size"
                 v-bind:style="{width: canvasItem.layout.size.width + 'px', height: canvasItem.layout.size.height + 'px'}">

                <div class="border-line"></div>
                <div class="border-line dashed"></div>
                <div class="dot scale-e dot-e"></div>
                <div class="dot scale-w dot-w"></div>
            </div>
        </div>
    </div>
</template>
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
        layout:{                    //积木布局
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
            }
        }
    }]
}"></canvas>
     **/

    import Vue from 'vue';

    Vue.directive('drag', {
            bind: function (el, binding) {
                let oDiv = el;   //当前元素
                let self = this;  //上下文
                oDiv.onmousedown = function (e) {
                    //鼠标按下，计算当前元素距离可视区的距离
                    let disX = e.clientX - oDiv.offsetLeft;
                    let disY = e.clientY - oDiv.offsetTop;

                    document.onmousemove = function (e) {
                        //通过事件委托，计算移动的距离
                        let l = e.clientX - disX;
                        let t = e.clientY - disY;
                        //移动当前元素
                        oDiv.style.left = l + 'px';
                        oDiv.style.top = t + 'px';
                        //将此时的位置传出去
                        binding.value({x: e.pageX, y: e.pageY})
                    };
                    document.onmouseup = function (e) {

                        document.onmousemove = null;
                        document.onmouseup = null;
                    };
                };
            }
        }
    );

    export default {
        name: 'bb-layout-canvas',
        props: {
//            layoutObject: {
//                type: Object,
//                default: function () {
//                    return {
//                        uuid: '',
//                        title: '',                   //标题
//                        shell: true,                //手机/PC外壳
//                        bgMusic: "",                 //背景音乐
//                        type: 'h-l-m-r',
//                        bgColor: {
//                            header: "#B3C0D1",
//                            leftAside: "#D3DCE6",
//                            main: "#E9EEF3",
//                            rightAside: "#D3DCE6",
//                            footer: "#B3C0D1"
//                        }
//                    }
//                }
//            },
//            ds: {
//                type: Array,
//                default: function () {
//                    return []
//                }
//            },
            content: {
                type: [Array, String],
                default: function () {
                    return [
                        {
                            uuid: 'footer',
                            alias: 'bb-words',
                            aliasName: '',
                            group: 'footer',
                            attributes: {value: 'Footer', textAlign: 'center', lineHeight: '60px'},
                            animation: [],
                            interactives: [],
                            layout: {
                                bgColor: "",             //背景颜色
                                rotate: 0,               //旋转
                                transparency: 0,         //透明度
                                zIndex: 0,               //层级
                                size: {width: 0, height: 0},//大小
                                position: {x: 0, y: 0},     //位置
                                border: {                //边框
                                    style: "",           //边框样式
                                    color: "",           //边框颜色
                                    size: "",            //边框尺寸
                                    radian: "",          //边框弧度
                                    margin: ""           //边距
                                },
                                shadow: {                //阴影
                                    color: "",           //阴影颜色
                                    size: "",            //阴影大小
                                    direction: '',       //阴影方向
                                    vague: ''            //阴影模糊
                                }
                            }
                        }
                    ]
                }
            }
        },
        data() {
            return {
                canvasItems: []
            }
        },
        created: function () {
            this.setData();
        },
        methods: {
            setData: function () {
                if (this.content) {
                    this.canvasItems = this.canvasItems.concat(this.content);
                }
            },
            direction(val){
                console.log(val);
            }
        }
    }
</script>
<style scoped>
    .canvas {
        position: absolute;
    }

    .operate {
        position: absolute;
        cursor: pointer;
        z-index: 99;
        -webkit-transform-origin: center center;
        transform-origin: center center;
        pointer-events: auto;
    }

    .operate-size {
        transform: rotate(0deg);
    }

    .border-line {
        position: absolute;
        box-sizing: content-box;
        width: 100%;
        height: 100%;
        margin: -1px 0 0 -1px;
        border: 1px solid #fff;
    }

    .dashed {
        border: 1px dashed #000;
    }

    .scale-e {
        cursor: e-resize;
    }

    .scale-w {
        cursor: w-resize;
    }

    .dot {
        position: absolute;
        background-color: #fff;
        width: 5px;
        height: 5px;
        border: 1px solid #4a4a4a;
    }

    .dot-e {
        top: 50%;
        right: -4px;
        margin-top: -4px;
    }

    .dot-w {
        top: 50%;
        left: -4px;
        margin-top: -4px;
    }
</style>