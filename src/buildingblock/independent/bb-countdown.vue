<template>
    <span :style="style" v-html="countDownTime"></span>
</template>

<script>
    export default {
        name: 'bb-countdown',
        props: {
            /*
                countdownConfig 计时器设置
                {
                    type:'reverse' 倒计时|| 'order' 正计时 || "reverseLength"
                    time:'', 开始时间 //正计时有效 || 结束时间 //倒计时  事件区间计时
                    countTime: 时间长度计时
                    words:'开始啦！', //截止后显示 倒计时有效
                    integral:'chinese',//分割样式
                    showOrder:'order' || reverse //显示顺序
                }
            */
            countdownConfig:{
                type:Object,
                default:function(){
                    return {
                        type:'reverse',
                        time:null,
                        countTime:60,
                        words:'即将开始！',
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
                countDownTime:null,
                style:null
            }
        },
        computed:{
        },
        watch: {
        },
        mounted:function(){
            const t = this;
            t.setStyle();
            if(t.countdownConfig.type == "reverseLength" || 1){
                t.CountTimeDown();
            }else{
                t.getCountDown();
            }
        },
        methods: {
            //bengin 触发倒计时
            bengin:function(){
                this.getCountDown();
            },
            //设置字体样式
            setStyle:function(){
                const t = this;
                const style = {
                    'font-size':t.styleConfig.fontSize,
                    'color':t.styleConfig.fontColor
                };
                t.style = style;
            },
            //事件区间倒计时
            getCountDown:function(){
                const t = this;
                //获取时间节点
                const timestamp = t.countdownConfig.time;
                t.setInterval = setInterval(function(){
                    const nowTime = new Date();
                    const endTime = new Date(timestamp);
                    let time = '';
                    if(t.countdownConfig.type == 'order'){
                        //正序
                        time = nowTime.getTime() - endTime.getTime();
                    }else{
                        //倒序
                        time = endTime.getTime() - nowTime.getTime();
                    }
                    //计算 天 时 分 秒
                    const day = Math.floor(time/1000/60/60/24);
                    let hour = Math.floor(time/1000/60/60%24);
                    let min = Math.floor(time/1000/60%60);
                    let sec = Math.floor(time/1000%60);
                    if (hour < 10) {
                         hour = "0" + hour;
                    }
                    if (min < 10) {
                         min = "0" + min;
                    }
                    if (sec < 10) {
                         sec = "0" + sec;
                    }
                    const timeArr = [];
                    timeArr.push(day,hour,min,sec);
                    if(time > 0){
                        //时间差于0 继续计时
                        t.setCountDownStyle(timeArr);
                    }else{
                        //时间差小于等于0 计时结束 显示文字
                        clearInterval(t.setInterval);
                        t.countDownTime = t.countdownConfig.words;
                        //计时结束 事件 countdown-finish
                        t.$emit('countdown-finish');
                    }
                },1000);
            },
            //设置倒计时样式
            setCountDownStyle:function(timeArr){
                const t = this;
                const chinese = ["天","小时","分钟","秒"];
                const english = [" days "," hours "," miniutes "," seconds "];
                const code = ["天 ",":",":",":"];
                //获取显示长度并根据长度遍历
                const length = t.countdownConfig.precision.split(',');
                let countDownTime = '';
                length.forEach((val,key)=>{
                    let realKey = key;
                    //倒序显示
                    if(t.countdownConfig.showOrder == 'reverse'){
                        realKey = length.length - 1 - key;
                    }
                    switch(t.countdownConfig.integral){
                        case "chinese":
                            countDownTime = countDownTime + timeArr[realKey] + chinese[realKey];
                            break;
                        case "english":
                            countDownTime = countDownTime + timeArr[realKey] + english[realKey];
                            break;
                        case "code":
                            countDownTime = countDownTime + timeArr[realKey] + code[realKey];
                            break;
                    }
                });
                //处理编码显示状态多出 ':'
                if(t.countdownConfig.integral == "code"){
                    if(t.countdownConfig.showOrder == 'reverse'){
                        countDownTime = countDownTime.slice(0,countDownTime.length);
                    }else{
                        countDownTime = countDownTime.slice(0,countDownTime.length - 1);
                    }
                };
                t.countDownTime = countDownTime;
            },
            //时间长度计时
            CountTimeDown:function(){
                const t = this;
                //获取时间节点
                let countTime = t.countdownConfig.countTime || 60;
                t.setInterval = setInterval(function(){
                    countTime = countTime - 1;
                    if(countTime > 0){
                        //时间差于0 继续计时
                        t.countDownTime = countTime + "s";
                    }else{
                        //时间差小于等于0 计时结束 显示文字
                        clearInterval(t.setInterval);
                        t.countDownTime = t.countdownConfig.words;
                        //计时结束 事件 countdown-finish
                        t.$emit('countdown-finish');
                    }
                },1000);
            },
        }
    }
</script>
<style lang='less' scoped>
    .bb-countdown{
    }
</style>