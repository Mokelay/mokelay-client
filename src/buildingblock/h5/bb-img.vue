<template>
    <div>
        <img :src="imgSrc" v-bind:style="cssStyle"/>
    </div>
</template>

<script>
    import Vue from 'vue';
    import Util from '../../libs/util.js'

    export default {
        name: 'bb-img',
        props: {
            /*
                type: url，ds
                url
                ds
            **/
            isGetUrl: {
                type: Boolean,
                default: false,
            },
            src:{
                type:[String,Object]
            },
            cssStyle:{
                type:Object,
                default:function(){
                    return {}
                }
            },
            ds: {
                type: Object
            }
        },
        data() {
            return {
                imgSrc: ""
            }
        },
        mounted:function(){
            let th =this;

            if (this.isGetUrl) {
                th.loading = true;
                Util.getDSData(th.ds, _TY_Tool.buildTplParams(th), function (data) {
                    data.forEach(function (item) {
                        var list = item['value'];

                        
                    });
                    th.loading = false;
                }, function (code, msg) {
                    th.loading = false;
                });
            } else {
                this.imgSrc = this.src;
            }
        },
        methods: {
            
        }
    }
</script>
<style lang='less' scoped>
</style>