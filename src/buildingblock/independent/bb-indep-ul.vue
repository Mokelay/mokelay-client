

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
            const liInstance = t.renderLi(createElement);

            return createElement('ul',{
                class:{
                    indep_ul:true
                }
            },liInstance);
        },
        props: {
            //几列，如果是一列表示纵向展示，多列表示横向
            columns:{
                type:[Number,String],
                default:1
            },
            //主题 主要通过主题改变itemContent模板，来方便配置item ['line','card'] line表示一行一个文字，后面跟日期；card表示卡片，样式可以通过css编辑器控制
            theme:{
                type:String,
                default:'line'
            },
            //内容模板,通过数据填充展示的组件
            itemContent:{
                type:[String,Array],
                default:function(){
                    return [{
                        "uuid": "392D2A99-A533-4E5B-BF87-D8DAFE76A895",
                        "alias": "bb-words",
                        "aliasName": "纯文本",
                        "attributes": {
                            "tagName": "h3",
                            "text": "H3标签-<%=rowData.title%>"
                        },
                        "animation": [
                        ],
                        "interactives": [
                        ],
                        "layout": {
                        },
                        "onFocus": false
                    }]
                }
            },
            //静态的数据
            staticList:{
                type:[String,Array],
                default:function(){
                    return [{
                        title:'你好世界1'
                    },{
                        title:'你好世界2'
                    },{
                        title:'你好世界3'
                    },{
                        title:'你好世界4'
                    }]
                }
            },
            //列表数据  数据源
            ds:{
                type:Object
            }
        },
        data() {
            return {
               list:typeof(this.staticList)==='string'?eval('('+this.staticList+')'):this.staticList,
               external:{}
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
        },
        mounted:function(){
            let t=this;
            
        },
        methods: {
            //根据主题，修改 内容模板itemContent
            changeContentByTheme:function(){
                let t=this;
                if(!t.itemContent&&t.theme){
                    //根据不同的主题设置不同de itemContent
                    switch(t.theme){
                        case 'line':

                            break;
                        case 'card':

                            break;
                        default:
                            return
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
                                if(item['value']&&item['value']['list']){
                                    _list = item['value']['list'];    
                                }else{
                                    _list = item['value'];
                                }
                            }
                            t.list = _list;
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
                    //数据解析到模板中去
                    const _content = _TY_Tool.tpl(t.itemContent,{
                        rowData:item
                    });

                    let liItem = createElement('li',{
                        class:{

                        },
                        on:{
                            click:function(item){
                                debugger;
                                t.$emit('itemClick',item,t);
                            }
                        }
                    },_TY_Tool.bbRender(_content,createElement,t));
                    result.push(liItem);
                });

                return result;
            },
            linkage:function(...data){
                if(data){
                    this.external['linkage'] = data;
                    //外部参数请求数据，重新恢复到第一页
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

    
</style>