<script>
    export default {
        name: 'bb-view',
        render:function(createElement){
            const t = this;
            const itemList = t.renderItem(createElement);
            return createElement('el-form',{
                    props:{
                        key:t.formKey,
                        model:t.formData,
                        inline:true,
                        'label-position':t.labelPosition,
                        labelWidth:t.labelWidth || "100px",
                        size: t.size || "mini"
                    },
                    class:'grid'
                },itemList);
        },
        props: {
            /*静态表单项
                [{
                    uuid:'',
                    alias:'',                   //积木别名
                    aliasName:'',               //中文名称
                    group:'',                   //积木分组 表单项显示的位置
                    attributes:{
                        attributeName:''    //表单项键值别名
                        width:''            //表单项宽度
                        height:''           //表单项高度
                        dt:'String,Number,File,Image' //值类型,
                        custom:"default all"  //定制化积木  默认：第一项展示值，用户自定义积木跟在后面  全部定制：所有积木都用户自定义
                        content:[]  //表单项中包含的其他积木
                        type:"title,content"  //标点或者内容
                        labelWidth:30%      //标签宽度
                        show:true
                    },              //积木属性
                    animation:[],
                    interactives:[],
                    layout:{}                    //积木布局
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
            value:{
                type:[Object,String]
            },
            /*动态数据*/
            dataDS:{
                type:Object
            },
            //表单域标签的位置right/left/top
            labelPosition:{
                type:String,
                default:'left'
            },
        },
        data() {
            return {
                formData:this.value,
                realFields:_TY_Tool.deepClone(this.fields),
                formKey:_TY_Tool.uuid()
            }
        },
        watch: {
            value(val){
                this.formData = val;
            },
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
                            t.$emit("afterLoadData",t.formData,t);
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
                if(t.realFields){
                    t.formData = t.formData?t.formData:{};
                    t.realFields.forEach((field,key)=>{
                        let content = [];
                        //如果是String或者Number则直接展示，File类型的展示现在链接，图片预览
                        const realContent = field['attributes']['content'];
                        const dt = field['attributes']['dt'] || field.dt;
                        const custom = field['attributes']['custom'] || 'default';
                        const width = field['attributes']['width'] || field.width;
                        const height = field['attributes']['height'] || 'auto';
                        const type = field['attributes']['type'] || "content";
                        const attributeName = field['attributes']['attributeName'];
                        const show = field['attributes']['show'];
                        t.labelWidth = field['attributes']['labelWidth'];
                        t.size = field['attributes']['size'];
                        if(custom == 'all' && realContent){
                            //自定义积木展示表单值
                            realContent.forEach((con,index)=>{
                                realContent[index]['attributes']['value'] = t.formData[attributeName];
                            })
                        }else{
                            //默认展示表单值
                            switch(dt){
                                case 'String':
                                    content.push(createElement('span',{style:{'word-break': 'break-word'}
                                    },t.formData[attributeName]));
                                    break;
                                case 'Number':
                                    content.push(createElement('span',{style:{'word-break': 'break-word'}
                                    },t.formData[attributeName]));
                                    break;
                                case 'File':
                                    if(!t.formData[attributeName]){
                                        t.formData[attributeName] = []
                                    }
                                    t.formData[attributeName].forEach((val,index)=>{
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
                                    if(!t.formData[attributeName]){
                                        t.formData[attributeName] = []
                                    }
                                    t.formData[attributeName].forEach((val,index)=>{
                                        images.push(val.href);
                                    });
                                    const ele = createElement('bb-picture-preview',{
                                            props:{
                                                imgList:images
                                            }
                                        });
                                    content.push(ele);
                                    break;
                            };
                        };
                        const bb_children = _TY_Tool.bbRender(realContent, createElement, t);
                        const contentClass = custom == 'all'?"bb-content border-none":"bb-content";
                        const bbs = createElement('div',{class:contentClass},bb_children);
                        let className = dt == 'Image'?'bb-view-item label':'bb-view-item';
                        className = type == "title"?className + " bb-view-title" : className;
                        //合并默认类型和自定义类型
                        const contents = [];
                        if(content.length > 0){
                            contents.push(content)
                        };
                        contents.push(bbs);
                        const item = createElement('el-form-item',{
                            props:{
                                label:field.aliasName,
                                show:field.show
                            },
                            class:className,
                            style:{
                                width:width,
                                height:height,
                            }
                        },contents);
                        if(show){
                            itemList.push(item);
                        }
                    }) 
                }
                return itemList;
            },
            /*隐藏项或显示 
                hideNumber:[1,2,3,4,5,6] || "1,2,3,4,5,6" 需要隐藏的项
            */
            hideOrShow(...args){
                const t = this;
                args.forEach((val,key)=>{
                    if(val.type == 'custom' && val.arguments){
                        let hideArr = val.arguments;
                        hideArr = typeof hideArr == 'string'?hideArr.split(','):hideArr;
                        t.realFields.forEach((field,key)=>{
                            hideArr.forEach((item,index)=>{
                                if(key == item){
                                    field['attributes']['show'] = !field['attributes']['show'];
                                }
                            })
                        })
                    }
                });
            }, 
            /*隐藏项 
                hideNumber:[1,2,3,4,5,6] || "1,2,3,4,5,6" 需要隐藏的项
            */
            hide(...args){
                const t = this;
                args.forEach((val,key)=>{
                    if(val.type == 'custom' && val.arguments){
                        let hideArr = val.arguments;
                        hideArr = typeof hideArr == 'string'?hideArr.split(','):hideArr;
                        t.realFields.forEach((field,key)=>{
                            hideArr.forEach((item,index)=>{
                                if(key == item){
                                    field['attributes']['show'] = false
                                }
                            })
                        })
                    }
                });
            }, 
            /*显示项 
                showNumber:[1,2,3,4,5,6] || "1,2,3,4,5,6" 需要隐藏的项
            */
            show(...args){
                const t = this;
                args.forEach((val,key)=>{
                    if(val.type == 'custom' && val.arguments){
                        let hideArr = val.arguments;
                        hideArr = typeof hideArr == 'string'?hideArr.split(','):hideArr;
                        t.realFields.forEach((field,key)=>{
                            hideArr.forEach((item,index)=>{
                                if(key == item){
                                    field['attributes']['show'] = true
                                }
                            })
                        })
                    }
                });
            },
            //读取子积木
            loadChildBB(){
                let t=this;
                return _TY_Tool.loadChildBB(t);                
            },
            //外部设置表单值
            setData:function(...args){
                const t = this;
                args.forEach((val,key)=>{
                    if(val.type == 'custom' && val.arguments){
                        let newData = val.arguments;
                        t.formKey = _TY_Tool.uuid();
                        t.formData = newData;
                    }
                });
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
        display: flex !important;
        margin:0 -1px -1px 0 !important;
        border: 1px solid #ccc;
        &>.el-form-item__label{
            background: #f5f5f5;
            margin: 1px;
            padding-left: 12px;
            border-right: 1px solid #ccc;
            min-width: 100px;
        }
        &>.el-form-item__content{
            padding-left: 12px;
            flex:1;
            color: #999;
        }
        .bb-content{
            float: right;
            border-left: 1px solid #ccc;
            padding: 0 5px;
        }
    }
    .label{
        &>label{
            line-height: 78px;
        }
    }
    .bb-view-title{
        &>.el-form-item__label{
            background: none !important;
            margin: none!important;
            padding-left: none!important;
            border-right: none!important;
            font-weight: 800;
        }
        .bb-content{
            border:none;
        }
    }
    .border-none{
        border:none !important;
    }
</style>