
 
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
                    value:t.real_p_activeNames
                },
                on:{
                     change:t.collapseChange
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
                    isShow:true,//默认是否展示
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
            //右侧html模板
            itemRightTpl:{
                type:String
            },
            //是否显示左侧checkbox
            showLeftCheckbox:{
                type:Boolean,
                default:false
            }
        },
        data() {
            return {
                // p_activeNames:((this.activeNames&&typeof(this.activeNames)==='string')?(this.activeNames.indexOf(",")>=0?this.activeNames.split(","):this.activeNames):this.activeNames),
                //collapseData 数据
                renderData:this.collapseData?(typeof(this.collapseData)==='string'?JSON.parse(this.collapseData):this.collapseData):[],
                external:{},//外部参数
                totalData:this.collapseData?(typeof(this.collapseData)==='string'?JSON.parse(this.collapseData):this.collapseData):[],
                selectedDatas:[],//checkbox勾选数据存储
                real_p_activeNames:[]

            }
        },
        watch: {
            collapseData(val){
                this.totalData = val?(typeof(val)==='String'?JSON.parse(val):val):[];
                this.renderData = val?(typeof(val)==='String'?JSON.parse(val):val):[];
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
                this.real_p_activeNames = this.activeNames;
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
                    this.getCollapseItem();
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
                        const checkboxInstance = createElement('el-checkbox',{
                            style:{
                                'margin': '0 10px',
                                'display':(t.showLeftCheckbox?'inline':'none')
                            },
                            on:{
                                change:function(val){
                                    //checkbox 改变后
                                    if(val){
                                        //勾选
                                        if(t.selectedDatas.indexOf(data.name)<0){
                                            t.selectedDatas.push(data.name);
                                        }
                                    }else{
                                        //取消勾选
                                        if(t.selectedDatas.indexOf(data.name)>=0){
                                            t.selectedDatas.splice(t.selectedDatas.indexOf(data.name),1);
                                        }
                                    }
                                    //勾选改变事件
                                    t.$emit('checkedChange',data.name,val,t.selectedDatas,t);
                                }
                            }
                        },[]);
                        const customTitle = createElement('template',{
                            slot:'title'
                        },[checkboxInstance,data.title]);
                        let collapseItemContent=_TY_Tool.bbRender(data.content, createElement, t);
                        const collapseItem = createElement('el-collapse-item',{
                            props:{
                                name:data.name
                            },
                            style:style,
                            ref:data.name
                        },[customTitle].concat(collapseItemContent));

                        result.push(createElement('div',{
                                style:{
                                    position:'relative'
                                }
                            },[collapseItem,createElement('div',{
                                    domProps:{
                                        innerHTML:_TY_Tool.tpl(t.itemRightTpl,_TY_Tool.buildTplParams(t,{
                                            rowData:data
                                        }))
                                    },
                                    style:{
                                        position:'absolute',
                                        top: '0',
                                        right: '1rem',
                                        'font-size': '0.45rem',
                                        'line-height': '1.715rem'
                                    }
                                },[])
                            ])
                        );
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
                分页数据：
                    {
                        totalRecords:100,
                        currentRecords:[{
                            title:'',
                            name:'',
                            content:[],
                            isShow:true
                        }]
                    }
            */

            getCollapseItem:function(){
                const t = this;
                if (t.collapseDs) {
                    _TY_Tool.getDSData(t.collapseDs, _TY_Tool.buildTplParams(t), function (map) {
                        const datas = map[0].value;
                        let itemList;
                        let totalItems=0;
                        if(datas['currentRecords']&&datas['totalRecords']>=0){
                            //分页数据
                            totalItems = datas['totalRecords'];
                            itemList = datas['currentRecords'];
                        }else{
                            itemList = datas;
                        }
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

                                //解析模板 ===start=== 需要将当前content需要的参数模板解析 成对应的值
                                // let itemAttrStr = JSON.stringify(contentItem['attributes']);
                                let itemAttrStr = JSON.stringify(contentItem);
                                const newItemAttrStr = t.transferAttributesTpl(itemAttrStr,val);
                                // let newItemAttrStr = itemAttrStr.replace(new RegExp('<%=collapse.name%>','g'),val.name).replace(new RegExp('<%=collapse.label%>','g'),val.title);
                                contentItem = JSON.parse(newItemAttrStr);
                                //解析模板 ===end===
                                if(!val['content']){
                                    val['content'] = [];
                                }
                                if(contentItem['group'] && contentItem['group'] == val['name']){
                                    //如果有分组则按分组放置
                                    val['content'].push(contentItem);
                                }else if(!contentItem['group']){
                                    val['content'].push(contentItem);
                                }
                            })
                        })
                        t.renderData = itemList;

                        t.$emit('afterLoadData',itemList,totalItems,t);//加载完数据之后触发 主要是用于分页事件
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
            },
            //模板转换成属性  itemAttrStr 属性的string  val 当前content的数据
            transferAttributesTpl(itemAttrStr,val){
                const t = this;
                const items = itemAttrStr.match(/<%=(collapse+).*?%>/g);
                let newItemAttrStr = itemAttrStr;
                if(items){
                    items.forEach((item,key)=>{
                        let attrName = item.split('.')[1].split("%>")[0]
                        newItemAttrStr = newItemAttrStr.replace(new RegExp(item,'g'),val[attrName])
                    })
                }
                return newItemAttrStr;
            },
            collapseChange(val){
                this.$emit("collapseChange",val);
            },
            //关闭全部
            closeAll(){
                this.real_p_activeNames = [];
            }
        }
    }
</script>