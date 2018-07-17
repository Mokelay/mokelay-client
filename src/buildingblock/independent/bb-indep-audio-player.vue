<template>
	<div class="audioPlayer">
       <!--  <audio style="height:2rem;" src="http://ty.saiyachina.com/config/ty_oss_download?bucketName=ty-storage&fileName=569bef9c3e6c5d3542dcf11306dcf8a1.mp3" controls="controls">
                                            您的浏览器不支持 audio 标签。
                                            </audio> -->

        <div class="audio-wrapper">
            <audio :id="audioId" :src="valueBase" type="audio/mpeg">
            </audio>
            <div class="audio-left" @click="togglePlay"><i :class="palyButtonIcon"></i></div>
            <div class="audio-right">
                <span>
                    <span class="audio-length-current" id="audioCurTime">{{time}}</span>
                    <span class="progress-color-bar" :style="{width:playedWidth}" @mousedown="setCurrentTime"><span id="progressDot" class="progress-dot" :style="{left:playedLeft}" @mousedown="setDot"></span></span>
                    <span class="progress-bar" id="progressBar" @mousedown="setCurrentTime"></span>
                    <span class="audio-length-total">{{transferRecordTime}}</span>
                </span>
            </div>
        </div>
	</div>
</template>
<script>  
export default {
    name:"bb-indep-audio-player",
    components:{
    },
    props:{
        /*默认值  回填图片  音频 或者 视频
            "http://www.baidu.com/1.img,http://www.baidu.com/2.img"
            ["http://www.baidu.com/1.img","http://www.baidu.com/2.img"]
        */
        value:{
            type:[Array,String]
        },
        //文件读取结果类型，可选值dataUrl，test
        resultType:{
            type:String,
            default:"dataUrl"
        },
        //接受的文件类型。默认值image/*
        accept:{
            type:String,
            default:"audio/*"
        },
        //是否禁用图片上传
        disabled:{
            type:Boolean,
            default:false
        },
    },
   data(){ 
        return{
            valueBase:this.value,
            time:"0:00",
            recordTime:"0:00",
            transferRecordTime:"0:00",
            palyButtonIcon:"ty ty-lvyinpf fcGreen",
            status:"beforeRecord", // playing pause played
            audioId:_TY_Tool.uuid(),
            playedWidth:"-1px",
            playedLeft:"-1px",
            canPlay:false,
            totalWidth:0,
        };
    },
    mounted: function () {
        const  t = this;
        t.audio = document.getElementById(t.audioId);
        t.totalWidth = document.getElementsByClassName("progress-bar")[0].offsetWidth + 5;
        t.audio.oncanplay = function () {
            t.recordTime = t.audio.duration != Infinity?t.audio.duration : 100;
            t.canPlay = true;
            t.transferRecordTime = t.transTime(t.recordTime);
        }
        // 监听音频播放时间并更新进度条
        t.audio.addEventListener('timeupdate', function () {
            t.updateProgress(t.audio);
        }, false);
        // 监听播放完成事件
        t.audio.addEventListener('ended', function () {
            t.audioEnded();
        }, false);
    },
    watch:{
        value(val){
            this.valueBase = val;
        },
        status(val){
        	switch(val){
        		case "played":
        			this.playButtonClass = "ty ty-icon_qiyong played";
        			break;
        		case "playing":
        			this.playButtonClass = "ty ty-wj_radio_examination playing";
        			break;
        		case "pause":
        			this.playButtonClass = "ty ty-icon_qiyong pause";
        			break;
        	}	
        }
      },    
    methods: {
        //计算录音时间
        getTime(){
            const t = this;
            let minute = parseInt(t.recordTime/60);
            let second = t.recordTime%60;
            minute = minute < 10?"0"+minute:minute;
            second = second < 10?"0"+second:second;
            let finelTime = minute + ":" + second;
            t.recordTime = t.recordTime - 1;
            return finelTime;
        },
        //播放录音
        play(){
            const t = this;
            if(t.status != "playing"){
            	t.status = "playing"
            	t.audio.play();
            	t.shift = setInterval(()=>{
            		t.time = t.getTime();
            	},1000);
            }else{
            	t.status = "pause"
            	t.audio.pause();
            	clearInterval(t.shift);
            }
        },
        togglePlay(){
            const t = this;
            if(!t.canPlay){
                return
            }
            if (t.audio.paused) {
                t.status = "playing"
                t.palyButtonIcon = "ty ty-lvyin fcRed";
                // 开始播放当前点击的音频
                t.audio.play(); 
            } else {
                t.status = "pause"
                t.audio.pause();
                t.palyButtonIcon = "ty ty-lvyinpf fcGreen";
            }
        },
        /**
         * 更新进度条与当前播放时间
         * @param {object} audio - audio对象
         */
        updateProgress() {
            const t = this;
            let value = (t.audio.currentTime / t.recordTime) * 0.90;
            t.playedWidth = value * t.totalWidth + 'px';
            let left = (value * t.totalWidth) - 1;
            t.playedLeft = left + 'px';
            t.time = t.transTime(t.audio.currentTime);
        },
        /**
         * 音频播放时间换算
         * @param {number} value - 音频当前播放时间，单位秒
         */
        transTime(value) {
            const t = this;
            let time = "";
            let h = parseInt(value / 3600);
            value %= 3600;
            let m = parseInt(value / 60);
            let s = parseInt(value % 60);
            if (h > 0) {
                time = t.formatTime(h + ":" + m + ":" + s);
            } else {
                time = t.formatTime(m + ":" + s);
            }

            return time;
        },
        /**
         * 格式化时间显示，补零对齐
         * eg：2:4  -->  02:04
         * @param {string} value - 形如 h:m:s 的字符串 
         */
        formatTime(value) {
            let time = "";
            let s = value.split(':');
            let i = 0;
            for (; i < s.length - 1; i++) {
                time += s[i].length == 1 ? ("0" + s[i]) : s[i];
                time += ":";
            }
            time += s[i].length == 1 ? ("0" + s[i]) : s[i];

            return time;
        },
        /**
         * 播放完成时把进度调回开始的位置
         */
        audioEnded() {
            const t = this;
            t.playedWidth = 0;
            t.playedLeft = 0;
            t.palyButtonIcon = "ty ty-lvyinpf fcGreen";
        },
        setCurrentTime(e) {
            const t = this;
            // 只有音乐开始播放后才可以调节，已经播放过但暂停了的也可以
            if (!t.audio.paused || t.audio.currentTime != 0) {
                let rate = e.offsetX / t.totalWidth;
                t.audio.currentTime = t.recordTime * rate;
                t.updateProgress(t.audio);
            }
        },
        setDot(e){
            const t = this;
            // 鼠标拖动进度点时可以调节进度
            // 只有音乐开始播放后才可以调节，已经播放过但暂停了的也可以
            // 鼠标按下时
            if (!t.audio.paused || t.audio.currentTime != 0) {
                let oriLeft = e.currentTarget.offsetLeft;
                let mouseX = e.clientX;
                let maxLeft = oriLeft; // 向左最大可拖动距离
                let maxRight = t.totalWidth - oriLeft; // 向右最大可拖动距离

                // 禁止默认的选中事件（避免鼠标拖拽进度点的时候选中文字）
                if (e.preventDefault) {
                    e.preventDefault();
                } else {
                    e.returnValue = false;
                }

                // 禁止事件冒泡
                if (e && e.stopPropagation) {
                    e.stopPropagation();
                } else {
                    window.event.cancelBubble = true;
                }

                // 开始拖动
                document.onmousemove = function (e) {
                    let length = e.clientX - mouseX;
                    if (length > maxRight) {
                        length = maxRight;
                    } else if (length < -maxLeft) {
                        length = -maxLeft;
                    }
                    let rate = (oriLeft + length) / t.totalWidth;
                    t.audio.currentTime = t.recordTime * rate;
                    updateProgress(t.audio);
                };

                // 拖动结束
                document.onmouseup = function () {
                    document.onmousemove = null;
                    document.onmouseup = null;
                };
            }
        }
    }
}
</script>
<style lang="less">
    .audioPlayer{
        .played{
            font-size: 1.4rem;
            color: #24c789;
            display: inline-block;
            float: left;
        }
        .playing{
            font-size: 1.4rem;
            color: #24c789;
            display: inline-block;
            float: left;
        }
        .pause{
            font-size: 1.4rem;
            color: #24c789;
            display: inline-block;
            float: left;
        }
        .shiftTime{
        	padding-top:0.5rem;
            font-size:0.4rem;
        	color:#24c789;
        }
        .audio-wrapper {
            background-color: #fcfcfc;
            margin: 0.1rem auto;
            max-width: 100%;
            height: 2rem;
            border: 1px solid #fbfbfb;
        }
        .audio-left {
            float: left;
            text-align: center;
            width: 18%;
            height: 100%;
            color:#24C789;
            font-size:1.5rem;
            line-height:1.8rem;
        }
        .audio-right{
            float: left;
            line-height:2rem;
            width:82%;
            &>span{
                position: relative;
                display: inline-block;
                width: 100%;
            }
            .progress-dot{
                width: .5rem;
                height: .5rem;
                display: inline-block;
                border-radius: 50%;
                background-color: #fff;
                border: .12rem solid #24C789;
                position: absolute; 
                top: -0.17rem;
            }
            .progress-bar{
                width: 55%;
                border-bottom: 2px solid #ccc;
                height: 1px;
                display: inline-block;
                vertical-align: middle;
            }
            .progress-color-bar{
                width: 0rem;
                height: 4px;
                display: inline-block;
                background-color: #24C789;
                position: absolute;
                top: 1rem;
            }
            .audio-length-current,.audio-length-total{
                display: inline-block;
                width: 1rem;
                font-size:0.4rem;
            }
        }
        .fcGreen{
            color:#24C789;
        }
        .fcRed{
            color:#EA2E34;
        }
    }
</style>

