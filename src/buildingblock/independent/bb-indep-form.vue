<script>
    export default {
        name: 'bb-indep-form',
        components: {
        },
        props: {
            /*表单值 支持v-model*/
            value:{
                type:Object
            },
            //动态表单值
            formDataDs:{
                type:Object
            },
            /*
            content:积木数据,
                content:[{                      //页面内容
                        uuid:'',
                        alias:'',                   //积木别名
                        aliasName:'',               //中文名称
                        group:'',                   //积木分组 表单项显示的位置
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
                default:function(){
                    return [{                      //页面内容
                        uuid:'1',
                        alias:'bb-vant-search',                   //积木别名
                        aliasName:'123',               //中文名称
                        group:'',                   //积木分组 表单项显示的位置
                        attributes:{
                            attributeName:'a'    //表单项键值别名
                        },              //积木属性
                        animation:[],
                        interactives:[],
                        layout:{                    //积木布局
                        }
                    },{                      //页面内容
                        uuid:'2',
                        alias:'bb-vant-field-number',                   //积木别名
                        aliasName:'123',               //中文名称
                        group:'',                   //积木分组 表单项显示的位置
                        attributes:{
                            attributeName:'b'    //表单项键值别名
                        },              //积木属性
                        animation:[],
                        interactives:[],
                        layout:{                    //积木布局
                        }
                    },{                      //页面内容
                        uuid:'3',
                        alias:'bb-vant-field',                   //积木别名
                        aliasName:'123',               //中文名称
                        group:'',                   //积木分组 表单项显示的位置
                        attributes:{
                            attributeName:'c'    //表单项键值别名
                        },              //积木属性
                        animation:[],
                        interactives:[],
                        layout:{                    //积木布局
                        }
                    },{                      //页面内容
                        uuid:'4',
                        alias:'bb-vant-radio-group',                   //积木别名
                        aliasName:'123',               //中文名称
                        group:'',                   //积木分组 表单项显示的位置
                        attributes:{
                            attributeName:'d'    //表单项键值别名
                        },              //积木属性
                        animation:[],
                        interactives:[],
                        layout:{                    //积木布局
                        }
                    },{                      //页面内容
                        uuid:'5',
                        alias:'bb-vant-password-input',                   //积木别名
                        aliasName:'123',               //中文名称
                        group:'',                   //积木分组 表单项显示的位置
                        attributes:{
                            attributeName:'e'    //表单项键值别名
                        },              //积木属性
                        animation:[],
                        interactives:[],
                        layout:{                    //积木布局
                        }
                    }];
                }

            }
        },
        data() {
            return {
                formData:this.value || {},
                realContent:this.content
            };
        },
        render: function(createElement){
            const t = this;
            const bbList = t.renderContent(createElement);
            return createElement('form',{props:{},attrs:{action:'/'}},bbList);
        },
        computed:{
        },
        watch: {
           
        },
        created: function () {
            let t=this;
            t.getData();
        },
        mounted:function(){
            let t=this;
        },
        methods: {
            onSearch(){

            },
            onCancel(){

            },
            renderContent(createElement){
                const t = this;
                let newContent = [];
                t.realContent.forEach((ele,key)=>{
                    const content = _TY_Tool.deepClone(ele);
                    //每个formItem 都有一个 input事件，实现v-model
                    const FormItemInteractive = {
                        uuid:_TY_Tool.uuid(),
                        fromContentEvent:'input',
                        executeType:'container_method',         //执行类型(预定义方法 trigger_method,
                        containerMethodName:'defaultVmodel'
                    };
                    content["interactives"] = content["interactives"]?content["interactives"].concat([FormItemInteractive]):[FormItemInteractive];
                    //对应字段名称
                    const attributeName = content["attributes"]["attributeName"];
                    //给表单项赋值
                    content["attributes"]["value"] = t.formData[attributeName];
                    newContent.push(content);
                });
                const bbList = _TY_Tool.bbRender(newContent, createElement, t);
                return bbList
            },
            //动态获取卡片内容
            getData(){
                const t = this;
                if (t.formDataDs) {
                    t.loading = true;
                    _TY_Tool.getDSData(t.formDataDs, _TY_Tool.buildTplParams(t), function (data) {
                        data.forEach((item) => {
                            t.loading = false;
                            const {dataKey, value} = item;
                            t.formData = value;
                        });
                    }, function (code, msg) {
                        t.loading = false;
                    });
                }
            },
            /* defaultVmodel  bb-form实现createElement中的v-model
                由于createElement中暂时没有找到实现v-model的方式，
                defaultVmodel配合input事件实现v-model功能.
                表单中的编辑器输入时都会默认触发该方法.
                @val:积木触发事件时传给方法的参数[data,data2....],例如linkage(data)
                @t:当前容器积木
                @bb:触发事件的积木
            */
            defaultVmodel(val,...params){
                const t = this;
                params.forEach((param,key)=>{
                    if(param.alias){
                        const attributeName = param.attributes.attributeName;
                        t.formData[attributeName] = val
                    }
                })
                this.$emit('input',t.formData);
                this.$emit('change',t.formData);
            },
            //外部获取表单值
            getFormData(){
                return this.formData;
            }
        }
    }
</script>

<style lang='less' scoped>

</style>