<template>
    <div class="bb-layout-canvas">
        <div class="bg-canvas">
            <div class="canvas" v-for="(canvasItem,key) in canvasItems">
                <div>
                    <bb-layout-canvas :content="[canvasItem]"></bb-layout-canvas>
                </div>
                <div @click="checkDrag(canvasItem.uuid)" class="operate operate-size"
                    v-bind:style="{transform: 'rotate(' + canvasItem.layout.rotate + 'deg)', left: canvasItem.layout.position.x + 'px', top: canvasItem.layout.position.y + 'px', width: canvasItem.layout.size.width + 'px', height: canvasItem.layout.size.height + 'px'}">

                    <div class="border-line"></div>
                    <div v-show="canvasItem.isShow">
                        <div class="rotate-btn" id="dragRotate" :data-x="0" :data-y="0" :data-uuid="canvasItem.uuid" v-dragRotate="directionRotate">
                            <span class="icon-xuanzhuang-css danyeeditor-replay"></span>
                        </div>
                        <div class="remove" @click="remove(key)"><i class="ty-icon_lajitong"></i></div>
                        <div class="border-line dashed" :data-uuid="canvasItem.uuid" v-drag="direction" id="drag"></div>

                        <!-- <div class="dot scale-nw dot-nw"></div> -->
                        <div class="dot scale-n dot-n" id="dragTop" :data-uuid="canvasItem.uuid" v-dragTop="directionTop"></div>

                        <!-- <div class="dot scale-ne dot-ne"></div> -->
                        <div class="dot scale-e dot-e" id="dragRight" :data-uuid="canvasItem.uuid" v-dragRight="directionRight"></div>

                        <!-- <div class="dot scale-se dot-se"></div> -->
                        <div class="dot scale-s dot-s" id="dragBottom" :data-uuid="canvasItem.uuid" v-dragBottom="directionBottom"></div>

                        <!-- <div class="dot scale-sw dot-sw"></div> -->
                        <div class="dot scale-w dot-w" id="dragLeft" :data-uuid="canvasItem.uuid" v-dragLeft="directionLeft"></div>
                    </div>
                </div>
            </div>
            
        </div>
        <div class="menu" :style="{ left: menuRight + 'px' }">
            <div class="menu-box">
                <div class="cexiao danyeeditor-undo">
                    <span>撤销</span>
                </div>
                <div class="chongzuo danyeeditor-redo">
                    <span>重做</span>
                </div>
            </div>
            <div class="menu-box">
                <div @click="previewCanvas" class="play danyeeditor-eye">
                    <span>预览</span>
                </div>
                <div class="wangge danyeeditor-wangge">
                    <span>网格</span>
                </div>
                <div class="xifu danyeeditor-xifu active">
                    <span>吸附</span>
                </div>
            </div>
            <div class="menu-psd">Ps</div>
        </div>
        <el-dialog
            width="414px"
            height="736px"
            top="20px"
            :close-on-click-modal="false"
            :visible.sync="isShowDialog">

            <div class="canvas" v-for="(canvasItem,key) in canvasItems">
                <bb-layout-canvas :content="[canvasItem]"></bb-layout-canvas>
            </div>

        </el-dialog>
    </div>
</template>
<script>

    import Vue from 'vue';
    import '../css/iconfont/rotatefont.css';

    Vue.directive('dragRotate', {
            bind: function (el, binding) {
                let rotateX = 0;
                let rotateY = 0;
                let rotate = 0;
                let result = false;
                let direaction = '';
                let currentX = 0;
                let currentY = 0;
                el.onmousedown = function (e) {
                    result = true;
                    currentX = el.getAttribute('data-x');
                    currentY = el.getAttribute('data-y');

                    if (currentX != '0' && currentY != '0') {
                        rotateX = currentX;
                        rotateY = currentY;
                    } else {
                        rotateX = e.pageX;
                        rotateY = e.pageY;
                        el.setAttribute('data-x', rotateX);
                        el.setAttribute('data-y', rotateY);
                    }

                    document.onmousemove = function (e) {
                        
                        rotate = Math.ceil(Math.atan2(e.clientX - rotateX, rotateY - e.clientY) / Math.PI * 180);
                        
                        console.log(rotate);

                        binding.value({rotate: rotate, uuid: el.getAttribute('data-uuid')});
                    };
                   
                    document.onmouseup = function (e) {
                        direaction = '';
                        document.onmousemove = null;
                        document.onmouseup = null;
                    };
                };
            }
        }
    );

    Vue.directive('dragTop', {
            bind: function (el, binding) {
                let oDiv = el;   //当前元素
                let self = this;  //上下文
                oDiv.onmousedown = function (e) {
                    // let contentHeight = document.getElementsByClassName('wy-content-height')[0].offsetHeight;
                    let top = oDiv.offsetParent.offsetTop;
                    let disY = e.clientY - oDiv.offsetParent.offsetTop;
                    let size = oDiv.offsetParent.offsetHeight;

                    document.onmousemove = function (e) {
                        // 通过事件委托，计算移动的距离
                        let moveAfterTop = e.clientY - disY;
                        let height = size + (top - moveAfterTop);
                    
                        oDiv.offsetParent.style.height = height + 'px';
                        oDiv.offsetParent.style.top = moveAfterTop + 'px';

                        binding.value({y: moveAfterTop, height: height, uuid: el.getAttribute('data-uuid')})
                    };
                   
                    document.onmouseup = function (e) {

                        document.onmousemove = null;
                        document.onmouseup = null;
                    };
                };
            }
        }
    );
        
    Vue.directive('dragBottom', {
            bind: function (el, binding) {
                let oDiv = el;   //当前元素
                let self = this;  //上下文
                oDiv.onmousedown = function (e) {
                    let top = oDiv.offsetParent.offsetTop;
                    let disY = e.clientY - oDiv.offsetParent.offsetTop;
                    let disY1 = oDiv.offsetParent.offsetHeight;

                    document.onmousemove = function (e) {
                        let height = e.clientY - disY + disY1 - top;

                        oDiv.offsetParent.style.height = height + 'px';
                        
                        binding.value({height: height, uuid: el.getAttribute('data-uuid')})
                    };
                   
                    document.onmouseup = function (e) {

                        document.onmousemove = null;
                        document.onmouseup = null;
                    };
                };
            }
        }
    );

    Vue.directive('dragLeft', {
            bind: function (el, binding) {
                let oDiv = el;   //当前元素
                let self = this;  //上下文
                oDiv.onmousedown = function (e) {
                    let left = oDiv.offsetParent.offsetLeft;
                    let disX = e.clientX - oDiv.offsetParent.offsetLeft;
                    let size = oDiv.offsetParent.offsetWidth;

                    document.onmousemove = function (e) {
                        // 通过事件委托，计算移动的距离
                        let moveAfterLeft = e.clientX - disX;
                        let width = size + (left - moveAfterLeft);
                    
                        oDiv.offsetParent.style.width = width + 'px';
                        oDiv.offsetParent.style.left = moveAfterLeft + 'px';

                        binding.value({x: moveAfterLeft, width: width, uuid: el.getAttribute('data-uuid')})
                    };
                   
                    document.onmouseup = function (e) {

                        document.onmousemove = null;
                        document.onmouseup = null;
                    };
                };
            }
        }
    );

    Vue.directive('dragRight', {
            bind: function (el, binding) {
                let oDiv = el;   //当前元素
                let self = this;  //上下文
                oDiv.onmousedown = function (e) {
                    let left = oDiv.offsetParent.offsetLeft;
                    let disX = e.clientX - oDiv.offsetParent.offsetLeft;
                    let disX1 = oDiv.offsetParent.offsetWidth;

                    document.onmousemove = function (e) {
                        let width = e.clientX - disX + disX1 - left;

                        oDiv.offsetParent.style.width = width + 'px';
                        
                        binding.value({width: width, uuid: el.getAttribute('data-uuid')})
                    };
                   
                    document.onmouseup = function (e) {

                        document.onmousemove = null;
                        document.onmouseup = null;
                    };
                };
            }
        }
    );

    Vue.directive('drag', {
            bind: function (el, binding) {
                let oDiv = el;   //当前元素
                let self = this;  //上下文
                oDiv.onmousedown = function (e) {
                    // 鼠标按下，计算当前元素距离可视区的距离
                    let disX = e.clientX - oDiv.offsetParent.offsetLeft;
                    let disY = e.clientY - oDiv.offsetParent.offsetTop;

                    document.onmousemove = function (e) {
                        // 通过事件委托，计算移动的距离
                        let left = e.clientX - disX;
                        let top = e.clientY - disY;
                        
                        oDiv.offsetParent.style.left = left + 'px';
                        oDiv.offsetParent.style.top = top + 'px';

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
        name: 'bb-layout-canvas-edit',
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
                                    width: 100,
                                    height: 100
                                }, //大小
                                position: {
                                    x: 100,
                                    y: 100
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
                isShowDialog: false,
                menuRight: 0,
                canvasItems: []
            }
        },
        created: function () {
            this.setData();
        },
        watch:{
            content(val){
                this.setData();
            }
        },
        methods: {
            checkDom: function () {
                if (this.content.length && this.content.length && this.content[this.content.length - 1].layout) {
                    this.canvasItems = [].concat(this.content);
                }
            },
            
            setData(){
                
                if (this.canvasItems.length) {
                    this.canvasItems.forEach((con, key) => {
                        if (key === (this.canvasItems.length - 1)) {
                            this.content[this.content.length - 1].isShow = true;
                            this.$emit('onFocus',con, key);
                        } else {
                            con.isShow = false;
                        }
                    });
                } else {
                    this.content[this.content.length - 1].isShow = true;
                }
                    
                this.checkDom();
            },

            directionRotate(val){

                this.canvasItems.forEach((con, key) => {
                    if (con.uuid === val.uuid) {
                        con.layout.rotate = val.rotate;
                    }
                });
            },

            directionTop(val){
                
                this.canvasItems.forEach((con, key) => {
                    if (con.uuid === val.uuid) {
                        con.layout.size.height = val.height;
                        con.layout.position.y = val.y;
                    }
                });
            },

            directionBottom(val){
                
                this.canvasItems.forEach((con, key) => {
                    if (con.uuid === val.uuid) {
                        con.layout.size.height = val.height;
                    }
                });
            },

            directionLeft(val){
                
                this.canvasItems.forEach((con, key) => {
                    if (con.uuid === val.uuid) {
                        con.layout.size.width = val.width;
                        con.layout.position.x = val.x;
                    }
                });
            },
            
            directionRight(val){
                console.log(val);

                this.canvasItems.forEach((con, key) => {
                    if (con.uuid === val.uuid) {
                        con.layout.size.width = val.width;
                    }
                });
            },
            direction(val){
                console.log(val);

                this.canvasItems.forEach((item, key) => {
                    if (item.uuid === val.uuid) {
                        item.isShow = true;
                        item.layout.position = {x: val.x, y: val.y};
                    } else {
                        item.isShow = false;
                    }
                });
            },
            checkDrag(uuid){

                this.canvasItems.forEach((item, key) => {
                    if (item.uuid === uuid) {
                        item.isShow = true;
                    } else {
                        item.isShow = false;
                    }
                });
            },
            //删除积木
            remove(index){
                const t = this;
                t.$confirm('确认操作?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    t.canvasItems.splice(index, 1);
                    t.$emit('remove',t.canvasItems[index]);
                    t.$emit('change',t.canvasItems);
                }).catch(() => {
                    t.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });

            },

            previewCanvas() {
                this.isShowDialog = !this.isShowDialog
            }
        },
        mounted() {
            const el = this;
            const bgCanvas = document.getElementsByClassName('bg-canvas')[0];
            let offLeft = bgCanvas.offsetLeft;
            let menuWidth = bgCanvas.clientWidth;

            el.menuRight = offLeft + menuWidth + 20;

            window.onresize = function() {
                offLeft = bgCanvas.offsetLeft;
                menuWidth = bgCanvas.clientWidth;
                el.menuRight = offLeft + menuWidth + 20;
            };
        }
    }
</script>
<style lang="less">

    .el-main {
        padding: 0 !important;
    }

    .bb-layout-canvas .el-dialog {
        height: 736px !important;
    }
</style>
<style lang="less">

    .bb-layout-canvas {
        background: #efefef;
    }

    .bb-layout-canvas .el-dialog__wrapper.el-dialog {
        margin-left: -10px !important;
        height: 100% !important;
    }

    .bg-canvas {
        background-image: none;
        background-size: 451.905px;
        background-color: rgb(255, 255, 255);
        background-repeat: no-repeat;
        background-position: 0px 0px;
        opacity: 1;
        position: relative;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        width: 414px;
        height: 736px;
        margin: 0 auto;
        box-shadow: 0px 2px 10px 0px rgba(0,0,0,0.2);
    }

    .operate {
        position: absolute;
        cursor: pointer;
        z-index: 99;
        -webkit-transform-origin: center center;
        transform-origin: center center;
        pointer-events: auto;
        min-height: 40px;
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

    .keyboard-help {
        height: 100%;
        position: fixed;
        font-size: 20px;
        z-index: 10000000;
    }
    .keyboard-help .stretch-transition {
        -webkit-transition: height 0.3s ease;
        transition: height 0.3s ease;
    }
    .keyboard-help .stretch-transition.stretch-enter,
    .keyboard-help .stretch-transition.stretch-leave {
        height: 0 !important;
        overflow: hidden;
    }
    .keyboard-help .icon-wrap {
        width: 100%;
        text-align: center;
        margin-bottom: 10px;
    }
    .keyboard-help .icon-wrap .icon {
        -webkit-transform: scale(1.5);
            transform: scale(1.5);
    }
    .keyboard-help .icon {
        width: 20px;
        height: 20px;
        fill: #fff;
    }
    .keyboard-help .help-modal {
        position: absolute;
        border-radius: 3px;
        bottom: 100px;
        left: 50px;
        width: 360px;
        height: 540px;
        background-color: #fff;
        box-shadow: 3px 2px 20px rgba(49,48,48,0.32);
        overflow: hidden;
    }
    .keyboard-help .help-modal header {
        height: 60px;
        font-size: 16px;
        background-color: #29d1d9;
        color: #fff;
        line-height: 60px;
        overflow: hidden;
        width: 100%;
        position: relative;
    }
    .keyboard-help .help-modal header .title {
        display: inline-block;
        height: 100%;
    }
    .keyboard-help .help-modal header .icon {
        margin-right: 10px;
        top: 2px;
        vertical-align: text-bottom;
        position: relative;
        margin-left: 30px;
    }
    .keyboard-help .help-modal header .close-icon {
        cursor: pointer;
        display: inline-block;
        position: absolute;
        right: 20px;
        top: 25px;
    }
    .keyboard-help .help-modal header .close-icon svg {
        width: 18px;
        height: 18px;
    }
    .keyboard-help .help-modal ul.article {
        font-size: 13px;
        padding: 0 25px;
        width: 310px;
        overflow: auto;
        max-height: 478px;
        color: #989898;
    }
    .keyboard-help .help-modal ul.article .line {
        height: 38px;
        line-height: 38px;
        border-bottom: 1px solid #f3f3f3;
    }
    .keyboard-help .help-modal ul.article .line .name {
        display: inline-block;
        width: 120px;
        height: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .keyboard-help .help-modal ul.article .line .control {
        display: inline-block;
        height: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .keyboard-help .help-btn {
        width: 60px;
        height: 60px;
        position: absolute;
        cursor: pointer;
        left: 0;
        bottom: 100px;
        color: #fff;
        font-size: 12px;
        text-align: center;
    }
    .keyboard-help .help-btn:hover {
        color: #00c4cd;
    }
    .keyboard-help .help-btn:hover .icon {
        fill: #00c4cd;
    }
    .bb-layout-canvas{
        .remove{
            opacity:0;
            transition: opacity .2s;
            display: inline-block;
            position: absolute;
            top: -30px;
            right: 30px;
        }
        &:hover{
            .remove{
                opacity:1;
                transition: opacity .2s;
            }
        }
    }

    .menu {
        width: 40px;
        position: fixed;
        top: 200px;
        z-index: 1000;
    }
    .menu .menu-psd {
        background: #646a74;
        color: #fff;
        cursor: pointer;
        border-radius: 2px;
        text-align: center;
        line-height: 40px;
        height: 37px;
        font-size: 24px;
        box-shadow: 2px 2px 8px rgba(170,170,170,0.89);
    }
    .menu .menu-psd:hover,
    .menu .menu-psd.active {
        color: #00c4cd;
        background-color: #51555c;
    }
    .menu .menu-box {
        border-radius: 2px;
        margin-bottom: 16px;
        box-shadow: 2px 2px 8px rgba(170,170,170,0.89);
    }
    .menu .menu-box .ico_stop {
        position: relative;
    }
    .menu .menu-box .ico_stop:hover:before,
    .menu .menu-box .ico_stop:hover:after {
        background-color: #00c4cd;
    }
    .menu .menu-box .ico_stop:before,
    .menu .menu-box .ico_stop:after {
        content: '';
        width: 2px;
        height: 10px;
        background-color: #fff;
        position: absolute;
        top: 10px;
    }
    .menu .menu-box .ico_stop:before {
        left: 16px;
    }
    .menu .menu-box .ico_stop:after {
        right: 16px;
    }
    .menu .menu-box .play:before {
        font-size: 15px;
    }
    .menu .menu-box div {
        position: relative;
        width: 100%;
        height: 41px;
        line-height: 30px;
        cursor: pointer;
        text-align: center;
        font-size: 12px;
        color: #fff;
        background: #646a74;
    }
    .menu .menu-box div:first-child {
        border-bottom: 1px solid #525861;
        border-radius: 2px 2px 0 0;
    }
    .menu .menu-box div:last-child {
        border-radius: 0 0 2px 2px;
    }
    .menu .menu-box div:hover,
    .menu .menu-box div.active {
        color: #00c4cd;
        background-color: #51555c;
    }
    .menu .menu-box div span {
        position: absolute;
        bottom: -5px;
        left: 0;
        width: 100%;
        -webkit-transform-origin: 50% 50%;
                transform-origin: 50% 50%;
        -webkit-transform: scale(0.93);
                transform: scale(0.93);
        font-family: 'PingFangSC-Regular';
    }
</style>