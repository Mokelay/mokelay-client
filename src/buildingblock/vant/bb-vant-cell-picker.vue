<template>
    <div class="bb-vant-cell-picker">
        <bb-vant-cell @click="showPopup" :value="valueBase" :option="option" :content="content" :contentDs="contentDs"></bb-vant-cell>
        <van-popup v-model="pickerShow" position="bottom" @click-overlay="onCancel">
            <van-picker
                v-if="pickerConfig.type != 'area'"
                :show-toolbar="pickerConfig.showToolbar||true"
                :title="pickerConfig.title||''"
                :columns="realColumns||[]"
                @cancel="onCancel"
                @confirm="onConfirm"
                @change="onChange"
            />
            <bb-vant-area v-if="pickerConfig.type == 'area'" :value="valueBase" @change="onConfirm"></bb-vant-area>
        </van-popup>
    </div>
</template>
<script>
import Popup from 'vant/lib/popup';
import 'vant/lib/popup/style';
import Picker from 'vant/lib/picker';
import 'vant/lib/picker/style';
import Cell from 'vant/lib/cell';
import 'vant/lib/cell/style';
    export default {
        name: 'bb-vant-cell-picker',
        components: {
          "van-cell":Cell,
          "van-popup":Popup,
          "van-picker":Picker
        },
        props: {
            //内容
            value:{
                type:[Number,String]
            },
            /*模板默认值*/
            defaultValTpl:{
                type:[String,Number,Boolean]
            },
            /*columns 选择器静态数据
                [{text:"浙江",value:0001,children:[
                    { text: '杭州',value:'1'},
                    { text: '宁波',value:'2'},
                    { text: '温州',value:'3'},
                    { text: '湖州',value:'4'}
                    ]},
                {text:"福建",value:0001,children:[
                    { text: '杭州',value:'1'},
                    { text: '宁波',value:'2'},
                    { text: '温州',value:'3'},
                    { text: '湖州',value:'4'}
                    ]}]
                
                单级['杭州', '宁波', '温州', '嘉兴', '湖州']
                多级[
                    {
                        values: Object.keys(citys),
                        className: 'column1'
                    },
                    {
                        values: citys['浙江'],
                        className: 'column2',
                        defaultIndex: 2
                    }
                ]
            */
            columns:{
                type:Array
            },
            /*选择器动态数据*/
            columnsDs:{
                type:Object
            },
            /*选项名关键字 配合DS接口使用，从返回数据中获取需要的值*/
            valueKey:{
                type:Object,
                default:function(){
                    return {
                        value:"value",
                        text:"text",
                        children:"children"
                    }
                }
            },
            /*选择器属性
                type:"area"  area地址选择器  default默认值
                showToolbar:true //显示头部
                title:"标题"
            */
            pickerConfig:{
                type:Object,
                default:function(){
                    return {
                        type:"default"
                    };
                }
            },
            /*其他属性配置
                {
                    icon:String 左侧图标,
                    title:String 左侧标题,
                    label:String 标题下方的描述信息,
                    required:Boolean 是否显示表单必填星号,
                    isLink:Boolean 展示右侧箭头并开启点击反馈
                    center:Boolean 使内容垂直居中
                    url:""  跳转链接
                    clickable:Boolean 开启点击反馈
                 }
            */
            option:{
                type:Object,
                default:function(){
                    return {

                    }
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
        data() {
            return {
                valueBase:this.value,
                pickerShow:false,
                columnsData:this.pickerConfig.columns || this.columns,
                external:{}
            };
        },
        computed:{
            realColumns(){
                const columns = [];
                this.setColumn(this.columnsData,columns);
                return columns;
            }
        },
        watch:{
            value(val){
                const t = this;
                if(t.pickerConfig.columns){
                   t.pickerConfig.columns.forEach((ele,key)=>{
                        t.valueBase = ele.value == val?ele.text:t.valueBase;
                   });
                }
            }
        },
        mounted(){
            const t = this;
            t.getData();
            if(t.pickerConfig.columns){
               t.pickerConfig.columns.forEach((ele,key)=>{
                    t.valueBase = ele.value == t.value?ele.text:t.valueBase;
               });
            }
        },
        //事件click
        methods: {
            onConfirm(value, index) {
                if(Array.isArray(value)){
                    let text = [];
                    let emitValue = [];
                    value.forEach((val,key)=>{
                        if(this.pickerConfig.type == 'area'){
                            val.text = val.name;
                            val.value = val.code;
                        }
                        text.push(val.text);
                        emitValue.push(val.value);
                    })
                    this.valueBase = text.join(" ");
                    emitValue = emitValue.join(",")
                    this.$emit("input",emitValue,value);
                    this.$emit("change",emitValue,value);
                }else{
                    this.valueBase = value.text;
                    this.$emit("input",value.value,value);
                    this.$emit("change",value.value,value);
                }
                this.pickerShow = false;                
            },
            onCancel() {
                this.pickerShow = false;
            },
            showPopup(){
                this.pickerShow = true;
            },
            onChange(picker, values,level) {
                picker.setColumnValues(level + 1, values[level]["children"]);
                this.$emit("scroll",values);
            },
            //设置表头
            setColumn(data,columns){
                const t = this;
                columns.push({
                    values:data
                });
                if(data[0] && data[0].children){
                    t.setColumn(data[0].children,columns)
                }
            },
            //获取选择器选项数据
            getData(){
                let t=this;
                if(t.columnsDs){
                    _TY_Tool.getDSData(t.columnsDs, _TY_Tool.buildTplParams(t), function (map) {
                         map.forEach((val,key)=>{
                            t.columnsData = t.transferData(val.value);
                        })
                    }, function (code, msg) {
                    });
                }
            },
            //转换DS返回的数据
            transferData(data){
                const t = this;
                const valueKey = t.valueKey["value"];
                const textKey = t.valueKey["text"];
                const childrenKey = t.valueKey["children"];
                const dataString = JSON.stringify(data);
                let newString = valueKey?dataString.replace(new RegExp(valueKey,'g'),"value"):dataString;
                newString = textKey?newString.replace(new RegExp(textKey,'g'),"text"):newString;
                newString = childrenKey?newString.replace(new RegExp(childrenKey,'g'),"children"):newString;
                const newData = JSON.parse(newString);
                return newData;
            },
            //外部联动更新数据
            linkage(...data){
                if(data){
                    this.external['linkage'] = data;
                    this.getData();
                }
            },
        }
    }
</script>

<style scoped>
    .bb-vant-cell-picker{
        font-size: 0.5rem;
    }
</style>