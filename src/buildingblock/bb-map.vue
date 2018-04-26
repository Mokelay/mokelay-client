<template>
    <div class="bb-map-contrast">
        <div id="mapContent" class="map-content">

        </div>

        <div v-if="isSearch" class="search-element">
             <div id="searchbox" class="clearfix"> 
                <div id="searchbox-container"> 
                    <div id="sole-searchbox-content" class="searchbox-content"> 
                        <input id="sole-input" class="searchbox-content-common" type="text" name="word" autocomplete="off" maxlength="256" placeholder="搜地点、区域" value="" /> 
                        <div class="input-clear" title="清空"></div> 
                    </div> 
                    <div id="searchResultPanel" style="border:1px solid #C0C0C0;width:150px;height:auto; display:none;"></div>
                </div> 
                <button id="search-button" data-title="搜索" @click="searchClick"></button> 
            </div>
        </div>

        <div v-if="isSign" class="sign-element">
            <!-- <div class="market-opacity"></div> -->
            <div class="market-mode" @click="signDeleteClick">
            </div>
            <div class="market-mode-last" @click="signSaveClick">
            </div>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue';
    import reloadJS from '../libs/reloadJS';

    import ditu0 from '../css/icon/map/ditu.png'
    import ditu1 from '../css/icon/map/ditu1.png'
    import ditu2 from '../css/icon/map/ditu2.png'
    import ditu3 from '../css/icon/map/ditu3.png'
    import ditu4 from '../css/icon/map/ditu4.png'
    import ditu5 from '../css/icon/map/ditu5.png'
    import ditu6 from '../css/icon/map/ditu6.png'

    const resourcesUrl = ['http://api.map.baidu.com/getscript?v=2.0&ak=qp02aVl6tUyI3xKRBCeBqH8mjBICZHgs&services=',
        'http://api.map.baidu.com/library/DrawingManager/1.4/src/DrawingManager_min.js',
        'http://api.map.baidu.com/library/SearchInfoWindow/1.4/src/SearchInfoWindow_min.js']

    export default {
        name: 'bb-map',
        props: {
            isSearch: {
                type: Boolean,
                default: true,
            },
            isSign: {
                type: Boolean,
                default: true,
            }
        },
        data() {
            return {
                map: null,
                overlays: [],
                marker: null
            }
        },
        mounted () {
            let th = this;

            reloadJS(resourcesUrl).then(function () {
                function G(id) {
                    return document.getElementById(id);
                }

                let map = new BMap.Map("mapContent");
                // 添加地图类型控件
                map.addControl(new BMap.MapTypeControl({anchor: BMAP_ANCHOR_TOP_LEFT})); 
                // 设置地图显示的城市 此项是必须设置的
                // map.setCurrentCity("杭州");    
                // 开启鼠标滚轮缩放      
                map.enableScrollWheelZoom(true);

                if (th.isSearch) {
                    // 建立一个自动完成的对象
                    let ac = new BMap.Autocomplete(    
                        {"input" : "sole-input"
                        ,"location" : map
                    });

                    // 鼠标放在下拉列表上的事件
                    ac.addEventListener("onhighlight", function(e) {  
                        let str = "";
                        let _value = e.fromitem.value;
                        let value = "";
                        if (e.fromitem.index > -1) {
                            value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
                        }    
                        str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;
                        
                        value = "";
                        if (e.toitem.index > -1) {
                            _value = e.toitem.value;
                            value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
                        }    
                        str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;
                        G("searchResultPanel").innerHTML = str;
                    });

                    let myValue;
                    // 鼠标点击下拉列表后的事件
                    ac.addEventListener("onconfirm", function(e) {    
                        let _value = e.item.value;
                        myValue = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
                        G("searchResultPanel").innerHTML ="onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue;
                        
                        th.localSearch(th, myValue, true);
                    });

                }

                if (th.isSign) {
                    var poi = new BMap.Point(116.307852,40.057031);
                    map.centerAndZoom(poi, 16);
                    map.enableScrollWheelZoom();  
                    th.overlays = [];
                    var overlaycomplete = function(e){
                        th.overlays.push(e.overlay);
                    };
                    var styleOptions = {
                        strokeColor:"red",    //边线颜色。
                        fillColor:"red",      //填充颜色。当参数为空时，圆形将没有填充效果。
                        strokeWeight: 3,       //边线的宽度，以像素为单位。
                        strokeOpacity: 0.8,	   //边线透明度，取值范围0 - 1。
                        fillOpacity: 0.6,      //填充的透明度，取值范围0 - 1。
                        strokeStyle: 'solid' //边线的样式，solid或dashed。
                    }
                    //实例化鼠标绘制工具
                    var drawingManager = new BMapLib.DrawingManager(map, {
                        isOpen: false, //是否开启绘制模式
                        enableDrawingTool: true, //是否显示工具栏
                        drawingToolOptions: {
                            anchor: BMAP_ANCHOR_TOP_RIGHT, //位置
                            offset: new BMap.Size(5, 5), //偏离值
                            drawingModes: [BMAP_DRAWING_POLYLINE],
                        },
                        circleOptions: styleOptions, //圆的样式
                        polylineOptions: styleOptions, //线的样式
                        polygonOptions: styleOptions, //多边形的样式
                        rectangleOptions: styleOptions //矩形的样式
                    });  
                    //添加鼠标绘制工具监听事件，用于获取绘制结果
                    drawingManager.addEventListener('overlaycomplete', overlaycomplete);

                    var obj = document.getElementById("mapContent");
                    obj.addEventListener("click",function(ev){

                        th.deleteOtherDom();

                        let clickSignMode = document.getElementsByClassName('BMapLib_last');
                        let clickSignMode1 = document.getElementsByClassName('market-sign-mode1');
                        if (!clickSignMode || !clickSignMode1) {
                            return;
                        }
                        if (clickSignMode[0] === ev.target || clickSignMode1[0] === ev.target) {
                            th.modifySignImage('sign');
                        }
                        
                    });
                }

                th.map = map;
            });
            
        },
        methods: {
            /**
             * 删除原百度地图拖动图标及功能
             */
            deleteOtherDom() {
                let removeNode = document.getElementsByClassName('BMapLib_hander');

                if (removeNode && removeNode[0]) {
                    removeNode[0].parentNode.removeChild(removeNode[0]);
                }
            },
            /**
             * 修改原百度地图工具箱功能
             */
            modifySignImage(type) {

                if (!type) {
                    return;
                }

                let clickSignMode = document.getElementsByClassName('BMapLib_last');
                let clickSignMode1 = document.getElementsByClassName('market-sign-mode1');
                let clickMode = document.getElementsByClassName('market-mode');
                let clickMode1 = document.getElementsByClassName('market-mode1');
                let clickModeLast = document.getElementsByClassName('market-mode-last');
                let clickModeLast1 = document.getElementsByClassName('market-mode-last1');

                if (type === 'sign' && clickSignMode1 && clickSignMode1[0]) {
                    return;
                } else if (type === 'clear' && clickMode1 && clickMode1[0]) {
                    return;
                }  else if (type === 'save' && clickModeLast1 && clickModeLast1[0]) {
                    return;
                }

                if (clickSignMode1 && clickSignMode1[0]) {
                    clickSignMode1[0].className = 'BMapLib_box BMapLib_polyline BMapLib_last';
                } else if (clickMode1 && clickMode1[0]) {
                    clickMode1[0].className = 'market-mode';
                } else if (clickModeLast1 && clickModeLast1[0]) {
                    clickModeLast1[0].className = 'market-mode-last';
                }

                if (type === 'sign') {
                    clickSignMode[0].className = 'BMapLib_box BMapLib_polyline market-sign-mode1';
                } else if (type === 'clear') {
                    clickMode[0].className = 'market-mode1';
                }  else if (type === 'save') {
                    clickModeLast[0].className = 'market-mode-last1';
                }
            },
            /**
             * 删除标记点
             */
            clearAll() {
                for(var i = 0; i < this.overlays.length; i++){
                    this.map.removeOverlay(this.overlays[i]);
                }
                this.overlays.length = 0   
            },
            /**
             * 搜索功能
             */
            localSearch(t, myValue, auto) {
                // 清除地图上所有覆盖物
                t.map.clearOverlays();    
                let local = null;
                // 智能搜索
                if (auto) {
                    local = new BMap.LocalSearch(t.map, { 
                        onSearchComplete: function () {
                            // 获取第一个智能搜索的结果
                            if (!local.getResults() || !local.getResults().Br.length) {
                                return;
                            }
                            let pp = local.getResults().getPoi(0).point;    
                            t.map.centerAndZoom(pp, 18);
                            // 添加标注
                            t.map.addOverlay(new BMap.Marker(pp));
                        }
                    });
                } else {
                    local = new BMap.LocalSearch(t.map, {
                        onSearchComplete: function () {
                            if (!local.getResults() || !local.getResults().Br.length) {
                                return;
                            }
                            let ppList = local.getResults().Br;  

                            t.map.centerAndZoom(ppList[0].point, 18);

                            ppList.map(function(item, index) {
                                t.map.addOverlay(new BMap.Marker(item.point));
                            });
                        }
                    });
                }
                
                local.search(myValue);
            },
            /**
             * 搜索点击功能
             */
            searchClick() {
                let searchValue = document.getElementById('sole-input').value;
                if (!searchValue) {
                    return;
                }

                this.localSearch(this, searchValue, false);
            },
            /**
             * 处理地图点击事件
             */
            handleClick(tab, event) {
                console.log(tab, event);
            },
            /**
             * 删除标记点事件
             */
            signDeleteClick() {
                this.deleteOtherDom();
                this.modifySignImage('clear');
                this.clearAll();
                this.map.removeEventListener("click", function() {});
            },
            /**
             * 保存标记点
             */
            signSaveClick() {
                this.deleteOtherDom();
                this.modifySignImage('save');
                this.testStaticMap();
                this.map.removeEventListener("click", function() {});

                console.log(this.overlays || this.overlays[0] || this.overlays[0].CC[0].ia);
            }
        }
    }
</script>

<style>

    .tangram-suggestion-main {
        z-index: 2;
    }

    .anchorTL, .BMapLib_hander_hover {
        display: none !important;
    }

    .anchorTR {
        top: 20px !important;
        right: 20px !important;
    }

    .BMapLib_hander {
        display: none !important;
    }

    .BMapLib_Drawing_panel {
        height: 71px !important;
        border: none !important;
        box-shadow: none !important;
    }

    .BMapLib_last {
        background: url('../css/icon/map/biaoji.png') no-repeat !important;
        height: 71px !important;
        width: 110px !important;
    }

    .map-content .market-sign-mode {
        background: url('../css/icon/map/biaoji.png') no-repeat !important;
        height: 71px !important;
        width: 110px !important;
    }

    .map-content .market-sign-mode1 {
        background: url('../css/icon/map/biaoji1.png') no-repeat !important;
        height: 71px !important;
        width: 110px !important;
    }

</style>

<style lang='less' scoped>

    @import 'http://api.map.baidu.com/library/DrawingManager/1.4/src/DrawingManager_min.css';
    @import 'http://api.map.baidu.com/library/SearchInfoWindow/1.4/src/SearchInfoWindow_min.css';

    .bb-map-contrast {
        height: 100vh;
        margin: 0 auto;
        .map-content {
            height: 100%;
            width: 100%;
            text-align: center;
        }
        
        .search-element {
            position: absolute;
            z-index: 2;
            top: 20px;
            left: 40px;
            #searchbox {
                border-radius: 2px;
                width: 425px;
                position: relative;
                z-index: 5
            }

            #searchbox #searchbox-container {
                position: relative;
                z-index: 2;
                pointer-events: auto;
                width: 360px;
                float: left;
                box-sizing: border-box;
                box-shadow: 1px 2px 1px rgba(0,0,0,.15)
            }

            #searchbox #search-button {
                pointer-events: auto;
                background: url('../css/icon/map/searchbox_f175577.png') no-repeat 0 -76px #0091ea;
                width: 57px;
                height: 45px;
                float: left;
                border: 0;
                padding: 0;
                cursor: pointer;
                border-radius: 0 2px 2px 0;
                box-shadow: 1px 2px 1px rgba(0,0,0,.15)
            }

            #searchbox #search-button:hover {
                background-color: #2e77e5
            }

            .searchbox-content {
                width: 360px;
                border-radius: 2px 0 0 2px;
                background: #fff
            }

            .searchbox-content:after {
                font-size: 0;
                zoom:1;content: " ";
                clear: both;
                display: block;
                hieght: 0;
                visibility: hidden
            }

            .searchbox-content .input-clear {
                cursor: pointer;
                position: absolute;
                width: 27px;
                height: 45px;
                top: 0;
                background: url('../css/icon/map/searchbox_f175577.png') no-repeat 0 -114px #fff;
                display: none;
                right: 39px
            }

            .searchbox-content .searchbox-content-common {
                outline:none;
                box-sizing: border-box;
                float: left;
                width: 360px;
                height: 45px
            }

            #sole-input::-webkit-input-placeholder {
                color: #aaaaaa;
                font-size: 16px
            }

            #sole-input::-moz-placeholder {
                color: #aaaaaa;
                font-size: 16px
            }

            #sole-input:-moz-placeholder {
                color: #aaaaaa;
                font-size: 16px
            }

            #sole-input:-ms-input-placeholder {
                color: #aaaaaa;
                font-size: 16px
            }

            #sole-searchbox-content {
                position: relative
            }

            #sole-searchbox-content #sole-input {
                box-sizing: border-box;
                border: 0;
                padding: 9px 0;
                border-left: 10px solid transparent;
                border-right: 27px solid transparent;
                line-height: 20px;
                font-size: 16px;
                height: 45px;
                color: #333;
                position: relative;
                border-radius: 2px 0 0 2px
            }

        }

        .sign-element {
            position: absolute;
            width: 110px;
            height: 140px;
            z-index: 1;
            right: 22px;
            top: 73px;
            bottom: 0px;
            margin: 20px 0 0 20px;

            .market-mode {
                background: url('../css/icon/map/qingchu.png') no-repeat !important;
                height: 71px;
                width: 100%;
                cursor: pointer;
            }
            
            .market-mode1 {
                background: url('../css/icon/map/qingchu1.png') no-repeat !important;
                height: 71px;
                width: 100%;
                cursor: pointer;
            }
            
            .market-mode-last {
                background: url('../css/icon/map/baocun.png') no-repeat !important;
                height: 71px;
                width: 100%;
                cursor: pointer;
            }
            
            .market-mode-last1 {
                background: url('../css/icon/map/baocun1.png') no-repeat !important;
                height: 71px;
                width: 100%;
                cursor: pointer;
            }
        }
    }
</style>