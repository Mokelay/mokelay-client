<script>
    export default {
        name: 'bb-indep-QR',
        components: {
        },
        props: {
            url:{
                type:Boolean,
                default:false
            },
            //大小
            size:{
                type:Number,
                default:200
            }
        },
        data() {
            return {
                realUrl:_TY_Tool.tpl(this.url,this),
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