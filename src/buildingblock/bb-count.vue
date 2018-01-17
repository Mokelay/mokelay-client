<template>
    <div class="bb-count" :style="{color:countConfig.color,'font-size':countConfig.size,'text-align':styles.align}">
        <img v-if="countConfig.buttonType == 'custom'" :src="countConfig.imgUrl" alt="" v-tap="tap">
        <i v-else :class="countConfig.icon" v-tap="tap"></i>
        <transition 
            name="custom-classes-transition"
            enter-active-class="animated bounceInUp"
            leave-active-class="animated bounceOutUp"
            :duration="200"
            @after-leave="afterLeave"
        >
            <p v-show="show" :style="{'line-height':styles.height,'display':styles.display}">{{valueBase}}</p>
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
                default:0
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
                    countType:'count' 计数器 || statistics 静态展示
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
                type:Object
            }

        },
        data() {
            return {
                valueBase: this.value,
                show:true,
                taped:false
            }
        },
        computed:{
            //如果按钮是图片则控制字体行高
            styles:function(){
                const t = this;
                let height = 'auto';
                if(t.countConfig.buttonType == 'custom'){
                    height = '115px';
                }
                let display = 'inline-block';
                let align = 'inherit';
                if(t.countConfig.layout == 'vertical'){
                    display = 'block';
                    align = 'center';
                }
                let styles = {
                    height:height,
                    display:display,
                    align:align
                }
                return styles;
            }
        },
        watch: {
        },
        mounted:function(){
            let t=this;
            _TY_Tool.buildDefaultValTpl(t,"valueBase");
            t.getData();
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
                                t[dataKey] = val.value;
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
                        }, function (code, msg) {
                    });
                }
            },
            //上传统计 事件  commit
            tap:function(){
                const t = this;
                if(t.countConfig.countType != 'statistics'){
                    t.show = !t.show;
                }
            },
            //恢复动画
            afterLeave:function(){
                const t = this;
                t.show = !t.show;
                //如果不可重复 则重复点击为取消
                if(!t.countConfig.repeat && t.taped){
                    t.valueBase --;
                    t.taped = false;
                    t.$emit('input',t.valueBase);
                    t.$emit('commit',t.valueBase);
                    t.commitData();
                }else{
                    //点击 值 增加1
                    t.valueBase ++;
                    t.taped = true;
                    t.$emit('input',t.valueBase);
                    t.$emit('commit',t.valueBase);
                    t.commitData();
                }
            }
        }
    }
</script>
<style lang='less' scoped>
    .bb-count{
        i,img{
            vertical-align: baseline
        }
        p{
            display: inline-block;
            vertical-align: bottom;
        }
        img{
            width: 115px;
            height: 115px;
        }
    }
</style>