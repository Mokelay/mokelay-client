<!-- <template>
    <div class="bb-vant-field" :class="{
        'noPadding':option.noPadding,
        't_right':option.t_right
    }">
        <van-field 
            v-model="valueBase" 
            :type="option.type"
            :label="option.label"
            :icon="option.icon"
            :leftIcon="option.leftIcon"
            :required="option.required"
            :disabled="option.disabled"
            :error="option.error" 
            :errorMessage="option.errorMessage" 
            :autosize="option.autosize"
            :maxText="maxTextShow"
            :placeholder="option.placeholder"
            @change="onInput" 
            @click-icon="clickIcon" 
            @keyup="keyup"/>
        <p v-if="messageText && option.showMessageText" class="showText">{{writeText}}/{{messageText}}</p>
    </div>
</template>
 -->
<script>
import Field from 'vant/lib/field';
import 'vant/lib/field/style';

    export default {
        name: 'bb-vant-field',
        components: {
          "van-field":Field,
        },
        props: {
            //内容
            value:{
                type:String,
            },
            /*模板默认值*/
            defaultValTpl:{
                type:[String,Number,Boolean]
            },
            /*其他属性配置
                {
                    type:"defalut", 可设置为任意原生类型 number tel textarea
                    placeholder:"", 
                    label:"标签名",
                    icon:"", 输入框尾部图标
                    leftIcon:"",输入框左侧图标
                    required:false,
                    disabled:false,
                    border:true,
                    error:false,  是否将输入内容标红
                    errorMessage:"错误提示文案", 底部错误提示文案 
                    autosize:true 自适应内容高度，只对 textarea 有效
                    valueStyle:{} 
                }
            */
            option:{
                type:Object,
                default:function() {
                    return {
                        type:"textarea",
                        placeholder:"",
                        label:"标签名",
                        icon:"",
                        leftIcon:"",
                        required:false,
                        disabled:false,
                        error:false,
                        errorMessage:"",
                        autosize:true,
                        maxText:100000,
                        border:true,
                        showMessageText:true,
                        valueStyle:{}
                    };
                }
            },
            /*
            content:积木数据,
                content:[{                      //页面内容
                        uuid:'',
                        alias:'',                   //积木别名
                        aliasName:'',               //中文名称
                        group:'',                   //对应slot  空 对应 内容 icon  自定义icon  title   自定义title  right-icon  自定义右侧按钮，默认是arrow

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

            },
            //动态内容
            contentDs:{
                type:Object
            }
        },
        render: function (createElement) {
            const t = this;
            //单元格
            const children = [];
            if(t.valueBase){
                const valueStyle = _TY_Tool.setStyle({layout:t.option.valueStyle},t);
                const child = createElement('span',{props:{style:valueStyle},style:valueStyle},[t.valueBase]);
                children.push(child);
            }
            if(t.realContent){
                t.realContent.forEach((ele,index)=>{
                    const bb = _TY_Tool.bbRender([ele], createElement, t);
                    const child = createElement('div',{slot:ele.group},[bb]);
                    children.push(child);
                });
            }
            const field = createElement('van-field',{
                props:{
                    value:t.valueBase,
                    type:t.option.type,
                    label:t.option.label,
                    icon:t.option.icon,
                    leftIcon:t.option.leftIcon,
                    required:t.option.required,
                    disabled:t.option.disabled,
                    error:t.option.error, 
                    errorMessage:t.option.errorMessage, 
                    autosize:t.option.autosize,
                    maxText:t.maxTextShow,
                    placeholder:t.option.placeholder
                },
                on:{
                    "change":t.onInput,
                    "click-icon":t.clickIcon, 
                    "keyup":t.keyup
                }
            },[children]);
            //实时长度提示
            const messageWords = `${t.writeText}/${t.messageText}`;
            const message = createElement('p',{
                props:{},
                class:"showText",
            },[messageWords]);
            //最外层div
            let bbVantFieldClass = "bb-vant-field";
            if(t.option.noPadding){
                bbVantFieldClass = bbVantFieldClass + " noPadding";
            }
            if(t.option.t_right){
                bbVantFieldClass = bbVantFieldClass + " t_right";
            }
            return createElement('div',{
                props:{
                },
                class:bbVantFieldClass,
                on:{}
            },[field,message]);
        },
        data() {
            return {
                valueBase:this.value,
                writeText:"0",
                maxTextShow:this.option.maxText,
                messageText:this.option.maxText,
                isShowText:true,
                realContent:this.content
            };
        },
        mounted(){
            console.log("this.value:",this.value);
            let t=this;
            _TY_Tool.buildDefaultValTpl(t,"valueBase");  
            t.$emit('mounted',this.valueBase); 
        },
        //事件click
        methods: {
            //点击图标
            clickIcon(key){
                this.$emit('clickIcon',key);
            }, 
            //输入事件
            onInput(key){
                this.$emit('input',this.valueBase);
                this.$emit('change',this.valueBase);
            },
            //显示字符，超出限制字符截取
            keyup(){
                this.writeText = this.valueBase.length;
                this.$emit('onFocus',this.valueBase); 
                var t = this.valueBase;
        		var w = this.writeText;
        		var s = this.option.maxText;
        		if(w>s){
        			var a = this.valueBase.substring(0,s);
        			this.valueBase = a;
        			this.writeText = this.valueBase.length;
        		}
            }

        }
    }
</script>

<style scoped>
    .showText{text-align:right; margin-right:5%;font-size: 0.2rem;}
</style>

<style>
    .bb-vant-field.noPadding .van-field{
        padding: 0;
    }
    .bb-vant-field.t_right .van-field input{
        text-align: right
    }
</style>