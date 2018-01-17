<template>

</template>

<script>
    export default {
        name: 'bb-countdown',
        props: {
            /*
                countdownConfig 计时器设置
                {
                    type:'reverse' 倒计时|| 'order' 正计时
                    startTime:'', 开始时间  //正计时有效
                    beforeStartWords:'还没开始！', //开始前显示 正计时有效
                    endTime:'',结束时间  //倒计时有效
                    startWords:'开始啦！', //截止后显示 倒计时有效
                    precision:'day,hour,minte,second', 显示精度
                    integral:'chinese',//分割样式
                    showOrder:'order' //显示顺序
                }
            */
            countdownConfig:{
                type:Object,
                default:function(){
                    return {
                        type:'reverse',
                        startTime:'',
                        endTime:'',
                        beforeStartWords:'还没开始！',
                        startWords:'开始啦！',
                        precision:'day,hour,minte,second',
                        integral:'chinese',
                        showOrder:'order'
                    }
                }
            },
            /*
                styleConfig 样式设置
                {
                    fontSize:'24px',
                    fontColor:'#cccccc'
                }

            */
            styleConfig:{
                type:Object,
                default:function(){
                    return {
                        fontSize:'24px',
                        fontColor:'#cccccc'
                    }
                }
            }

        },
        data() {
            return {
            }
        },
        computed:{
        },
        watch: {
        },
        mounted:function(){
        },
        methods: {
            //倒计时结束 事件 reverse-finish
            //正计时结束 事件 order-finish
            //bengin 方法
        }
    }
</script>
<style lang='less' scoped>
    .bb-countdown{
    }
</style>