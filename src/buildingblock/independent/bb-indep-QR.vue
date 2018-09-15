<script>
    export default {
        name: 'bb-indep-QR',
        components: {
        },
        props: {
            /*二维码类型
                default 默认 wx微信小程序二维码
            */
            qrType:{
                type:String,
                default:"default"
            },
            url:{
                type:String
            },
            //大小
            size:{
                type:Number,
                default:200
            },
            wxOptions:{
                type:Object,
                default:function(){
                    return {
                        //参数
                        scene:"pageAlias",
                        //页面
                        page:"pages/index/index",
                        //自动配置线条颜色
                        auto_color:false,
                        //auto_color 为 false 时生效，使用 rgb 设置颜色 例如 {"r":"xxx","g":"xxx","b":"xxx"} 十进制表示
                        line_color:{"r":"0","g":"0","b":"0"},
                        //透明底色
                        is_hyaline:false
                    }
                }
            }
        },
        data() {
            return {
                realUrl:_TY_Tool.tpl(this.url,this),
                realWxOptions:Object.assign({width:this.size},this.wxOptions)
            }
        },
        render:function(createElement){
            const t = this;
            const qrCode = t.renderQrCode(createElement);
            return qrCode;
        },
        watch: {
            url(val){
                var t = this;
                t.realUrl = _TY_Tool.tpl(val,t)
            }
        },
        created: function () {
        },
        mounted: function () {
            var t =this;
        },
        methods: {
            renderQrCode:function(createElement){
                let t=this;
                let _host= _TY_H5Host|| (window.location.protocol + "//" + window.location.host);
                const qrCodeInstance = createElement('qriously',{
                    props:{
                        size:t.size,
                        value:t.realUrl || (_host+"/#/"+(t.$route.params.pageAlias||t.$route.query.pageAlias))
                    },
                },[]);
                return qrCodeInstance;
            },
            setUrl:function(...args){
                const t = this;
                args.forEach((val,key)=>{
                  if(val.type == 'custom'){
                    t.realUrl = val.arguments;
                  }
                });
            }
        }
    }
</script>

<style scoped>
</style>