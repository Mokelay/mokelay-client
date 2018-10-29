<script>
    export default {
        name: 'bb-dialog',
        render: function (createElement) {
            const t = this;
            const bbItems = _TY_Tool.bbRender(t.realContent, createElement, t);
            return createElement('el-dialog',{
                props:{
                    'title':t.title,
                    'visible':t.active,
                    'width':t.realWidth,
                    'custom-class':t.className,
                    'append-to-body':t.appendToBody,
                    'modal-append-to-body':t.modalAppendToBody,
                    'close-on-click-modal':t.closeOnClickModal,
                    'fullscreen':t.fullscreen,
                    'modal':true,
                    'lock-scroll':true,
                    'top':t.top||'0.5vh'
                },
                style:{
                    'border-radius':"5px",
                    'height':'99vh'
                },
                key:t.key,
                on:{
                    close:t.closeFn
                },
                class:'bb-dialog '+(t.autoMaxHeight?'':'max'),
                ref:"bb-dialog"
            },[bbItems,this.$slots.default]); //支持插槽
        },
        props: {
            //是否可以点击model 关闭dialog
            closeOnClickModal:{
                type:Boolean,
                default:true
            },
            title: {
                type: String,
                default: ""
            },
            size: {
                type: String,
                default: "small"
            },
            isShow: {
                type: Boolean,
                default: false
            },
            className: {
                type: String,
                default: ""
            },
            appendToBody:{
                type:Boolean,
                default:true
            },
            modalAppendToBody:{
                type:Boolean,
                default:true
            },
            width:{
                type:String
            },
            modal:{
                type:Boolean,
                default:true
            },
            fullscreen:{
                type:Boolean,
                default:false
            },
            /*
                content:积木数据,
                content:[{                      //页面内容
                        uuid:'',
                        alias:'',                   //积木别名
                        aliasName:'',               //中文名称
                        attributes:{
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
                type:[Array,String]
            },
            //不限最大高度
            autoMaxHeight:{
                type:Boolean,
                default:false
            },
            //弹窗距离顶部高度
            top:{
                type:String
            }
        },

        data() {
            return {
                active: false,
                realContent: this.content
          }
        },
        computed: {
              key() {//解决router指向同一个component，页面不刷新的问题
                return this.$route.name !== undefined? this.$route.name + +new Date(): this.$route + +new Date()
              },
            realWidth:function(){
                const t = this;
                let width = "50%"
                switch(t.size){
                    case "tiny":
                        width = "25%";
                        break;
                    case "small":
                        width = "50%";
                        break;
                    case "large":
                        width = "75%";
                        break;
                    case "full":
                        width = "100%";
                        break;
                }
                if(t.width){
                    width = t.width
                }
                return width
            }
        },
        watch: {
            isShow: function (val, oldVal) {
                this.active = val;
            },
            content: function (val) {
                this.realContent = val;
            }
        },
        mounted() {
            this.active = this.isShow;
        },
        methods: {
            closeFn:function() {
                this.active = false;
                this.$emit('closeDia');
                this.$emit('update:isShow', false);
            },
            closeDialog:function(){
                //因为有close事件，所以active变成false后，会自动执行closeFn 方法
                this.active = false;
            },
            loadChildBB:function(){
                let t=this;
                const childBB = [];
                if(t.content){
                    t.content.forEach((content,index)=>{
                        const bb = {
                            bbAlias: content.alias,
                            children: null,
                            name: content.aliasName,
                            uuid: content.uuid
                        }
                        childBB.push(bb);
                    });
                    return childBB;
                }else{
                    return _TY_Tool.loadChildBB(t);
                }     
            },
            show:function(){
                this.active = true;
                this.$emit('openDia');
                this.$emit('update:isShow', true);
            }
        }
    }
</script>
<style lang="less">
    .bb-dialog{
        .el-dialog{
            margin:auto;
            margin-top: 0.5vh;
            
            overflow: auto;
        }
        &.max .el-dialog{
            max-height: 99vh;
        }
        .el-dialog__body{
            max-height: 100vh;
            overflow-y: auto;
        }
        .el-dialog.is-fullscreen{
            overflow-y:hidden;
        }
    }
</style>