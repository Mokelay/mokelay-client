<template>
    <div class="bb-photos" @touchend="swipe">
        <ul>
            <li v-for="(pic,index) in realFields" :key="index">
                <transition 
                    name="custom-classes-transition"
                    :enter-active-class="transformAnimate.enter"
                    :leave-active-class="transformAnimate.leave"
                >
                    <img v-if="pic.show":src="pic.url" :alt="pic.name">
                </transition>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        name: 'bb-photos',
        props: {
            /*
                fields 图片地址数组或者','隔开的字符串
                数组：[{url:'',name:''}]，
                字符串：'https://a.jpg,https://b.jpg'
            */
            fields:{
                type:[Array,String]
            },
            /*  fieldsDs 动态图片数据源*/
            fieldsDs:{
                type:Object
            },
            /*
                transformConfig 样式
                {
                    transformMode:'auto',   auto || manual  图片变换方式
                    transformTime:2, 图片变换时间间隔
                    transformAnimate:'' 图片变换动画
                }
            */
            transformConfig:{
                type:Object,
                default:function(){
                    return {
                        transformMode:'auto', 
                        transformTime:5000,
                        transformAnimate:'fadeInRight,fadeOutLeft',
                        show:true
                    }
                }
            }
        },
        data() {
            return {
                show:true,
                realFields:this.fields,
                showArr:[],
                int:0,
                transformAnimate:{
                    enter:'',
                    leave:''
                }
            }
        },
        computed:{
        },
        watch: {
        },
        created: function () {
        },
        mounted:function(){
             this.setTransformAnimate();
             this.setShow();
             if(this.transformConfig.transformMode == 'auto'){
                this.autoTransform();
             };
        },
        methods: {
            //设置图片显示
            setShow:function(){
                const t = this;
                t.showArr = [];
                t.realFields.forEach((val,key) => {
                    val.show = false;
                });
                const ele = t.realFields[0];
                ele.show = true;
                t.$set(t.realFields,0,ele)
            },
            //设置自动轮播
            autoTransform:function(){
                const t = this;
                let int = 0;
                setInterval(function(){
                    t.realFields[int].show = true;
                    //隐藏上一个
                    let lastItem = 0;
                    if(int == 0){
                        lastItem = t.realFields.length - 1
                    }else{
                        lastItem = int - 1
                    }
                    t.realFields[lastItem].show = false;
                    //当指针大于数组长度重新循环
                    if(int == t.realFields.length - 1){
                        int = 0;
                    }else{
                        int++; 
                    }
                    const ele = t.realFields[int]
                    t.$set(t.realFields,int,ele)
                },t.transformConfig.transformTime);
            },
            //获取切换动画
            setTransformAnimate:function(){
                const t = this;
                t.transformAnimate.enter ='animated ' + t.transformConfig.transformAnimate.split(',')[0];
                t.transformAnimate.leave ='animated ' + t.transformConfig.transformAnimate.split(',')[1];
            },
            swipe:function(params){

            }
        }
    }
</script>
<style lang='less' scoped>
    .bb-photos{
        width: 100%;
        ul li{
            position: absolute;
            top: 0;
            img{
                width: 100%;
            }
        }
    }
</style>