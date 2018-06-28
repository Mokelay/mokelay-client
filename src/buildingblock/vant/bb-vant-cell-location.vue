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
                type:[Number,String]
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
                valueBase:this.value,
                realContent:this.content || []
            };
        },
        mounted(){
            this.getData();
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
                    ["startRecord","stopRecord","uploadVoice"]
                    ).then((wx)=>{
                        t.wx = wx;
                        const recordTimer = setTimeout(function(){
                            t.wx.startRecord({
                                success: function(res){
                                    debugger
                                    localStorage.rainAllowRecord = 'true';
                                    const timeInter = setInterval(()=>{
                                        t.recordTime = t.recordTime + 1;
                                    },1000)
                                },
                                cancel: function () {
                                    alert('用户拒绝授权录音');
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