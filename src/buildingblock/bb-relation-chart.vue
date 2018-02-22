<template>
    <div :style="{width:width,height:height}"></div>
</template>

<script>
    export default {
        name: 'bb-relation-chart',
        props: {
            type: {
                type: String,
                default: "layout-none"
            },
            width: {
                type: String,
                default: "100%"
            },
            height: {
                type: String,
                default: "500px"
            },
            title: {
                type: Object,
                default: function () {
                    return {title: "关系图表"};
                },
                //required: true
            },
            ds: {
                type: Object,
                default: function () {
                    return null
                }
            },
            data: {
                type: Object,
                default: function () {
                    return {
                        data:[],
                        connector:[]
                    };
                },
                //required: true
            },
            focusNodeAdjacency: {
                type: Boolean,
                default: true,
            },
            name: {
                type: String,
                default: "关系图表"
            },
            legend: {
                type: Object,
                default: function () {
                    return {
                        show: true,
                        //right: 68,
                        //top: 20,
                        orient: '',
                        width: 40,
                        x: 'right',
                        y: 'bottom',
                        itemWidth: 10,
                        itemHeight: 10,
                        itemGap: 20,//间隔
                        selectedMode: true,//点击关闭
                    };
                }
            },
        },
        data() {
            return {
                _chart: null
            }
        },
        created: function () {
        },
        mounted: function () {
            const t=this;
            t.loadData(function(){
                t.getData();
            });
        },
        methods: {
            loadData(callback){
                let t=this;
                if (t.ds) {
                    t.loading = true;
                    _TY_Tool.getDSData(t.ds, _TY_Tool.buildTplParams(t), function (map) {
                        map.forEach(function (item) {
                            t.data = item['value'];
                        });
                        t.loading = false;
                        if(callback){
                            callback(t);
                        }
                    }, function (code, msg) {
                        t.loading = false;
                    });
                }else{
                    if(callback){
                        callback(t);
                    }
                }
            },
            getData(self) {
                var t = self||this;
                var json = this.data;
                require.ensure(['echarts'], function (require) {
                    if (!t._chart) {
                        var echarts = require("echarts");
                        t._chart = echarts.init(t.$el);
                    }
                    //TODO
                    var categories = [];
                    var res = {};
                    var temp={};
                    //获取links数据
                    var links = json.connector.map(function (connector) {
                        //计算当前元素的关系权重
                        res[connector.fromOIAlias] = res[connector.fromOIAlias] >= 1 ? res[connector.fromOIAlias] + 1 : 1;
                        res[connector.toOIAlias] = res[connector.toOIAlias] >= 1 ? res[connector.toOIAlias] + 1 : 1;
                        temp[connector.fromOIAlias] = temp[connector.fromOIAlias] >= 1 ? temp[connector.fromOIAlias] + 1 : (connector.toOIAlias?1:0);
                        temp[connector.toOIAlias] = temp[connector.toOIAlias] >= 1 ? temp[connector.toOIAlias] + 1 : 1;
                        return {
                            source: connector.fromOIAlias,
                            target: connector.toOIAlias
                        };
                    });
                    //获取data数据
                    var data = json.data.map(function (data, index) {
                        var x1 = 0, y1 = 0;
                        //随机获取到圆心的距离
                        var l = 500 * Math.random();
                        //随机获取角度
                        var a = 360 * Math.random();
                        //根据元素的关系权重计算元素直径
                        var ln = json.connector.length > json.data.length ? json.connector.length : json.data.length;
                        var symbolSize = parseInt(100 * (res[data.alias] / ln) * 2);
                        if (!symbolSize || symbolSize < 40) {
                            symbolSize = 40;
                        }
                        var label = null;
                        var color = "#" + ("00000" + ((Math.random() * 16777215 + 0.5) >> 0).toString(16)).slice(-6);
                        categories[index] = {
                            name: data.name,
                            itemStyle: {
                                normal: {
                                    //随机产生色号
                                    color: color
                                }
                            }
                        };
                        if (t.type === "layout-circular") {
                            label = {
                                normal: {
                                    //当元素直径小于10不显示name
                                    show: symbolSize > 0
                                }
                            }
                        }
                        return {
                            x: x1 + l * Math.cos(a),
                            y: y1 + l * Math.sin(a),
                            //圆心
                            z: "0.0",
                            id: data.alias,
                            //元素名
                            name: data.name,
                            category: index,
                            //元素名样式
                            label: label,
                            value: res[data.alias],
                            symbolSize: symbolSize,
                            content: data.content,
                            linkCount:temp[data.alias],
                            itemStyle: {
                                normal: {
                                    //随机产生色号
                                    color: color
                                }
                            }
                        };
                    });
                    var option = {};
                    // 绘制图表
                    var layout = "none";
                    switch (t.type) {
                        case "layout-none":
                            layout = "none";
                            break;
                        case "layout-circular":
                            layout = "circular";
                            break;
                    }
                    var data2 = categories.map(function (data) {
                        return data.name;
                    });

                    function tooltipFormatter(params, ticket, callback) {
                        var tipContent = '';
                        if (params.dataType === 'node') {
                            tipContent = `${params.seriesName}<br />连接数： ${params.data.linkCount||0}<br /><span style="width:50px;wordWrap:break-word;">表单描述: ${params.data.content}</span>`
                        } else {
                            tipContent = `${params.data.source} -> ${params.data.target}`
                        }
                        return tipContent
                    }
                    option = {
                        title: t.title,
                        tooltip: {
                            trigger: 'item',
                            showContent: true,
                            enterable: true,
                            alwaysShowContent: false,
                            formatter: tooltipFormatter
                        },
                        //控制图例
                        legend: {
                            show: t.legend.show || true,
                            data: categories,
                            orient: t.legend.orient || 'vertical',
                            width: t.legend.width || 40,
                            x: t.legend.x || 'right',
                            y: t.legend.y || 'bottom',
                            itemWidth: t.legend.itemWidth || 10,
                            itemHeight: t.legend.itemHeight || 10,
                            itemGap: t.legend.itemGap || 20,
                            selectedMode: t.legend.selectedMode,
                        },
                        animationDurationUpdate: 1500,
                        animationEasingUpdate: 'quinticInOut',
                        series: [
                            {
                                name: t.name,
                                type: 'graph',
                                layout: layout,
                                circular: {
                                    rotateLabel: true
                                },
                                data: data,
                                links: links,
                                categories: categories,
                                roam: true,
                                focusNodeAdjacency: t.focusNodeAdjacency,
                                label: {
                                    normal: {
                                        position: 'right',
                                        formatter: '{b}'
                                    }
                                },
                                lineStyle: {
                                    normal: {
                                        color: 'source',
                                        curveness: 0.3
                                    }
                                }
                            }
                        ]
                    };
                    t._chart.setOption(option, true);
                },'echarts');
            }
        }
    }
</script>