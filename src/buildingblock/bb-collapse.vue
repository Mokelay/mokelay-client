
 
<script>

/**
    //bb-collapse
    {
        uuid: '123',
        alias: 'bb-collapse',
        aliasName: '折叠面板',
        attributes: [{
            accordion: false,//是否手风琴样式
            activeNames: ['a'],//默认展开项
            collapseData:[{
                title:'属性配置',
                name:'a',
                content:[{
                    uuid: '234',
                    alias: 'bb-list',
                    aliasName: '属性配置',
                    group: 'a', //a  和 head上面的name属性对应
                    attributes: { ...
                    }, //etProps的内容
                    animation: [{ ...
                    }],
                    interactives: [{ ...
                    }],
                    layout: { ...
                    }
                }]
            }]
        }]
    }
**/
    export default {
        name: 'bb-collapse',
        render: function (createElement) {
            const t = this;
            const renderArray = t.renderElement(createElement);
            return createElement('el-collapse', {
                ref:'bb-collapse',
                props:{
                    value:this.p_activeNames
                }
            }, [renderArray]);
        },
        props: {
            value:{
                type:[String,Array]
            },
            //是否手风琴
            accordion:{
                type:Boolean,
                default:false
            },
            //默认展开值设置
            activeNames:{
                type:[Array,String],
                default:function(){
                    return [];
                }
            },
            /**
                [{
                    title:'属性配置',
                    name:'a',
                    content:[{
                        uuid: '234',
                        alias: 'bb-list',
                        aliasName: '属性配置',
                        group: 'a', //a  和 head上面的name属性对应
                        attributes: { ...
                        }, //etProps的内容
                        animation: [{ ...
                        }],
                        interactives: [{ ...
                        }],
                        layout: { ...
                        }
                    }]
                }]
            **/
            collapseData:{
                type:[Array,String],
                default:function(){
                    return null;
                }
            },
            //查询折叠面板的item数据 有几个内折叠
            itemDs:{
                type:Object,
                default:function(){
                    return null;
                }
            },
            //collapseDs 动态获取折叠面板
            collapseDs:{
                type:Object
            },
            /*templateContent 折叠面板内容
                content:[{
                    uuid: '234',
                    alias: 'bb-list',
                    aliasName: '属性配置',
                    group: 'a', //a  和 head上面的name属性对应
                    attributes: { ...
                    }, //etProps的内容
                    animation: [{ ...
                    }],
                    interactives: [{ ...
                    }],
                    layout: { ...
                    }
                }]
            */
            templateContent:{
                type:[Array,String]
            },
        },
        data() {
            return {
                // p_activeNames:((this.activeNames&&typeof(this.activeNames)==='string')?(this.activeNames.indexOf(",")>=0?this.activeNames.split(","):this.activeNames):this.activeNames),
                //collapseData 数据
                renderData:this.collapseData?(typeof(this.collapseData)==='string'?JSON.parse(this.collapseData):this.collapseData):[],
                external:{},//外部参数
                totalData:this.collapseData?(typeof(this.collapseData)==='string'?JSON.parse(this.collapseData):this.collapseData):[]
            }
        },
        watch: {
            collapseData(val){
                this.totalData = val?(typeof(val)==='String'?JSON.parse(val):val):[]
            }
        },
        computed:{
            p_activeNames(){
                if(this.accordion){
                    //手风琴
                    if(typeof(this.activeNames)==='string'){
                        return this.activeNames.split(",")[0];
                    }else{
                        return this.activeNames[0];
                    }
                }else{
                    if(typeof(this.activeNames)==='string'){
                        return this.activeNames.split(",");
                    }
                }
                return this.activeNames;
            }
        },
        created: function () {
            let t=this;
            //初始化item
            t.buildTitle();
            t.getCollapseItem();
        },
        mounted:function(){
            let t=this;
        },
        methods: {
            //外部传参调用
            linkage:function(...data){
                if(data){
                    this.external['linkage'] = data;
                    this.buildTitle();
                }
            },
            //动态获取item值  renderData的name属性来分组
            buildTitle:function(){
                let t=this;
                 if(t.itemDs){
                    _TY_Tool.getDSData(t.itemDs, _TY_Tool.buildTplParams(t), function (map) {
                        let showItems=[];
                        t.totalData.forEach(function(itemData){
                            itemData.isShow=false;
                            map[0].value.forEach((item, key)=> {
                                if(item.alias==itemData.name){
                                    itemData.isShow=true;
                                }
                            });
                            if(JSON.stringify(showItems).indexOf(JSON.stringify(itemData))==-1){
                                showItems.push(itemData);
                            }
                        });
                        t.renderData = showItems.reverse();
                    }, function (code, msg) {
                    });
                }
            },
            //渲染组件
            renderElement:function(createElement){
                let t=this;
                let result = [];
                if(t.renderData&&t.renderData.length>0){
                    t.renderData.forEach(function(data,index){
                        let style={};
                        if(!data.isShow){
                            style={
                                "display":"none"
                            }
                        }
                        let collapseItemContent=_TY_Tool.bbRender(data.content, createElement, t);
                        result.push(createElement('el-collapse-item',{
                            props:{
                                title:data.title,
                                name:data.name
                            },
                            style:style
                        },collapseItemContent));
                    });
                }
                return result;
            },
            loadChildBB(){
                let t=this;
                return _TY_Tool.loadChildBB(t);                
            },
            /*DS动态获取Collapse项
                获取到的itemList = [{
                            title:'',
                            name:'',
                            content:[],
                            isShow:true
                        }]
            */

            getCollapseItem:function(){
                const t = this;
                if (t.collapseDs) {
                    _TY_Tool.getDSData(t.collapseDs, _TY_Tool.buildTplParams(t), function (map) {
                        const itemList = map[0].value;
                        let templateContent = t.templateContent;
                        templateContent = templateContent?(typeof(templateContent)==='string'?eval(templateContent):templateContent):[];
                        itemList.forEach((val,key)=>{
                            //用模板生成具体的contentItem 生成新的uuid
                            t.transferContentItem(templateContent);
                            templateContent.forEach((contentItem,index)=>{
                                //根据新生成的uuid重构交互
                                contentItem['interactives'].forEach((interactive,id)=>{
                                    interactive['uuid'] = _TY_Tool.uuid();
                                    interactive['fromContentUUID'] = contentItem['uuid'];
                                    if(interactive['executeType'] == 'trigger_method'){
                                        const oldUUID = interactive['executeContentUUID'];
                                        //修改模板中的目标积木uuid
                                        interactive['executeContentUUID'] = t.collapseItem[oldUUID] || oldUUID;
                                    }
                                });
                                contentItem['attributes']['parantData'] = val['name'];
                                if(contentItem['group'] && contentItem['group'] == val['name']){
                                    //如果有分组则按分组放置
                                    val['content'].push(contentItem);
                                }else if(!contentItem['group']){
                                    val['content'].push(contentItem);
                                }
                            })
                        })
                        t.renderData = itemList;
                    }, function (code, msg) {
                    });
                }
            },
            //用模板生成具体的contentItem的uuid
            transferContentItem:function(templateContent){
                const t = this;
                templateContent.forEach((contentItem,index)=>{
                    t.collapseItem = t.collapseItem?t.collapseItem:{};
                    //生成新的积木uuid
                    const newUUID = _TY_Tool.uuid();
                    t.collapseItem[contentItem['uuid']] = newUUID;
                    contentItem['uuid'] = newUUID;
                })
            }
        }
    }
</script>