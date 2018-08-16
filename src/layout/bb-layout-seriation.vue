<script>
// 顺序排列布局
/*实现功能
    1.水平或者垂直排列
    2.渲染积木
        a.积木属性渲染
        b.积木样式渲染（积木样式包含边框，边距，背景色，透明度，阴影等等）
        c.积木动画渲染
    3.积木交互绑定（通过积木选择器，支持多级积木事件方法绑定）
*/  

    //引入H5背景图
    import H5_bg_01 from './../libs/imgs/h5_bg/h5_bg_01.png';
    import H5_bg_02 from './../libs/imgs/h5_bg/h5_bg_02.png';
    import H5_bg_03 from './../libs/imgs/h5_bg/h5_bg_03.png';
    import H5_bg_04 from './../libs/imgs/h5_bg/h5_bg_04.png';
    import H5_bg_05 from './../libs/imgs/h5_bg/h5_bg_05.png';
    import H5_bg_06 from './../libs/imgs/h5_bg/h5_bg_06.png';
    import H5_bg_07 from './../libs/imgs/h5_bg/h5_bg_07.png';
    import H5_bg_08 from './../libs/imgs/h5_bg/h5_bg_08.png';

    import Vue from 'vue'
    import VueQriously from 'vue-qriously'
    Vue.use(VueQriously)

    export default {
        name: 'bb-layout-seriation',
        render:function(createElement){
            const t = this;
            const bbList = t.renderBB(createElement);
            //控制水平排列
            let itemClass = t.horizontal?"df":"db";
            itemClass = t.realShow?itemClass:"dn";
            if((t.platform == 'H5'||t.platform == 'PAD'||t.platform == 'WX')&&_TY_Tool.isPC()){
                //如果是移动端页面，并且当前在pc环境下（非google的手机模式）,模拟展示手机内容，并且展示二维码
                //rem基准值更正
                t.changeParentRemSize();
                const platformInstance = createElement('div',{
                    style:{},
                    "class":"h5_platform"
                },bbList);
                const bgInstances = t.renderBg(createElement);
                
                const qrCode = t.renderQrCode(createElement);
                let style = {
                    "position":"relative"
                }
                if(t.platform){
                    style =  Object.assign(style,{
                        "height": "812px",
                        "width" : "375px",
                        "margin-left":"30%"
                    });
                }
                return createElement('div',{
                    style:style,
                    'class':""
                },bgInstances.concat(qrCode).concat([platformInstance]));
            }else{
                return createElement('div',{class:itemClass},bbList);
            }
        },
        props: {
            /*水平排列*/
            horizontal:{
                type:Boolean,
                default:false
            },
             //平台
            platform:{
                type:String,
                default:''
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
                type:[Array,String]
            },
            defaultHide:{
                type:Boolean,
                default:false
            },
            //排版  下拉：均分(average),按比例分配(proportion),紧凑(compact),右侧自动填充(rightauto)，左侧自动填充(leftauto)
            layoutType:{
                type:String,
                default:"average"
            },
            //用bb-tag标签配置。结构是数组["1","2"]
            distributeBlock:{
                type:Array,
                default:function(){
                    return [];
                }
            }
        },
        watch:{
            content(val){
                this.realContent = val;
            }
        },
        data() {
            return {
                realShow:!this.defaultHide,
                realContent:this.content
            }
        },
        methods: {
            //针对h5页面在pc上的预览，修改html的size，以更正rem基准值
            changeParentRemSize:function(){
                let t=this;
                document.children[0].style['font-size']='28.8px';
            },
            //渲染二维码
            renderQrCode:function(createElement){
                let t=this;
                let _host= _TY_H5Host|| (window.location.protocol + "//" + window.location.host);
                const qrCodeInstance = createElement('qriously',{
                    props:{
                        size:200,
                        value:(_host+"/#/"+(t.$route.params.pageAlias||t.$route.query.pageAlias))
                    },
                    style:{
                        position: 'absolute',
                        right: '-200px',
                        top: '30%'
                    }
                },[]);
                const pInstance = createElement('p',{
                        domProps:{
                            innerHTML:"手机扫一扫，更好看！"
                        },
                        style:{
                            position: 'absolute',
                            right: '-182px',
                            top: 'calc(30% + 210px)',
                            color:'#333',
                            'font-size':'16px'
                        }
                    },[]);
                return [pInstance,qrCodeInstance];
            },
            //渲染的背景图 手机
            renderBg:function(createElement){
                let t=this;
                if(!t.platform){
                    return [];
                }
                let result = [];
                const H5bgs = [H5_bg_01,H5_bg_02,H5_bg_03,H5_bg_04,H5_bg_05,H5_bg_06,H5_bg_07,H5_bg_08];
                const ImgPosition = ['lt','t','rt','l','r','lb','b','rb'];
                //有8张背景图
                for(let i=0;i<8;i++){
                    let clazz = "";
                    let bgSrc;
                    if(t.platform == 'H5'||t.platform == 'PAD'||t.platform == 'WX'){
                        clazz="h5_bg h5_bg_"+ImgPosition[i];
                        bgSrc = H5bgs[i];
                    }
                    const bgInstance = createElement('img',{
                        "class":clazz,
                        attrs:{
                            "src":bgSrc
                        }
                    },[]);
                    result.push(bgInstance);
                }
                if(t.platform == 'H5'||t.platform == 'PAD'||t.platform == 'WX'){
                    //滚动条要挡住上下部分
                    result.push(createElement('div',{
                            "class":"blockUp",
                        },[]));
                    result.push(createElement('div',{
                            "class":"blockDown",
                        },[]));
                }
                return result;
            },
            renderBB:function(createElement){
                const t = this;
                const bbList = _TY_Tool.bbRender(t.realContent, createElement, t);
                
                //水平排列垂直排列控制
                bbList.forEach((bbEle,index)=>{
                    let _style = {};
                    if(!t.layoutType || t.layoutType==='average'){
                        _style = {
                            flex:1,
                            width:"1%"//解决flex1 不均分的bug
                        };
                    }else if(t.layoutType === 'compact'){
                        _style = {};
                    }else if(t.layoutType === 'proportion'){
                        let _flex = 1;
                        if(typeof(t.distributeBlock[index])==='string'){
                            _flex = Number(t.distributeBlock[index]||1);
                        }else if(typeof(t.distributeBlock[index])==='object'){
                            _flex = Number(t.distributeBlock[index].alias||1);
                        }
                        _style = {
                            flex:_flex
                        }
                    }else if(t.layoutType === 'rightauto'){
                        //左边固定宽度，右边自动填充
                        if(index==0){
                            _style={
                                '-webkit-box-flex': 'initial',
                                '-webkit-flex': 'initial',
                                'flex': 'initial',
                                'display': 'block'
                            }
                        }else{
                            _style = {
                                '-webkit-box-flex': 1,
                                '-webkit-flex': 1,
                                'flex': 1,
                                'display': 'block'
                            }
                        }
                    }else if(t.layoutType === 'leftauto'){
                        //左侧自动填充，右侧固定
                         if(index==bbList.length-1){
                            _style={
                                '-webkit-box-flex': 'initial',
                                '-webkit-flex': 'initial',
                                'flex': 'initial',
                                'display': 'block'
                            }
                        }else{
                            _style = {
                                '-webkit-box-flex': 1,
                                '-webkit-flex': 1,
                                'flex': 1,
                                'display': 'block'
                            }
                        }
                    }
                    if(!t.horizontal){
                        _style = {};
                    }
                    const bbItem = createElement('div', {style:_style},[bbEle]);
                    bbList.splice(index,1,bbItem);
                    //控制排序 TODO
                    //bbList.splice(bb.layout.sort - 1,1,bbItem);
                })
                return bbList;
            },
            loadChildBB(){
                let t=this;
                return _TY_Tool.loadChildBB(t);
            },
            //根据  事件的 executeArgument  来判断是否该隐藏或是显示
            itemShowOrHide(..._data){
                const t = this;
                _data.forEach((val,key)=>{
                  if(val.type == 'custom'){
                    let flag = val.arguments;
                    if(flag){
                        t.realShow = true;
                        t.$emit('show');
                    }else{
                        t.realShow = false;
                        t.$emit('hide');
                    }
                  }
                });
            },
            //显示
            show(){
                const t = this;
                t.realShow = true;
                t.$emit('show');
            },
            //隐藏
            hide(){
                const t = this;
                t.realShow = false;
                t.$emit('hide');
            }
        },
        components:{
        }
    }
</script>
<style scoped>
    .h5_platform{
        overflow-y: scroll;
        padding: calc(5% + 105px) 0;
        height: 100%;
        width: 75%;
        margin-left: 50px;
    }
    .h5_platform::-webkit-scrollbar {
         display: none;
    }
    .h5_bg{
        position:absolute;
        z-index: 100;
    }
    .h5_bg_lt{
        left: 5%;
        top:5%;
    }
    .h5_bg_t{
        left: calc(5% + 51px);
        top:5%;
        width: calc(90% - 103px);
        height: 85px;
    }
    .h5_bg_rt{
        right: 5%;
        top:5%;
    }
    .h5_bg_l{
        left: 5%;
        top:calc(5% + 85px);
        height: calc(90% - 170px);
        width: 25px;
    }
    .h5_bg_r{
        right: 5%;
        top:calc(5% + 85px);
        height: calc(90% - 170px);
        width: 25px;
    }
    .h5_bg_lb{
        left: 5%;
        bottom:5%;
    }
    .h5_bg_b{
        left: calc(5% + 51px);
        bottom:5%;
        width: calc(90% - 103px);
        height: 86px;
    }
    .h5_bg_rb{
        right: 5%;
        bottom:5%;
    }
    .blockUp{
        width: 90%;
        padding-top: calc(5% + 85px);
        position: absolute;
        z-index: 90;
        background: #fff;
        left: 5%;
        top:0;
    }
    .blockDown{
        width: 90%;
        padding-top: calc(5% + 85px);
        position: absolute;
        z-index: 90;
        background: #fff;
        left: 5%;
        bottom:0;
    }
</style>
<style lang="less">
    .dn{
        display:none;
    }
    .df{
        display:flex;
    }
    .db{
        display:block;
    }
    .h5_platform{
        &>div{
            transform: scale(1);
        }
    }
</style>