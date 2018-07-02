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
        /*其他属性设置
            {
                theme:"card" "photograph" "custom"
            }
        */
        option:{
            type:Object,
            default:function(){
                return {
                    theme:"card"
                };
            }
            
        }
    },
   data(){ 
        return{
            valueBase:typeof this.value == "string"?this.value.split(","):this.value,
            uploadUrl:"",
            recordTime:0
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
            case "custom":
                if(t.content){
                    children = _TY_Tool.bbRender(t.content, createElement, t);
                    className = "";
                }
                break;
        }
        
        const vantUpload = createElement('vant-uploader',{props:{
            "resultType":t.resultType,
            "accept":t.accept,
            "disabled":t.disabled,      
            "maxSize":t.maxSizet,
            "before-read":t.beforeRead,
            "after-read":t.afterRead,
        },on:{
            oversize:t.oversize
        },class:className},[children,this.$slots.default]);
        //渲染已经上传的图片
        const picList = [];
        t.valueBase.forEach((ele,index)=>{
            const tag = t.accept == "video/*"?"bb-video":"img";
            const Img = createElement(tag,{props:{value:ele},attrs:{src:ele,controls:"controls"},class:"uploaded-child"},[vantUpload]);
            const del = createElement('i',{props:{},on:{click:t.remove.bind(null,index)},class:"ty ty-icon_cuowu"},[]);
            const item = createElement('div',{props:{},class:"uploaded-item"},[Img,del]);
            picList.push(item);
        }); 
        const ul = createElement('ul',{props:{}},[picList]);

        return createElement('div',{props:{},class:"bb-vant-uploader"},[vantUpload,picList]);
    },
    watch:{
        value(val){
            this.valueBase = val;
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
            t.uploadUrl = "/config/ty_oss_upload";
            const xhr = new XMLHttpRequest();  // XMLHttpRequest 对象
            xhr.open("post", t.uploadUrl, true); //post方式，url为服务器请求地址，true 该参数规定请求是否异步处理。
            xhr.onload = (res) => { 
                    const response = JSON.parse(res.target.response);
                    const url = response.data.file_url;
                    t.valueBase.push(url);
                    t.$emit('input',t.valueBase);
                    t.$emit('change',t.valueBase);
                    _TY_Toast({content:"上传成功！"});
                }; //请求完成
            xhr.onerror =  (res) => { _TY_Toast({content:"上传失败！"})}; //请求失败
            xhr.send(formdata); //开始上传，发送form数据
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
</style>

