<script>
// 顺序排列布局
/*实现功能
    1.水平或者垂直排列
    2.渲染积木
        a.积木属性渲染
        b.积木样式渲染（积木样式包含边框，边距，背景色，透明度，阴影等等）
        c.积木动画渲染
    3.积木交互绑定（通过积木选择器，支持多级积木事件方法绑定）
*/  
    export default {
        name: 'bb-layout-seriation',
        render:function(createElement){
            const t = this;
            const bbList = t.renderBB(createElement);
            //控制水平排列
            let itemClass = t.horizontal?"df":"db";
            itemClass = t.realShow?itemClass:"dn";
            return createElement('div',{class:itemClass},bbList);
        },
        props: {
            /*水平排列*/
            horizontal:{
                type:Boolean,
                default:false
            },
            /*
                content:积木数据,
                content:[{                      //页面内容
                        uuid:'',
                        alias:'',                   //积木别名
                        aliasName:'',               //中文名称
                        attributes:{},              //积木属性
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
                type:[Array,String]
            },
            defaultHide:{
                type:Boolean,
                default:false
            }
        },
         data() {
            return {
                realShow:!this.defaultHide,
            }
        },
        methods: {
            renderBB:function(createElement){
                const t = this;
                const bbList = _TY_Tool.bbRender(t.content, createElement, t);
                //水平排列垂直排列控制
                bbList.forEach((bbEle,index)=>{
                    const bbItem = createElement('div', {style:{flex:1}},[bbEle]);
                    bbList.splice(index,1,bbItem);
                    //控制排序 TODO
                    //bbList.splice(bb.layout.sort - 1,1,bbItem);
                })
                return bbList;
            },
            loadChildBB(){
                let t=this;
                return _TY_Tool.loadChildBB(t);                
            },
            //根据  事件的 executeArgument  来判断是否该隐藏或是显示
            itemShowOrHide(..._data){
                const t = this;
                _data.forEach((val,key)=>{
                  if(val.type == 'custom'){
                    let flag = val.arguments;
                    if(flag){
                        t.realShow = true;
                        t.$emit('show');
                    }else{
                        t.realShow = false;
                        t.$emit('hide');
                    }
                  }
                });
            },
            //显示
            show(){
                const t = this;
                t.realShow = true;
                t.$emit('show');
            },
            //隐藏
            hide(){
                const t = this;
                t.realShow = false;
                t.$emit('hide');
            }
        },
        components:{
        }
    }
</script>
<style lang="less">
    .dn{
        display:none;
    }
    .df{
        display:flex;
    }
    .db{
        display:block;
    }
</style>