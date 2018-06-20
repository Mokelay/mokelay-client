<script>
    export default {
        name: 'bb-indep-contact-list',
        props: {
            /*默认值 支持v-model*/
            value:{
                type:Array
            },
            /*联系人列表数据
                [{
                    icon:"头像",
                    name:"姓名",
                    subtitle:"副标题",
                    department:"部门",
                    post:"岗位",
                    jobNumber:"工号",
                    phone:"18888888888",
                    email:"email@test.com"
                }]

            */
            contactList:{
                type:Array
            },
            /*联系人动态数据源*/
            contactListDs:{
                type:Object
            },
            /*动态获取更多联系人*/
            moreDs:{
                type:Object
            },
            /*右侧自定义内容模板
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
            */
            contentTpl:{
                type:Array
            },
            /*其他属性设置
                {
                    styleType:"simple", detail words 展示风格 简约  详细
                    selectType:"checkbox"  radio  单选多选
                }
            */
            option:{
                type:Object,
                default:function(){
                    return {
                        styleType:"detail",
                        selectType:"checkbox",
                    }
                }
            }
        },
        data() {
            return {
                realContactlist:this.contactList,
                valueBase:this.value || [],
                editContactKey:null //当前编辑器联系人在数组中的下标
            }
        },
        watch: {
        },
        computed:{
        },
        render: function(createElement){
            const t = this;
            const children = [];
            t.realContactlist.forEach((contact,key)=>{
                //左侧内容
                const icon = createElement('img',{attrs:{
                    src:contact.icon,
                }},[]);
                const name = createElement('p',{props:{
                },class:"name"},[contact.name]);
                const subtitle = createElement('p',{props:{
                },class:"subtitle"},[contact.subtitle]);

                const leftContent = [];
                switch(t.option.styleType){
                    case "simple":
                        leftContent.push(icon,name);
                        break;
                    case "detail":
                        leftContent.push(icon,name,subtitle);
                        break;
                };
                const contactItemLeft = createElement('div',{props:{
                },class:"contactItemLeft"},leftContent);
                //右侧内容
                const department = createElement('p',{props:{
                },class:"department"},[`部门：${contact.department}`]);
                const post = createElement('p',{props:{
                },class:"post"},[`岗位：${contact.post}`]);
                const jobNumber = createElement('p',{props:{
                },class:"jobNumber"},[`工号：${contact.jobNumber}`]);
                const phone = createElement('p',{props:{
                },class:"phone"},[`手机号：${contact.phone}`]);
                const email = createElement('p',{props:{
                },class:"email"},[`邮箱：${contact.email}`]);

                const contactItemRight = createElement('div',{props:{
                },class:"contactItemRight"},[department,post,jobNumber,phone,email]);
                let checked = false;
                t.valueBase.forEach((val,index)=>{
                    if(val == contact){
                        debugger
                        checked = true
                    }
                });
                //选择框
                const select = createElement('input',{attrs:{
                    type:t.option.selectType,
                    checked:checked
                },class:"selectButton",on:{change:t.selectContact.bind(t,contact)}},[]);
                //编辑安娜
                const edit = createElement('div',{props:{type:t.option.selectType
                },class:"editButton",on:{click:t.edit.bind(t,key)}},["编辑"]);

                const allContent = [];
                switch(t.option.styleType){
                    case "simple":
                        allContent.push(contactItemLeft,select);
                        break;
                    case "detail":
                        allContent.push(contactItemLeft,contactItemRight,select,edit);
                        break;
                    case "words":
                        allContent.push(contactItemRight,select,edit);
                        break;
                };
                let itemClass = _TY_Tool.isPC()?"contactItem":"contactItem h5"
                //联系人卡片
                const contactItem = createElement('div',{props:{
                    value:t.valueBase
                },class:itemClass},allContent);
                children.push(contactItem);
            });
            //联系人卡片列表
            return createElement('div',{props:{
                },class:"contactList",ref:"div"},[children]);
        },
        created: function () {
            const t = this;
            t.getContactList();
        },
        mounted:function(){
            
        },
        methods: {
            //获取联系人列表
            getContactList(){
                const t = this;
                if (t.contactListDs) {
                    t.loading = true;
                    _TY_Tool.getDSData(t.contactListDs, _TY_Tool.buildTplParams(t), function (data) {
                        data.forEach((item) => {
                            t.loading = false;
                            const {dataKey, value} = item;
                            t.realContactlist = value;
                        });
                    }, function (code, msg) {
                        t.loading = false;
                    });
                }
            },
            //编辑当前项
            edit(key){
                const t = this;
                t.editContactKey = key;
                this.$emit("edit",t.realContactlist(key));

            },
            //选中联系人
            selectContact(contact){
                const t = this;
                let checked = true
                if(!t.valueBase.length){
                    t.valueBase.push(contact);
                }else{
                    //判断是选中还是取消选中
                    t.valueBase.forEach((val,key)=>{
                        if(val == contact){
                            t.valueBase.splice(key,1);
                            checked = false
                            this.$emit("checkedOff",t.valueBase);
                        }
                    });
                    if(checked){
                        t.valueBase = t.option.selectType == "radio"?[]:t.valueBase;
                        t.valueBase.push(contact);
                        this.$emit("checkedOn",t.valueBase);
                    }
                }
            },
            //获取更多联系人
            getMore(){
                const t = this;
                if (t.moreDs) {
                    t.loading = true;
                    _TY_Tool.getDSData(t.moreDs, _TY_Tool.buildTplParams(t), function (data) {
                        data.forEach((item) => {
                            t.loading = false;
                            const {dataKey, value} = item;
                            t.realContactlist.push(value);
                        });
                    }, function (code, msg) {
                        t.loading = false;
                    });
                }
            },
            //外部设置列表
            setContactList(list){
                this.realContactlist = list;
            },
            //外部设置联系人卡片
            setContact(contact){
                const t = this;
                if(t.editContactKey != null){
                    t.realContactlist[t.editContactKey] = contact;
                }else{
                    this.$emit("add",contact);
                    t.realContactlist.push(contact);
                }
            }
        }
    }
</script>
<style lang='less'>
    .contactList{
        .contactItem{
            min-width: 10rem;
            position: relative;
            font-size: 0.5rem;
            box-sizing: border-box;
            border:1px solid rgba(204, 204, 204, 1);
            padding: 0.25rem;
            margin: 0.25rem;
            /*float: left;*/
            display: inline-block;
            .contactItemLeft,.contactItemRight{
                display: inline-block;
            }
            .contactItemLeft{
                width: 25%;
                text-align: center;
                vertical-align: top;
                img{
                    width: 2rem;
                    height: 2rem;
                }
            }
            .contactItemRight{
                width: 75%;
                p{
                    word-break: break-all;
                }
            }
            .selectButton{
                position: absolute;
                top: 0.5rem;
                right: 0.5rem;
            }
            .editButton{
                background: rgba(137, 133, 133, 0.5);
                width: 100%;
                position: absolute;
                text-align: center;
                left: 0;
                bottom:0;
                opacity: 0;
            }
            &:hover{
                .editButton{
                    opacity:1;
                    transition: opacity .5s;
                }
            }
        }
        .h5{
            display: list-item;
            min-width: auto
        }
    }
</style>