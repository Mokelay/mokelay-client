<script>
    /**
        //bb-tabs
        {
            uuid: '123',
            alias: 'bb-tabs',
            aliasName: '标签',
            attributes: [{
                tabPosition: 'left',
                activeName: 'all',
                badgeDs: {
                    ...
                },
                tabPanes: [{ //tabPanes属性逐渐下架，后面用content和tabs
                    label: '全部',
                    name: 'all',
                    fields: [{
                        et: 'bb-page',
                        etProps: '{...}'
                    }]
                }],
                tabDs: {...},//tabPanes属性逐渐下架，后面用content和tabs
                tabDsContent:[{...}],//模板  //tabPanes属性逐渐下架，后面用content和tabs
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
                ...
            }]
        }
    **/

    //TODO 需要支持内容的Page渲染
    import Vue from 'vue';
    import Util from '../../libs/util.js'
    export default {
        name: 'bb-tabs',
        render: function (createElement) {
            const t = this;
            if(!t.canRender){
                return;
            }
            if(!t.hasTransfer){
                t.contentToTabData();
            }
            const paneArr = t.renderTabData(createElement);

            //模拟点击默认tab事件,避免已经渲染的dom重新渲染
            setTimeout(function(){
                t.tabClick({name:t.p_activeName});
            },300);
            return createElement('el-tabs', {
                props: {
                    value: t.p_activeName,
                    "tab-position":t.tabPosition,
                    type:t.tabType
                }, on: {
                    'tab-click': t.tabClick
                },
            }, [paneArr]);
        },
        props: {
            //tab的样式  border-card、card、默认
            tabType:{
                type:String,
                default:''
            },
            tabIconStyle:{
                type:[Object,String],
                default:null
            },
            lazy:{
                type:Boolean,
                default:true
            },
            /**
                最终的tab数据是由tabPanels + tabDS 合并而来
                实现交互渲染，需要改造为content , 增加group设计
            **/
            content:{
                type:[Array,String],
                default:function(){
                    return [];
                }
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
            /**
                [{
                    label: item.text,
                    name: item.value,
                    fields:[{
                        et:'bb-input',
                        etProps:'{xxx:xxx}'
                    }]
                }]
            **/
            tabPosition:{
                type:String,
                default:"top"
            },
            //后面废弃
            tabPanes: {
                type: Array,
                default: function () {
                    return [];
                }
            },
            //选中tab的name
            activeName: {
                type: String
            },
            //Tab上的角标读取的DS
            badgeDs: {
                type: Object
            },
            //Tab头支持接口返回，默认text,value，不满足用handle处理  后面废弃
            tabDs: {
                type: Object,
                default:function(){
                    return null;
                }
            },
            //针对tabDs，如果是接口返回的tab头，页面配置公共的  后面废弃
            tabDsContent: {
                type: [Array,String]
            }
        },
        data() {
            return {
                badgeData: null,
                canRender:false,//是否可以渲染了，属性改动会重新执行render方法
                bbTabs:this.tabs,//tab header,含dynamic类型
                /**
                    最终转换成没有dynamic的类型
                    [{
                        label:'全部',
                        name:'all',
                        group:'all'
                    }]
                **/
                realTabs:[],
                bbContent:typeof(this.content)==='string'?JSON.parse(this.content):this.content,
                /**
                    tabsData:[{
                        label: '全部',
                        name: 'all',
                        icon: 'ty-icon'
                        content:[{
                            
                        }]
                    }]
                **/
                tabsData:[],//最终转换成tab识别的data数据
                key:'',//当前组件标识，针对同一个页面由多个相同的组件
                hasTransfer:false,//表示t.contentToTabData(); 方法是否已经执行了，这个方法只能执行一次
                p_activeName:_TY_Tool.tpl(this.activeName,_TY_Tool.buildTplParams(this))
                
            }
        },
        computed: {
            // p_activeName(){
            //     return _TY_Tool.tpl(this.activeName,_TY_Tool.buildTplParams(this));
            // }
        },
        created: function () {
            const t=this;
            // this.getTabList();
            this.getBadge();
            //将老的属性转换成content
            t.oldPropsToContent();
            //再created的时候，先将动态tab头查询出来
            t.getTabHeaders();
        },
        mounted:function(){
            let t=this;
            //将content属性转换成可以识别的tab组件
            t.key = ""+ +new Date();
            setTimeout(()=>{
                t.$emit("mounted",t);
            },500);
        },
        methods: {
            //刷新tab方法 
            refresh:function(){
                let t=this;
                t.canRender = false;
                setTimeout(function(){
                    t.canRender = true;
                },300);
            },
            showOrHideTab:function(..._data){
                let t=this;
                _data.forEach((val,key)=>{
                  if(val.type == 'custom'){
                    let showTabNames = val.arguments;// 逗号隔开  abc,def
                    if(showTabNames){
                        let showTabNameArray = showTabNames.split(",");
                        t.tabsData.forEach(function(tab,_index){
                            let showFlag = false;
                            showTabNameArray.forEach(function(item,index){
                                if(tab.name===item){
                                    showFlag = true;
                                    return false;//break
                                }
                            });
                            if(showFlag){
                                tab.show = true;
                            }else{
                                tab.show=false;
                            }
                        });
                    }
                    t.refresh();
                    return false;//break
                  }
                });
            },
            //tabPanes  tabDs tabDsContent 转换成  只有在this.content没数据的时候才调用,方法内改变 bbContent 的值
            oldPropsToContent:function(){
                let t=this;
                if(t.bbContent&&t.bbContent.length>0){
                    return;
                }
                t.bbContent = [];
                t.bbTabs=[];
                if(t.tabPanes){
                    for(let i=0;i<t.tabPanes.length;i++){
                        let item = t.tabPanes[i];
                        t.bbTabs.push({
                            type:'static',
                            label:item.label,
                            name:item.name,
                            icon:item.icon
                        });
                        let fields = item.fields;
                        for(let j=0;j<item.fields.length;j++){
                            let field = item.fields[j];
                            t.bbContent.push({
                                uuid:_TY_Tool.uuid(),
                                alias:field['et'],
                                aliasName:field['et'],
                                group:item.name,
                                attributes:typeof field['etProps'] == 'string' ? eval("("+field['etProps']+")") : field['etProps'],
                                animation:[],
                                interactives:[],
                                layout:{}
                            });
                        }
                    }
                }
                if(t.tabDs&&t.tabDsContent){
                    t.bbTabs.push({
                        type:'dynamic',
                        label:'动态tab',
                        name:'dynamicTab',
                        ds:t.tabDs,
                        icon:''
                    });
                    let props = typeof t.tabDsContent == 'string' ? eval("("+t.tabDsContent+")") : t.tabDsContent;
                    t.bbContent.push({
                        uuid:_TY_Tool.uuid(),
                        alias:props['et'],
                        aliasName:props['et'],
                        group:'dynamicTab',
                        attributes:props['etProps'],
                        animation:[],
                        interactives:[],
                        layout:{}
                    });
                }
            },
            //根据bbTabs 获取所有的
            getTabHeaders:function(){
                let t=this;
                t.realTabs=[];
                if(t.bbTabs&&t.bbTabs.length>0){
                    t.bbTabs.forEach(function(tab,index){
                        if(tab.type==='static'){
                            t.realTabs.push({
                                label:tab.label,
                                name:tab.name,
                                group:tab.name,
                                icon:tab.icon
                            });
                            t.canRender=true;
                        }else if(tab.type==='dynamic'){
                            t.canRender=false;
                            _TY_Tool.getDSData(tab.ds, _TY_Tool.buildTplParams(t), function (map) {
                                map[0].value.forEach((item, key)=> {
                                    t.realTabs.push({
                                        label: item.text,
                                        name: item.value,
                                        group: tab.name,
                                        icon: item.icon
                                    })
                                });
                                t.canRender=true;
                            }, function (code, msg) {
                            });
                        }
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
                t.hasTransfer=true;
                t.canRender=true;
            },
            tabClick: function (tab, event) {
                const t = this;
                t.p_activeName = tab.name; 
                if(t.$refs['badge_'+tab.name]){
                    t.$refs['badge_'+tab.name].hide();
                }
                
                t.$emit('tab-click',tab);
                // 只有懒加载才需要 重新渲染
                if(t.lazy){
                    //如果是bb-page的内容，就只能通过bb-page 的p_params传参了
                    let alias = tab.name;
                    let currentTabContent;
                    t.tabsData.forEach((tabData, key)=> {
                        if(tabData.name==alias){
                            currentTabContent=tabData.content;
                        }
                    });
                    if(currentTabContent&&currentTabContent[0]&&currentTabContent[0].alias=='bb-page'
                            &&currentTabContent[0].attributes&&currentTabContent[0].attributes.pageAlias&&
                             _TY_Page_Data[currentTabContent[0].attributes.pageAlias]&&alias!='all'){
                        _TY_Page_Data[currentTabContent[0].attributes.pageAlias].p_params=alias;
                    }
                    //目前只是解决了按需加载tab页，点击刷新可以通过交互来做
                    if(!document.getElementById('tab_pane_' + alias+'_'+t.key)){
                        return;
                    }
                    //渲染content
                    let dom = new Vue({
                        router: t.$router,
                        render: function(createElement) {
                            return createElement('div',{},_TY_Tool.bbRender(currentTabContent, createElement, t));
                        }
                    }).$mount('#tab_pane_' + alias+'_'+t.key);
                    t.$refs[_TY_Tool.uuid()] = dom; //把创建的vue 设置到$refs中
                }
            },
            renderTabData: function (createElement) {
                const t = this;
                const paneArr = [];
                if (t.tabsData&&t.tabsData.length>0) {
                    t.tabsData.forEach((tabData, key)=> {
                        if(!tabData.show){
                            return true;
                        }
                        if (t.badgeData) {
                            t.badgeData.forEach((badgeItem, index)=> {
                                if (tabData.name == badgeItem.name) {
                                    tabData.value = badgeItem.value
                                }
                            })
                        }
                        const badge = createElement('bb-badge', {props: {value: tabData.value}, ref: 'badge_'+tabData.name}, []);
                        let iconDom = '';
                        if(tabData.icon){
                            //如果有icon
                            let iconStyle={}
                            if(t.tabIconStyle){
                                //如果有css样式配置
                                iconStyle = typeof(t.tabIconStyle)==='string'?eval(t.tabIconStyle):t.tabIconStyle;
                            }
                            iconDom = createElement('i',{
                                attrs:{
                                    class:tabData.icon
                                },
                                style:iconStyle
                            },[]);
                        }

                        let panelContent;
                        if(!t.lazy){
                            panelContent = createElement('div',{},_TY_Tool.bbRender(tabData.content, createElement, t));
                        }
                        //将每个item创建的vue对象放到 t.tabsData中,方便传参
                        tabData.vuePanel = panelContent;
                        const label = createElement('span', {slot: 'label'}, [iconDom,tabData.label, badge]);
                        const tabPaneItem = createElement('el-tab-pane', {
                                    props: {name: ""+tabData.name,label:tabData.label, key: tabData.name}
                                }, [label, createElement('div', {
                                    attrs: {id: 'tab_pane_' + tabData.name+'_'+t.key}
                                }, [panelContent])]
                        );
                        paneArr.push(tabPaneItem);
                    });
                }
                return paneArr;
            },
            getBadge: function () {
                var t = this;
                if (t.badgeDs) {
                    t.canRender=false;
                    Util.getDSData(t.badgeDs, _TY_Tool.buildTplParams(t), function (map) {
                        t.badgeData = [];
                        map.forEach((item, key)=> {
                            const badge = {
                                name: item.dataKey,
                                value: item.value,
                            }
                            t.badgeData.push(badge);

                        });
                        t.canRender=true;
                    }, function (code, msg) {
                         t.canRender=true;
                    });
                } else {
                }
            },
            loadChildBB(){
                let t=this;
                return _TY_Tool.loadChildBB(t);                
            },
            //外部设置当前激活标签
            setActiveName(...params){
                const t = this;
                params.forEach((param,key)=>{
                    if(param.type == "custom"){
                        t.p_activeName = param.arguments;                  
                    }
                })
            }
        }
    }
</script>