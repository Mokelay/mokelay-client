<script>
    export default {
        name: 'bb-seriation-item-edit',
        render: function (createElement) {
            const t = this;          
            let realContent = Array.isArray(t.content)?t.content:[].concat(t.content);
            realContent = t.content?realContent:null;
            //生成积木内容
            const bbItems = _TY_Tool.bbRender(realContent, createElement, t);
            const contentElements = createElement('div',{props:{},attrs:{class:t.borderClass}},[bbItems,t.$slots.default]);
            //生成按钮
            const copyButton = createElement('bb-button',{props:{button:{type:'text',icon:t.realStyle.copy.icon},class:t.realStyle.copy.class},on:{click:t.copy}},[]);
            const upButton = createElement('bb-button',{props:{button:{type:'text',icon:t.realStyle.up.icon},class:t.realStyle.up.class},on:{click:t.up}},[]);
            const downButton = createElement('bb-button',{props:{button:{type:'text',icon:t.realStyle.down.icon},class:t.realStyle.down.class},on:{click:t.down}},[]);
            const removeButton = createElement('bb-button',{props:{button:{type:'text',icon:t.realStyle.remove.icon},class:t.realStyle.remove.class},on:{click:t.remove}},[]);
            const buttons = [];
            t.config.buttons.forEach((ele,key)=>{
                switch(ele){
                    case 'up':
                        buttons.push(upButton);
                        break;
                    case 'down':
                        buttons.push(downButton);
                        break;
                    case 'remove':
                        buttons.push(removeButton);
                        break;
                    case 'copy':
                        buttons.push(copyButton);
                        break;
                }
            })
            const buttonElements = createElement('div',{props:{},attrs:{class:'bb-seriation-item-buttons'},on:{}},buttons);
            //生成虚线框的编辑区域
            const editorArea = createElement('div',{props:{},attrs:{class:t.realStyle.content.class},on:{click:t.onFocus}},[buttonElements,contentElements]);
            //生成箭头
            const pointer = t.config.pointer?createElement('i',{props:{},attrs:{class:t.realStyle.pointer.class},on:{}},[]):[];

            return createElement('div',{attrs:{class:'bb-seriation-item-edit'}},[editorArea,pointer]); 
        },
        props: {
            /*config 配置
                {
                    horizontal:false, //水平排列
                    pointer:false  //展示箭头
                    buttons:['copy','up','down','remove'] //需要展示的按钮
                }
            */
            config:{
                type:Object,
                default:function(){
                    return {
                        horizontal:false, //水平排列
                        pointer:false,
                        buttons:['copy','up','down','remove'],
                        onFocus:false
                    }
                }
            },
            /*
                content:积木数据,
                content:[{                      //页面内容
                        uuid:'',
                        alias:'',                   //积木别名
                        aliasName:'',               //中文名称
                        attributes:{},              //积木属性
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
                type:[Object,Array]

            }
        },
        data() {
            return {
                //垂直样式
                vertical:{
                    up:{
                        class:'ma fs16',
                        icon:'ty-icon_shangyi',
                    },
                    down:{
                        class:'ma fs16',
                        icon:'ty-icon_xiayi'
                    },
                    remove:{
                        class:'ma fs16',
                        icon:'ty-icon_lajitong'
                    },
                    copy:{
                        class:'ma fs16',
                        icon:'ty-wenjuan_fuzhi'
                    },
                    pointer:{
                        class:'ty-jiantou lh100'
                    },
                    content:{
                        class:'content'
                    }

                },
                //水平样式
                horizontal:{
                    up:{
                        class:'ma fs16',
                        icon:'ty-icon_jiangtoul',
                    },
                    down:{
                        class:'ma fs16 rotate180',
                        icon:'ty-icon_jiangtoul'
                    },
                    remove:{
                        class:'ma fs16',
                        icon:'ty-icon_lajitong'
                    },
                    copy:{
                        class:'ma fs16',
                        icon:'ty-wenjuan_fuzhi'
                    },
                    pointer:{
                        class:'ty-jiantou rotate90 w15 vat lh200 dib'
                    },
                    content:{
                        class:this.config.pointer?'content dib w80':'content dib'
                    }
                },
                realStyle:{},
                borderClass:'border'
            }
        },
        watch: {
        },
        created: function () {
            const  t = this;
            t.realStyle = t.config.horizontal?t.horizontal:t.vertical;
            if(t.config.onFocus){
                t.onFocus();
            }
        },
        mounted:function(){
        },
        methods: {
            //当前积木选中状态
            onFocus:function(){
                //不可编辑
                const notCanOpt = this.content.group&&this.content.group==='notCanOpt';
                if(notCanOpt){
                    return ;
                }
                if(this.borderClass == "border borderSelected"){
                    this.onBlur();
                }else{
                    this.$emit('onFocus',this);
                    this.borderClass = "border borderSelected";
                }
            },
            //失焦状态
            onBlur:function(){
                this.$emit('onBlur',this);
                this.borderClass = "border";
            },
            //上移返回当前的积木数据
            up:function(){
                this.$emit('up',this);
            },
            //下移返回当前的积木数据
            down:function(){
                this.$emit('down',this);
            },
            //删除返回当前的积木数据
            remove:function(){
                this.$emit('remove',this);
            },
            //复制节点
            copy:function(){
                this.$emit('copy',this);
            },
            loadChildBB(){
                let t=this;
                return _TY_Tool.loadChildBB(t);                
            }
        }
    }
</script>
<style lang='less'>
    .bb-seriation-item-edit{
        .content{
            width: 100%;
            margin: 5px auto;
            overflow-y: auto;
            position: relative;
            &:hover{
                .bb-seriation-item-buttons{
                    opacity:1;
                    transition: opacity .5s;
                }
            }
        }
        &>i{
            text-align: center;
            width: 100%;
            font-size: 60px;
            color: #999999;
        }
        border-box:box-sizing;
        .border{
            width: 100%;
            border:2px dashed #cccccc;
            border-color: #cccccc;
            display: inline-block;
            float: left;
            transition: border-color .1s;
            min-height: 45px;
        }
        .borderSelected{
            border-color: #0091ea;
            transition: border-color .1s;
        }
        .legoborder{
            
        }
        .bb-seriation-item-buttons{
            display: inline-block;
            text-align: right;
            opacity:0;
            transition: opacity .1s;
            position: absolute;
            padding-right: 5px;
            z-index: 100;
            width: 100%;
            height: 100%;
            /*top: -10px;*/
        }
        .w20{
            width: 20%;    
        }
        .w15{
            width: 15%;    
        }
        .w80{
            width: 80%;    
        }
        .w100{
            width: 100%;    
        }
        .ma{
            margin: auto;
        }
        .fs16{
            font-size: 16px;
        }
        .rotate90{
            transform:rotate(-90deg);
            -ms-transform:rotate(-90deg);
            -moz-transform:rotate(-90deg);
            -webkit-transform:rotate(-90deg);
            -o-transform:rotate(-90deg);
        }
        .rotate180{
            transform:rotate(180deg);
            -ms-transform:rotate(180deg);
            -moz-transform:rotate(180deg);
            -webkit-transform:rotate(180deg);
            -o-transform:rotate(180deg);
        }
        .fl{
            float: left;
        }
        .vat{
            vertical-align: top;
        }
        .lh100{
            line-height: 100px;
        }
        .lh200{
            line-height: 200px;
        }
        .dib{
            display: inline-block;
        }
    }
</style>