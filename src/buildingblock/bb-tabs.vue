<script>
    //TODO 需要支持内容的Page渲染
    import Vue from 'vue';
    import Util from '../libs/util.js'
    export default {
        name: 'bb-tabs',
        render: function (createElement) {
            const t = this;
            if (t.canRender) {
                const paneArr = t.renderTabPanes(createElement);
                return createElement('el-tabs', {
                    props: {value: t.value, 'active-name': t.p_activeName}, on: {
                        'tab-click': t.tabClick
                    }
                }, [paneArr]);
            }

        },
        props: {
            tabPanes: {
                type: Array,
                default: function () {
                    return [];
                }
            },
            value: {
                type: String
            },
            activeName: {
                type: String
            },
            badgeDs: {
                type: Object
            },
            //tab头支持接口返回，默认text,value，不满足用handle处理
            tabDs: {
                type: [Object,String]
            },
            //针对tabDs，如果是接口返回的tab头，页面配置公共的
            tabDsContent: {
                type: [Array,String]
            }
        },
        data() {
            return {
                badgeData: null,
                canRender: false,
                // paneBox: []
            }
        },
        computed: {
            p_activeName(){
                return _TY_Tool.tpl(this.activeName,_TY_Tool.buildTplParams(this));
            }
        },
        created: function () {
            this.getTabList();
            this.getBadge();
        },
        methods: {
            tabClick: function (tab, event) {
                const t = this;
                t.$refs['badge_'+tab.name].hide();
                let alias = tab.name;
                let currentTab;
                for(let i=0;i<t.paneBox.length;i++){
                    if(alias==t.paneBox[i].alias){
                        currentTab = t.paneBox[i];
                        break;
                    }
                }
                if(!currentTab.dom.componentInstance){
                  //渲染content
                    let dom = new Vue({
                        router: t.$router,
                        render: function(createElement) {
                            return currentTab.dom;
                        }
                    }).$mount('#tab_pane_' + alias);
                }
            },
            renderTabPanes: function (createElement) {
                const t = this;
                const paneArr = [];
                let _paneBox = [];
                if (t.tabPanes&&t.tabPanes.length>0) {
                    t.tabPanes.forEach((tabPane, key)=> {
                        if (t.badgeData) {
                            t.badgeData.forEach((badgeItem, index)=> {
                                if (tabPane.name == badgeItem.name) {
                                    tabPane.value = badgeItem.value
                                }
                            })
                        }
                        //当前tab是否默认选中的tab
                        const activeTab = t.p_activeName&&tabPane.name==t.p_activeName;
                        const activeTabDom =[];
                        tabPane.fields = tabPane.fields ? tabPane.fields : [];
                        tabPane.fields.forEach((field, index)=> {
                            let etProps = typeof field['etProps'] == 'string' ? eval("(" + field['etProps'] + ")") : field['etProps'];
                            let currentDom = createElement(field['et'], {
                                props: _TY_Tool.tpl(etProps, _TY_Tool.buildTplParams(t,{
                                    "tab": {//静态配置只传过去name和value
                                        label: tabPane.label,
                                        name: tabPane.name
                                    }
                                }))
                            }, []);
                            _paneBox.push({
                                rendered:activeTab,
                                alias: tabPane.name,//表示唯一tab
                                dom:currentDom
                            });
                            if(activeTab){
                                activeTabDom.push(currentDom);
                            }
                        });
                        const badge = createElement('bb-badge', {props: {value: tabPane.value}, ref: 'badge_'+tabPane.name}, []);
                        const label = createElement('span', {slot: 'label'}, [tabPane.label, badge]);
                        const tabPaneItem = createElement('el-tab-pane', {
                                    props: {name: tabPane.name,label:tabPane.label, key: tabPane.name}
                                }, [label, createElement('div', {
                                    attrs: {id: 'tab_pane_' + tabPane.name}
                                }, [activeTabDom])]
                        );
//                        },[label,tabPaneChild]);
                        paneArr.push(tabPaneItem);
                    });
                }
                if(_paneBox.length>0){
                    t.paneBox=_paneBox;
                }
                return paneArr;
            },
            getBadge: function () {
                var t = this;
                if (t.badgeDs) {
                    Util.getDSData(t.badgeDs, _TY_Tool.buildTplParams(t), function (map) {
                        t.badgeData = [];
                        map.forEach((item, key)=> {
                            const badge = {
                                name: item.dataKey,
                                value: item.value,
                            }
                            t.badgeData.push(badge);
                        });
                        t.canRender = true;
                    }, function (code, msg) {
                    });
                } else {
                    t.canRender = true;
                }
            },
            getTabList(){
                let t=this;
                if(t.tabDs){
                    Util.getDSData(t.tabDs, _TY_Tool.buildTplParams(t), function (map) {
                        map[0].value.forEach((item, key)=> {
                            const tab = {
                                label: item.text,
                                name: item.value,
                                fields:[]
                            }
                            if(t.tabDsContent){
                                let props = typeof t.tabDsContent == 'string' ? eval("("+t.tabDsContent+")") : t.tabDsContent;
                                let newProps=_TY_Tool.tpl(props,_TY_Tool.buildTplParams(t,{
                                    "tab": {//动态可以传其他值
                                        label: item.text,
                                        name: item.value
                                    }
                                }));
                                tab.fields.push(newProps);
                            }
                            t.tabPanes.push(tab);
                        });
                    }, function (code, msg) {
                    });
                }
            }
        }
    }
</script>