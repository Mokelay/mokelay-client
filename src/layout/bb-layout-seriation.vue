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
            return createElement('div',{},bbList);
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
                            executeSource:'',       //目标积木路径（配置环境和实际环境路径不同）
                                                    {
                                                        uuid:xxx,
                                                        bbAlias:xxxx,
                                                        children:[{
                                                            uuid:xxx,
                                                            bbAlias:xxx,
                                                            children:[{...}]
                                                        }]
                                                    }
                                                    //配置环境中通过$parent的方式获取目标积木
                                                    //实际环境中通过路径的获取目标积木
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
                                radian:"",          //边框弧度
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
            return{
            }
        },
        mounted:function(){
            const t = this;
            //等待DOM元素渲染完成后 根据ref取得方法
            t.setEventListener();
        },
        methods: {
            renderBB:function(createElement){
                const t = this;
                t._BB_PREFIX = "bb_";
                const bbList = [];
                //onInteractiveFn 存储每个事件的方法数组
                t.onInteractiveFn = {};
                if(t.content){
                    t.content.forEach((bb,key)=>{
                        const attributes = bb['attributes'];
                        let onArr = t.setEventMethod(bb);
                        //渲染积木属性
                        const bbContent = createElement(bb['alias'], {ref:t._BB_PREFIX+bb['uuid'], props:attributes, on:onArr},[])
                        //渲染积木动画 TODO
                        const bbItem = createElement('transition', {style:{display:'inline-block',width:'auto'}},[bbContent]);
                        //控制排序 TODO
                        bbList.push(bbItem);
                    });
                }
                return bbList;
            },
            //绑定公共方法到事件
            setEventMethod:function(bb){
                const t = this;
                let on = {};
                const uuid = bb['uuid'];
                bb.interactives.forEach((interactive,index)=>{
                    on[interactive['fromContentEvent']] = t.publicEmit.bind(t,bb,interactive['fromContentEvent']);
                });
                return on;
            },
            //将方法放入对应事件的方法数组中，事件触发公共方法，执行方法数组（一个事件可能对应多个方法）;
            setEventListener:function(){
                const t = this;
                t.content.forEach((bb,key)=>{
                    const uuid = bb['uuid'];
                    bb.interactives.forEach((interactive,index)=>{
                        const executeType = interactive['executeType'];
                        //所有事件都触发 publicEmit 中间处理函数 由publicEmit 统一触发方法
                        //事件所要执行的方法
                        let fn = null;
                        if(executeType == 'trigger_method'){
                        //预定义方法
                            const executeContentUUID = interactive['executeContentUUID'];
                            const executeContentMethodName = interactive['executeContentMethodName'];
                            //给相同事件的创建方法数组
                            fn = t.$refs[t._BB_PREFIX+executeContentUUID]?t.$refs[t._BB_PREFIX+executeContentUUID][executeContentMethodName] : null;
                        }else if(executeType == 'custom_script'){
                        //自定义方法
                            const buzz = interactive['executeScript'];
                            fn = _TY_Tool.loadBuzz.bind(this,buzz,function(code){
                                eval(code);
                            })
                        }else if(executeType == 'container_method'){
                        //容器方法
                            const containerMethodName = interactive['containerMethodName'];
                            fn = t[containerMethodName];
                        }
                        if(fn){
                        //将获得的方法推送到数组中
                            t.onInteractiveFn[uuid] = t.onInteractiveFn[uuid] || {};
                            t.onInteractiveFn[uuid][interactive['fromContentEvent']] = t.onInteractiveFn[uuid][interactive['fromContentEvent']] || [];
                            t.onInteractiveFn[uuid][interactive['fromContentEvent']].push(fn);
                        }
                    });
                })
            },
            /*公共方法处理绑定事件
                bb:触发事件的积木
                fromContentEvent:当前触发事件名称
            */
            publicEmit:function(bb,fromContentEvent,...params){
                const t = this;
                const uuid = bb['uuid'];
                const fnArr = t.onInteractiveFn[uuid][fromContentEvent];
                fnArr.forEach((fn,key)=>{
                    fn(...params);
                })
            }
        },
        components:{
        }
    }
</script>
<style lang="less">
</style>