

<script>

    /**
        <ul>
            <li> {{content}}</li>
        </ul>        
    */

    export default {
        name: 'bb-indep-ul',
        render: function (createElement) {
            let t=this;
            const liInstance = t.theme=='swipe'?t.renderSwipeLi(createElement):t.renderLi(createElement);
            let loadingInstance = '';
            if(t.loading){
                loadingInstance = t.renderLoading(createElement);
            }
            const ulInstance = createElement('ul',{
                class:{
                    indep_ul:true,
                    clearfix:true
                }
            },liInstance);
            return createElement('div',{
                class:{
                    "bb-swipe-ul bb_indep_ul_fixed_height":t.fixedHeight
                }
            },[ulInstance,loadingInstance]);
        },
        props: {
            //几列，如果是一列表示纵向展示，多列表示横向
            columns:{
                type:[Number,String],
                default:1
            },
            //主题 主要通过主题改变itemContent模板，来方便配置item ['line','card',swipe] line表示一行一个文字，后面跟日期；card表示卡片，样式可以通过css编辑器控制
            theme:{
                type:String,
                default:'line'
            },
            //内容模板,通过数据填充展示的组件 <%=rowData.title%>
            itemContent:{
                type:[String,Array],
                default:function(){
                    return []
                }
            },
            //静态的数据
            staticList:{
                type:[String,Array],
                default:function(){
                    return []
                }
            },
            //列表数据  数据源
            ds:{
                type:Object
            },
            //======样式控制区======
            //li 的样式设置
            itemStyle:{
                type:Object
            },
            //第一个item样式
            firstItemStyle:{
                type:Object
            },
            //最后一个item的样式
            lastItemStyle:{
                type:Object
            },
            //当前列表分页参数 page当前页  pageSize每页条数
            pageConfig:{
                type:Object,
                default:function(){
                    return {
                        page:1,
                        pageSize:10
                    };
                }
            },
            //关闭上拉加载
            closePullLoading:{
                type:Boolean
            },
            //是否固定高度
            fixedHeight:{
                type:Boolean,
                default:false
            },
            //懒加载 默认不加载数据
            lazy:{
                type:Boolean,
                default:false
            },
            //右侧滑动样式,swipe 主题时有效
            rightItemStyle:{
                type:Object
            },
            /**
                按钮解析
                {
                    disabled:false,//按钮是否可编辑
                    action:'url 地址跳转|| execute-ds执行接口 || dialog-page弹窗 || code自定义代码 || buzz 巴斯代码',
                    url:''跳转地址 action:'url’时有效
                    urlType:'openWindow 在新标签中打开 
                    ds:{} //按钮请求的接口配置 action:'execute-ds’时有效
                    confirmTitle:'', //请求接口前的提示语标题   action:'execute-ds’时有效
                    confirmText:'', //请求接口前的提示语内容   action:'execute-ds’时有效
                    callBackStaticWords:'' //请求接口成功提示语
                    dialogPage:'pageAlias',//弹窗中的页面名称   action:'dialog-page’时有效
                    method:fn , //需要执行的方法 action:'code’时有效
                    buzz:'buzzName'  //巴斯方法名称  action:'buzz’时有效
                }
             */
            itemClickConfig:{
                type:Object
            }
        },
        data() {
            return {
                list:this.transferList(this.staticList),
                external:{},
                pageSize:this.pageConfig.pageSize,
                page: this.pageConfig.page,
                end:false,//是否加载结束
                loading:false//是否加载中
            }
        },
        computed:{
        },
        watch: {
           
        },
        created: function () {
            let t=this;
            //根据主题修改content
            t.changeContentByTheme();
            if(!t.lazy){
                //加载数据
                t.loadData();
            }
        },
        mounted:function(){
            let t=this;
            //添加上拉加载事件
            t.scrollListener();
            if( t.theme=='swipe'){
                t.renderSwipeListener();    
            }

            //渲染完成事件
            t.$emit("mounted",t);
        },
        methods: {
            transferList:function(val){
                let t=this;
                let result = [];
                if(val){
                    if(typeof(val)==='string'){
                        try{
                            result = JSON.parse(val);
                        }catch(e){
                            try{
                                result = eval('('+this.staticList+')');
                            }catch(e2){

                            }
                        }
                    }
                }
                return result;
            },
            //根据主题，修改 内容模板itemContent
            changeContentByTheme:function(){
                let t=this;
                if((!t.itemContent||t.itemContent.length<=0)&&t.theme){
                    //根据不同的主题设置不同de itemContent
                    switch(t.theme){
                        case 'line':
                            t.itemContent = [
                                {
                                    "uuid": "0B87493A-AB7B-4721-AE2A-0B42732DE002",
                                    "alias": "bb-words",
                                    "aliasName": "标题",
                                    "attributes": {
                                        "show": true,
                                        "attributeName": "title",
                                        "value": "<%=rowData.title%>",
                                        "theme": "",
                                        "textAlign": "left",
                                        "lineHeight": "1rem",
                                        "tagName": "a",
                                        "cssClass": "flex1 ellipsis pointer",
                                        "fontColor": "#0091ea"
                                    },
                                    "animation": [],
                                    "interactives": [],
                                    "layout": {}
                                },
                                {
                                    "uuid": "546FEF5B-BE46-44EF-9EA9-8B441244D797",
                                    "alias": "bb-words",
                                    "aliasName": "日期",
                                    "attributes": {
                                        "show": true,
                                        "attributeName": "date",
                                        "theme": "",
                                        "tagName": "span",
                                        "lineHeight": "1rem",
                                        "value": "<%=rowData.createDate%>",
                                        "cssClass": "flex_wrap",
                                        "fontColor": "#666"
                                    },
                                    "animation": [],
                                    "interactives": [],
                                    "layout": {}
                                }
                            ]
                            break;
                        case 'card':
                            t.itemContent=[
                                {
                                    "uuid": "D9E26950-31C3-41EF-9E3B-9C227129D561",
                                    "alias": "bb-img",
                                    "aliasName": "小图片",
                                    "attributes": {
                                        "show": true,
                                        "src": "<%=rowData.img%>",
                                        "cssStyle": {
                                            "width": "50px",
                                            "height": "50px",
                                            "margin": "auto",
                                            "border-radius": "50%",
                                            "display": "block",
                                            "overflow": "hidden"
                                        },
                                        "attributeName": "img"
                                    },
                                    "animation": [
                                        
                                    ],
                                    "interactives": [
                                        
                                    ],
                                    "layout": {
                                        
                                    }
                                },
                                {
                                    "uuid": "279454A8-0FFA-4CF0-89DE-F5D3AD5EB2A2",
                                    "alias": "bb-words",
                                    "aliasName": "文案",
                                    "attributes": {
                                        "show": true,
                                        "attributeName": "title",
                                        "lineHeight": "1.5rem",
                                        "textAlign": "center",
                                        "display": "block",
                                        "value": "<%=rowData.title%>"
                                    },
                                    "animation": [
                                        
                                    ],
                                    "interactives": [
                                        
                                    ],
                                    "layout": {
                                        
                                    }
                                }
                            ];
                            t.itemStyle= {
                                "border": {
                                    "margin": "",
                                    "size": "0 0.05rem 0 0",
                                    "color": "rgba(234, 234, 234, 1)",
                                    "style": "solid",
                                    "radian": "0.1rem",
                                    "padding": "0.5rem 0.5rem 0.2rem 0.5rem"
                                }
                            }
                            break;
                        default:
                            return
                    }
                }
            },
            scrollListener:function(){
                let t=this;
                //屏幕高度
                const screenHeight = window.screen.height;
                if(!t.closePullLoading && !t.fixedHeight){
                    window.onscroll = function(){
                        const totalHeight = document.activeElement.scrollHeight || document.body.scrollHeight;
                        const scrollHeight = document.documentElement.scrollTop || document.body.scrollTop;
                        if(screenHeight + scrollHeight + 10 >= totalHeight){//接近底部10px的时候就加载
                            if(!t.end&&!t.loading){
                                t.loading =true;
                                t.page = t.page+1;
                                t.loadData();
                            }
                        }
                    }
                }
                if(t.fixedHeight){
                    //固定高度的上拉加载
                    t.$el.onscroll=function(){
                        const _screenHeight = event.target.offsetHeight;
                        const totalHeight = event.target.scrollHeight;
                        const scrollHeight = event.target.scrollTop;
                        if(_screenHeight + scrollHeight + 10 >= totalHeight){//接近底部10px的时候就加载
                            if(!t.end&&!t.loading){
                                t.loading =true;
                                t.page = t.page+1;
                                t.loadData();
                            }
                        }
                    }
                }
            },
            //加载数据
            loadData:function(){
                let t=this;
                if(t.ds){
                    //如果配置的ds说明是动态的数据
                    _TY_Tool.getDSData(t.ds, _TY_Tool.buildTplParams(t), function (map) {
                        map.forEach(function (item) {
                            var _list = [];
                            if(item['valueKey'].split('.').length > 1){//支持定制接口
                                _list = item['value']
                            }else{
                                if(item['value']&&item['value']['currentRecords']){
                                    _list = item['value']['currentRecords'];
                                    const totalPage = item['value']['totalPages'];
                                    if(t.page>=totalPage){
                                        t.end=true;
                                    }else{
                                        t.end=false;
                                    }
                                }else if(item['value']&&item['value']['list']){
                                    _list = item['value']['list'];    
                                }else{
                                    _list = item['value'];
                                }
                            }
                            if(t.page>1){
                                t.list = t.list.concat(_list);
                            }else{
                                t.list = _list;    
                            }
                            t.loading = false;
                            //加载完数据
                            t.$emit("loaded",t);
                        });
                    }, function (code, msg) {

                    });
                }
            },
            //渲染li  item
            renderLi:function(createElement){
                let t=this;
                let result = [];
                if(!t.list||t.list.length<=0||!t.itemContent||t.itemContent.length<=0){
                    return;
                }
                t.list.forEach((item,index)=>{
                    if(item['hide']){
                        return true;
                    }
                    //数据解析到模板中去
                    let _content = _TY_Tool.tpl(JSON.stringify(t.itemContent),_TY_Tool.buildTplParams(t,{
                        rowData:item
                    }));
                    if(!_content){
                        console.error("错误提示:","列表组件没有配置模板或者没有匹配到参数");
                        return true;
                    }
                    /*
                        兼容 ul包含ul的情况
                        子的ul中模板用<#= ... #>代替，否则第一层就会被模板参数替换
                    */
                    const reg = /<#=(.*?)#>/g;
                    if(_content.match(reg)){
                        //如果字符串中含有<#=...#> 这样的标识，转换成 <%=...%>
                        _content = _content.replace(reg,function(){
                            return "<%="+arguments[1]+"%>"
                        })
                    }

                    let clazz=  [];
                    let _style={}
                    if(t.theme==='line'){
                        //如果是line的话，li是flex布局
                        clazz = ["flex"]
                    }
                    const col = Number(t.columns);
                    if(col>1){
                        _style = {
                            width:1/col*100 + "%",
                            float:"left"
                        }
                    }
                    let _cssStyle = Object.assign({},_TY_Tool.setSimpleStyle(t.itemStyle),_style);
                    if(index==0&&t.firstItemStyle){
                        //第一个的样式
                        _cssStyle = Object.assign(_cssStyle,_TY_Tool.setSimpleStyle(t.firstItemStyle),_style);
                    }else if(index==t.list.length-1 &&t.lastItemStyle){
                        //最后一个的样式
                        _cssStyle = Object.assign(_cssStyle,_TY_Tool.setSimpleStyle(t.lastItemStyle),_style);
                    }
                    let liItem = createElement('li',{
                        class:clazz,
                        style:_cssStyle,
                        on:{
                            click:function(){
                                if(t.itemClickConfig){
                                    //如果配置了item的点击配置
                                    _TY_Tool.resolveButton(t.itemClickConfig,_TY_Tool.buildTplParams(t,{
                                        rowData:item
                                    }));
                                }
                                t.$emit('itemClick',item,t);
                            }
                        }
                    },_TY_Tool.bbRender(JSON.parse(_content),createElement,t));
                    result.push(liItem);
                });

                return result;
            },
            //渲染li  item 主题为swipe的时候渲染
            renderSwipeLi:function(createElement){
                let t=this;
                let result = [];
                if(!t.list||t.list.length<=0||!t.itemContent||t.itemContent.length<=0){
                    return;
                }
                t.list.forEach((item,index)=>{
                    if(item['hide']){
                        return true;
                    }
                    //数据解析到模板中去
                    let _content = _TY_Tool.tpl(JSON.stringify(t.itemContent),_TY_Tool.buildTplParams(t,{
                        rowData:item
                    }));
                    if(!_content){
                        console.error("错误提示:","列表组件没有配置模板或者没有匹配到参数");
                        return true;
                    }
                    /*
                        兼容 ul包含ul的情况
                        子的ul中模板用<#= ... #>代替，否则第一层就会被模板参数替换
                    */
                    const reg = /<#=(.*?)#>/g;
                    if(_content.match(reg)){
                        //如果字符串中含有<#=...#> 这样的标识，转换成 <%=...%>
                        _content = _content.replace(reg,function(){
                            return "<%="+arguments[1]+"%>"
                        })
                    }

                    let _style={
                        "display":"block"
                    }
                    let _cssStyle = Object.assign({},_TY_Tool.setSimpleStyle(t.itemStyle),_style);
                    if(index==0&&t.firstItemStyle){
                        //第一个的样式
                        _cssStyle = Object.assign(_cssStyle,_TY_Tool.setSimpleStyle(t.firstItemStyle),_style);
                    }else if(index==t.list.length-1 &&t.lastItemStyle){
                        //最后一个的样式
                        _cssStyle = Object.assign(_cssStyle,_TY_Tool.setSimpleStyle(t.lastItemStyle),_style);
                    }
                    const liItem = createElement('div',{
                        class:"bb-swipe-content",
                        style:_cssStyle,
                        on:{
                            click:function(){
                                t.$emit('itemClick',item,t);
                            }
                        }
                    },[_TY_Tool.bbRender(JSON.parse(_content),createElement,t)]);

                    const liRight = createElement("div",{
                        style:Object.assign({},_TY_Tool.setSimpleStyle(t.rightItemStyle),{
                            "position": "absolute",
                            "right":"0",
                            "top": "0",
                            "height": "100%",
                            "transform": "translate3d(100%,0,0)"
                        })
                    },[createElement('a',{
                            style:{
                                "display": "flex",
                                "align-items": "center",
                                "background-color": "#ef473a",
                                "color": "white",
                                "width":"2.4rem",
                                "height":"100%"
                            },
                            on:{
                                click:function(){
                                    t.$emit('deleteClick',item,t);
                                }
                            }
                        },[createElement('span',{
                                style:{
                                    "flex":"1",
                                    "text-align": "center"
                                }
                            },["删除"])
                        ])
                    ]);

                    let liBox = createElement('li',{
                        class:"bb-swipe-li",
                        style:{
                            "overflow": "hidden",
                            "position": "relative"
                        }
                    },[createElement('div',{
                           style:{
                            "height": "100%",
                            "background-color": "white",
                            "width": "100%",
                            "z-index": "100",
                            "transform": "translate3d(0px,0px,0px)",
                            /*规定应用过渡的CSS属性*/
                            "transition-property":"transform",
                            /*规定应用过渡所花费的时间*/
                            "transition-duration": "0s",
                            /*规定过渡效果从何开始，默认是0*/
                            "transition-delay": 0,
                            /*规定过渡的时间曲线*/ 
                            "transition-timing-function": "linear"
                           } 
                        },[liItem,liRight])
                    ]);

                    result.push(liBox);
                });

                return result;
            },
            //监听滑动事件
            renderSwipeListener:function(){
                let t=this;
                var subWidth,marginRight,$startX,touchesX,$moveX;
                function touch(event) {
                    //获取触发滑动事件的Dom元素
                    var listDome = event.currentTarget.childNodes[0];
                    //侧滑菜单
                    var subCountWidth =  event.currentTarget.childNodes[0].childNodes[1].children;
                    switch(event.type){
                        case "touchstart" :
                            //计算侧滑菜单宽度
                            subWidth = 0;
                            for(var i = 0;i<subCountWidth.length;i++) {
                                subWidth = subWidth + subCountWidth[i].clientWidth;
                            }

                            listDome.style.transitionDuration = "0.3s";
                            marginRight = window.getComputedStyle(listDome,"").transform;
                            marginRight = Math.abs(Number(marginRight.substring(7,marginRight.length-1).split(",")[4]));
                            //触摸点x轴距离
                            $startX = event.touches[0].clientX;
                            //触摸点至移动之后得到的x轴距离
                            touchesX = 0;
                            break;
                        case "touchmove" :
                            listDome.style.transitionDuration = "0s";
                            $moveX = event.touches[0].clientX;
                            touchesX = $startX - $moveX;
                            console.log("移动X距离----"+touchesX);
                            //滑块距离右边实际距离 >= 0时
                            if(marginRight >= 0) {
                                if(marginRight+touchesX < 0 ) {
                                    listDome.style.transform = 'translate3d(0px,0px, 0px)';
                                }else if(marginRight+touchesX <= 500) {
                                    listDome.style.transform = 'translate3d(-'+(marginRight+touchesX)+'px,0px, 0px)';
                                }else {
                                    listDome.style.transform = 'translate3d(-'+subWidth+'px,0px, 0px)';
                                }
                            }else if(marginRight < 0) {
                                    listDome.style.transform = 'translate3d(0px,0px, 0px)';
                            }
                            break;
                        case "touchend" :
                            listDome.style.transitionDuration = "0.3s";
                            marginRight = window.getComputedStyle(listDome,"").transform;
                            marginRight = Math.abs(Number(marginRight.substring(7,marginRight.length-1).split(",")[4]));
                            if(marginRight <= 58 || touchesX <= -58) {
                                listDome.style.transform = 'translate3d(0px,0px, 0px)';
                            }else {
                                listDome.style.transform = 'translate3d(-'+subWidth+'px,0px, 0px)';
                            }
                            break;
                    }
                }

                var listContext = document.getElementsByClassName("bb-swipe-ul");
                for(var i = 0;i<listContext.length;i++) {
                    var listDOM = listContext[i].outerHTML;
                    listDOM = listDOM.replace(/[\r\n\t]/g,'');
                    listContext[i].outerHTML = listDOM;
                }

                /**
                 * 移动端侧滑菜单开始逻辑控制
                 */
                var list = document.getElementsByClassName("bb-swipe-li");
                for(var i = 0;i<list.length;i++) {
                    list[i].addEventListener("touchstart",touch,false);
                    list[i].addEventListener("touchmove",touch,false);
                    list[i].addEventListener("touchend",touch,false);
                }
            },

            //渲染加载框
            renderLoading:function(createElement){
                let t=this;
                return createElement('div',{
                    class:'bb_loading'
                },[createElement('span',{},[]),
                createElement('span',{},[]),
                createElement('span',{},[]),
                createElement('span',{},[]),
                createElement('span',{},[])]);
            },
            linkage:function(...data){
                if(data){
                    this.external['linkage'] = data;
                    //外部参数请求数据，重新恢复到第一页
                    this.page = 1;
                    this.loadData();
                }
            },
            loadChildBB(){
                let t=this;
                return _TY_Tool.loadChildBB(t);                
            }
            
        }
    }
</script>

<style lang='less' scoped>
    .indep_ul{
        font-size:0.5rem;
    }
    @keyframes load{
        0%{
            opacity: 1;
            -webkit-transform: scale(1.2);
        }
        100%{
            opacity: .2;
            -webkit-transform: scale(.2);
        }
    }
    @-webkit-keyframes load{
        0%{
            opacity: 1;
            -webkit-transform: scale(1.2);
        }
        100%{
            opacity: .2;
            -webkit-transform: scale(.2);
        }
    }
    .bb_loading{
        width: 150px;
        height: 5px;
        margin: 0 auto;
        text-align: center;
        box-sizing: content-box;
        padding-bottom: 1rem;
    }
    .bb_loading span{
        display: inline-block;
        width: 15px;
        height: 100%;
        margin-right: 5px;
        background: lightgreen;
        background:#33BEFE;
        -webkit-animation: load 1.04s ease infinite;
        animation: load 1.04s ease infinite;
    }
    .bb_loading span:last-child{
        margin-right: 0px; 
    }
    
    .bb_loading span:nth-child(1){
        -webkit-animation-delay:0.13s;
        animation-delay:0.13s;
    }
    .bb_loading span:nth-child(2){
        -webkit-animation-delay:0.26s;
        animation-delay:0.26s;
    }
    .bb_loading span:nth-child(3){
        -webkit-animation-delay:0.39s;
        animation-delay:0.39s;
    }
    .bb_loading span:nth-child(4){
        -webkit-animation-delay:0.52s;
        animation-delay:0.52s;
    }
    .bb_loading span:nth-child(5){
        -webkit-animation-delay:0.65s;
        animation-delay:0.65s;
    }

    .bb_indep_ul_fixed_height{
        overflow-y:auto;
    }

    
</style>