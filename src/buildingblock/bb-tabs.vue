<script>
    // import TYPage from "../page-preview";
    //TODO 需要支持内容的Page渲染
    import Util from '../libs/util.js'
    export default {
        name: 'bb-tabs',
        render:function(createElement){
            const t = this;
            if(t.canRender){
                const paneArr = t.renderTabPanes(createElement);
                return createElement('el-tabs',{props:{value:t.value,'active-name':t.activeName},on:{
                    'tab-click':t.tabClick
                }},[paneArr]);
            }
            
        },
        props: {
            tabPanes: {
                type: Array,
                default:function(){
                    return [
                        {
                           fields:[
                                {et:'',etProps:{}}
                           ],
                           value:'',
                           name:'',
                           label:''
                        }
                    ]
                }
            },
            value:{
                type:String
            },
            activeName:{
                type:String
            },
            badgeDs:{
                type:Object
            }
        },
        data() {
            return {
                badgeData:null,
                canRender:false
            }
        },
        created: function () {
            this.getBadge();
        },
        methods: {
            tabClick:function(tab, event){
                const t = this;
                t.$refs[tab.name].hide();
            },
            renderTabPanes:function(createElement){
                const t = this;
                const paneArr = [];
                if(t.tabPanes){
                    t.tabPanes.forEach((tabPane,key)=>{
                        if(t.badgeData){
                            t.badgeData.forEach((badgeItem,index)=>{
                                if(tabPane.name == badgeItem.name){
                                    tabPane.value = badgeItem.value
                                }
                            })
                        }
                        const tabPaneChild = [];
                        tabPane.fields = tabPane.fields?tabPane.fields:[];
                        let content = '';
                        tabPane.fields.forEach((field,index)=>{
                            let etProps = typeof field['etProps'] == 'string'?eval("("+field['etProps']+")"):field['etProps'];
                            tabPaneChild.push(createElement(field['et'],{props:etProps},[]))
                            content = createElement(field['et'],{props:etProps},[]);
                        });
                        const badge = createElement('bb-badge',{props:{value:tabPane.value},ref:tabPane.name},[]);
                        const label = createElement('span',{slot:'label'},[tabPane.label,badge]);
                        const tabPaneItem = createElement('el-tab-pane',{props:{name:tabPane.name,key:tabPane.name}
                        },[label,tabPaneChild]);
                        paneArr.push(tabPaneItem);
                    });
                    return paneArr;
                }else{
                    return [];
                }
            },
            getBadge: function () {
                var t = this;
                if (t.badgeDs) {
                    Util.getDSData(t.badgeDs, {"bb": t, "router": t.$route.params}, function (map) {
                        t.badgeData = [];
                        map.forEach((item,key)=>{
                            const badge = {
                                name:item.dataKey,
                                value:item.value,
                            }
                            t.badgeData.push(badge);
                        });
                        t.canRender = true;
                    }, function (code, msg) {
                    });
                }else{
                    t.canRender = true;
                }
            },
        }
    }
</script>