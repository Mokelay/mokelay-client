<template>

    <van-cell :title="addressDetail" icon="location" :class="locationClass" @click="wxLocation" is-link />

</template>
<script>
import Cell from 'vant/lib/cell';
import 'vant/lib/cell/style';

    export default {
        name: 'bb-vant-cell-location',
        components: {
          "van-cell":Cell,
        },
        props: {
            /*位置信息 支持v-model
                {
                    latitude: 0, // 纬度，浮点数，范围为90 ~ -90
                    longitude: 0, // 经度，浮点数，范围为180 ~ -180。
                    name: '', // 位置名
                    address: '', // 地址详情说明
                }
            */
            value:{
                type:[Object,String],
                default:"所在位置"
            },
            /*其他属性配置
            {
                scale: 1, // 地图缩放级别,整形值,范围从1~28。默认为最大
                infoUrl: '' // 在查看位置界面底部显示的超链接,可点击跳转
            }
            */
            option:{
                type:Object,
                default:function(){
                    return {
                        scale: 1
                    };
                }
            }
        },
        data() {
            return {
                valueBase:this.value,
                addressDetail:'所在位置',
                locationClass:''
            };
        },
        mounted(){
            const t = this;
            t.wx = _TY_Tool.wx;
        },
        //事件click
        methods: {
            //微信定位
            wxLocation(){
                const  t = this;
                if(t.wx){
                    t.wx.getLocation({
                        type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
                        success: function (res) {
                            const latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                            const longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                            const speed = res.speed; // 速度，以米/每秒计
                            const accuracy = res.accuracy; // 位置精度
                            t.valueBase = res;
                            t.getLocationName(latitude,longitude);
                        }
                    });
                }
            },
            getLocationName(latitude,longitude){
                const t = this;
                //const ak = "qioiIjiHhNBq1DvY4ogShy4e";
                const ak = "HycR3XEV2OG3zLRM6AF2jo2iBsjgiqVo";  //xlx
                const url = `http://api.map.baidu.com/geocoder/v2/?callback=renderReverse&location=${latitude},${longitude}&output=json&pois=1&ak=${ak}`;
                require.ensure(['jsonp'], function (require) {
                    const jsonp = require('jsonp');
                    jsonp(url, null, (err, data) => {
                        t.valueBase.address = data.result.formatted_address;
                        t.valueBase.name = data.result.sematic_description;
                        t.addressDetail = data.result.sematic_description;
                        t.wx.openLocation({
                            latitude: latitude, // 纬度，浮点数，范围为90 ~ -90
                            longitude: longitude, // 经度，浮点数，范围为180 ~ -180。
                            name: t.valueBase.name, // 位置名
                            address: t.valueBase.address, // 地址详情说明
                            scale: t.option.scale, // 地图缩放级别,整形值,范围从1~28。默认为最大
                            infoUrl: t.option.infoUrl // 在查看位置界面底部显示的超链接,可点击跳转
                        });
                        t.$emit("change",t.valueBase);
                        t.$emit("input",t.valueBase);
                        t.locationClass = "locationClass";
                        if (err) {
                            console.error(err.message);
                            t.locationClass = "";
                        } else {
                            console.log(data);
                        }
                    });
                });
            }
        }
    }
</script>

<style lang="less">
    .locationClass{
        .van-cell__left-icon{
            color:#24C789
        }
    }
</style>