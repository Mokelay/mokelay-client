<template>
    <div>
        <el-time-picker 
            v-if="type == 'time' || type == 'timerange'"
            v-model="valueBase"
            :is-range="type == 'timerange'"
            :disabled="option.disabled || false"
            :editable="option.editable || false"
            :picker-options="pickerOptions"
            :value-format="option.valueFormat || 'HH:mm:ss'"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            @change="change"
            :type="type" placeholder="选择时间">
        </el-time-picker>
        <el-date-picker
            v-else 
            v-model="valueBase"
            :disabled="option.disabled || false"
            :editable="option.editable || false"
            :picker-options="pickerOptions"
            :value-format="option.valueFormat"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="change"
            :type="type" placeholder="选择日期时间"></el-date-picker>  
    </div>
</template>

<script>
    import Util from '../../libs/util';

    export default {
        name: 'bb-date-picker',
        props: {
            option:{
                type: Object,
                default:function(){
                    return {
                        disabled:false,
                        editable:false,
                        handle:null
                    }
                }
                /*数据格式
                    {
                        disabled:false,
                        editable:false,
                        handle:buzz //处理option 
                    }
                */
            },
            value:{
                type:[String,Date,Array]
            },
            /*选择器类型
                {
                    "text": "时间选择器",
                    "value": "time"
                }, {
                    "text": "时间范围选择器",
                    "value": "timerange"
                }, {
                    "text": "日期选择器",
                    "value": "date"
                }, {
                    "text": "时间日期选择器",
                    "value": "datetime"
                }, {
                    "text": "日期范围选择器",
                    "value": "daterange"
                }, {
                    "text": "时间日期范围选择器",
                    "value": "datetimerange"
                }
            */
            type:{
                type:String,
                default:'datetime'
            },
            defaultValTpl:{
                type:[String,Number,Boolean]
            }
        },
        data() {
            return {
                //默认值 
                valueBase: this.value,
                //日期选择器参数配置
                pickerOptions:null
            }
        },
        watch:{
            value(val){
                this.valueBase = val;
            },
            valueBase(val){
                //this.change(val);
            }
        },
        created: function () {
            const t = this;
            t.getPickerOptions();
        },
        mounted:function(){
            let t=this;
            _TY_Tool.buildDefaultValTpl(t,"valueBase");
        },
        methods: {
            change:function(val){
                let newDate = val;
                //判断如果输出的是date对象则string化
                if(val && Array.isArray(val)){
                    newDate = [];
                    const startTime = typeof val[0] == "string"?val[0] : val[0].toDateString();
                    const endTime = typeof val[1] == "string"?val[1] : val[1].toDateString();
                    newDate.push(startTime);
                    newDate.push(endTime);
                }else{
                    newDate = val.toDateString();
                }
                this.valueBase = newDate;
                this.$emit('input',newDate);
                this.$emit('change',newDate);
            },
            //通过buzz处理PickerOptions，实现返回自定义函数
            getPickerOptions:function(){
                const t = this;
                if(t.option.handle){
                    //日期选择器参数 通过buzz返回配置
                    _TY_Tool.loadBuzz(t.option.handle, function(code) {
                        t.pickerOptions = eval(code);
                    });
                }else{
                    //日期选择器参数配置
                    t.pickerOptions = Object.assign({},t.option);
                }
            },
            //通过外部交互设置选择器
            setOption:function(...args){
                const t = this;
                args.forEach((val,key)=>{
                    if(val.type == 'custom'){
                        t.pickerOptions = val.arguments;
                    }  
                })
            }
        }
    }
</script>