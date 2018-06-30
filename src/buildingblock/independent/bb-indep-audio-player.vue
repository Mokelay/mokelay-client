<template>
	<div class="audioPlayer">
<!-- 		<i :class="playButtonClass" @click="play"></i>
		<p class="shiftTime">{{time}}</p> -->
		<audio id="audio" :src="valueBase" controls="controls"></audio>
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
            type:[Array,String],
            default:"http://www.w3school.com.cn/i/horse.ogg"
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
            time:"00:00",
            recordTime:0,
            playButtonClass:"ty ty-icon_qiyong played",
            status:"beforeRecord" // playing pause played
        };
    },
    mounted: function () {
         this.audio=document.getElementById("audio");
         this.recordTime = this.audio.duration;
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
    }
</style>

