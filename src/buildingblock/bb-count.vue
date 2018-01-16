<template>
    <div class="bb-count" :style="{color:countConfig.color,'font-size':countConfig.size}">
        <img v-if="countConfig.buttonType == 'custom'" :src="countConfig.imgUrl" alt="" v-tap="tap">
        <i v-else :class="countConfig.icon" ></i>
        <transition 
            name="custom-classes-transition"
            enter-active-class="animated bounceInUp"
            leave-active-class="animated bounceOutUp"
            :duration="200"
            @after-leave="afterLeave"
        >
            <p v-show="show">{{valueBase}}</p>
        </transition>
        
    </div>
</template>

<script>
    export default {
        name: 'bb-count',
        props: {
            /*
                value 默认值 支持v-model
            */
            value:{
                type:Number,
                default:100
            },
            /*
                defaultValTpl 模板默认值
            */
            defaultValTpl:{
                type:[String,Number,Boolean]
            },
            /*
                countConfig 计数设置
                {
                    buttonType:'default || custom', 默认 或者自定义图片
                    layout:'horizontal || vertical   布局
                    color:'#333'  会改变图标和字体的颜色
                    size:'14px' 字体大小
                    icon:'ty-star-on' 按钮图标 buttonType为default时有效
                    imgUrl:''  按钮图片 buttonType为custom时有效
                    repeat: false || true 允许重复提交
                }
            */
            countConfig:{
                type:Object,
                default:function(){
                    return {
                        buttonType:'custom',
                        layout:'horizontal',
                        color:'#3d3d3d',
                        size:'20px',
                        icon:'ty-star-on',
                        repeat:false,
                        imgUrl:'http://img1.imgtn.bdimg.com/it/u=4074159533,3671406090&fm=27&gp=0.jpg'
                    }
                }
            },
            /*
                readDs 读取动态统计数据
            */
            readDs:{
                type:Object
            },
            /*
                commitDs 上传当前统计数据
            */
            commitDs:{
                type:Object,
                default:function(){
                    return {

                    }
                }
            }

        },
        data() {
            return {
                valueBase: this.value,
                show:true,
                taped:false,
            }
        },
        computed:{
        },
        watch: {
        },
        mounted:function(){
            let t=this;
            _TY_Tool.buildDefaultValTpl(t,"valueBase");
        },
        methods: {
            //读取统计数据
            getData: function () {
                const t = this;
                if (t.readDs) {
                    _TY_Tool.getDSData(t.readDs, {"bb": t, "router": t.$route.params,"external":t.external}, 
                        function (map) {
                            map.forEach((val,key)=>{
                                const dataKey = val.dataKey
                                t[dataKey] = val.value.list;
                            })
                        }, function (code, msg) {
                    });
                }
            },
            //提交统计
            commitData: function () {
                const t = this;
                if (t.commitDs) {
                    _TY_Tool.getDSData(t.commitDs, {"bb": t, "router": t.$route.params,"external":t.external}, function (map) {
                            map.forEach((val,key)=>{
                                const dataKey = val.dataKey
                                t[dataKey] = val.value.list;
                            })
                        }, function (code, msg) {
                    });
                }
            },
            //上传统计 事件  commit
            tap:function(){
                const t = this;
                if(t.commitDs){
                    t.show = !t.show;
                }
            },
            //恢复动画
            afterLeave:function(){
                const t = this;
                t.show = !t.show;
                if(!t.countConfig.repeat && t.taped){
                    t.valueBase --;
                    t.taped = false;
                }else{
                    t.valueBase ++;
                    t.taped = true;
                }
            }
        }
    }
</script>
<style lang='less' scoped>
    .bb-count{
        max-height: 100px;
        overflow:hidden;
        i,img{
            vertical-align: baseline
        }
        p{
            display: inline-block;
            vertical-align: bottom;
        }
        img{
            width: 100%;
            height: 100%;
            max-width: 100%;
            max-height: 100%;
        }
    }
</style>