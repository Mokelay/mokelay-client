<script>
import Cell from 'vant/lib/cell';
import 'vant/lib/cell/style';

    export default {
        name: 'bb-vant-cell',
        components: {
          "van-cell":Cell,
        },
        props: {
            //内容
            value:{
                type:[Number,String]
            },
            /*模板默认值*/
            defaultValTpl:{
                type:[String,Number,Boolean]
            },
            /*其他属性配置
                {
                    icon:String 左侧图标,
                    title:String 左侧标题,
                    label:String 标题下方的描述信息,
                    required:Boolean 是否显示表单必填星号,
                    isLink:Boolean 展示右侧箭头并开启点击反馈
                    center:Boolean 使内容垂直居中
                    url:""  跳转链接
                    clickable:Boolean 开启点击反馈
                    valueStyle:{}
                 }
            */
            option:{
                type:Object,
                default:function(){
                    return {}
                }

            },
            /*
            content:积木数据,
                content:[{                      //页面内容
                        uuid:'',
                        alias:'',                   //积木别名
                        aliasName:'',               //中文名称
                        group:'',                   //对应slot  空 对应 内容 icon  自定义icon  title   自定义title  right-icon  自定义右侧按钮，默认是arrow

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
                type:Array,

            },
            //动态内容
            contentDs:{
                type:Object
            }
        },
        data() {
            return {
                valueBase:this.value,
                realContent:this.content || []
            };
        },
        watch:{
            value(val){
                this.valueBase = val;
            },
            contentDs(val){
                this.getData();
            }
        },
        render: function(createElement){
            const t = this;
            const children = [];
            if(t.valueBase){
                const valueStyle = _TY_Tool.setStyle({layout:t.option.valueStyle},t);
                const child = createElement('span',{props:{style:valueStyle},attrs:{style:valueStyle}},[t.valueBase]);
                children.push(child);
            }
            if(t.realContent){
                t.realContent.forEach((ele,index)=>{
                    const bb = _TY_Tool.bbRender([ele], createElement, t);
                    const child = createElement('div',{slot:ele.group},[bb]);
                    children.push(child);
                });
            }
            return createElement('van-cell',{props:{
                "icon":t.option.icon,
                "label":t.option.label,
                "required":t.option.required,
                "is-link":t.option.isLink,
                "center":t.option.center,
                "url":t.option.url,
                "clickable":t.option.clickable,
                "title":t.option.title
            },on:{
                click:t.click
            }},[children]);
        },
        mounted(){
            this.getData();
        },
        //事件click
        methods: {
            //点击事件
            click(param){
                this.$emit('click',param);
            },
            //获取动态内容
            getData(){
                const t = this;
                if (t.contentDs) {
                    t.loading = true;
                    _TY_Tool.getDSData(t.contentDs, _TY_Tool.buildTplParams(t), function (data) {
                        t.contentDs.type = t.contentDs.type?t.contentDs.type:"dynamic";
                        if(t.contentDs.type == "dynamic"){
                            data.forEach((item) => {
                                t.loading = false;
                                const {dataKey, value} = item;
                                t.realContent = value;
                            });
                        }else{
                            t.realContent = map;
                        }
                    }, function (code, msg) {
                        t.loading = false;
                    });
                }
            },
        }
    }
</script>

<style scoped>
</style>