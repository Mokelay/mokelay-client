<!-- <template> 使用插槽 loadChildBB 不能或得子积木
    <el-form-item v-show="realShow" :label="realLabel" :rules="realRules" :prop="realProp">
        <slot></slot>
    </el-form-item>
</template> -->

<script>
    export default {
        name: 'bb-form-item',
        render: function (createElement) {
            const t = this;
            const realContent = [];
            realContent.push(t.contentItem);
            //处理标准格式数据
            const bbList = _TY_Tool.bbRender(realContent, createElement, t);
            let formItem;
            realContent.forEach((field,key)=>{
                formItem = createElement('el-form-item',{
                    class:t.realShow?'ds':'dn', //控制元素的隐藏显示
                    props:{
                        label:t.realLabel,
                        prop:t.realProp,
                        rules:t.realRules,
                        show:t.realShow
                    }
                },bbList);
            });
            return formItem;
        },
        props: {
            /*标签文本*/
            label:{
                type:String
            },
            /*该表单域标签是否显示*/
            show:{
                type:Boolean,
                default:true
            },
            /*表单验证规则
                [
                    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
                    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur,change' }
                ]
            */
            rules:{
                type:Array
            },
            /*表单域 model 字段，
              在使用 validate、resetFields 方法的情况下，该属性是必填的
            */
            prop:{
                type:String
            },
            /*bb-form-item中的积木元素
                contentItem={                      //页面内容
                        uuid:'',
                        alias:'',                   //积木别名
                        aliasName:'',               //中文名称
                        attributes:{
                            attributeName:''    //表单项键值别名
                            rules:[]            //验证规则
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
            contentItem:{
                type:Object
            }
        },

        data() {
            return {
                realLabel:this.label,
                realShow:this.show,
                realRules:this.rules,
                realProp:this.prop
            }
        },
        computed: {
        },
        watch: {
        },
        created: function () {
        },
        mounted:function(){

        },
        methods: {
            //事件：出现show 和 隐藏hide 事件
            //标签项展示
            itemShow(){
                const t = this;
                t.realShow = true;
                t.$emit('show');
            },
            //标签项影藏
            itemHide(){
                const t = this;
                t.realShow = false;
                t.$emit('hide');
            },
            //读取子积木
            loadChildBB(){
                let t=this;
                return _TY_Tool.loadChildBB(t);                
            },
            /* defaultVmodel  bb-form实现createElement中的v-model
                由于createElement中暂时没有找到实现v-model的方式，
                defaultVmodel配合input事件实现v-model功能.
                表单中的编辑器输入时都会默认触发该方法.
                @val:积木触发事件时传给方法的参数[data,data2....],例如linkage(data)
                @t:当前容器积木
                @bb:触发事件的积木
            */
            defaultVmodel:function (val, t, bb) {
                //表单值回填
                t.$emit('input',val[0]);
                t.$emit('change',val[0]);
            }
        }
    }
</script>
<style scoped>
    .dn{
        display: none;
    }
    .db{
        display: inline-block;
    }
</style>