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
    //引入PC背景图
    import PC_bg_01 from './../libs/imgs/pc_bg/pc_bg_01.png';
    import PC_bg_02 from './../libs/imgs/pc_bg/pc_bg_02.png';
    import PC_bg_03 from './../libs/imgs/pc_bg/pc_bg_03.png';
    import PC_bg_04 from './../libs/imgs/pc_bg/pc_bg_04.png';
    import PC_bg_05 from './../libs/imgs/pc_bg/pc_bg_05.png';
    import PC_bg_06 from './../libs/imgs/pc_bg/pc_bg_06.png';
    import PC_bg_07 from './../libs/imgs/pc_bg/pc_bg_07.png';
    import PC_bg_08 from './../libs/imgs/pc_bg/pc_bg_08.png';
    //引入H5背景图
    import H5_bg_01 from './../libs/imgs/h5_bg/h5_bg_01.png';
    import H5_bg_02 from './../libs/imgs/h5_bg/h5_bg_02.png';
    import H5_bg_03 from './../libs/imgs/h5_bg/h5_bg_03.png';
    import H5_bg_04 from './../libs/imgs/h5_bg/h5_bg_04.png';
    import H5_bg_05 from './../libs/imgs/h5_bg/h5_bg_05.png';
    import H5_bg_06 from './../libs/imgs/h5_bg/h5_bg_06.png';
    import H5_bg_07 from './../libs/imgs/h5_bg/h5_bg_07.png';
    import H5_bg_08 from './../libs/imgs/h5_bg/h5_bg_08.png';
    //引入微信小程序
    import WX_exit from './../libs/imgs/wx_bg/wx_exit.png';
    import WX_menu from './../libs/imgs/wx_bg/wx_menu.png';

    export default {
        name: 'bb-layout-seriation-edit',
        render:function(createElement){
            const t = this;
            const bbList = t.renderBB(createElement);
            //平台场景设置
            let bgStyle ={
                "display":t.horizontal?'flex':'block'
            };
            let divClass = "";
            if(t.platform=="PC"){
                divClass = "pc_platform";
            }else if(t.platform == 'H5'||t.platform == 'PAD'){
                divClass = "h5_platform";
                //rem基准值更正
                t.changeParentRemSize();
            }else if(t.platform == 'WX'){
                divClass="wx_platform";
                //rem基准值更正
                t.changeParentRemSize();
            }
            const platformInstance = createElement('div',{
                style:bgStyle,
                "class":divClass
            },bbList);

            const bgInstances = t.renderBg(createElement);
            //控制水平排列
            let style = {
                "position":"relative"
            }
            if(t.platform){
                style =  Object.assign(style,{
                    "height": "calc(100vh - 126px)",
                    "overflow": "hidden"
                });
            }
            return createElement('div',{
                style:style,
                'class':""
            },bgInstances.concat([platformInstance]));
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
            /*其他属性设置
                styleType:"detail  simple"
            */
            option:{
                type:Object,
                default:function(){
                    return {
                        styleType:"detail"
                    }
                }
            }
        },
        mounted:function(){
            const t =this;
            setTimeout(function(){
                t.$emit('mounted',t);
            },0);
        },
        data() {
            return {
                realContent:this.content,
                preItem:null
            }
        },
        watch:{
            content(val){
                this.realContent = val;
            }
        },
        created:function(){
            this.quickKey();
        },
        methods: {
            //针对h5页面在pc上的预览，修改html的size，以更正rem基准值
            changeParentRemSize:function(){
                let t=this;
                const _size = window.innerWidth/40;//window.innerWidth * 25% / 10
                document.children[0].style['font-size']= _size+ "px";
            },
            //渲染编辑页的背景图 手机和pc
            renderBg:function(createElement){
                let t=this;
                if(!t.platform){
                    return [];
                }
                let result = [];
                const Pcbgs = [PC_bg_01,PC_bg_02,PC_bg_03,PC_bg_04,PC_bg_05,PC_bg_06,PC_bg_07,PC_bg_08];
                const H5bgs = [H5_bg_01,H5_bg_02,H5_bg_03,H5_bg_04,H5_bg_05,H5_bg_06,H5_bg_07,H5_bg_08];
                const ImgPosition = ['lt','t','rt','l','r','lb','b','rb'];
                //有8张背景图
                for(let i=0;i<8;i++){
                    let clazz = "";
                    let bgSrc;
                    if(t.platform == 'PC'){
                        clazz="pc_bg pc_bg_"+ImgPosition[i];
                        bgSrc = Pcbgs[i];
                    }else if(t.platform == 'H5'||t.platform == 'PAD'||t.platform == 'WX'){
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
                if(t.platform == 'WX'){
                    //渲染头部和微信小程序菜单
                    const wxTitleInstance = createElement('img',{
                        "class":"wx_menu",
                        attrs:{
                            "src":WX_menu
                        }
                    },[]);
                    result.push(wxTitleInstance);
                    const wxExitInstance = createElement('img',{
                        "class":"wx_exit",
                        attrs:{
                            "src":WX_exit
                        }
                    },[]);
                    result.push(wxExitInstance);
                }
                return result;
            },
            renderBB:function(createElement){
                const t = this;
                if(t.realContent){
                    const bbList = [];
                    //水平排列垂直排列控制
                    t.realContent.forEach((bbEle,index)=>{
                        //根据group 来区分是否这个item 可以编辑
                        const notCanOpt = bbEle.group&&bbEle.group==='notCanOpt';
                        const tag = _TY_Tool.isPC()?'bb-seriation-item-edit':'bb-seriation-item-edit-h5'
                        const bbItem = createElement(tag, {
                            ref:'bb-seriation-item-edit-' + index,
                            props:{
                                content:bbEle,
                                config:{
                                    horizontal:t.horizontal,
                                    pointer:(bbEle.attributes&&bbEle.attributes.pointer?bbEle.attributes.pointer:false),
                                    buttons:notCanOpt?[]:['copy','up','down','remove'],
                                    onFocus:notCanOpt?false:bbEle.onFocus,
                                    styleType:t.option.styleType
                                }   
                            },
                            style:{flex:1},
                            on:{
                                up:t.up.bind(null,index),
                                down:t.down.bind(null,index),
                                remove:t.remove.bind(null,index),
                                copy:t.copy.bind(null,index),
                                onFocus:notCanOpt?false:t.onFocus.bind(null,index),
                                onBlur:t.onBlur.bind(null,index)
                            },
                            attrs:{
                                aliasName:bbEle['aliasName'] + '_edit'
                            },
                        },[]);
                        // const bbItem = createElement('div', {style:{flex:1}},[bbEle]);
                        bbList.push(bbItem);
                        //控制排序 TODO
                        //bbList.splice(bb.layout.sort - 1,1,bbItem);
                        bbEle.onFocus = false;
                    });
                    return bbList; 
                }
            },
            loadChildBB(){
                let t=this;
                return _TY_Tool.loadChildBB(t);                
            },
            //上移返回当前的积木数据
            up:function(...params){
                const t = this;
                const index = params[0];
                t.$emit('up',t.realContent[index]);
                t.$emit('change',t.realContent);
                if(index == 0) {
                    return;
                }
                const item = t.realContent[index];
                t.realContent.splice(index,1);
                t.realContent.splice(index-1,0,item);
            },
            //下移返回当前的积木数据
            down:function(...params){
                const t = this;
                const index = params[0];
                //如果下一个item是不能编辑的item（最后一个item），点击下移，不移动
                if(index==t.realContent.length-2){
                    //根据group 来区分是否这个item 可以编辑
                    const nextNotCanOpt = t.realContent[index+1].group&&t.realContent[index+1].group==='notCanOpt';
                    if(nextNotCanOpt){
                        return;
                    }
                }
                this.$emit('down',t.realContent[index]);
                this.$emit('change',t.realContent);
                if(index == t.realContent.length -1) {
                    return;
                }
                const item = t.realContent[index]
                t.realContent.splice(index,1);
                t.realContent.splice(index+1,0,item);
            },
            copy:function(...params){
                const t=this;
                const index = params[0];
                t.$emit('copy',t.realContent[index]);
                const contentItem = t.realContent[index];
                const newContent = _TY_Tool.copyContent([contentItem]);
                t.realContent.splice(index+1, 0,newContent[0]);
                t.$emit('change',t.realContent);
            },
            //删除返回当前的积木数据
            remove:function(...params){
                const t = this;
                const index = params[0];
                if(_TY_Tool.isPC()){
                    t.$confirm('确认操作?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        t.$emit('remove',t.realContent[index]);
                        if(index==t.realContent.length-2&&t.realContent[index+1].group&&t.realContent[index+1].group==='notCanOpt'&&t.realContent.length==2){
                            //倒数第二个item,并且最后一个item是不可编辑的，则倒数第二个和最后一个不可编辑的item一起删除
                            t.realContent.splice(index+1, 1);
                        }
                        t.realContent.splice(index, 1);
                        t.$emit('change',t.realContent);
                    }).catch(() => {
                        t.$message({
                            type: 'info',
                            message: '已取消删除'
                        });
                    });
                }else{
                    t.$emit('remove',t.realContent[index]);
                    if(index==t.realContent.length-2&&t.realContent[index+1].group&&t.realContent[index+1].group==='notCanOpt'&&t.realContent.length==2){
                        //倒数第二个item,并且最后一个item是不可编辑的，则倒数第二个和最后一个不可编辑的item一起删除
                        t.realContent.splice(index+1, 1);
                    }
                    t.realContent.splice(index, 1);
                    t.$emit('change',t.realContent);
                }
            },
            //积木选中状态
            onFocus:function(...params){
                const t = this;
                if(params[0] == t.nowEdit){
                    return;
                }
                if(t.preItem){
                    t.preItem.onBlur();
                }
                t.preItem = params[1];
                // //记录当前编辑的积木下标
                t.nowEdit = params[0];
                // //将当前编辑的对象放到全局变量中
                _TY_Root._TY_Current_Edit_Item = t.realContent[params[0]];
                t.$emit('onFocus',t.realContent[params[0]],t.nowEdit,t);
            },
            //积木失焦状态
            onBlur:function(){
                const t = this;
                t.nowEdit = null;
                t.$emit('onBlur');
            },
            /*积木新增方法 对外
                @bbAlias:积木别名
                @bbName:积木名称
            */
            add:function(bbName,bbAlias){
                const t = this;
                //初始化新增加的积木
                const newBB = {
                    uuid:_TY_Tool.uuid(),
                    alias:bbAlias,
                    aliasName:bbName,
                    attributes:{},
                    animation:[],
                    interactives:[],
                    layout:{}
                }
                t.realContent = t.realContent?t.realContent:[];
                t.realContent.push(newBB);
                //返回新的积木数组
                t.$emit('add',t.realContent);
                t.$emit('change',t.realContent);
            },
            /*乐高新增方法 对外
                @contentItem:积木别名
                {
                    uuid:'',
                    alias:bbAlias,
                    aliasName:bbName,
                    attributes:{},
                    animation:[],
                    interactives:[],
                    layout:{}
                }
            */
            addContent:function(contentItem){
                const t = this;
                if(!contentItem||contentItem.length<=0){
                    return;
                }
                let item;
                if(contentItem instanceof Array&&contentItem[0] && contentItem[0].hasOwnProperty('value')&&contentItem[0].hasOwnProperty('valueKey')&&!contentItem[0].value){
                    //数组直接return
                    return; 
                }else if(contentItem instanceof Array&&contentItem[0] && contentItem[0].hasOwnProperty('value')&&contentItem[0].hasOwnProperty('valueKey')){
                    if(Array.isArray(contentItem[0].value)){
                        //可能会有数组的情况
                        contentItem[0].value.forEach(function(_item,_index){
                            t.realContent.splice(t.realContent.length,0,_item);
                        });
                    }else{
                        item = contentItem[0].value;
                    }
                }else{
                    item = contentItem;
                }
                if(item){
                    t.realContent.splice(t.realContent.length,0,item);
                }
                //返回新的积木数组
                t.$emit('add',t.realContent);
                t.$emit('change',t.realContent);
            },
            //刷新方法，主要用于 lego配置页刷新 根据apiALias获取item列表
            refresh:function(content){
                const t=this;
                if(content instanceof Array && content[0].hasOwnProperty('value')&&content[0].hasOwnProperty('valueKey')&&content[0].value instanceof Array){
                    t.realContent = content[0].value;
                }else if(content instanceof Array&&!content[0].hasOwnProperty('value')){
                    t.realContent = content;
                }
                t.$emit('afterLoad',t.realContent);
            },
            //完成编辑的积木数据回填
            afterEdit:function(content){
                const t = this;
                //t.realContent[t.nowEdit] = content;
                t.$set(t.realContent,t.nowEdit,content);
                t.$emit('afterEdit',t.realContent);
                t.$emit('change',t.realContent);
            },
            //键盘快捷键监听
            quickKey:function(){
                const t = this;
                window.document.onkeydown=function(event){   
                    const e = event || window.event || arguments.callee.caller.arguments[0]; 
                    if (e.ctrlKey && e.keyCode == 8) { 
                        //control + BackSpace
                            t.remove(t.nowEdit);
                    }
                    if (e && e.keyCode==27) { 
                        //esc
                            t.onBlur();
                    }   
                 };
            },
            //外部获取最新的content
            getContents(){
                return this.realContent;
            }
        },
        components:{
        }
    }
</script>
<style scoped>
    .pc_platform{
        overflow-y: scroll;
        padding: 27px 91px 54px 92px;
        height: 100%;
    }
    .pc_platform::-webkit-scrollbar {
         display: none;
    }
    .pc_bg{
        position:absolute;
        z-index: 100;
    }
    .pc_bg_lt{
        left: 0;
        top:0;
    }
    .pc_bg_t{
        left: 91px;
        top:0;
        width: calc(100% - 180px);
        height: 26px;
    }
    .pc_bg_rt{
        right: 0;
        top:0;
    }
    .pc_bg_l{
        left: 1px;
        top:27px;
        height: calc(100% - 80px);
        width: 91px;
    }
    .pc_bg_r{
        right: 0;
        top:27px;
        height: calc(100% - 80px);
        width: 91px;
    }
    .pc_bg_lb{
        left: 0;
        bottom:0;
    }
    .pc_bg_b{
        left: 92px;
        bottom:1px;
        width: calc(100% - 181px);
        height: 53px;
    }
    .pc_bg_rb{
        right: 0;
        bottom:0;
    }
   
    .h5_platform{
        overflow-y: scroll;
        padding: calc(3% + 48px) 0;
        height: 100%;
        width: calc(60% - 66px);
        margin-left: calc(20% + 35px);
    }
    .h5_platform::-webkit-scrollbar {
         display: none;
    }
    img.h5_bg_l,img.h5_bg_r{
        z-index: 0;
    }
    .h5_bg{
        position:absolute;
        z-index: 100;
    }
    .h5_bg_lt{
        width: 60px;
        height: 60px;
        left: 20%;
        top:3%;
    }
    .h5_bg_t{
        left: calc(20% + 60px);
        top:3%;
        width: calc(60% - 120px);
        height: 60px;
    }
    .h5_bg_rt{
        width: 60px;
        height: 60px;
        right: 20%;
        top:3%;
    }
    .h5_bg_l{
        left: 20%;
        top:calc(3% + 60px);
        height: calc(94% - 120px);
        width: 60px;
    }
    .h5_bg_r{
        right: 20%;
        top:calc(3% + 60px);
        height: calc(94% - 120px);
        width: 60px;
    }
    .h5_bg_lb{
        left: 20%;
        bottom:3%;
        width: 60px;
        height: 60px;
    }
    .h5_bg_b{
        left: calc(20% + 60px);
        bottom:3%;
        width: calc(60% - 120px);
        height: 60px;
    }
    .h5_bg_rb{
        right: 20%;
        bottom:3%;
        width: 60px;
        height: 60px;
    }
    .blockUp{
        width: 60%;
        padding-top: calc(3% + 48px);
        position: absolute;
        z-index: 90;
        background: #fff;
        left: 20%;
        top:0;
    }
    .blockDown{
        width: 60%;
        padding-top: calc(3% + 40px);
        position: absolute;
        z-index: 90;
        background: #fff;
        left: 20%;
        bottom:0;
    }



    .wx_platform{
        overflow-y: scroll;
        padding:  calc(5% + 152px) calc(25% + 25px) calc(5% + 85px) ;
        height: 100%;
    }
    .wx_platform::-webkit-scrollbar {
         display: none;
    }
    .wx_menu{
        z-index: 100;
        position: absolute;
        left: calc(25% + 25px);
        top: calc(5% + 85px);
        height: 28px;
        width: calc(50% - 50px);
    }
    .wx_exit{
        z-index: 100;
        position: absolute;
        right: calc(25% + 25px);
        top: calc(5% + 85px + 28px);
        height: 36px;
    }


</style>
<style lang="less">
    .pc_platform,.h5_platform{
        &>div{
            transform: scale(1);
        }
    }
</style>