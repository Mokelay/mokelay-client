
<script>
    /**
        tabPosition: 'left',
        activeName: 'all',
        tabs:[{
            type:'static',
            label:'全部',
            name:'all'
        },{
            type:'dynamic',
            name:'d',//content中的group
            ds:{
                ...
            }
        }],
        content:[{
            uuid:'234',
            alias:'bb-page',
            aliasName:'全部页',
            group:'all',//d 静态的tab一个panel一条记录，动态的tab一条记录包含多个panel
            attributes:{...},//etProps的内容
            animation:[{...}],
            interactives:[{...}],
            layout:{...}
        }]
    */
    export default {
        name: 'bb-indep-tabs',
        render:function(createElement){
            let t=this;
            let tabBox = [];
            if(t.canRender){
                tabBox = t.renderTabData(createElement);
            }
            return createElement('div',{
                class:[
                    'bb-tab',
                    'bb-tab-theme--'+t.tabTheme,
                    'bb-tab-position--'+t.tabPosition,
                    'clearfix'
                ]
            },tabBox);
        },
        props: {
            /**
                tab主题:
                [{
                    text:'默认',
                    value:'default'
                },{
                    text:'白蓝块',
                    value:'FB_card'
                },{
                    text:'大长块',
                    value:'big_card'
                }]
            */
            tabTheme:{
                type:String,
                default:'FB_card'
            },
            //默认展开的tab名称
            activeName: String,
            //tab的位置
            tabPosition: {
                type: String,
                default: 'top'
            },
            //tab的icon样式
            tabIconStyle:{
                type:Object
            },
            /**
                记录所有的tab  static和 dynamic区分
                tabs:[{
                    type:'static',
                    label:'全部',
                    name:'all'
                },{
                    type:'dynamic',
                    name:'d',//content中的group
                    ds:{
                        ...
                    }
                }]
            **/
            tabs:{
                type:Array,
                default:function(){
                    return [];
                }
            },
            //内容模板，或者静态内容
            content:{
                type:[Array,String],
                default:function(){
                    return [];
                }
            },
            //单个tab的样式
            itemStyle:{
                type:Object
            },
            //单个tab选中的样式
            activeItemStyle:{
                type:Object
            },
            //header 的样式设置
            headerStyle:{
                type:Object
            },
            //content的样式设置
            panelStyle:{
                type:Object
            },
            //是否可以影藏panel
            hidePanel:{
                type:Boolean,
                default:false
            },
            //文本对应的接口变量名
            textProp:{
                type:String
            },
            //值对应的接口变量名
            valueProp:{
                type:String
            }
        },
        data() {
            return {
                realTabs:[],
                tabsData:[],
                bbContent:typeof(this.content)==='string'?JSON.parse(this.content):this.content,
                canRender:false,
                p_activeName:_TY_Tool.tpl(this.activeName,_TY_Tool.buildTplParams(this))
            }
        },
        computed:{
            
        },
        created:function(){
            let t=this;
            t.getTabHeaders();
        },
        mounted:function(){
            let t =this;
            if(!t.p_activeName&&t.tabs&&t.tabs.length>0){
                t.p_activeName = t.tabs[0].name;
            }
            t.readActiveTab();
            setTimeout(()=>{
                t.$emit("mounted",t);
            },500);
        },
        methods: {
            //渲染头部
            renderHeader:function(createElement){
                let t=this;

            },
            //渲染panel
            renderPanel:function(createElement){
                let t=this;

            },
            //影藏某个tab
            hideTab:function(tabName){
                let t=this;
                if(t.tabsData){
                    t.tabsData.forEach((tab,index)=>{
                        if(tab.name == tabName){
                            tab.show = false;
                            return false;
                        }
                    });
                }
            },
            //显示某个tab
            showTab:function(tabName){
                let t=this;
                if(t.tabsData){
                    t.tabsData.forEach((tab,index)=>{
                        if(tab.name == tabName){
                            tab.show = true;
                            return false;
                        }
                    });
                }
            },
            //将当前激活标签记录到sessionstorage
            storageActiveTab:function(){
                sessionStorage.setItem("bb-indep-tabs",this.p_activeName);
            },
            //将当前激活标签记录到sessionstorage
            readActiveTab:function(){
                const t=this;
                const storageTab = sessionStorage.getItem("bb-indep-tabs")||'';
                let tempTab = this.p_activeName;
                t.realTabs.forEach((item,index)=>{
                    if(storageTab==item.name){
                        tempTab = storageTab;
                        return false;
                    }
                });
                this.p_activeName = tempTab;
            },
            //外部设置当前激活标签
            activeTabFromOn(...params){
                const t = this;
                params.forEach((param,key)=>{
                    if(param.type == "custom"){
                        t.p_activeName = _TY_Tool.tpl(param.arguments,_TY_Tool.buildTplParams(t));
                        t.storageActiveTab();                  
                    }
                })
            },
            //选中某个tab
            activeTab:function(tabName){
                let t=this;
                if(t.tabsData){
                    t.tabsData.forEach((tab,index)=>{
                        if(tab.name == tabName){
                            tab.show = true;
                            t.p_activeName = tab.name;
                            t.storageActiveTab(); 
                            return false;
                        }
                    });
                }
            },
            //根据index 选中某个tab
            activeTabIndex:function(index){
                let t=this;
                if(t.tabsData){
                    t.tabsData.forEach((tab,key)=>{
                        if(index == key){
                            tab.show = true;
                            t.p_activeName = tab.name;
                            t.storageActiveTab(); 
                            return false;
                        }
                    });
                }
            },
            //根据tabs 获取所有的
            getTabHeaders:function(){
                let t=this;
                t.realTabs=[];
                if(t.tabs&&t.tabs.length>0){
                    const promiseArr = [];
                    t.tabs.forEach(function(tab,index){
                        if(tab.type==='static'){
                            t.realTabs.push({
                                label:tab.label,
                                name:tab.name,
                                group:tab.name,
                                icon:tab.icon
                            });
                        }else if(tab.type==='dynamic'){
                            const textKey = t.textProp||'text';
                            const valueKey = t.valueProp||'value';
                            const item = new Promise((resolve, reject) => {
                                _TY_Tool.getDSData(tab.ds, _TY_Tool.buildTplParams(t), function (map) {
                                    map[0].value.forEach((item, key)=> {
                                        t.realTabs.push({
                                            label: item[textKey],
                                            name: item[valueKey],
                                            group: tab.name,
                                            icon: item.icon
                                        })
                                    });
                                    resolve();
                                }, function (code, msg) {
                                    reject();
                                });
                            });
                            promiseArr.push(item);
                        }
                    });
                    Promise.all(promiseArr).then(values => {
                        //tab 头设置完了之后，将tab头和content转换成tabData
                        t.contentToTabData();
                    });
                }
            },
            //转换content 让bb-tab能渲染  同一个group组装content
            contentToTabData:function(){
                let t=this;
                t.tabsData=[];
                if(t.realTabs&&t.realTabs.length>0&&t.bbContent&&t.bbContent.length>0){
                    for(let i=0;i<t.realTabs.length;i++){
                        let data={
                            label:t.realTabs[i].label,
                            name:t.realTabs[i].name,
                            icon:t.realTabs[i].icon,
                            show:true,
                            content:[]
                        };
                        for(let j=0;j<t.bbContent.length;j++){
                            let item = t.bbContent[j];
                            if(item.group==t.realTabs[i].group){
                                //同一个group
                                let itemCopy = _TY_Tool.deepClone(item);
                                let itemAttrStr = JSON.stringify(item['attributes']);
                                itemCopy['attributes']=JSON.parse(itemAttrStr.replace(new RegExp('<%=tab.name%>','g'),data.name).replace(new RegExp('<%=tab.label%>','g'),data.label));
                                data.content.push(itemCopy);
                            }
                        }
                        t.tabsData.push(data);
                    }
                }
                t.canRender=true;
            },
            //tab点击事件
            tabClick:function(tab,t){
                if(t.hidePanel&&t.p_activeName ==tab.name){
                    //再次点击，取消选中
                    t.p_activeName = "";
                }else{
                    t.p_activeName = tab.name;
                }
                t.storageActiveTab(); 
                //分发tab点击事件
                t.$emit('tab-click',tab,t);
            },
            renderTabData: function (createElement) {
                const t = this;
                const headerArr=[];
                const paneArr = [];
                if (t.tabsData&&t.tabsData.length>0) {
                    t.tabsData.forEach((tabData, key)=> {
                        if(!tabData.show){
                            return true;
                        }
                        const _itemStyle = _TY_Tool.setSimpleStyle(t.itemStyle);
                        const _activeItemStyle = _TY_Tool.setSimpleStyle(t.activeItemStyle);

                        let iconDom = '';
                        if(tabData.icon){
                            //如果有icon
                            let iconStyle={}
                            if(t.tabIconStyle){
                                //如果有css样式配置
                                iconStyle = _TY_Tool.setSimpleStyle(t.tabIconStyle);
                            }
                            iconDom = createElement('i',{
                                attrs:{
                                    class:tabData.icon
                                },
                                style:iconStyle
                            },[]);
                        }

                        const label = createElement('div', {
                            class:"bb-tab-header-item "+(t.p_activeName==tabData.name?'is-active':''),
                            attrs:{
                                'tab-name':'tab_'+tabData.name
                            },
                            style:(t.p_activeName==tabData.name?Object.assign(_itemStyle,_activeItemStyle):_itemStyle),
                            on:{
                                click:function(){
                                    t.tabClick(tabData,t);
                                }
                            },
                            ref:"tab_header_"+tabData.name
                        }, [iconDom,createElement('span',{
                                attrs:{
                                    'tab-name':tabData.name
                                }
                            },tabData.label)
                        ]);

                        headerArr.push(label);

                        const tabPaneItem = createElement('div', {
                                class:"bb-tab-panel "+(t.p_activeName==tabData.name?'tab-show':'tab-hide'),
                                attrs: {
                                   'tab-name':'tab_'+tabData.name
                                },
                                ref:"tab_panel_"+tabData.name
                            }, _TY_Tool.bbRender(tabData.content, createElement, t));
                        paneArr.push(tabPaneItem);
                    });
                }
                const headerBox = createElement('div',{
                        class:['bb-tab-header'],
                        style:Object.assign({
                            float:(t.tabPosition==='left'||t.tabPosition==='right')?t.tabPosition:'none'
                        },_TY_Tool.setSimpleStyle(t.headerStyle))
                    },[createElement('div',{
                        class:['bb-tab-header-scroll','clearfix']
                    },[createElement('div',{
                        class:['bb-tab-header-box']
                        },headerArr)]
                    )
                ]);

                const panelBox = createElement('div',{
                    class:['bb-tab-panel-box'],
                    style:Object.assign({},_TY_Tool.setSimpleStyle(t.panelStyle),{
                        display:(t.p_activeName?'block':'none')
                    })
                },paneArr);
                const tabBox = t.tabPosition!=='bottom' ? [headerBox,panelBox] : [panelBox,headerBox];

                return tabBox;
            },
            loadChildBB(){
                let t=this;
                return _TY_Tool.loadChildBB(t);                
            }
        }
    }
</script>
<style lang='less' scoped>
    .bb-tab{
        font-size: 0.5rem;
    }
    .tab-hide{
        display: none;
    }
    .tab-show{
        display: block;
    }
    .bb-tab-header{
        overflow: hidden;
        margin-bottom: -0.0357rem;
        position: relative;
    }
    .bb-tab-header-scroll{
        overflow: auto;
        font-weight: 500;
        position: relative;
    }
    .bb-tab-header-box{
        white-space: nowrap;
        transition: transform .3s;
        position: relative;
        .bb-tab-header-item{
            display:inline-block;
            padding: 0 0.714rem;
            height: 1.48rem;
            box-sizing: border-box;
            line-height: 1.428rem;
            list-style: none;
            color: #303133;
            position: relative;
            text-align: center;
            cursor:pointer;

            &:hover,&:focus{
                color: #409eff;
            }
            &.is-active{
                color: #409eff;
            }
        }

    }
    .bb-tab-header:after{
        content: "";
        position: absolute;
        background-color: #e4e7ed;
        z-index: 5;
    }

/* position top */
    .bb-tab-position--top {
        .bb-tab-header{
            margin-bottom:0.357rem;
            &:after{
                left: 0;
                bottom: 0;
                width: 100%;
                height: 0.0714rem;
            }
        }
        .bb-tab-header-scroll::-webkit-scrollbar{
            display:none;
        }
        .bb-tab-header-item.is-active{
            z-index: 20;
            &>span{
                border-bottom: 0.0714rem solid #409eff;
                display: inline-block;
            }
        }
        .bb-tab-header-item:first-child{
            padding-left: 0;
        }
        .bb-tab-header-item:last-child{
            padding-right: 0;
        }
    }

/* position bottom */
    .bb-tab-position--bottom {
        .bb-tab-header{
            margin-top:0.357rem;
            &:after{
                left: 0;
                top: 0;
                width: 100%;
                height: 0.0714rem;
            }
        }
        .bb-tab-header-scroll::-webkit-scrollbar{
            display:none;
        }
        .bb-tab-header-item.is-active{
            z-index: 20;
            &>span{
                border-top: 0.0714rem solid #409eff;
                display: inline-block;
            }
        }
        .bb-tab-header-item:first-child{
            padding-left: 0;
        }
        .bb-tab-header-item:last-child{
            padding-right: 0;
        }
    }

/* position left */
    .bb-tab-position--left{
        min-height:7.14rem;
        .bb-tab-header{
            margin-right:0.357rem;
            &:after{
                right: 0;
                top: 0;
                height: 100%;
                width: 0.0714rem;
            }
        }
        .bb-tab-header-item{
            display:block;
            text-align: right;
            border-right:0.0714rem solid transparent;
            &.is-active{
                border-right: 0.0714rem solid #409eff;
                z-index:20;
            }
        }
    }

/* position right */
    .bb-tab-position--right{
        min-height:7.14rem;
        .bb-tab-header{
            margin-left:0.357rem;
            &:after{
                left: 0;
                top: 0;
                height: 100%;
                width: 0.0714rem;
            }
        }
        .bb-tab-header-item{
            display:block;
            text-align: left;
            border-left:0.0714rem solid transparent;
            &.is-active{
                border-left: 0.0714rem solid #409eff;
                z-index:20;
            }
        }
    }

/*FB 主题样式*/
    .bb-tab-theme--FB_card{
        .bb-tab-header{
            box-shadow: 0 0.0714rem 0.0714rem #ccc;
            .bb-tab-header-box{
                text-align: center;
            }
        }
        .bb-tab-header:after{
            height:0;
        }
        .bb-tab-header-item{
            line-height: 1.48rem;
            margin:0 0.6rem;
            border:0;
            text-align: center;
            &.is-active{
                border:0;
                color:#fff;
                background:#409eff;    
            }
            &>span{
                border-bottom: 0;
            }
        }
        .bb-tab-header-item:first-child,.bb-tab-header-item:last-child{
            padding: 0 0.714rem;
        }
    }
    .bb-tab-theme--FB_card.bb-tab-position--left{
        .bb-tab-header{
            box-shadow: 0.0714rem 0 0.0714rem #ccc;
            .bb-tab-header-item{
                margin:0;
            }
        }
    }
    .bb-tab-theme--FB_card.bb-tab-position--right{
        .bb-tab-header{
            box-shadow: -0.0714rem 0 0.0714rem #ccc;
            .bb-tab-header-item{
                margin:0;
            }
        }
    }
    .bb-tab-theme--FB_card.bb-tab-position--bottom{
        .bb-tab-header{
            box-shadow: 0 -0.0714rem 0.0714rem #ccc;
            .bb-tab-header-item{
                margin:0;
            }
        }
    }

/*big_card 主题样式*/
    .bb-tab-theme--big_card{
        .bb-tab-header{
            .bb-tab-header-box{
                
            }
            background:#f3f4f5;
        }
        .bb-tab-header:after{
            height:0.0357rem;
        }
        .bb-tab-header-item{
            line-height: 1.48rem;
            margin:0;
            text-align: center;
            border-left:0.0357rem solid #ccc;
            min-width:4.285rem;
            &:hover,&:focus{
                color:#8a5ebf;
            }
            &:last-child{
                border-right:0.0357rem solid #ccc;
            }
            &.is-active{
                color:#8a5ebf;
                border-top:0.0714rem solid #8a5ebf;
            }
            &.is-active>span,&>span{
                border-bottom: 0;
            }
        }
        .bb-tab-header-item:first-child,.bb-tab-header-item:last-child{
            padding: 0 0.714rem;
        }
    }
    .bb-tab-theme--big_card.bb-tab-position--left{
        .bb-tab-header{
            .bb-tab-header-item{
                margin:0;
                text-align: right;
                border-left:0;
                border-right:0.0714rem solid transparent;
                &.is-active{
                    border-top:0;
                    border-right:0.0714rem solid #8a5ebf;
                }
            }
            &:after{
                width:0.0357rem;
                height:100%;
                right: 0;
                top: 0;
            }
        }
    }
    .bb-tab-theme--big_card.bb-tab-position--right{
        .bb-tab-header{
            .bb-tab-header-item{
                margin:0;
                text-align: left;
                border-left:0;
                border-right:0.0714rem solid transparent;
                &.is-active{
                    border-top:0;
                    border-left:0.0714rem solid #8a5ebf;
                }
            }
            &:after{
                width:0.0357rem;
                height:100%;
                left: 0;
                top: 0;
            }
        }
    }
    .bb-tab-theme--big_card.bb-tab-position--bottom{
        .bb-tab-header{
            .bb-tab-header-item{
                margin:0;
                &.is-active{
                    border-top:0;
                    border-bottom:0.0714rem solid #8a5ebf;
                }
            }
            &:after{
                height:0.0357rem;
                width:100%;
                left: 0;
                top: 0;
            }
        }
    }
     



    

    

</style>