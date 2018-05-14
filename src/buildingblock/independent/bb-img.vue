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
                    return {
                        width: '200px',
                        height: '200px'
                    }
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
                    console.log(data);
                    data.forEach(function (item) {
                        let result = item['value'];

                        th.imgSrc = result.logo;
                    });
                    th.loading = false;
                }, function (code, msg) {
                    th.loading = false;
                });
            } else {
                th.imgSrc = this.src;
            }
        },
        methods: {
            
        }
    }
</script>
<style lang='less' scoped>
</style>