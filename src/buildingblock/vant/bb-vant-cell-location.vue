<template>
    <van-cell title="所在位置" icon="location" is-link />
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
            //内容
            value:{
                type:[Object,String],
                default:"所在位置"
            },
            /*模板默认值*/
            defaultValTpl:{
                type:[String,Number,Boolean]
            },
            /*其他属性配置
            {
                icon:String 左侧图标,
                title:String 左侧标题,
                label:String 标题下方的描述信息,
                required:Boolean 是否显示表单必填星号,
                isLink:Boolean 展示右侧箭头并开启点击反馈
                center:Boolean 使内容垂直居中
                url:""  跳转链接
                clickable:Boolean 开启点击反馈
            }
            */
            option:{
                type:Object,
                default:function(){
                    return {
                        icon:"ty ty-dlweizhi",
                        title:String,
                        label:String,
                        required:Boolean,
                        isLink:Boolean,
                        center:Boolean,
                        url:"",
                        clickable:Boolean
                    };
                }
            }
        },
        data() {
            return {
                location:this.value,
                realContent:this.content || []
            };
        },
        mounted(){
        },
        //事件click
        methods: {
            //点击事件
            click(param){
                this.$emit('click',param);
            },
            //微信定位
            wxLocation(){
                const  t = this;
                _TY_Tool.wx("http://ty.saiyachina.com",
                    ["openLocation","getLocation"]
                    ).then((wx)=>{
                        t.wx = wx;
                        const recordTimer = setTimeout(function(){
                            t.wx.getLocation({
                                type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
                                success: function (res) {
                                    var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                                    var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                                    var speed = res.speed; // 速度，以米/每秒计
                                    var accuracy = res.accuracy; // 位置精度
                                    t.location = res;
                                }
                            });
                        },300);
            });
        },
        }
    }
</script>

<style scoped>
</style>