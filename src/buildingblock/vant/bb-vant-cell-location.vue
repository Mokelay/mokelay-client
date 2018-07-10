<template>

    <van-cell title="所在位置" icon="location" @click="wxLocation" :value="addressDetail" is-link />

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
                addressDetail:''
            };
        },
        mounted(){
            const t = this;
            _TY_Tool.wx(["openLocation","getLocation"]).then((wx)=>{
                t.wx = wx;
            });
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
<<<<<<< HEAD
                            t.$emit("change",t.valueBase);
                            t.$emit("input",t.valueBase);
=======
                            t.getLocationName(latitude,longitude);
>>>>>>> bd644ed7ed57946aa21b0f1e8c5041bfadde3d11
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
                        }
                    });
                }
            },
<<<<<<< HEAD
=======
            getLocationName(latitude,longitude){
                const t = this;
                const ak = "qioiIjiHhNBq1DvY4ogShy4e";
                const url = `http://api.map.baidu.com/geocoder/v2/?callback=renderReverse&location=${latitude},${longitude}&output=json&pois=1&ak=${ak}`;
                require.ensure(['jsonp'], function (require) {
                    const jsonp = require('jsonp');
                    jsonp(url, null, (err, data) => {
                        t.valueBase.address = data.result.formatted_address;
                        t.valueBase.name = data.result.sematic_description;
                        t.addressDetail = data.result.sematic_description;
                        if (err) {
                            console.error(err.message);
                        } else {
                            console.log(data);
                        }
                    });
                });
            }
>>>>>>> bd644ed7ed57946aa21b0f1e8c5041bfadde3d11
        }
    }
</script>

<style scoped>
</style>