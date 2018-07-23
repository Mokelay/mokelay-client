
<script>
    export default {
        name: 'bb-indep-dialog',
        render: function (createElement) {
            const t = this;
            let dialog;
            if(t.canRender){
                //当可以渲染的时候才能渲染
                const bbItems = _TY_Tool.bbRender(t.realContent, createElement, t);
                if(window._TY_Platform=='PC'){
                    dialog = t._renderPCDialog(createElement,bbItems);
                }else{
                    dialog = t._renderH5Dialog(createElement,bbItems);
                }
            }
            return dialog;
        },
        props: {
            //弹框自定义头部
            titleContent:{
                type:Array
            },
            //内容积木列表
            content:{
                type:[Array,String]
            },
            //是否显示
            isShow:{
                type: Boolean,
                default: true
            },
            //弹窗标题
            title:{
                type:String
            },
            //消息内容  针对H5
            message:{
                type:String
            },
            //是否展示确认按钮  针对H5
            showConfirmButton:{
                type:Boolean,
                default:true
            },
            //是否显示取消按钮  针对H5
            showCancelButton:{
                type:Boolean,
                default:false
            },
            //确认按钮文案  针对H5
            confirmButtonText:{
                type:String,
                default:"确认"
            },
            //取消按钮的文案  针对H5
            cancelButtonText:{
                type:String,
                default:"取消"
            },
            //是否有蒙层
            overlay:{
                type:Boolean,
                default:true
            },
            //是否点击蒙层关闭弹窗
            closeOnClickOverlay:{
                type:Boolean,
                default:false
            },
            //是否锁定背景滚动
            lockScroll:{
                type:Boolean,
                default:true
            },
            //是否显示右上角关闭按钮，针对pc
            showClose:{
                type:Boolean,
                default:true
            },
            //dialog宽度 针对pc
            width:{
                type:String
            },
            size:{
                type:String,
                default:'small'
            },
            //是否全屏 针对pc
            fullscreen:{
                type:Boolean,
                default:false
            },
            //dialog margin-top长度 针对pc
            top:{
                type:String,
                default:"15vh"
            }
        },
        data() {
            return {
                canRender:false,//标记是否可以渲染
                realContent: this.content,
                active:this.isShow,//是否显示弹窗
                linkage:null
            }
        },
        computed:{
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
        created: function () {
            const t=this;
            //按需加载弹窗组件
            if(window._TY_Platform=='PC'){
                t._initPcDialog();
            }else{
                //加载h5 vantdialog组件
                t._initH5Dialog(); 
            }
        },
        mounted:function(){
            let t=this;
        },
        methods: {
            //加载PCdialog
            _initPcDialog:function(){
                let t=this;
                //引入第三方vant 的dialog组件
                const ElDialogView = r => require.ensure([], () => r(require('element-ui')), 'element-ui');
                ElDialogView(function( { Dialog } ){
                    let Vue = require('vue');
                    Vue.default.use(Dialog)
                    t.canRender=true;
                });
            },
            //渲染PC的dialog
            _renderPCDialog:function(createElement,childrens){
                let t=this;
                if(t.titleContent){
                    const titleContent = _TY_Tool.bbRender(t.titleContent, createElement, t);
                    const title = createElement('template',{slot:"title"},[titleContent]);
                    childrens.push(title);
                }
                return createElement('el-dialog',{
                    props:{
                        'visible':t.active,
                        'title':t.title,
                        'modal':t.overlay,
                        'close-on-click-modal':t.closeOnClickOverlay,
                        'lock-scroll':t.lockScroll,
                        'show-close':t.showClose,//是否显示关闭按钮 右上角
                        'modal-append-to-body':true,//遮罩层插入到body元素上
                        'append-to-body':true,//弹窗自身插入到body元素上
                        'width':t.realWidth||t.width,
                        'top':t.top,
                        "fullscreen":t.fullscreen
                    },
                    style:{
                    },
                    key:t.key,
                    on:{
                        'input':function(val){
                            t.active = val;
                        },
                        'close':t._beforeClose,
                        'open':t._afterOpen
                    },
                    class:'bb-indep-dialog'
                },[childrens,this.$slots.default]);//this.$slots.default 使bb-indep-dialog支持van-dailog的slots
            },
            //el dialog 打开的回调
            _afterOpen:function(){
                let t=this;
                setTimeout(()=>{
                    t.$emit('afterOpen',t);
                },500)
                
            },
            _initH5Dialog:function(){
                let t=this;
                //引入第三方vant 的dialog组件
                const VantDialogView = r => require.ensure([], () => r(require('vant')), 'vant');
                VantDialogView(function( { Dialog } ){
                    let Vue = require('vue');
                    Vue.default.use(Dialog)
                    t.canRender=true;
                 });
            },
            //渲染h5的dialog
            _renderH5Dialog:function(createElement,childrens){
                let t=this;
                return createElement('van-dialog',{
                    props:{
                        'value':t.active,
                        'title':t.title,
                        'message':t.message,
                        'show-confirm-button':t.showConfirmButton,
                        'show-cancel-button':t.showCancelButton,
                        'confirm-button-text':t.confirmButtonText,
                        'cancel-button-text':t.cancelButtonText,
                        'overlay':t.overlay,
                        'close-on-click-overlay':t.closeOnClickOverlay,
                        'lock-scroll':t.lockScroll
                    },
                    style:{
                    },
                    key:t.key,
                    on:{
                        'input':function(val){
                            t.active = val;
                        },
                        'before-close':t._beforeClose,
                        'confirm':t._confirm,
                        'cancel':t._cancel
                    },
                    class:'bb-indep-dialog'
                },[childrens,this.$slots.default]);//this.$slots.default 使bb-indep-dialog支持van-dailog的slots
            },
            //关闭弹窗前
            _beforeClose:function(action,done){
                let t=this;
                t.active = false;
                t.$emit('update:isShow', false);
                t.$emit('beforeClose', t);
                //关闭弹窗
                done&&done();
            },
            //点击确认按钮触发事件
            _confirm:function(){
                let t=this;
                t.active=false;
                t.$emit("confirm",t);//弹窗确认事件
                t.$emit('update:isShow', false);
            },
            //点击取消按钮触发事件
            _cancel:function(){
                let t=this;
                t.active = false;
                t.$emit("cancel",t);//弹窗取消事件
                t.$emit('update:isShow', false);
            },
            //对外提供方法 打开弹窗
            openDialog:function(linkage){
                this.active = true;
                this.linkage = linkage;
                this.$emit('update:isShow', false);
                this.$emit('open',linkage,this);
            },
            //对外提供方法 关闭弹窗
            closeDialog:function(){
                this.active = false;
                this.$emit('update:isShow', false);
                this.$emit('close',this.linkage,this);
            },
            //主要用于积木选择器
            loadChildBB:function(){
                let t=this;
                return _TY_Tool.loadChildBB(t);                
            }
            
        }
    }
</script>
<style scoped>
    
</style>