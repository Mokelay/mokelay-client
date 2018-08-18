<script>
    import Tabbar from 'vant/lib/tabbar';
    import 'vant/lib/tabbar/style';
    import TabbarItem from 'vant/lib/tabbar-item';
    import 'vant/lib/tabbar-item/style';

    export default {
        name: 'bb-vant-tab-bar',
        components: {
            "van-tabbar":Tabbar,
            "van-tabbar-item":TabbarItem
        },
        props: {
            //v-model 当前索引
            value:{
                type:Number
            },
            /*静态标签数据
                [{
                    text:"标签名称"  标签名称
                    icon:"chat", 图标
                    dot:false, 显示小红点
                    info:"String || Number" 图标右上角提示信息
                    url:"String" 跳转链接
                    to:"String || Object"   路由跳转对象，同 vue-router 的 to
                    replace:false  跳转时是否替换当前history
                    iconStyle:{},  图标样式
                    textStyle:{}   字体样式

                }]
            */
            fields:{
                type:Array,
                default:function() {
                    return [{
                        text:'标签1',
                        icon:'ty-yy_ty',
                        iconStyle:{},
                        textStyle:{}
                    },{
                        text:'标签2',
                        icon:'ty-yy_ty',
                        iconStyle:{},
                        textStyle:{}
                    },{
                        text:'标签3',
                        icon:'ty-yy_ty',
                        iconStyle:{},
                        textStyle:{}
                    }];
                }
            },
            valueKey:{
                text:"text",
                icon:"icon",
                dot:"dot",
                info:"info",
                url:"url",
                iconStyle:"iconStyle",
                textStyle:"textStyle",
            },
            //动态标签数据
            fieldsDs:{
                type:Object
            },
            /*  自定义图标
                content:[{                      //页面内容
                        uuid:'',
                        alias:'',                   //积木别名
                        aliasName:'',               //中文名称
                        group:'',                   //对应图标的text
                        attributes:{
                            attributeName:''    //表单项键值别名
                            rules:[]            //验证规则
                            width:''            //表单项宽度
                            ........            //其他积木属性
                        },              //积木属性
                        animation:[{                //动画
                            style:"",               //方式
                            time:0,                 //时间
                            delay:0,                //延迟时间
                            playNum:1               //播放次数
                            loop:true|false,        //循环
                            direction:""            //方向
                        }],
                        interactives:[{             //触发交互
                            uuid:'',
                            fromContentEvent:'',    //触发积木的事件,fromContentUUID为当前content的UUID
                            executeType:'',         //执行类型(预定义方法 trigger_method,
                                                    //自定义方法 custom_script,
                                                    //容器类方法 container_method)
                            executeScript:'',       //执行脚本 executeType = custom_script
                            executeContentUUID:'',  //执行积木的UUID executeType = trigger_method
                            executeContentMethodName:'',
                                                    //执行积木的方法
                            containerMethodName:''  //容器方法 executeType = container_method
                        }],
                        layout:{                    //积木布局
                            sort:0,                 //排序 顺序排列布局下有效
                            bgColor:"",             //背景颜色
                            rotate:0,               //旋转
                            transparency:0,         //透明度
                            border:{                //边框
                                style:"",           //边框样式
                                color:"",           //边框颜色
                                size:"",            //边框尺寸
                                radius:"",          //边框弧度
                                margin:""           //边距
                            },
                            shadow:{                //阴影
                                color:"",           //阴影颜色
                                size:"",            //阴影大小
                                direction:'',       //阴影方向
                                vague:''            //阴影模糊
                            }
                        }
                    }]
            */
            content:{
                type:Array
            },
            /*动态自定义图标*/
            contentDs:{
                type:Object
            },
            /*激活的样式
                {
                    iconStyle:{},
                    textStyle:{}
                }
            */
            activeStyle:{
                type:Object,
                default:function(){
                    return {
                        iconStyle:{},
                        textStyle:{}
                    }
                }
            }
        },
        data() {
            return {
                active:this.value || 0,
                realFields:this.fields,
                realContent:this.content || []
            };
        },
        render: function(createElement){
            const t = this;
            const tabbars = [];
            t.realFields.forEach((field,key)=>{
                field.iconStyle = field.iconStyle?field.iconStyle:{}
                field.textStyle = field.textStyle?field.textStyle:{}
                const fieldIcon = {
                    layout:t.active == key?t.activeStyle.iconStyle : field.iconStyle
                }
                const iconStyle = _TY_Tool.setStyle(fieldIcon);
                const fieldText = {
                    layout:t.active == key?t.activeStyle.textStyle : field.textStyle
                }
                const textStyle = _TY_Tool.setStyle(fieldText);
                //自定义图标
                const icons = [];
                t.realContent.forEach((item,index)=>{
                    // item['slot'] = 'icon';
                    // item['slot-scope'] = 'props';
                    if(item.group == field.text){
                        const bb = _TY_Tool.bbRender([item], createElement, t);
                        const bbTpl = createElement('template',{props:{"slot-scope":"props"},slot:'icon'},[bb]);
                        icons.push(bbTpl);
                    }
                });
                const iconEle = createElement('i',{props:{"slot-scope":"props"},slot:'icon',class:'ty ' + field.icon,style:iconStyle},[]);
                const text = createElement('span',{props:{},style:textStyle},[field.text]);
                const tabbar = createElement('van-tabbar-item',{props:{
                        "icon":'ty ' + field.icon,
                        "dot":field.dot,
                        "info":field.info,
                        "url":_TY_Tool.tpl(field.url,_TY_Tool.buildTplParams(t)),
                        "to":field.to,
                        "replace":field.replace,
                        "key":key
                    },
                },[icons,iconEle,text]);
                tabbars.push(tabbar);
            });


            return createElement('van-tabbar',{props:{value:t.active},on:{change:t.onChange}},[tabbars]);
        },
        mounted(){ 
            this.getData();
            this.getIcon();
        },
        //事件click
        methods: {
            //切换标签w
            onChange(key) {
                this.$emit("change",key);
            },
            //获取数据
            getData() {
                const t = this;
                if (t.fieldsDs) {
                    Util.getDSData(t.fieldsDs, _TY_Tool.buildTplParams(t), function (data) {
                        data.forEach((item) => {
                            let _list = [];
                            if(item['value']&&item['value']['currentRecords']){
                                _list = item['value']['currentRecords'];
                                const totalPage = item['value']['totalPages'];
                                if(t.page>=totalPage){
                                    t.end=true;
                                }else{
                                    t.end=false;
                                }
                            }else if(item['value']&&item['value']['list']){
                                _list = item['value']['list'];    
                            }else{
                                _list = item['value'];
                            }
                            let newValue = t.transferData(_list);
                            t.realFields = newValue;
                        });
                    }, function (code, msg) {
                    });
                }
            },
            //获取content数据
            getIcon() {
                const t = this;
                if (t.contentDs) {
                    Util.getDSData(t.contentDs, _TY_Tool.buildTplParams(t), function (data) {
                        data.forEach((item) => {
                            const {dataKey, value} = item;
                            t.realContent = value;
                        });
                    }, function (code, msg) {
                    });
                }
            },
            //转换DS返回的数据
            transferData(data){
                const t = this;
                const textKey = t.valueKey["text"];
                const iconKey = t.valueKey["icon"];
                const dotKey = t.valueKey["dot"];
                const infoKey = t.valueKey["info"];
                const urlKey = t.valueKey["url"];
                const iconStyleKey = t.valueKey["iconStyle"];
                const textStyleKey = t.valueKey["textStyle"];
                const dataString = JSON.stringify(data);
                let newString = textKey?dataString.replace(new RegExp(textKey,'g'),"text"):dataString;
                newString = iconKey?newString.replace(new RegExp(iconKey,'g'),"icon"):newString;
                newString = dotKey?newString.replace(new RegExp(dotKey,'g'),"dot"):newString;
                newString = infoKey?newString.replace(new RegExp(infoKey,'g'),"info"):newString;
                newString = urlKey?newString.replace(new RegExp(urlKey,'g'),"url"):newString;
                newString = iconStyleKey?newString.replace(new RegExp(iconStyleKey,'g'),"iconStyle"):newString;
                newString = textStyleKey?newString.replace(new RegExp(textStyleKey,'g'),"textStyle"):newString;
                const newData = JSON.parse(newString);
                return newData;
            },
        }
    }
</script>

<style scoped>
</style>