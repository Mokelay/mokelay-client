
 
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
            return createElement('el-button-group', {
                ref:'bb-collapse',
                value:this.p_activeNames
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
            }

        },
        data() {
            return {
                p_activeNames:typeof(this.activeNames)==='string'?JSON.parse(this.activeNames):this.activeNames,
                //collapseData 数据
                renderData:this.collapseData?(typeof(this.collapseData)==='String'?JSON.parse(this.collapseData):this.collapseData):[]
            }
        },
        watch: {
        },
        created: function () {

        },
        mounted:function(){
            let t=this;
        },
        methods: {
            //渲染组件
            renderElement:function(createElement){
                let t=this;
                let result = [];
                if(t.renderData&&t.renderData.length>0){
                    t.renderData.forEach(function(data,index){
                        let collapseItemContent=_TY_Tool.bbRender(data.content, createElement, t);
                        result.push(createElement('el-collapse-item',{
                            props:{
                                title:data.title,
                                name:data.name
                            }
                        },collapseItemContent));
                    });
                }
                return result;
            }
           

        }
    }
</script>