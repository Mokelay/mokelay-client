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
            var src = this.src;
            if(typeof src == "string"){
                this.imgSrc =  src;
            }else if(typeof src == "object"){
                var type = src['type'];
                if(type == "url"){
                }else if(type == "ds"){
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