<template>
    <div>
        <img :src="src" v-bind:style="cssStyle"/>
    </div>
</template>

<script>
    export default {
        name: 'bb-img',
        props: {
            /*
                type: url，ds
                url
                ds
            **/
            src:{
                type:[String,Object]
            },
            cssStyle:{
                type:Object,
                default:function(){
                    return {}
                }
            }
        },
        data() {
            return {
                imgSrc:""
            }
        },
        computed:{
        },
        watch: {
        },
        created: function () {
            var t =this;
            var src = this.src;
            if(typeof src == "string"){
                this.imgSrc =  src;
            }else if(typeof src == "object"){
                var type = src['type'];
                if(type == "url"){
                    this.imgSrc =  src['url'];
                }else if(type == "ds"){
                    Util.getDSData(src['ds'], _TY_Tool.buildTplParams(t), 
                        function (map){},
                        function (code, msg) {}
                    );
                }
            }
        },
        mounted:function(){
        },
        methods: {
        }
    }
</script>
<style lang='less' scoped>
</style>