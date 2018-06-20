<!-- <template>
    <div class="contactList">
        <div class="contactItem" v-for="(contact,key) in realContactlist">
            <div class="contactItemLeft">
                <img :src="contact.icon" alt="contact.name">
                <p class="name">{{contact.name}}</p>
                <p class="status" v-if="option.styleType == 'detail'">{{contact.subtitle}}</p>
            </div>
            <div class="contactItemRight" v-if="option.styleType == 'detail'">
                <p>部门：{{contact.department}}</p>
                <p>岗位：{{contact.post}}</p>
                <p>工号：{{contact.jobNumber}}</p>
                <p>手机号：{{contact.phone}}</p>
                <p>邮箱：{{contact.email}}</p>
            </div>
            <input class="selectButton" :type="option.selectType" @change="selectContact">
            <div class="editButton" @click="edit">编辑</div>
        </div>
    </div>
</template> -->
<script>
    export default {
        name: 'bb-indep-contact-list',
        props: {
            /*默认值 支持v-model*/
            value:{
                type:Object
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
                type:Array,
                default:function(){
                    return [{
                        icon:"https://img1.mklimg.com/g2/M00/2C/26/rBBrCVpqxeiAJ9ZNAAAa9tYa42U290.png!",
                        name:"姓名",
                        subtitle:"副标题",
                        department:"部门",
                        post:"岗位",
                        jobNumber:"工号",
                        phone:"18888888888",
                        email:"email@test.com"
                    }]
                }
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
                valueBase:this.value
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
                //选择框
                const select = createElement('input',{attrs:{type:t.option.selectType
                },class:"selectButton",on:{change:t.selectContact.bind(t,contact)}},[]);
                //编辑安娜
                const edit = createElement('div',{props:{type:t.option.selectType
                },class:"editButton",on:{click:t.edit.bind(t,contact)}},["编辑"]);

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
                //联系人卡片
                const contactItem = createElement('form',{props:{
                    value:t.valueBase
                },class:"contactItem",ref:"form"},allContent);
                children.push(contactItem);
            });
            //联系人卡片列表
            return createElement('div',{props:{
                },class:"contactList"},[children]);
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
            edit(contact){
                this.$emit("edit",contact);
            },
            //选中联系人
            selectContact(contact){
                debugger

            },
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
            }
        }
    }
</script>
<style lang='less'>
    .contactList{
        .contactItem{
            max-width: 11rem;
            position: relative;
            font-size: 0.5rem;
            box-sizing: border-box;
            border:1px solid rgba(204, 204, 204, 1);
            padding: 0.25rem;
            margin: 0.25rem;
            float: left;
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
                width: 73%;
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
    }
</style>