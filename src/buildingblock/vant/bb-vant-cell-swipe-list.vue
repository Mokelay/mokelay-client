<script>
import CellGroup from 'vant/lib/cell-group';
import 'vant/lib/cell-group/style';
    //当每项swipe数据格式相同时可以使用list
    export default {
        name: 'bb-vant-cell-swipe-list',
        components: {
          "van-cell-group":CellGroup,
        },
        props: {
            /*单元格内容
                [{
                    uuid:123,
                    title:String,
                    value:String
                }]
            */
            value:{
                type:Array
            }, 
            //动态数据源
            valueDs:{
                type:Object
            },
            /*cellSwipe 模板
                {
                    leftWidth:Number,
                    rightWidth:Number,
                    contentDs:Object,
                    content:[{                      //页面内容
                        uuid:'',
                        alias:'',                   //积木别名
                        aliasName:'',               //中文名称
                        group:'',                   //对应slot
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
                }
            */
            cellSwipeConfig:{
                type:Object,
                default:function(){
                    return  {}
                }
            }
        },
        data() {
            return {
                valueBase:this.value || []
            };
        },
        render: function(createElement){
            const t = this;
            const children = [];
            t.valueBase.forEach((val,index)=>{
                const contentTpl = _TY_Tool.deepClone(t.cellSwipeConfig.content);
                contentTpl.forEach((ele,key)=>{
                    if(ele.group != "left" && ele.group != "right"){
                        ele['attributes']['value'] = val['value'];
                        ele['attributes']['option']['title'] = val['title'];
                    }
                })
                const cellSwipeItem = createElement('bb-vant-cell-swipe',{props:{
                        "rightWidth":t.cellSwipeConfig.rightWidth,
                        "leftWidth":t.cellSwipeConfig.leftWidth,
                        "content":contentTpl,
                        "contentDs":t.cellSwipeConfig.contentDs,
                    },on:{
                        'left':t.onLeft.bind(t,index),
                        'cell':t.onCell.bind(t,index),
                        'outside':t.onOutside.bind(t,index),
                        'right':t.onRight.bind(t,index)
                    }},[]);
                children.push(cellSwipeItem);
            });
            return createElement('van-cell-group',{props:{}},children);

        },
        mounted(){
            this.getData();
        },
        //事件click
        methods: {
            //动态获swipe内容
            getData(){
                const t = this;
                if (t.valueDs) {
                    t.loading = true;
                    _TY_Tool.getDSData(t.valueDs, _TY_Tool.buildTplParams(t), function (data) {
                        data.forEach((item) => {
                            t.loading = false;
                            const {dataKey, value} = item;
                            t.valueBase = value;
                        });
                    }, function (code, msg) {
                        t.loading = false;
                    });
                }
            },
            //左侧点击
            onLeft(index){
                this.$emit('left',index,this.valueBase);
            },
            //单元格被点击
            onCell(index){
                this.$emit('cell',index,this.valueBase);
            },
            //外部被点击
            onOutside(index){
                this.$emit('outside',index,this.valueBase);
            },
            //右侧被点击
            onRight(index){
                this.$emit('right',index,this.valueBase);
            },
            //外部设置valueBase
            setValueBase(value){
                this.valueBase = value;
            }
        }
    }
</script>

<style lang="less">

</style>
