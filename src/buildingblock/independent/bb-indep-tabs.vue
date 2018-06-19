
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
                    'bb-tab-position--'+t.tabPosition
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
                default:'default'
            },
            //默认展开的tab名称
            activeName: String,
            //tab的位置
            tabPosition: {
                type: String,
                default: 'top'
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
                            const item = new Promise((resolve, reject) => {
                                _TY_Tool.getDSData(tab.ds, _TY_Tool.buildTplParams(t), function (map) {
                                    map[0].value.forEach((item, key)=> {
                                        t.realTabs.push({
                                            label: item.text,
                                            name: item.value,
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
            tabClick:function(tab,t){
                t.p_activeName = tab.name;
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
                        
                        const label = createElement('div', {
                            class:"bb-tab-header-item "+(t.p_activeName==tabData.name?'is-active':''),
                            attrs:{
                                'tab-name':'tab_'+tabData.name
                            },
                            on:{
                                click:function(){
                                    t.tabClick(tabData,t);
                                }
                            },
                            ref:"tab_header_"+tabData.name
                        }, [createElement('span',{
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
                        class:['bb-tab-header']
                    },[createElement('div',{
                        class:['bb-tab-header-scroll']
                    },[createElement('div',{
                        class:['bb-tab-header-box']
                        },headerArr)]
                    )
                ]);
                const panelBox = createElement('div',{
                    class:['bb-tab-panel-box']
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
        margin-bottom: -1px;
        position: relative;
    }
    .bb-tab-header-scroll{
        overflow-x: scroll;
        font-weight: 500;
        position: relative;
    }
    .bb-tab-header-box{
        white-space: nowrap;
        transition: transform .3s;
        float: left;
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
            cursor:pointer;

            &:hover,&:focus{
                color: #409eff;
            }
            &.is-active{
                color: #409eff;
            }
        }

    }

    .bb-tab-position--top {
        .bb-tab-header:after{
            content: "";
            position: absolute;
            left: 0;
            bottom: 0;
            width: 100%;
            height: 2px;
            background-color: #e4e7ed;
            z-index: 5;
        }
        .bb-tab-header-scroll::-webkit-scrollbar{
            display:none;
        }
        .bb-tab-header-active-bar{
            position: absolute;
            bottom: 0;
            left: 0;
            height: 2px;
            background-color: #409eff;
            z-index: 10;
            transition: transform .3s cubic-bezier(.645,.045,.355,1);
            list-style: none;
        }
        .bb-tab-header-item.is-active{
            z-index: 20;
            &>span{
                border-bottom: 2px solid #000;
                border-bottom-color:#409eff;
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
     

    .bb-tab-panel-box{

        .bb-tab-panel{

        }
    }

    

</style>