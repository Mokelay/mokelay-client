<template>
    <div class="bb-map">
        <div class="bb-map-content" :style="mapSize">
            <div id="mapContent" class="map-content" @click="routerMapClick">

            </div>

            <div v-show="isSearch" class="search-element">
                <div id="searchbox" class="clearfix"> 
                    <div id="searchbox-container"> 
                        <div id="sole-searchbox-content" class="searchbox-content"> 
                            <input id="sole-input" v-model="valueBase" class="searchbox-content-common" type="text" name="word" autocomplete="off" maxlength="256" placeholder="搜地点、区域" value="" /> 
                            <div class="input-clear" title="清空"></div> 
                        </div> 
                        <div id="searchResultPanel" style="border:1px solid #C0C0C0;width:150px;height:auto; display:none;"></div>
                    </div> 
                    <button id="search-button" data-title="搜索" @click="searchClick"></button> 
                </div>
            </div>

            <div v-if="isSign" class="sign-element">
                <div class="market-mode" @click="signDeleteClick">
                </div>
                <div class="market-mode-last" @click="signSaveClick">
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue';
    import Util from '../libs/util.js'
    import '../css/DrawingManager_min.css';
    import '../css/SearchInfoWindow_min.css';

    import ditu0 from '../css/icon/map/ditu.png';       // 放大
    import ditu1 from '../css/icon/map/ditu1.png';      // 1爱琴海    4003
    import ditu2 from '../css/icon/map/ditu2.png';      // 2家具委管  4002
    import ditu3 from '../css/icon/map/ditu3.png';      // 3星艺佳    4005
    import ditu4 from '../css/icon/map/ditu4.png';      // 4其他      4006
    import ditu5 from '../css/icon/map/ditu5.png';      // 5家具自营   4001
    import ditu6 from '../css/icon/map/ditu6.png';      // 6房地产    4004

    // 百度地图资源加载 
    const resourcesUrl = ['//api.map.baidu.com/getscript?v=2.0&ak=qp02aVl6tUyI3xKRBCeBqH8mjBICZHgs&services=',
        '//api.map.baidu.com/library/DrawingManager/1.4/src/DrawingManager_min.js',
        '//api.map.baidu.com/library/SearchInfoWindow/1.4/src/SearchInfoWindow_min.js'];

    export default {
        name: 'bb-map',
        props: {
            isSearch: {
                type: Boolean,
                default: false,
            },
            isSign: {
                type: Boolean,
                default: false,
            },
            isArea: {
                type: Boolean,
                default: false,
            },
            isRouterJump: {
                type: Boolean,
                default: false,
            },
            widthMap: {
                type: String,
                default: '',
            },
            heightMap: {
                type: String,
                default: '',
            },
            ds: {
                type: Object
            },
            tds: {
                type: Object
            },
            saveds: {
                type: Object
            },
            /*坐标回填*/
            signId:{
                type: [Array,String],
                default:function(){
                    return [];
                }
            }
        },
        data() {
            return {
                routerJump: this.isRouterJump,
                map: null,                  // 地图对象
                overlays: [],               // 初始绘制坐标数据
                saveSign: [],               // 保存坐标数据
                valueBase: this.value,      // 搜索value
                province: '',               // 省
                town: '',                   // 市
                area: '',                   // 区
                pointData: {},              // 标记data
                checkResourcesId: '',       // 选中资源id,
                mapSize: {
                    width: this.widthMap ? this.widthMap + '% !important' : '100%',
                    height: this.heightMap ? this.heightMap + '% !important' : '100%',
                }
            }
        },
        mounted() {
            let th = this;

            try {
                Util.reloadJS(resourcesUrl).then(function () {
                    let map = new BMap.Map("mapContent");

                    // 添加地图类型控件
                    map.addControl(new BMap.MapTypeControl({anchor: BMAP_ANCHOR_TOP_LEFT})); 
                    // 开启鼠标滚轮缩放      
                    map.enableScrollWheelZoom(true);

                    /**
                    * 获取数据
                    */
                    if (th.ds) {
                        th.loading = true;
                        Util.getDSData(th.ds, _TY_Tool.buildTplParams(th), function (data) {
                            data.forEach(function (item) {
                                var list = item['value'];

                                th.province = list.province;
                                th.town = list.town;
                                th.area = list.area;
                                // 设置地图显示的城市 此项是必须设置的
                                map.centerAndZoom(th.area || th.town || list.province, 11); 

                                th.searchOperation(th);

                                // 包含搜索 标记功能
                                if (th.isSign) {
                                    console.log('isSign : ' + th.isSign);
                                    th.signOperation(th);
                                    
                                    th.modifySignImageClick(th);

                                    th.showSignStyle();
debugger
                                    if (th.signId && th.signId.length) {
                                        th.signShowOperation(th);
                                    }
                                }
                                if (th.isArea) {
                                    boundary();
                                }
                            });
                            th.loading = false;
                        }, function (code, msg) {
                            th.loading = false;
                        });
                    }

                    function boundary () {
                        th.loading = true;
                        Util.getDSData(th.tds, _TY_Tool.buildTplParams(th), function (data) {
                            data.forEach(function (item) {
                                var list = item['value'];

                                th.pointData = list.list;

                                th.getBoundary(th);

                                th.addPoint(th, list.list);
                            });
                            th.loading = false;
                        }, function (code, msg) {
                            th.loading = false;
                        });
                    }

                    th.map = map;
                });
            } catch(e) {}
        },
        methods: {
            routerMapClick() {
                if (this.routerJump) {
                    this.$emit('router-map-click');
                }
            },
            getDom(id) {
                return document.getElementById(id);
            },
            /**
             * 行政区划添加标注
             */
            addPoint(th, data, lat, lng) {
                let map = th.map;
                // 编写自定义函数,创建标注
                // 1爱琴海    4003
                // 2家具委管  4002
                // 3星艺佳    4005
                // 4其他      4006
                // 5家具自营   4001
                // 6房地产    4004

                let marker;
                let markerArr;
                // 添加标注
                function addMarker(point, myIcon){
                    marker = new BMap.Marker(point, {icon:myIcon});
                    map.addOverlay(marker);

                    marker.addEventListener("click", attribute);
                }
                // 标注回调函数
                function attribute(e){
                    let p = e.target;
                    let lng = p.getPosition().lng;
                    let lat = p.getPosition().lat;

                    var allOverlay = map.getOverlays();
                    for (var i = 0; i < allOverlay.length - 1; i++) {
                        if (allOverlay[i].toString() == "[object Marker]") {
                            map.removeOverlay(allOverlay[i]);
                        }
                    }
                    
                    th.addPoint(th, th.pointData, p.getPosition().lat, p.getPosition().lng); 
                }
                // 向地图添加标注
                let code;
                let img;
                let myIcon;
                let point;
                let child;
                let child2;
                for (var i = 0; i < data.length; i ++) {
                    point = new BMap.Point(data[i].x_coordinate, data[i].y_coordinate);
                    code = data[i].project_kind_code;
                    
                    if (lat && lng && lng == data[i].x_coordinate && lat == data[i].y_coordinate) {
                        myIcon = new BMap.Icon(ditu0, new BMap.Size(32, 32));
                    } else {
                        if (code === '4001') {
                            img = ditu5;
                        } else if (code === '4002') {
                            img = ditu2;
                        } else if (code === '4003') {
                            img = ditu1;
                        } else if (code === '4004') {
                            img = ditu6;
                        } else if (code === '4005') {
                            img = ditu3;
                        } else if (code === '4006') {
                            img = ditu4;
                        }
                        myIcon = new BMap.Icon(img, new BMap.Size(22, 22));
                    }
                    child = th.getDom(data[i].id + '-big');
                    child && child.parentNode.removeChild(child);
                    child2 = th.getDom(data[i].id + '-small');
                    child2 && child2.parentNode.removeChild(child2);
                    addMarker(point, myIcon);
                }

                th.addlabel(th, data, lat, lng);
            },
            /**
             * 自定义label样式
             */
            customLabelCss(th, data) {
                function ComplexCustomOverlay(point, text){
                    this._point = point;
                    this._text = text;
                }
                ComplexCustomOverlay.prototype = new BMap.Overlay();
                var div = document.createElement("div");
                ComplexCustomOverlay.prototype.initialize = function(map){
                    this._map = map;
                    
                    div.setAttribute('id', data.id + '-small');
                    div.style.position = "absolute";
                    div.style.zIndex = BMap.Overlay.getZIndex(this._point.lat);
                    div.style.backgroundColor = "#fff";
                    div.style.border = "1px solid transparent";
                    div.style.color = "#666666";
                    div.style.height = "30px";
                    div.style.padding = "0 10px";
                    div.style.lineHeight = "30px";
                    div.style.whiteSpace = "nowrap";
                    div.style.MozUserSelect = "none";
                    div.style.boxShadow = '1px 2px 1px rgba(0,0,0,.15)';
                    div.style.fontSize = "12px"
                    var span = this._span = document.createElement("span");
                    div.appendChild(span);
                    span.appendChild(document.createTextNode(this._text));      
                    var that = this;

                    var arrow = this._arrow = document.createElement("div");
                    arrow.style.position = "absolute";
                    arrow.style.width = "11px";
                    arrow.style.height = "10px";
                    arrow.style.top = "29px";
                    arrow.style.left = "10px";
                    arrow.style.overflow = "hidden";
                    arrow.style.width = 0;
                    arrow.style.height = 0;
                    arrow.style.borderLeft = '5px solid transparent';
                    arrow.style.borderRight = '5px solid transparent';
                    arrow.style.borderTop = '5px solid #fff';
                    div.appendChild(arrow);
                    
                    th.map.getPanes().labelPane.appendChild(div);
                    
                    return div;
                }
                ComplexCustomOverlay.prototype.draw = function(){
                    var map = this._map;
                    var pixel = map.pointToOverlayPixel(this._point);
                    div.style.left = pixel.x - parseInt(this._arrow.style.left) -5 + "px";
                    div.style.top  = pixel.y - 45 + "px";
                }
                    
                var myCompOverlay = new ComplexCustomOverlay(new BMap.Point(data.x_coordinate, data.y_coordinate), data.project_name);

                return myCompOverlay;
            },
            /**
             * 自定义label样式
             */
            customLabelCss2(th, data) {
                function ComplexCustomOverlay(point, text){
                    this._point = point;
                    this._text = text;
                }
                ComplexCustomOverlay.prototype = new BMap.Overlay();
                var div = document.createElement("div");
                ComplexCustomOverlay.prototype.initialize = function(map){
                    this._map = map;
                    
                    div.setAttribute('id', data.id + '-big');
                    div.style.position = "absolute";
                    div.style.zIndex = BMap.Overlay.getZIndex(this._point.lat);
                    div.style.backgroundColor = "#fff";
                    div.style.border = "1px solid transparent";
                    div.style.color = "#666666";
                    div.style.height = "66px";
                    div.style.width = "200px";
                    div.style.padding = "10px 10px";
                    div.style.whiteSpace = "nowrap";
                    div.style.MozUserSelect = "none";
                    div.style.boxShadow = '1px 2px 1px rgba(0,0,0,.15)';
                    div.style.fontSize = "12px"
                    let span = this._span = document.createElement("span");
                    span.style.whiteSpace = 'pre-wrap';
                    span.style.wordWrap = 'break-word';
                    span.style.lineHeight = '25px';

                    let span2 = document.createElement("span");
                    span2.style.marginLeft = '14px';
                    span2.style.display = 'inline-block';
                    span2.style.position = 'relative';
                    span2.style.padding = '2px 10px';
                    span2.style.border = '1px solid';
                    span2.style.borderRadius = '20px';
                    span2.style.color = 'rgb(68, 176, 239)';
                    span2.style.background = '#fff';
                    span2.style.lineHeight = '18px';
                    span2.style.font = '400 12px Arial,sans-serif';
                    span2.style.transform = 'scale(0.8)';
                    
                    div.appendChild(span);
                    div.appendChild(span2);
                    
                    span.appendChild(document.createTextNode(this._text));      
                    span2.appendChild(document.createTextNode(data.project_status)); 

                    var that = this;

                    var arrow = this._arrow = document.createElement("div");
                    arrow.style.position = "absolute";
                    arrow.style.width = "11px";
                    arrow.style.height = "10px";
                    arrow.style.top = "65px";
                    arrow.style.left = "10px";
                    arrow.style.overflow = "hidden";
                    arrow.style.width = 0;
                    arrow.style.height = 0;
                    arrow.style.borderLeft = '5px solid transparent';
                    arrow.style.borderRight = '5px solid transparent';
                    arrow.style.borderTop = '5px solid #fff';
                    
                    div.appendChild(arrow);

                    th.map.getPanes().labelPane.appendChild(div);
                    
                    return div;
                }
                ComplexCustomOverlay.prototype.draw = function(){
                    var map = this._map;
                    var pixel = map.pointToOverlayPixel(this._point);
                    div.style.left = pixel.x - parseInt(this._arrow.style.left) -5 + "px";
                    div.style.top  = pixel.y - 85 + "px";
                }
                    
                var myCompOverlay = new ComplexCustomOverlay(new BMap.Point(data.x_coordinate, data.y_coordinate), data.project_name);

                return myCompOverlay;
            },
            /**
             * 行政区划添加备注
             */
            addlabel(th, data, lat, lng) {
                let map = th.map;
                let opts;
                let label;
                for (var i = 0; i < data.length; i ++) {

                    if (lng && lat && lng == data[i].x_coordinate && lat == data[i].y_coordinate) {
                        label = th.customLabelCss2(th, data[i]);
                    } else {
                        label = th.customLabelCss(th, data[i]);
                    }
                    
                    map.addOverlay(label); 
                }  
                
            },
            /**
             * 添加行政区划
             */
            getBoundary(th){       
                let map = th.map;
                var bdary = new BMap.Boundary();
                bdary.get(th.province + th.town + th.area, function(rs){      //获取行政区域
                    var count = rs.boundaries.length;       //行政区域的点有多少个
                    if (count === 0) {
                        // alert('未能获取当前输入行政区域');
                        return ;
                    }
                    var pointArray = [];
                    for (var i = 0; i < count; i++) {
                        var ply = new BMap.Polygon(rs.boundaries[i], {strokeWeight: 2, strokeColor: "#0091EA"}); //建立多边形覆盖物
                        map.addOverlay(ply);  //添加覆盖物
                        pointArray = pointArray.concat(ply.getPath());
                    }    
                    map.setViewport(pointArray);    //调整视野  
                });   
            },            
            /**
             * 搜索逻辑处理
             */
            searchOperation(th) {
                let map = th.map;
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
                    th.getDom("searchResultPanel").innerHTML = str;
                });

                let myValue;
                // 鼠标点击下拉列表后的事件
                ac.addEventListener("onconfirm", function(e) {    
                    let _value = e.item.value;
                    myValue = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
                    th.getDom("searchResultPanel").innerHTML ="onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue;
                    
                    th.localSearch(th, myValue, true);
                });
            },
            /**
             * 显示默认标记逻辑处理
             */
            signShowOperation(th) {
                let map = th.map;
                th.overlays = [];
                let point = [];

                for (let i = 0; i < th.signId.length; i++) {
                    th.overlays.push({
                        lat: th.signId[i].x,
                        lng: th.signId[i].y
                    });
                    point.push(new BMap.Point(th.signId[i].y, th.signId[i].x));
                }

                map.addOverlay(new BMap.Polyline(point, {strokeColor:"red", strokeWeight:2, strokeOpacity:0.5})); 
            },
            /**
             * 标记逻辑处理
             */
            signOperation(th) {
                let map = th.map;
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

                th.showSignStyle();
            },
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
             * 修改原百度地图工具箱事件
             */
            modifySignImageClick(th) {
                let obj = th.getDom("mapContent");
                th.deleteOtherDom();
                obj.addEventListener("click", function(ev){

                    let clickSignMode = document.getElementsByClassName('BMapLib_last');
                    let clickSignMode1 = document.getElementsByClassName('market-sign-mode1');
                    if (!clickSignMode || !clickSignMode1) {
                        return;
                    }
                    if (clickSignMode[0] === ev.target || clickSignMode1[0] === ev.target) {
                        th.modifySignImage('sign');
                    }
                });

                th.showSignStyle();
            },
            /**
             * 显示标记图标
             */
            showSignStyle() {
                setTimeout(function () {
                    if (document.getElementsByClassName('anchorTR') && document.getElementsByClassName('anchorTR')[0]) {
                        document.getElementsByClassName('anchorTR')[0].setAttribute('class', 'BMapLib_Drawing BMap_noprint sign-right-top');
                    }
                }, 0);
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
                if (!this.valueBase) {
                    return;
                }

                this.localSearch(this, this.valueBase, false);

                this.$emit('search-click');
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
                this.map.clearOverlays();
                this.overlays = [];
                this.map.removeEventListener("click", function() {});
                this.$emit('sign-delete-click');
            },
            /**
             * 保存标记点
             */
            signSaveClick() {
                if (!this.overlays.length) {
                    return;
                }
                this.deleteOtherDom();
                this.modifySignImage('save');
                this.map.removeEventListener("click", function() {});

                console.log(this.overlays[0] || this.overlays[0].ia);

                const th = this;
                let overlays = this.overlays[0].ia;

                for (let i = 0; i < overlays.length; i++) {
                    this.saveSign.push({
                        x: overlays[i].lat,
                        y: overlays[i].lng
                    });
                }

                let result = {
                    city_resource_id: this.$route.query.city_resource_id,
                    signId: this.saveSign
                };

                this.$emit('signSaveClick', result);
            }
        }
    }
</script>

<style>

    .sign-right-top {
        top: 20px !important;
        right: 20px !important;
    }
    
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

    .bb-map {
        height: 100vh;
        .bb-map-content {
            margin: 0 auto;
            width: 100%;
            height: 100%;
            position: relative;
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
                right: 20px;
                top: 71px;
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
    }

    
</style>