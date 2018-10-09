<script>
import Tabs from 'vant/lib/tabs';
import 'vant/lib/tabs/style';
import Tab from 'vant/lib/tab';
import 'vant/lib/tab/style';

    export default {
        name: 'bb-vant-tabs',
        components: {
          "van-tabs":Tabs,
          "van-tab":Tab,
        },
        render: function (createElement) {
            const t = this;
            let dialog;
            //当可以渲染的时候才能渲染
            const tabArr = t.renderTabItem(createElement);
            return createElement('van-tabs',{
                'value':t.valueBase,
                'type':t.option['type'],
                'duration':t.option['duration'],
                'line-width': t.option['line-width'],
                'swipe-threshold':t.option['swipe-threshold'],
                'sticky':t.option['sticky'],
                'swipeable':t.option['swipeable']
            },tabArr);
        },
        props: {
            //当前激活标签的索引 支持v-model
            value:{
                type:[Number,String]
            },
            /*模板默认值*/
            defaultValTpl:{
                type:[String,Number,Boolean]
            },
            /*静态内容
                content:[{                      //页面内容
                        uuid:'',
                        alias:'',                   //积木别名
                        aliasName:'',               //中文名称
                        group:'',                   //积木分组 对应tab的title字段
                        attributes:{
                            disabled:false,
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
            /*其他属性配置
                {
                    type:'line',
                    duration:0.2 切换 tab 的动画时间
                    'line-width': 200, 底部条宽度 (px)
                    'swipe-threshold':4, 滚动阀值，设置 Tab 超过多少个可滚动
                    sticky:false,是否使用粘性定位布局
                    swipeable:false 是否可以滑动内容切换
                    disabledTabs:'tab1,tab2,tab3'
                }
            */
            option:{
                type:Object,
                default:function(){
                    return {
                        'type':'line',
                        'duration':0.2,
                        'line-width': 200,
                        'swipe-threshold':4,
                        'sticky':false,
                        'swipeable':false
                    };
                }
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
        mounted(){
            this.getData();
        },
        //事件click
        methods: {
            //点击事件
            click(param){
                this.$emit('click',param);
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
            renderTabItem(createElement){
                const t = this;
                const tabObj = {};
                const tabArr = [];
                const disabledTabsArr = t.option.disabledTabs?t.option.disabledTabs.split(','):[];
                t.realContent.forEach((item,key)=>{
                    tabObj[item.group] = tabObj[item.group]?tabObj[item.group]:[];
                    tabObj[item.group].push(item);
                });
                Object.keys(tabObj).forEach((val,index)=>{
                    const tabBBs =  _TY_Tool.bbRender(tabObj[val], createElement, t);
                    //根据option读取disabled的tab
                    let disabled = false;
                    disabledTabsArr.forEach((dis,Num)=>{
                        if(dis == val){
                            disabled = true;
                        }
                    })
                    const item = createElement('van-tab',{props:{title:val,disabled:disabled}},tabBBs);
                    tabArr.push(item);
                });
                return tabArr;
            },
            //外部设置当前激活标签
            activeTab(...params){
                const t = this;
                params.forEach((param,key)=>{
                    if(param.type == "custom"){
                        t.valueBase = param.arguments;                  
                    }
                })
            }
        }
    }
</script>

<style scoped>
</style>