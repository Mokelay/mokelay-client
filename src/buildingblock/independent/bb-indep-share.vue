<template>
    <span>
        <i :class="'bb-indep-share ty ' + option.icon" @click="startShare"></i>
        <van-actionsheet class="shareDialog" v-model="show">
            <i class="ty ty-riji-fenxiang" @click="onMenuShareAppMessage"></i>
        </van-actionsheet>
    </span>
</template>
<script>  
    import Actionsheet from 'vant/lib/actionsheet';
    import 'vant/lib/actionsheet/style';
export default {
    name:"bb-indep-share",
    components:{
        "van-actionsheet":Actionsheet
    },
    props:{
        //分享标题
        title:{
            type:String
        },
        // 分享描述
        desc: {
            type:String
        },
        // 分享链接
        link: {
            type:String
        },
        // 分享图标
        imgUrl: {
            type:String
        },
        // 分享类型,music、video或link，不填默认为link
        type: {
            type:String
        },
        // 如果type是music或video，则要提供数据链接，默认为空
        dataUrl: {
            type:String
        },
        /*其他属性设置 
            {
                icon：""  触发分享的图标
                shareArea:"timeline,appMessage,QQ,weibo,qZone"  允许分享范围  默认全部允许
            }
        */
        option:{
            type:Object,
            default:function(){
                return {
                    icon:"ty-riji-fenxiang",
                    shareArea:"timeline,appMessage,QQ,weibo,qZone"
                }
            }
        }
    },
   data(){ 
        return{
            //分享内容
            shareInfo:{},
            realTitle:this.title,
            realDesc:this.desc,
            realLink:this.link,
            realImgUrl:this.imgUrl,
            shareArea:this.option.shareArea.split(","),
            show:false
        };
    },
    mounted: function () {
        const t = this;
        t.wx = _TY_Tool.wx;
        t.realTitle = _TY_Tool.tpl(t.title,_TY_Tool.buildTplParams(t));
        t.realDesc = _TY_Tool.tpl(t.desc,_TY_Tool.buildTplParams(t));
        t.realLink = _TY_Tool.tpl(t.link,_TY_Tool.buildTplParams(t));
        t.realImgUrl = _TY_Tool.tpl(t.imgUrl,_TY_Tool.buildTplParams(t));
    },
    render: function(createElement){
        const t = this;
        const shareButton = createElement('i',{class:`bb-indep-share ty ${t.option.icon}`,on:{click:t.startShare}},[]);
        return shareButton;
    },
    watch:{

    },  
    methods: {
        //获取子积木
        loadChildBB(){
            let t=this;
            return _TY_Tool.loadChildBB(t);                
        },
        startShare(){
            const t = this;
            t.show = true;
            alert('startShare');
            // const shareInfo = {
            //     title:t.realTitle,
            //     desc:t.realDesc,
            //     link:t.realLink,
            //     imgUrl:t.realImgUrl,
            //     success: function () { 
            //         t.$emit("shareSuccess")
            //     },
            //     cancel: function () { 
            //         t.$emit("shareFail")
            //     } 
            // };
            const shareInfo = {
                title:"分享标题",
                desc:"这是分享的测试",
                link:"http://ty.saiyachina.com/#/home_ln",
                imgUrl:"https://img3.mklimg.com/g2/M00/2D/0E/rBBrCVqWaDyAKLowAAAKmJyWFcY209.png", 
                success: function () { 
                        // 用户确认分享后执行的回调函数
                },
                cancel: function () { 
                    // 用户取消分享后执行的回调函数
                }
            };
            if(t.wx){
                alert('in wx');
                t.wx.onMenuShareAppMessage(shareInfo);
                t.wx.onMenuShareQQ(shareInfo);
                t.wx.onMenuShareWeibo(shareInfo);
                t.wx.onMenuShareQZone(shareInfo);
                // t.shareArea.forEach((val,key)=>{
                //     switch(val){
                //         case "timeline":
                //             alert('in wx timeline');
                //             t.wx.onMenuShareTimeline(shareInfo);
                //             break;
                //         case "appMessage":
                //             t.wx.onMenuShareAppMessage(shareInfo);
                //             break;
                //         case "QQ":
                //             t.wx.onMenuShareQQ(shareInfo);
                //             break;
                //         case "weibo":
                //             t.wx.onMenuShareWeibo(shareInfo);
                //             break;
                //         case "qZone":
                //             t.wx.onMenuShareQZone(shareInfo);
                //             break;
                //     }
                // })
            }else{
                return;
            }
        },
        onMenuShareAppMessage(){
            if(WeixinJSBridge){
                WeixinJSBridge.invoke('sendAppMessage',{
                    "img_url": "https://img3.mklimg.com/g2/M00/2D/0E/rBBrCVqWaDyAKLowAAAKmJyWFcY209.png",
                    "img_width": "200",
                    "img_height": "200",
                    "link": "http://ty.saiyachina.com/#/home_ln",
                    "desc": descContent,
                    "title": "分享标题"
                }, function(res) {
                    //_report('send_msg', res.err_msg);  // 这是回调函数，必须注释掉
                })
            }
        }
    }
}
</script>
<style lang="less">
    .bb-indep-share{
        font-size:0.5rem;
    }
</style>

