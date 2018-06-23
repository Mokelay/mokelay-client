<script>  
import Uploader from 'vant/lib/uploader';
import 'vant/lib/uploader/style';
import Icon from 'vant/lib/icon';
import 'vant/lib/icon/style';

export default {
    name:"bb-vant-uploader",
    components:{
        "vant-uploader":Uploader,
        "vant-icon":Icon
    },
    props:{
        value:{
            type:[String,Number]
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
    },
   data(){ 
        return{
            valueBase:this.value,
            uploadUrl:""
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
        let children = createElement('vant-icon',{props:{name:'photograph'}},[]);
        if(t.content){
            children = _TY_Tool.bbRender(t.content, createElement, t);
        }
        return createElement('vant-uploader',{props:{
            "resultType":t.resultType,
            "accept":t.accept,
            "disabled":t.disabled,      
            "maxSize":t.maxSizet,
            "before-read":t.beforeRead,
            "after-read":t.afterRead,
        },on:{
            oversize:t.oversize
        }},[children,this.$slots.default]);
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
            t.$emit('input',val,t);
            t.$emit('oversize',val,t);
        },
        //读取文件前
        beforeRead(file){
            return true;
        },
        //读取完成后
        afterRead(file){
            this.$emit("after-read",file);
        },
        //文件上传
        uploadeFile(file){
            const t = this;
            //创建form对象          
            let param = new FormData(); 
            //通过append向form对象添加数据
            param.append('file',file,file.name);
            //添加form表单中其他数据
            param.append('chunk','0');
            //FormData私有类对象，访问不到，可以通过get判断值是否传进去
            console.log(param.get('file')); 
            //添加请求头
            let config = {
                headers:{'Content-Type':'multipart/form-data'}
            };  
            _TY_Tool.post(t.uploadUrl,param,config)
            .then(response=>{
                t.$emit("upload-success",response.data);
                console.log(response.data);
            })
        },
        //获取子积木
        loadChildBB(){
            let t=this;
            return _TY_Tool.loadChildBB(t);                
        }
    }
  }
</script>

