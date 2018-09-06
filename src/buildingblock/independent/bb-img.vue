<template>
    <img :src="imgSrc" @click="imgClick" onerror="javascript:this.src='';" v-bind:style="cssStyle"/>
</template>

<script>
    import Vue from 'vue';
    import Util from '../../libs/util.js';

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
            /*预定义样式设置
                居中圆形小头像：{
                    width: '50px',
                    height: '50px',
                    margin:'auto',
                    'border-radius':'50%',
                    display: 'block',
                    overflow: 'hidden'
                }
                居中方形小头像：{
                    width: '50px',
                    height: '50px',
                    margin:'auto',
                    display: 'block',
                    overflow: 'hidden'
                }
                居中圆形中头像：{
                    width: '75px',
                    height: '75px',
                    margin:'auto',
                    'border-radius':'50%',
                    display: 'block',
                    overflow: 'hidden'
                }
                居中方形中头像：{
                    width: '75px',
                    height: '75px',
                    margin:'auto',
                    display: 'block',
                    overflow: 'hidden'
                }
                居中圆形大头像：{
                    width: '100px',
                    height: '100px',
                    margin:'auto',
                    'border-radius':'50%',
                    display: 'block',
                    overflow: 'hidden'
                }
                居中方形大头像：{
                    width: '100px',
                    height: '100px',
                    margin:'auto',
                    display: 'block',
                    overflow: 'hidden'
                }

            */
            cssStyle:{
                type:[Object,String],
                default:function(){
                    return {
                        width: '50px',
                        height: '50px',
                        margin:'auto',
                        'border-radius':'50%',
                        display: 'block',
                        overflow: 'hidden'
                    };
                }
            },
            ds: {
                type: Object
            },
            //图片点击的按钮属性
            button:{
                type:Object
            }
        },
        watch:{
            src(val){
                this.imgSrc = val;
            }
        },
        data() {
            return {
                imgSrc: this.src
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
            //img点击事件
            imgClick:function(){
                let t=this;
                if(t.button){
                    _TY_Tool.resolveButton(t.button,_TY_Tool.buildTplParams(t));
                }
                t.$emit("click",t);
            }
        }
    }
</script>
<style lang='less' scoped>
</style>