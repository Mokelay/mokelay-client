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
        name: 'bb-layout-seriation-edit',
        render:function(createElement){
            const t = this;
            const bbList = t.renderBB(createElement);
            //控制水平排列
            const style = {
                display:t.horizontal?'flex':'block'
            }
            return createElement('div',{style:style},bbList);
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
            }
        },
        mounted:function(){
            const t =this;
            setTimeout(function(){
                t.$emit('mounted',t);
            },0);
        },
        data() {
            return {
                realContent:this.content,
                preItem:null
            }
        },
        watch:{
            content(val){
                this.realContent = val;
            }
        },
        methods: {
            renderBB:function(createElement){
                const t = this;
                if(t.realContent){
                    const bbList = [];
                    //水平排列垂直排列控制
                    t.realContent.forEach((bbEle,index)=>{
                        const bbItem = createElement('bb-seriation-item-edit', {
                            ref:'bb-seriation-item-edit-' + index,
                            props:{
                                content:bbEle,
                                config:{
                                    horizontal:t.horizontal,
                                    pointer:(bbEle.attributes&&bbEle.attributes.pointer?bbEle.attributes.pointer:false),
                                    buttons:['up','down','remove']}
                            },
                            style:{flex:1},
                            on:{
                                up:t.up.bind(null,index),
                                down:t.down.bind(null,index),
                                remove:t.remove.bind(null,index),
                                onFocus:t.onFocus.bind(null,index)
                            }
                        },[]);
                        // const bbItem = createElement('div', {style:{flex:1}},[bbEle]);
                        bbList.push(bbItem);
                        //控制排序 TODO
                        //bbList.splice(bb.layout.sort - 1,1,bbItem);
                    })
                    return bbList; 
                }
            },
            loadChildBB(){
                let t=this;
                return _TY_Tool.loadChildBB(t);                
            },
            //上移返回当前的积木数据
            up:function(...params){
                const t = this;
                const index = params[0];
                t.$emit('up',t.realContent[index]);
                t.$emit('change',t.realContent);
                if(index == 0) {
                    return;
                }
                const item = t.realContent[index];
                t.realContent.splice(index,1);
                t.realContent.splice(index-1,0,item);
                if(index==t.realContent.length-1&&
                    t.realContent[index].attributes.hasOwnProperty('pointer')){
                    t.realContent[index-1].attributes.pointer=true;
                    t.realContent[index].attributes.pointer=false;
                }
            },
            //下移返回当前的积木数据
            down:function(...params){
                const t = this;
                const index = params[0];
                this.$emit('down',t.realContent[index]);
                this.$emit('change',t.realContent);
                if(index == t.realContent.length -1) {
                    return;
                }
                const item = t.realContent[index]
                t.realContent.splice(index,1);
                t.realContent.splice(index+1,0,item);
                if(index==t.realContent.length-2&&
                    t.realContent[index].attributes.hasOwnProperty('pointer')){
                    t.realContent[index+1].attributes.pointer=false;
                    t.realContent[index].attributes.pointer=true;
                }
            },
            //删除返回当前的积木数据
            remove:function(...params){
                const t = this;
                const index = params[0];
                t.$confirm('确认操作?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    if(index==t.realContent.length-1&&t.realContent.length>1){
                        t.realContent[t.realContent.length-2].attributes.pointer=false;
                    }
                    t.$emit('remove',t.realContent[index]);
                    t.realContent.splice(index, 1);
                    t.$emit('change',t.realContent);
                }).catch(() => {
                    t.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            //积木选中状态
            onFocus:function(...params){
                const t = this;
                if(t.preItem){
                    t.preItem.onBlur();
                }
                t.preItem = params[1];
                //记录当前编辑的积木下标
                t.nowEdit = params[0];
                //将当前编辑的对象放到全局变量中
                _TY_Root._TY_Current_Edit_Item = t.realContent[params[0]];
                t.$emit('onFocus',t.realContent[params[0]]);
            },
            /*积木新增方法 对外
                @bbAlias:积木别名
                @bbName:积木名称
            */
            add:function(bbName,bbAlias){
                const t = this;
                //初始化新增加的积木
                const newBB = {
                    uuid:_TY_Tool.uuid(),
                    alias:bbAlias,
                    aliasName:bbName,
                    attributes:{},
                    animation:[],
                    interactives:[],
                    layout:{}
                }
                t.realContent = t.realContent?t.realContent:[];
                t.realContent.push(newBB);
                //返回新的积木数组
                t.$emit('add',t.realContent);
                t.$emit('change',t.realContent);
            },
            /*乐高新增方法 对外
                @contentItem:积木别名
                {
                    uuid:'',
                    alias:bbAlias,
                    aliasName:bbName,
                    attributes:{},
                    animation:[],
                    interactives:[],
                    layout:{}
                }
            */
            addContent:function(contentItem){
                const t = this;
                if(!contentItem||contentItem.length<=0){
                    return;
                }
                let item;
                if(contentItem instanceof Array&&contentItem[0] && contentItem[0].hasOwnProperty('value')&&contentItem[0].hasOwnProperty('valueKey')&&(Array.isArray(contentItem[0].value)||!contentItem[0].value)){
                    //数组直接return
                    return; 
                }else if(contentItem instanceof Array&&contentItem[0] && contentItem[0].hasOwnProperty('value')&&contentItem[0].hasOwnProperty('valueKey')){
                    // t.realContent.push(contentItem[0].value);
                    item = contentItem[0].value;
                }else{
                    item = contentItem;
                    // t.realContent.push(contentItem);
                }
                if(t.realContent[t.realContent.length-1].attributes.hasOwnProperty('pointer')){
                    t.realContent[t.realContent.length-1].attributes.pointer=true;
                }
                t.realContent.splice(t.realContent.length,0,item);
                //返回新的积木数组
                t.$emit('add',t.realContent);
                t.$emit('change',t.realContent);
            },
            //刷新方法，主要用于 lego配置页刷新 根据apiALias获取item列表
            refresh:function(content){
                const t=this;
                if(content instanceof Array && content[0].hasOwnProperty('value')&&content[0].hasOwnProperty('valueKey')&&content[0].value instanceof Array){
                    t.realContent = content[0].value;
                }else if(content instanceof Array&&!content[0].hasOwnProperty('value')){
                    t.realContent = content;
                }
                t.$emit('afterLoad',t.realContent);
            },
            //完成编辑的积木数据回填
            afterEdit:function(content){
                const t = this;
                //t.realContent[t.nowEdit] = content;
                t.$set(t.realContent,t.nowEdit,content);
                t.$emit('afterEdit',t.realContent);
                t.$emit('change',t.realContent);
            }
        },
        components:{
        }
    }
</script>
<style lang="less">
</style>