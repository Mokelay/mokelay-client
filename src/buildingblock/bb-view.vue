<script>
    export default {
        name: 'bb-view',
        render:function(createElement){
            const t = this;
            const itemList = t.renderItem(createElement);
            return createElement('el-form',{
                    props:{
                        inline:true,
                        'label-width':'100px',
                        'label-position':"left",
                    },
                    class:'grid'
                },itemList);
        },
        props: {
            /*静态表单项
                [{
                    alias:''表单项键名
                    aliasName:''表单项名称
                    dt:'String,Number,File,Image' 值类型,
                    width:'33.33%'
                }]
            */
            fields:{
                type:Array
            },
            /*动态表单项*/
            fieldsDs:{
                type:Object
            },
            /*静态数据
                {   
                    键名：键值
                    alias1:'测试数据',
                    alias2:1,
                    alias3:[{
                        name:'文件名称.pdf',
                        href:'http://www..../123.pdf'
                    }],
                    alias4:[{
                        name:'图片名称',
                        href:'http://.....123.jpg'
                    }]
                }
            */
            data:{
                type:Object
            },
            /*动态数据*/
            dataDS:{
                type:Object
            },
        },
        data() {
            return {
                formData:this.data,
                realFields:this.fields
            }
        },
        watch: {
        },
        created: function () {
            const t = this;
            t.getFields();
            t.getData();
        },
        mounted:function(){
        },
        methods: {
            //通过DS获取表单项
            getFields: function () {
                const t = this;
                if (t.fieldsDs) {
                    _TY_Tool.getDSData(t.fieldsDs, _TY_Tool.buildTplParams(t), function (map) {
                        map.forEach((val,key)=>{
                            const dataKey = val.dataKey
                            t.realFields = val.value;
                        })
                    }, function (code, msg) {
                    });
                }
            },
            //通过DS获取表单数据
            getData: function () {
                const t = this;
                if (t.dataDS) {
                    _TY_Tool.getDSData(t.dataDS, _TY_Tool.buildTplParams(t), function (map) {
                        map.forEach((val,key)=>{
                            const dataKey = val.dataKey;
                            t.formData = val.value;
                        })
                    }, function (code, msg) {
                    });
                }
            },
            //外部刷新表单数据
            linkage:function(...data){
                if(data){
                    this.external['linkage'] = data;
                    this.getData();
                }
            },
            //渲染表单项
            renderItem:function(createElement){
                const t = this;
                const itemList = [];
                if(t.realFields && t.formData){
                   t.realFields.forEach((field,key)=>{
                        let content = [];
                        //如果是String或者Number则直接展示，File类型的展示现在链接，图片预览
                        switch(field.dt){
                            case 'String':
                                content.push(createElement('span',{
                                },t.formData[field.alias]));
                                break;
                            case 'Number':
                                content.push(createElement('span',{
                                },t.formData[field.alias]));
                                break;
                            case 'File':
                                t.formData[field.alias].forEach((val,index)=>{
                                    const ele = createElement('a',{
                                        style:{color:'#0091ea',margin:'0 20px 0 0'},
                                        attrs:{
                                            href:val['href'],
                                            download:val['name'],
                                            target:'_blank'
                                        }
                                    },val['name']);
                                    content.push(ele);
                                })
                                break;
                            case 'Image':
                                const images = [];
                                t.formData[field.alias].forEach((val,index)=>{
                                    images.push(val.href);
                                });
                                const ele = createElement('bb-picture-preview',{
                                        props:{
                                            imgList:images
                                        }
                                    });
                                content.push(ele);
                                break;

                        }
                        const className = field.dt == 'Image'?'bb-view-item label':'bb-view-item';
                        const item = createElement('el-form-item',{
                            props:{label:field.aliasName},
                            class:className,
                            style:{
                                width:field.width,
                            }
                        },content);
                        itemList.push(item);
                    }) 
                }
                return itemList;
            }
        }
    }
</script>
<style lang='less'>
    .grid{
        display: -webkit-flex; /* Safari */
        display: flex;
        flex-wrap: wrap;
        align-items: center;
    }
    .bb-view-item{
        margin:0 -1px -1px 0 !important;
        border: 1px solid #ccc;
        .el-form-item__label{
            background: #f5f5f5;
            margin: 1px;
            padding-left: 12px;
            border-right: 1px solid #ccc;
        }
        .el-form-item__content{
            padding-left: 12px;
        }
    }
    .label{
        &>label{
            line-height: 78px;
        }
    }
</style>