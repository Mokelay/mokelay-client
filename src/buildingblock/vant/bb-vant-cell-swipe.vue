<!-- <template>
    <van-cell-group>
        <van-cell-swipe :right-width="65" :left-width="65">
            <div slot="left"><p>选择</p></div>
                <van-cell title="单元格" value="内容" />
            <div slot="right"><p>删除</p></div>
        </van-cell-swipe>
        <van-cell-swipe :right-width="65" :left-width="65">
            <div slot="left"><p>选择</p></div>
                <van-cell title="单元格" value="内容" />
            <div slot="right"><p>删除</p></div>
        </van-cell-swipe>
        <van-cell-swipe :right-width="65" :left-width="65">
            <div slot="left"><p>选择</p></div>
                <van-cell title="单元格" value="内容" />
            <div slot="right"><p>删除</p></div>
        </van-cell-swipe>
    </van-cell-group>
</template> -->

<script>
import CellSwipe from 'vant/lib/cell-swipe';
import 'vant/lib/cell-swipe/style';
import CellGroup from 'vant/lib/cell-group';
import 'vant/lib/cell-group/style';
import Cell from 'vant/lib/cell';
import 'vant/lib/cell/style';

    export default {
        name: 'bb-vant-cell-swipe',
        components: {
          "van-cell-swipe":CellSwipe,
          "van-cell-group":CellGroup,
          "van-cell":Cell,
        },
        props: {
            //左侧滑动区域宽度
            leftWidth:{
                type:Number
            },
            //右侧滑动区域宽度
            rightWidth:{
                type:Number
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
                type:Array
            },
            contentDs:{
                type:Object
            }
        },
        data() {
            return {
                valueBase:this.value
            };
        },
        render: function(createElement){
            const t = this;
            t.setValue();
            const bbList = _TY_Tool.bbRender(t.realContent, createElement, t);
            return createElement('van-cell-swipe',{props:{border:t.option.border}},bbList);
        },
        mounted(){

        },
        //事件click
        methods: {
            //点击事件
            click(param){
                this.$emit('click',param);
            }
        }
    }
</script>

<style lang="less">

</style>