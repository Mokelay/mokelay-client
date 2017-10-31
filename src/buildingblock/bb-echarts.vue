<template>
    <div :style="{width:width,height:height}"></div>
</template>

<script>
    export default {
        name: 'bb-echarts',
        props: {
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
                default:function(){
                    return {
                        title:''
                    }
                }
            }, 
            xAxis: {
                type: Object,
                default:function(){
                    return {
                        data:[]
                    }
                }
            }, 
            series: {
                type: Array,
                default: function(){
                    return []
                }
            }
        },
        data() {
            return {}
        },
        created: function () {
        },
        mounted: function () {
            var t = this;
            //对数组中的object处理 提取纯数组
            if(typeof(t.xAxis.data[0]) == 'object'){
                const newArray = [];
                t.xAxis.data.forEach((val,key)=>{
                    newArray.push(val.data);
                });
                t.xAxis.data = newArray;
            }
            require.ensure(['echarts'], function (require) {
                var echarts = require("echarts");
                var _chart = echarts.init(t.$el);
                // 绘制图表
                _chart.setOption({
                    title: t.title,
                    tooltip: {},
                    xAxis: t.xAxis,
                    yAxis: {},
                    series: t.series
                });
            });
        },
        methods: {
            resetArray: function (array) {
                if (typeof(array) == 'object') {
                   array.forEach((val, index) => {
                        switch (val) {
                            case '':
                                let newObj = array
                                //t.formData = [];
                                let newValue = parseInt(newObj[val]);
                                if (typeof(newValue) == 'number') {
                                    array = newValue;
                                } else {
                                    array = newObj[val];
                                }
                                return array
                        }
                    });
                    return array
                }else{
                    return array
                }
            }

        }
    }
</script>