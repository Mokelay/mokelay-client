<template>
    <div class="bb-layout-canvas">
        <div ref="canvasItem" class="canvas" v-for="canvasItem in canvasItems"
             v-bind:style="{left: canvasItem.layout.position.x + 'px', top: canvasItem.layout.position.y + 'px'}">

            <bb-canvas-template :content="canvasItem" ref="canvasItem.uuid + '-canvas'"></bb-canvas-template>

            <!--<div v-drag="direction" id="drag" :data-uuid="canvasItem.uuid" class="operate operate-size"-->
            <!--v-bind:style="{left: canvasItem.layout.position.x + 'px', top: canvasItem.layout.position.y + 'px', width: canvasItem.layout.size.width + 'px', height: canvasItem.layout.size.height + 'px'}">-->

            <!--<div class="border-line"></div>-->
            <!--<div class="border-line dashed"></div>-->
            <!--<div class="dot scale-e dot-e"></div>-->
            <!--<div class="dot scale-w dot-w"></div>-->
            <!--</div>-->

            <div v-drag="direction" id="drag" :data-uuid="canvasItem.uuid" class="operate operate-size"
                 v-bind:style="{left: canvasItem.layout.position.x + 'px', top: canvasItem.layout.position.y + 'px', width: canvasItem.layout.size.width + 'px', height: canvasItem.layout.size.height + 'px'}">
                <div class="rotate-btn">
                    <span class="icon-xuanzhuang-css danyeeditor-replay"></span>
                </div>
                <div class="border-line"></div>
                <div class="border-line dashed"></div>
                <div class="dot scale-nw dot-nw"></div>
                <div class="dot scale-n dot-n"></div>
                <div class="dot scale-ne dot-ne"></div>
                <div class="dot scale-e dot-e"></div>
                <div class="dot scale-se dot-se"></div>
                <div class="dot scale-s dot-s"></div>
                <div class="dot scale-sw dot-sw"></div>
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
    import '../css/iconfont/rotatefont.css';

    Vue.directive('drag', {
            bind: function (el, binding) {
                let oDiv = el;   //当前元素
                let self = this;  //上下文
                oDiv.onmousedown = function (e) {
                    // 鼠标按下，计算当前元素距离可视区的距离
                    let disX = e.clientX - oDiv.offsetLeft;
                    let disY = e.clientY - oDiv.offsetTop;

                    document.onmousemove = function (e) {
                        // 通过事件委托，计算移动的距离
                        let left = e.clientX - disX;
                        let top = e.clientY - disY;
                        // 移动当前元素
                        oDiv.style.left = left + 'px';
                        oDiv.style.top = top + 'px';
                        // 将此时的位置传出去
//                        binding.value({x: e.pageX, y: e.pageY})

                        binding.value({x: left, y: top, uuid: el.getAttribute('data-uuid')})

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
                type: Array,
                default: function () {
                    return [
                        {
                            uuid: 'footer',
                            alias: 'bb-words',
                            aliasName: '',
                            group: 'footer',
                            attributes: {
                                value: 'Footer',
                                textAlign: 'center',
                                lineHeight: '60px',
                                width: '100px',
                                height: '100px'
                            },
                            animation: [],
                            interactives: [],
                            layout: {
                                bgColor: "",             //背景颜色
                                rotate: 0,               //旋转
                                transparency: 1,         //透明度
                                zIndex: 0,               //层级
                                size: {width: 100, height: 100},//大小
                                position: {x: 300, y: 300},     //位置
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
                        },
                        {
                            uuid: 'leftAside',
                            alias: 'bb-words',
                            group: 'leftAside',
                            aliasName: '',
                            attributes: {value: 'LeftAside', textAlign: 'center', lineHeight: '60px'},
                            animation: [],
                            interactives: [],
                            layout: {
                                bgColor: "",             //背景颜色
                                rotate: 0,               //旋转
                                transparency: 1,         //透明度
                                zIndex: 0,               //层级
                                size: {width: 200, height: 200},//大小
                                position: {x: 500, y: 200},     //位置
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
                canvasItems: [],
                contentValue: this.content
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

                this.canvasItems.forEach((item, key) => {
                    if (item.uuid === val.uuid) {
                        item.layout.position = {x: val.x, y: val.y};
                    }
                });

                console.log(this.canvasItems);
            }
        }
    }
</script>
<style scoped>
    /*.canvas {*/
    /*position: absolute;*/
    /*}*/

    /*.operate {*/
    /*position: absolute;*/
    /*cursor: pointer;*/
    /*z-index: 99;*/
    /*-webkit-transform-origin: center center;*/
    /*transform-origin: center center;*/
    /*pointer-events: auto;*/
    /*}*/

    /*.operate-size {*/
    /*transform: rotate(0deg);*/
    /*}*/

    /*.border-line {*/
    /*position: absolute;*/
    /*box-sizing: content-box;*/
    /*width: 100%;*/
    /*height: 100%;*/
    /*margin: -1px 0 0 -1px;*/
    /*border: 1px solid #fff;*/
    /*}*/

    /*.dashed {*/
    /*border: 1px dashed #000;*/
    /*}*/

    /*.scale-e {*/
    /*cursor: e-resize;*/
    /*}*/

    /*.scale-w {*/
    /*cursor: w-resize;*/
    /*}*/

    /*.dot {*/
    /*position: absolute;*/
    /*background-color: #fff;*/
    /*width: 5px;*/
    /*height: 5px;*/
    /*border: 1px solid #4a4a4a;*/
    /*}*/

    /*.dot-e {*/
    /*top: 50%;*/
    /*right: -4px;*/
    /*margin-top: -4px;*/
    /*}*/

    /*.dot-w {*/
    /*top: 50%;*/
    /*left: -4px;*/
    /*margin-top: -4px;*/
    /*}*/

    .operate {
        position: absolute;
        cursor: pointer;
        z-index: 99;
        -webkit-transform-origin: center center;
        transform-origin: center center;
        pointer-events: auto;
    }

    .operate.hover:hover,
    .operate.multi-selected {
        outline: 1px solid rgba(0, 0, 0, 0.5);
    }

    .operate .operate-mask {
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        position: absolute;
        z-index: 1;
        left: 0;
        top: 0;
    }

    .operate .operate-mask .mask-group {
        position: absolute;
        top: 50%;
        left: 50%;
        -webkit-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
        width: 100%;
        text-align: center;
    }

    .operate .operate-mask .mask-group .mask-text {
        color: #fff;
        font-size: 0.625rem;
        margin-bottom: 0.46875rem;
    }

    .operate .operate-mask .mask-group button {
        cursor: pointer;
        outline: none;
        border: none;
        background-color: #18ccc0;
        color: #fff;
        font-size: 0.4375rem;
        height: 0.9375rem;
        line-height: 0.9375rem;
        width: 2.78125rem;
    }

    .operate .rotate-btn {
        position: absolute;
        top: -30px;
        left: 50%;
        width: 22px;
        height: 22px;
        margin-left: -11px;
        cursor: pointer;
        border-radius: 50%;
        background-color: #000;
    }

    .operate .rotate-btn .icon-xuanzhuang-css {
        position: absolute;
        left: 50%;
        font-size: 12px;
        top: 50%;
        -webkit-transform: translate3d(-50%, -50%, 0);
        transform: translate3d(-50%, -50%, 0);
        color: #fff;
    }

    .operate .border-line {
        position: absolute;
        box-sizing: content-box;
        width: 100%;
        height: 100%;
        margin: -1px 0 0 -1px;
        border: 1px solid #fff;
    }

    .operate .border-line.dashed {
        border: 1px dashed #000;
    }

    .operate .dot {
        position: absolute;
        background-color: #fff;
        width: 5px;
        height: 5px;
        border: 1px solid #4a4a4a;
    }

    .operate .dot.dot-sw,
    .operate .dot.dot-se,
    .operate .dot.dot-nw,
    .operate .dot.dot-ne {
        width: 9px;
        height: 9px;
        border-radius: 50%;
    }

    .operate .dot-nw {
        top: -5px;
        left: -5px;
    }

    .operate .dot-ne {
        top: -5px;
        right: -5px;
    }

    .operate .dot-sw {
        bottom: -5px;
        left: -5px;
    }

    .operate .dot-se {
        bottom: -5px;
        right: -5px;
    }

    .operate .dot-n {
        left: 50%;
        top: -4px;
        margin-left: -4px;
    }

    .operate .dot-e {
        top: 50%;
        right: -4px;
        margin-top: -4px;
    }

    .operate .dot-s {
        bottom: -4px;
        left: 50%;
        margin-left: -4px;
    }

    .operate .dot-w {
        top: 50%;
        left: -4px;
        margin-top: -4px;
    }

    .operate .scale-nw {
        cursor: nw-resize;
    }

    .operate .scale-n {
        cursor: n-resize;
    }

    .operate .scale-ne {
        cursor: ne-resize;
    }

    .operate .scale-e {
        cursor: e-resize;
    }

    .operate .scale-se {
        cursor: se-resize;
    }

    .operate .scale-s {
        cursor: s-resize;
    }

    .operate .scale-w {
        cursor: w-resize;
    }

    .operate .scale-sw {
        cursor: sw-resize;
    }
</style>