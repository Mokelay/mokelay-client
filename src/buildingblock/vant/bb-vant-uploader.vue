<script>  
import Uploader from 'vant/lib/uploader';
import 'vant/lib/uploader/style';
import Icon from 'vant/lib/icon';
import 'vant/lib/icon/style';
import Toast from 'vant/lib/toast';
import 'vant/lib/toast/style';

export default {
    name:"bb-vant-uploader",
    components:{
        "vant-uploader":Uploader,
        "vant-icon":Icon
    },
    props:{
        /*默认值  回填图片  音频 或者 视频
            "http://www.baidu.com/1.img,http://www.baidu.com/2.img"
            ["http://www.baidu.com/1.img","http://www.baidu.com/2.img"]
        */
        value:{
            type:[Array,String],
            default:function(){
                return []
            }
        },
        //文件读取结果类型，可选值dataUrl，test
        resultType:{
            type:String,
            default:"dataUrl"
        },
        //接受的文件类型。默认值image/*
        accept:{
            type:String,
            default:"image/*"
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
        //文件大小限制，单位为byte
        maxSize:{
            type:Number
        },
        /*
        content:积木数据,
            content:[{                      //页面内容
                    uuid:'',
                    alias:'',                   //积木别名
                    aliasName:'',               //中文名称
                    group:'',                   //对应slot
                    attributes:{
                        attributeName:''    //表单项键值别名
                        rules:[]            //验证规则
                        width:''            //表单项宽度
                        ........            //其他积木属性
                    },              //积木属性
                    animation:[{                //动画
                        style:"",               //方式
                        time:0,                 //时间
                        delay:0,                //延迟时间
                        playNum:1               //播放次数
                        loop:true|false,        //循环
                        direction:""            //方向
                    }],
                    interactives:[{             //触发交互
                        uuid:'',
                        fromContentEvent:'',    //触发积木的事件,fromContentUUID为当前content的UUID
                        executeType:'',         //执行类型(预定义方法 trigger_method,
                                                //自定义方法 custom_script,
                                                //容器类方法 container_method)
                        executeScript:'',       //执行脚本 executeType = custom_script
                        executeContentUUID:'',  //执行积木的UUID executeType = trigger_method
                        executeContentMethodName:'',
                                                //执行积木的方法
                        containerMethodName:''  //容器方法 executeType = container_method
                    }],
                    layout:{                    //积木布局
                        sort:0,                 //排序 顺序排列布局下有效
                        bgColor:"",             //背景颜色
                        rotate:0,               //旋转
                        transparency:0,         //透明度
                        border:{                //边框
                            style:"",           //边框样式
                            color:"",           //边框颜色
                            size:"",            //边框尺寸
                            radius:"",          //边框弧度
                            margin:""           //边距
                        },
                        shadow:{                //阴影
                            color:"",           //阴影颜色
                            size:"",            //阴影大小
                            direction:'',       //阴影方向
                            vague:''            //阴影模糊
                        }
                    }
                }]
        */
        content:{
            type:Array
        },
        //上传接口配置
        uploadDs:{
            type:Object
        },
        /*其他属性设置  "picture" 表示图片view
            {
                theme:"card" "photograph" "picture" "custom" "video",
                replace:false//超过限制图片替换
                max:-1//最大上传个数  -1表示不限制

            }
        */
        option:{
            type:Object,
            default:function(){
                return {
                    theme:"card",
                    max:-1,//最大上传个数
                    replace:false//超过最大上传后，是否替换
                };
            }
        }
    },
   data(){ 
        return{
            valueBase:typeof this.value == "string"?this.value.split(","):this.value,
            uploadUrl:"",
            recordTime:0,
            uploadSuccess:false
        };
    },
    created: function () {
        const t = this;
        if(t.uploadDs){
            const api = t.uploadDs['api'];
            const type = t.uploadDs['category'];
            let apiUrl = api;
            if (type == 'config') {
                //如果不是自定义接口
                apiUrl = window._TY_ContentPath + "/" + api;
            }
            t.uploadUrl = apiUrl;
        }
    },
    render: function(createElement){
        const t = this;
        let children = [];
        let className = "default";
        switch(t.option.theme){
            case "card":
                children = createElement('i',{props:{},class:'ty ty-icon_tianjia'},[]);
                className = "card";
                break;
            case "photograph":
                children = createElement('vant-icon',{props:{name:'photograph'}},[]);
                className = "";
                break;
            case "video":
                children = createElement('i',{props:{},class:'ty ty-fbrj-shipin'},[]);
                className = "video";
                break;
            case "custom":
                if(t.content){
                    children = _TY_Tool.bbRender(t.content, createElement, t);
                    className = "";
                }
                break;
            case "picture":
                children.push(createElement('img',{
                    attrs:{
                        src:(t.valueBase&&t.valueBase.length>0)?t.valueBase[0]:''
                    },
                    style:{
                        width:'100%'
                    }
                },[]));
                if((!t.valueBase||t.valueBase.length<=0)){
                    //没有值的时候，显示编辑提示
                    children.push(createElement('span',{
                        style:{
                            position:'absolute',
                            bottom:'0.1rem',
                            right:'0.5rem',
                            'font-size': '0.3rem',
                            'text-align': 'center',
                            'line-height': '0.5rem',
                            background: '#999',
                            color: '#fff',
                            'border-radius': '.10666rem',
                            padding: '0.1rem .1rem .1rem .18rem',
                            'letter-spacing': '0.08rem'
                        }
                    },['修改']));
                }
                className = "";
                break;
        }
        let tmpStyle={};
        if(t.option.theme==='picture'&&(!t.valueBase||t.valueBase.length<=0)){
            //上传按钮是图片，并且没有src的时候
            tmpStyle = {
                'padding-bottom': '50%',
                height:'0',
                width:'100%'
            }
        }
        var itemClass = "uploaded-item";
        if(t.valueBase.length >= t.option.max && t.option.theme == "card"){
            className = "dsn";
        }
        var uploaderClass = "bb-vant-uploader";
        if(t.accept.indexOf("video")>-1 && t.valueBase.length == 1){
            uploaderClass = "bb-vant-uploader bb-vant-uploader-single";
            itemClass = "uploaded-item-lg";
        }
        const vantUpload = createElement('vant-uploader',{props:{
            "resultType":t.resultType,
            "accept":t.accept,
            "disabled":t.disabled,
            "maxSize":t.maxSize,
            "before-read":t.beforeRead,
            "after-read":t.afterRead,
        },on:{
            oversize:t.oversize
        },class:className,
        style:tmpStyle
        },[children,this.$slots.default]);
        //渲染已经上传的图片
        const picList = [];
        t.valueBase.forEach((ele,index)=>{
            const tag = t.accept == "video/*"?"bb-video":"img";
            const Img = createElement(tag,{props:{value:ele},attrs:{src:ele,controls:"controls"},class:"uploaded-child",on:{click:t.showDialog.bind(null,ele)}},[vantUpload]);
            const del = createElement('i',{props:{},on:{click:t.remove.bind(null,index)},class:"ty ty-icon_cuowu"},[]);
            const item = createElement('div',{props:{},class:itemClass},[Img,del]);
            picList.push(item);
        }); 
        const ul = createElement('ul',{props:{}},[picList]);

        let childs = [vantUpload,picList];
        if(t.option.theme=='picture'){
            childs = [vantUpload];
        }
        return createElement('div',{props:{},class:uploaderClass},childs);
    },
    watch:{
        value(val){
            // this.valueBase = val;
            this.valueBase = typeof val == "string"?val.split(","):val;
        }
      },    
    methods: {
      //事件submit
        oversize(val){
            let t=this;
            t.$emit('oversize',val,t);
        },
        //读取文件前
        beforeRead(file){
            return true;
        },
        //读取完成后
        afterRead(file){
            this.$emit("after-read",file);
            this.uploadeFile(file);
        },
        //文件上传
        uploadeFile(file){
            const t = this;
            let formdata = new FormData();
            formdata.append('file',file.file);
            console.log('正在上传。。。');
            //添加请求头 
            t.uploadUrl = t.uploadUrl?t.uploadUrl:"/config/ty_oss_upload";//统一文件上传地址
            if(t.accept.indexOf("video")>-1){
                t.uploadUrl = "/config/xlx_c_upload_mov_to_mp4"; //统一视频上传地址
            }
            const xhr = new XMLHttpRequest();  // XMLHttpRequest 对象
            xhr.open("post", t.uploadUrl, true); //post方式，url为服务器请求地址，true 该参数规定请求是否异步处理。
            xhr.onload = (res) => { 
                    const response = JSON.parse(res.target.response);
                    const intervalTime = t.accept.indexOf("video")>-1?2000:0;
                    const timeoutTime = t.accept.indexOf("video")>-1?5000:0;
                    let check = setInterval(()=>{
                        if(t.uploadSuccess){
                            clearInterval(check);
                            const url = response.data.file_url;
                            if(t.option.replace&&t.option.max>0&&t.valueBase.length>=t.option.max){//如果是替换的话
                                t.valueBase.splice(0,1,url);//替换第一个位置的文件
                            }else{
                                t.valueBase.push(url);
                            }
                            t.$emit('input',t.valueBase);
                            t.$emit('change',t.valueBase);
                            t.$emit('upload-success',t.valueBase);
                            _TY_Toast.closeAll();
                            _TY_Toast({content:"上传成功！"});
                        }else{
                            setTimeout(()=>{
                               t.uploadSuccess = true; 
                            },timeoutTime)
                        }
                    },intervalTime);
                }; //请求完成
            xhr.onerror =  (res) => { _TY_Toast({content:"上传失败！"})}; //请求失败
            xhr.send(formdata); //开始上传，发送form数据
            _TY_Toast({content:"上传中！",$type:"loading",duration:900000});
        },
        //获取子积木
        loadChildBB(){
            let t=this;
            return _TY_Tool.loadChildBB(t);                
        },
        //删除图片
        remove(index){
            const t = this;
            t.valueBase.splice(index,1);
            t.$emit('input',t.valueBase);
            t.$emit('change',t.valueBase);
        },
        //轮询检查格式转换是否结束
        checkSuccess(src){
            const t = this;
            //非视频不用检查转换进度
            if(!t.accept.indexOf("video")>-1){
                t.uploadSuccess = true;
            }
            t.video = document.createElement("video");
            t.video.setAttribute('src', src);
            t.video.setAttribute('controls', 'controls');
            t.video.oncanplay = function () {
                t.uploadSuccess = true;
            }
        },
        //点击查看大图
        showDialog(src){
            const img = [{                      //页面内容
                    uuid:_TY_Tool.uuid(),
                    alias:'bb-img',                   //积木别名
                    aliasName:'',               //中文名称
                    group:'',                   //对应slot
                    attributes:{
                        src:src
                    },              //积木属性
                    animation:[{                //动画
                    }],
                    interactives:[{             //触发交互
                    }],
                    layout:{                    //积木布局
                        display:"block",
                        positionType:"relative",  //展示类型
                        size:{width:"auto",height:"auto"},//大小
                        position:{x:0,y:0},     //位置
                        border:{                //边框
                            radian:"0",          //边框弧度
                            margin:"auto",          //外边距
                            padding:"0.2rem"
                        },
                    }
                }];
            _TY_Root.openDialog({type:"custom",arguments:{content:img,showConfirmButton:false,
confirmButtonText:"",closeOnClickOverlay:true}});
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
            float: left;
            margin-right: 0.1rem;
        }
        .uploaded-item{
            display: inline-block;
            position: relative;
            margin-right: 0.1rem;
            width: 2rem;
            height: 2rem;
            overflow: hidden;
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
                text-align: center;
                line-height: 2rem;
            }

        }
        .uploaded-item-lg{
            display: inline-block;
            position: relative;
            margin-right: 0.1rem;
            width: 100%;
            height: 4rem;
            overflow: hidden;
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
                width: 100%;
                text-align: center;
                line-height: 4rem;
            }
        }
        .video{
            font-size: 1rem;
            color: #7c808f;
            line-height: 1rem;
            margin-bottom: 1.76rem;
            margin-left: .3rem;
            display: inline-block;
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
            font-size:0.4rem;
            color:#8c8c8c;
            .time{
                color:#ed2b2c;
            }
        }
    }
    .dsn{
        display:none !important;
    }
    .bb-vant-uploader-single{
        width:100% !important;
        margin:0.5rem auto !important;
    }
</style>

