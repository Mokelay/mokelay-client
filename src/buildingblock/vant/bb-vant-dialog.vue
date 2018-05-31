
<script>
    // import Dialog from 'vant/lib/dialog';
    // import 'vant/lib/dialog/style';
    export default {
        name: 'bb-vant-dialog',
        // components: {
        //     "van-dialog":Dialog
        // },
        render: function (createElement) {
            const t = this;
            let dialog;
            //当可以渲染的时候才能渲染
            if(t.canRender){
                const bbItems = _TY_Tool.bbRender(t.realContent, createElement, t);
                dialog = t._renderH5Dialog(createElement,bbItems);
                console.log("dialog:",dialog);
            }
            return dialog
        },
        props: {
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
                type:String,
                default:'提示'
            },
            //消息内容
            message:{
                type:String,
                default:'测试内容'
            },
            /*其他属性配置
                {
                    showConfirmButton:true, 是否展示确认按钮
                    showCancelButton:false, 是否显示取消按钮
                    confirmButtonText:"确认", 确认按钮文案
                    cancelButtonText:"取消", 取消按钮的文案
                    overlay:true, 是否有蒙层
                    closeOnClickOverlay:false, 是否点击蒙层关闭弹窗
                    lockScroll:false 是否锁定背景滚动
                }
            */
            option:{
                type:Object,
                default:function(){
                    return {
                        showConfirmButton:true,
                        showCancelButton:false,
                        confirmButtonText:"确认",
                        cancelButtonText:"取消",
                        overlay:true,
                        closeOnClickOverlay:false,
                        lockScroll:false
                    };
                }
            }
        },
        data() {
            return {
                canRender:false,//标记是否可以渲染
                realContent: this.content,
                active:this.isShow,//是否显示弹窗
            }
        },
        computed:{
            key() {//解决router指向同一个component，页面不刷新的问题
                return this.$route.name !== undefined? this.$route.name + +new Date(): this.$route + +new Date()
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
            this._initH5Dialog();
        },
        mounted:function(){
        },
        methods: {
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
            //el dialog 打开的回调
            _afterOpen:function(){
                let t=this;
                t.$emit('afterOpen',t);
            },
            //渲染h5的dialog
            _renderH5Dialog:function(createElement,childrens){
                let t=this;
                return createElement('van-dialog',{
                    props:{
                        'value':true,
                        'title':t.title,
                        'message':t.message,
                        'show-confirm-button':t.option.showConfirmButton,
                        'show-cancel-button':t.option.showCancelButton,
                        'confirm-button-text':t.option.confirmButtonText,
                        'cancel-button-text':t.option.cancelButtonText,
                        'overlay':t.option.overlay,
                        'close-on-click-overlay':t.option.closeOnClickOverlay,
                        'lock-scroll':t.option.lockScroll
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
                    }
                },[childrens,this.$slots.default]);//this.$slots.default 使bb-indep-dialog支持van-dailog的slots
            },
            //关闭弹窗前
            _beforeClose:function(action,done){
                let t=this;
                t.active = false;
                //关闭弹窗
                done&&done();
            },
            //点击确认按钮触发事件
            _confirm:function(){
                let t=this;
                t.active=false;
                t.$emit("confirm",t);//弹窗确认事件
            },
            //点击取消按钮触发事件
            _cancel:function(){
                let t=this;
                t.active = false;
                t.$emit("cancel",t);//弹窗取消事件
            },
            //对外提供方法 打开弹窗
            openDialog:function(){
                this.active = true;
            },
            //对外提供方法 关闭弹窗
            closeDialog:function(){
                this.active = false;
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