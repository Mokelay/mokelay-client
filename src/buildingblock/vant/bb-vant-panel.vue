<script>
import Panel from 'vant/lib/panel';
import 'vant/lib/panel/style';

    export default {
        name: 'bb-vant-panel',
        components: {
          "van-panel":Panel,
        },
        props: {
            //标题
            title:{
                type:String
            },
            /*描述*/
            desc:{
                type:[String]
            },
            /*状态*/
            status:{
                type:String
            },
            /*静态内容
                content:[{                      //页面内容
                        uuid:'',
                        alias:'',                   //积木别名 
                        aliasName:'',               //中文名称 
                        group:'',                   //积木分组 对应slot  header main footer
                        attributes:{
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
            /*标签页动态数据源*/
            contentDs:{
                type:Object
            }
        },
        data() {
            return {
                valueBase:this.value,
                realContent:this.content
            };
        },
        render: function (createElement) {
            const t = this;
            let dialog;
            //当可以渲染的时候才能渲染
            const panelArr = t.renderPanelItem(createElement);
            return createElement('van-panel',{
                props:{
                    title:t.title,
                    desc:t.desc,
                    status:t.status
                },
            },panelArr);
        },
        mounted(){
            const t = this;
            t.getData();
            _TY_Tool.buildDefaultValTpl(t, "valueBase");
        },
        //事件change
        methods: {
            //点击事件
            change(param){
                this.valueBase = param;
                this.$emit('change',param);
            },
            //动态获取tab内容
            getData(){
                const t = this;
                if (t.contentDs) {
                    t.loading = true;
                    _TY_Tool.getDSData(t.contentDs, _TY_Tool.buildTplParams(t), function (data) {
                        data.forEach((item) => {
                            t.loading = false;
                            const {dataKey, value} = item;
                            t.realContent = value;
                        });
                    }, function (code, msg) {
                        t.loading = false;
                    });
                }
            },
            renderPanelItem(createElement){
                const t = this;
                const panelObj = {};
                const panelArr = [];
                if(t.realContent){
                    t.realContent.forEach((item,key)=>{
                        panelObj[item.group] = panelObj[item.group]?panelObj[item.group]:[];
                        panelObj[item.group].push(item);
                    });
                    Object.keys(panelObj).forEach((val,index)=>{
                        const panelItemBB =  _TY_Tool.bbRender(panelObj[val], createElement, t);
                        const item = createElement('div',{props:{slot:val}},panelItemBB);
                        panelArr.push(item);
                    });
                }
                return panelArr;
            }
        }
    }
</script>

<style scoped>
</style>