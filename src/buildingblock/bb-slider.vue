<template>
         <el-slider
          v-model="valueBase"
          :min="min"
          :max="max"
          :disabled="disabled"
          :step="step"
          :show-input="showInput"
          :show-input-controls="showInputControls"
          :show-stops="showStops"
          :show-tooltip="showTooltip"
          :format-tooltip="p_formatTooltip"
          :range="range"
          :vertical="vertical"
          :height="height"
          :label="label"
          :tooltip-class="tooltipClass"
          @change="change"
          >
        </el-slider>
</template>

<script>

    export default {
        name: 'bb-slider',
        props: {
            //如果range属性打开，value是一个数组  [1,5]
            value:{
                type:[Array,Number]
            },
            //最小值
            min:{
                type:[Number],
                default:0
            },
            //最大值
            max:{
                type:Number,
                default:100
            },
            //是否禁用
            disabled:{
                type:Boolean,
                default:false
            },
            //每步拖动长度
            step:{
                type:Number,
                default:1
            },
            //是否显示输入框 仅在非范围选择时有效
            showInput:{
                type:Boolean,
                default:false
            },
            //在显示输入框的情况下，是否显示输入框的控制按钮
            showInputControls:{
                type:Boolean,
                default:true
            },
            //是否显示间断点
            showStops:{
                type:Boolean,
                default:false
            },
            //是否显示 tooltip
            showTooltip:{
                type:Boolean,
                default:true
            },
            //格式化 tooltip message
            formatTooltip:{
                type:String
            },
            //是否为范围选择
            range:{
                type:Boolean,
                default:false
            },
            //是否竖向模式
            vertical:{
                type:Boolean,
                default:false
            },
            //Slider 高度，竖向模式时必填
            height:{
                type:String
            },
            //屏幕阅读器标签
            label:{
                type:String,
                default:''
            },
            //  tooltip 的自定义类名
            tooltipClass:{
                type:String,
                default:''
            },
            //默认值模板
            defaultValTpl:{
                type:[String,Number,Boolean]
            }
        },
        data() {
            return {
                valueBase: this.value,
            }
        },
        watch: {
            value(val){
                this.valueBase=val;
            }
        },
        computed:{
            p_formatTooltip(){
                if(this.formatTooltip){
                    return eval(this.formatTooltip);
                }
                return null;
            }
        },
        created: function () {
        },
        mounted:function(){
            let t=this;
            _TY_Tool.buildDefaultValTpl(t,"valueBase");
            if(Number(t.valueBase)){
                t.valueBase = Number(t.valueBase);
            }
        },
        methods: {
            change:function(val){
                this.$emit('input',val)
                this.$emit('change',val)
            }
        }
    }
</script>


<style>
    .el-slider__runway div.el-slider__button-wrapper{
        z-index: 100;
    }
    .el-slider{
        padding: 5px 10px;
    }
</style>