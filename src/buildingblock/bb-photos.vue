<template>
    <div class="bb-photos" v-swipeleft="swipe" v-swiperight="swipe">
        
        <ul>
            <li v-for="(pic,index) in realFields" :key="index">
                <transition 
                    name="custom-classes-transition"
                    :enter-active-class="transformAnimate.enter"
                    :leave-active-class="transformAnimate.leave"
                    @after-leave="afterLeave"
                >
                    <img v-show="pic.show":src="pic.url" :alt="pic.name">
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
                type:[Array,String],
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
                transformAnimate:{
                    enter:'',
                    leave:''
                },
                goNext:true,
                lastItem:null,
                nowItem:0,
                nextItem:null,
            }
        },
        computed:{
        },
        watch: {
        },
        created: function () {
        },
        mounted:function(){
            this.getData();
            this.setTransformAnimate();
            if(this.realFields){
                this.setShow();
            }
        },
        methods: {
            //获取图片地址
            getData: function () {
                const t = this;
                if (t.fieldsDs) {
                    _TY_Tool.getDSData(t.fieldsDs, {"bb": t, "router": t.$route.params,"external":t.external}, function (map) {
                        map.forEach((val,key)=>{
                            const dataKey = val.dataKey
                            t.realFields = val.value.list;
                            //触发积木更新
                            if(t.realFields){
                                t.setShow();
                            }
                        })
                    }, function (code, msg) {
                    });
                }
            },
            //支持外部传参
            linkage:function(...data){
                if(data){
                    this.external['linkage'] = data;
                    this.getData();
                }
            },
            //初始化图片显示
            setShow:function(){
                const t = this;
                t.realFields.forEach((val,key) => {
                    val.show = false;
                });
                //触发自动轮播
                t.autoTransform();
                //触发积木状态更新
                const ele = t.realFields[0];
                ele.show = true;
                t.$set(t.realFields,0,ele);
            },
            //设置自动轮播
            autoTransform:function(){
                const t = this;
                if(t.transformConfig.transformMode == 'auto'){
                    t.setTransformAnimate();
                    t.setInterval = setInterval(t.nextPhoto,t.transformConfig.transformTime);
                }
            },
            //计算并下一张动画
            nextPhoto:function(){
                
                const t = this;
                if(t.goNext){
                    //前进
                    let nextItem = t.nowItem == t.realFields.length - 1?0:t.nowItem+1;
                    t.realFields[t.nowItem].show = false;
                    t.realFields[nextItem].show = true;
                    t.nowItem = nextItem
                }else{
                    console.log('in fan');
                    //后退
                    let nextItem = t.nowItem == 0?t.realFields.length - 1:t.nowItem-1;
                    t.realFields[t.nowItem].show = false;
                    t.realFields[nextItem].show = true;
                    t.nowItem = nextItem
                }
                const ele = t.realFields[t.nowItem];
                t.$set(t.realFields,t.nowItem,ele);
            },
            //初始化切换动画
            setTransformAnimate:function(){
                const t = this;
                const animate = t.transformConfig.transformAnimate.split(',');
                if(t.goNext){
                    //正向入场动画
                    t.transformAnimate.enter ='animated ' + animate[0];
                    //正向离场动画
                    t.transformAnimate.leave ='animated ' + animate[1];  
                }else{
                    //反向入场动画
                    t.transformAnimate.enter ='animated ' + animate[2];
                    //反向离场动画
                    t.transformAnimate.leave ='animated ' + animate[3];
                }
            },
            //滑动触发图片转换
            swipe:function(s,e){
                const t = this;
                if(s.deltaX > 100){
                    t.goNext = false;
                    clearInterval(t.setInterval);
                    //计算并下一张动画
                    t.nextPhoto();
                    //修改动画
                    t.setTransformAnimate();
                }
                if(s.deltaX < -100){
                    t.goNext = true;
                    clearInterval(t.setInterval);
                    t.nextPhoto();
                    t.autoTransform();
                }  
            },
            //出动画之后纠正轮播状态为向前
            afterLeave:function(){
                const t = this;
                if(!t.goNext){
                    t.goNext = true;
                    //还原正向动画
                    t.setTransformAnimate();
                    t.autoTransform();
                }
            }
        }
    }
</script>
<style lang='less'>
    .bb-photos{
        width: 100%;
        min-height: 300px;
        ul{
            width:100%;
        }
        ul li{
            position: absolute;
            top: 0;
            img{
                width: 100%;
            }
        }
    }
</style>
