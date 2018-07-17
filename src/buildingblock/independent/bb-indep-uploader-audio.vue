<script>  
export default {
    name:"bb-indep-uploader-audio",
    components:{
    },
    props:{
        /*默认值 音频
            "http://www.baidu.com/1.img,http://www.baidu.com/2.img"
            ["http://www.baidu.com/1.img","http://www.baidu.com/2.img"]
        */
        value:{
            type:[Array,String],
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
        //读取前的回调函数
        /* beforeRead:{
        type:function,
        default:function(){
        return {}
        }
        },
        //读取完成后的回调函数
        afterRead:{
        type:function,
        default:function(){
        return {}
        }
        },*/
        //文件大小限制，单位为秒
        maxSize:{
            type:Number,
            default:600
        }
    },
   data(){ 
        return{
            valueBase:this.value,
            uploadUrl:"",
            recordTime:0,
            recordButtonClass:"ty ty-lvyin recordStart",
            status:"beforeRecord", //beforeRecord recordIng recordEnd
            file_url:"",
            uploadSuccess:false
        };
    },
    mounted: function () {
        const t = this;
        t.wx = _TY_Tool.wx;
    },
    render: function(createElement){
        const t = this;
        const maxSize = t.maxSize/60;
        const info = createElement('p',{props:{},class:"info"},[`录音时长${maxSize}分钟内,结束前请勿进行其他操作`]);
        const time = createElement('p',{props:{},class:"time"},[t.getTime()]);
        const button = createElement('i',{props:{},class:t.recordButtonClass,on:{
            // touchstart:t.startRecord,
            // touchend:t.endRecord
            click:t.recordFn
        }},[]);
        const recordRightChild = [];
        recordRightChild.push(time,info);
        const recordRight = createElement('div',{props:{},class:"recordRight"},[recordRightChild]);
        const record = createElement('div',{props:{},class:"record"},[button,recordRight]);
        const player = createElement('bb-indep-audio-player',{props:{value:t.valueBase}},[]);
        let audioUploader;
        if(t.status == "recordEnd" || t.valueBase){
            audioUploader = player;
        }else{
            audioUploader = record;
        }
        return audioUploader;
    },
    watch:{
        value(val){
            this.valueBase = val;
        },
        valueBase:{
            handler:(val,oldVal)=>{
            },
            deep:true
        },
      },    
    methods: {
        //获取子积木
        loadChildBB(){
            let t=this;
            return _TY_Tool.loadChildBB(t);                
        },
        recordFn(){
            if(this.status != "recording"){
                this.startRecord();
            }else{
                this.endRecord();
            }
        },
        startRecord(){
            if(_TY_Tool.isWX()){
                this.wxRecord();
            }else{
                _TY_Toast({content:"请在微信中打开"});
            }
        },
        endRecord(){
            const t = this;
            t.status = 'endRecord';
            clearInterval(t.timeInter);
            t.wx.stopRecord({
                success: function(voice){
                    t.recordButtonClass = "ty ty-lvyin recordStart";
                    const localId = voice.localId;
                    t.wx.uploadVoice({
                        localId:localId,
                        isShowProgressTips:1,
                        success:function(res){
                            t.uploadOss(res.serverId);
                        }
                    });
                },
                cancel: function () {
                },
                fail: function (res) {
                    alert(JSON.stringify(res));
                }
            });
        },
        wxRecord(){
            const  t = this;
            const recordTimer = setTimeout(function(){
                t.wx.startRecord({
                    success: function(res){
                        t.recordButtonClass = "ty ty-lvyin recordStart recordIng";
                        localStorage.rainAllowRecord = 'true';
                        t.status = 'recording';
                        t.timeInter = setInterval(()=>{
                            //时长控制
                            if(t.recordTime >= t.maxSize){
                                t.endRecord();
                                clearinterval(t.timeInter);
                            }else{
                                t.recordTime = t.recordTime + 1;
                            }
                        },1000);
                    },
                    cancel: function () {
                        alert('用户拒绝授权录音');
                    }
                });
            },300);
        },
        //计算录音时间
        getTime(){
            const t = this;
            let minute = parseInt(t.recordTime/60);
            let second = t.recordTime%60;
            minute = minute < 10?"0"+minute:minute;
            second = second < 10?"0"+second:second;
            let finelTime = minute + ":" + second;
            return finelTime;
        },
        //上传到oss  tx_id腾讯服务器上文件的id
        uploadOss(tx_id){
            const t = this;
            _TY_Toast({content:"上传中！",$type:"loading",duration:900000});
            _TY_Tool.post('/config/xlx_c_upload_amr_to_mp3',{
                media_id:tx_id
            }).then((res)=>{
                let check = setInterval(()=>{
                    if(t.uploadSuccess){
                        clearInterval(check);
                        t.valueBase = res.data.data.file_url;
                        //上传的文件名
                        t.file_name = res.data.data.file_serialize_name;
                        t.$emit("uploaded",t.valueBase);
                        t.$emit("change",t.valueBase);
                        t.$emit("input",t.valueBase);
                        _TY_Toast.closeAll();
                        _TY_Toast({content:"上传成功！",$type:"success"});
                    }else{
                        setTimeout(()=>{
                           t.uploadSuccess = true; 
                        },5000) 
                    }
                },2000);
            })
        },
        //轮询检查格式转换是否结束
        checkSuccess(src){
            const t = this;
            t.audio = document.createElement("audio");
            t.audio.setAttribute('src', src);
            t.audio.setAttribute('controls', 'controls');
            t.audio.oncanplay = function () {
                t.uploadSuccess = true;
            }
        }
    }
  }
</script>
<style lang="less">
    .bb-vant-uploader{
        margin:0.5rem;
        width: auto;
        display: inline-block;
        position: relative;
        .card{
            width: 2rem;
            height: 2rem;
            text-align: center;
            line-height: 2rem;
            background: rgba(142, 140, 140, 0.2);
            color: #999999;
            display: inline-block;
            margin-bottom: 0.1rem;
        }
        .uploaded-item{
            display: inline-block;
            position: relative;
            margin-right: 0.1rem;
            &:hover{
                &>i{
                    opacity:1;
                    transition: opacity .5s;
                }
            }
            &>i{
                color: #999;
                position: absolute;
                top: 0;
                right: 0;
                font-size: 0.5rem;
                opacity:1;
            }
            .uploaded-child{
                width: 2rem;
            }
        }
    }
    .record{
        .recordStart{
            font-size: 2rem;
            color: #ed2b2c;
            display: inline-block;
            float: left;
        }
        .recordRight{
            padding-top:0.5rem;
            font-size:0.34rem;
            color:#8c8c8c;
            .time{
                color:#ed2b2c;
            }
            .shiftTime{
                color:#24c789;
            }
        }
        .recordIng{
            color:#FFAEB9;
            animation: reacording 1s infinite;
        }
        @keyframes reacording{
            from {opacity:1}
            to {opacity:0.5}
        }

        @-moz-keyframes reacording /* Firefox */{
            from {opacity:1}
            to {opacity:0.5}
        }

        @-webkit-keyframes reacording /* Safari 和 Chrome */{
            from {opacity:1}
            to {opacity:0.5}
        }

        @-o-keyframes reacording /* Opera */{
            from {opacity:1}
            to {opacity:0.5}
        }
    }
</style>

