<!-- <template>
    <van-cell-group :border="option.border">
        <bb-vant-cell v-for="(field,key) in valueBase" :key="key" :value="field.value" :option="field.option" click="cellClick"></bb-vant-cell>
    </van-cell-group>
</template> -->

<script>
import CellGroup from 'vant/lib/cell-group';
import 'vant/lib/cell-group/style';

    export default {
        name: 'bb-vant-cell-group',
        components: {
          "van-cell-group":CellGroup,
        },
        props: {
            /*表单值
            */
            value:{
                type:Array
            },
            /*模板默认值*/
            defaultValTpl:{
                type:[String,Number,Boolean]
            },
            /*动态获取内容*/
            ds:{
                type:Object
            },
            /*其他属性配置
                {
                    border:Boolean  是否显示外边框
                }
            */
            option:{
                type:Object,
                default:function(){
                    return {
                        border:false
                    }
                }

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

            }

        },
        data() {
            return {
                valueBase:this.value,
                realContent:this.content || []
            };
        },
        render: function(createElement){
            const t = this;
            t.setValue();
            const bbList = _TY_Tool.bbRender(t.realContent, createElement, t);
            return createElement('van-cell-group',{props:{border:t.option.border}},bbList);
        },
        mounted(){
            this.getData();
        },
        //事件click
        methods: {
            //获取数据
            getData() {
                const t = this;
                if (t.ds) {
                    Util.getDSData(t.ds, _TY_Tool.buildTplParams(t), function (data) {
                        data.forEach((item) => {
                            const {dataKey, value} = item;
                            t.realFields = value;
                        });
                    }, function (code, msg) {
                    });
                }
            },
            //点击事件
            cellClick(param){
                this.$emit("click",param);
            },
            //设置表单值
            setValue(){
                const t = this;
                if(!t.valueBase || !t.realContent){
                    return;
                }
                t.realContent.forEach((content,key)=>{
                    content.value = t.valueBase[content.attributeName];
                });
            }
        }
    }
</script>

<style scoped>
</style>