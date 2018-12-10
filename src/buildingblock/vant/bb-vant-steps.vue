
<script>
import Step from 'vant/lib/step';
import 'vant/lib/step/style';
import Steps from 'vant/lib/steps';
import 'vant/lib/steps/style';

    export default {
        name: 'bb-vant-steps',
        components: {
          "van-steps":Steps,
          "van-step":Step
        },
        render: function (createElement) {
            const t = this;
            //当可以渲染的时候才能渲染
            const popupContent = _TY_Tool.bbRender(t.realContent, createElement, t);
            const steps = {};
            t.content.forEach((ele,key)=>{
                steps[ele.group] = steps[ele.group]?steps[ele.group]:[];
                steps[ele.group].push(ele);
            });
            const stepsArr = [];
            Object.keys(steps).forEach((name,index)=>{
                const renderContent = _TY_Tool.bbRender(steps[name], createElement, t);
                const step = createElement('van-step',{props:{}},[renderContent]);
                stepsArr.push(step);
            });
            return createElement('van-steps',{
                props:{
                    'active':t.valueBase,
                    'title':t.title,
                    'direction':t.direction,
                    'active-color':t.activeColor
                },
            },stepsArr);
        },
        props: {
            //当前激活指针  支持模板
            value:{
                type:[String,Number]
            },
            //  显示方向，可选值为 vertical horizontal
            direction:{
                type:String
            },
            //激活状态颜色
            activeColor:{
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
            }
        },
        data() {
            return {
                valueBase:_TY_Tool.tpl(this.value, _TY_Tool.buildTplParams(this)),
                steps:{}
            };
        },
        computed:{
        	//设置css样式
        	styleBase(){
        		let result;
        		if(this.bbStyle){
        			result = _TY_Tool.setStyle({
        				layout:this.bbStyle
        			},this);
        		}
        		return result;
        	},
        },
        watch:{
            value:function(val){
                this.valueBase = _TY_Tool.tpl(val, _TY_Tool.buildTplParams(this))
            }
        },
        mounted(){
            let t=this;
            //解析模板默认值
            _TY_Tool.buildDefaultValTpl(t,"valueBase");
        },
        methods: {
            
        }
    }
</script>

<style scoped>
</style>