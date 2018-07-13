<template>
    <div class="bb-vant-cell-picker">
        <bb-vant-cell @click="showPopup" :value="valueBase" :option="option"></bb-vant-cell>
        <van-popup v-model="pickerShow" position="bottom" @click-overlay="onCancel">
            <bb-vant-datetime-picker
                v-model="valueBase"
                :datetimeType="pickerConfig.type"
                :minDate="pickerConfig.minDate"
                :maxDate="pickerConfig.maxDate"
                :minHour="pickerConfig.minHour"
                :maxHour="pickerConfig.maxHour"
                @onCancel="onCancel"
                @onConfirm="onConfirm"
            />
        </van-popup>
    </div>
</template>
<script>
import Popup from 'vant/lib/popup';
import 'vant/lib/popup/style';
import DatetimePicker from 'vant/lib/datetime-picker';
import 'vant/lib/datetime-picker/style';
import Cell from 'vant/lib/cell';
import 'vant/lib/cell/style';

    export default {
        name: 'bb-vant-cell-date-picker',
        components: {
          "van-cell":Cell,
          "van-popup":Popup,
          "van-datetime-picker":DatetimePicker
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
            /*选择器属性
               {
                    type:"date time year-month datetime",
                    minDate:"",
                    maxDate:"",
                    minHour:"",
                    maxHour:""
               }
            */
            pickerConfig:{
                type:Object,
                default:function(){
                    return {
                        type:"date",
                        minDate:"1989/01/01",
                        maxDate:"3000/01/01",
                        minHour:"0",
                        maxHour:"0"
                    }
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
                    valueStyle:""   右侧内容样式
                 }
            */
            option:{
                type:Object,
                default:function(){
                    return {
                        icon:"ty-lxrili",
                        title:"表单项",
                        required:true,
                        isLink:true,
                        center:true,
                        valueStyle:""
                    };
                }

            },
        },
        data() {
            return {
                valueBase:this.value,
                pickerShow:false
            };
        },
        watch:{
            value(val){
                const t = this;
            }
        },
        mounted(){
            const t = this;
            _TY_Tool.buildDefaultValTpl(t,"valueBase");
        },
        //事件click
        methods: {
            onConfirm(value, index) {
                this.valueBase = value;
                this.$emit("input",this.valueBase);
                this.$emit("change",this.valueBase);
                this.pickerShow = false;
            },
            onCancel() {
                this.pickerShow = false;
            },
            showPopup(){
                this.pickerShow = true;
            }
}
    }
</script>

<style scoped>
    .bb-vant-cell-picker{
        font-size: 0.5rem;
    }
</style>