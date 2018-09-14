<template>
    <el-input-number v-model="valueBase" @change="change" :min="min" :controls="option.controls" :controls-position="option.controlsPosition" :max="max" :size="option.size" :disabled="option.disabled" :precision="option.precision" :step="option.step"></el-input-number>
</template>

<script>
    import Util from '../../libs/util';

    export default {
        name: 'bb-input-number',
        props: {
            disabled:{
                type:Boolean
            },
            value:{
                type:[Number,String]
            },
            min:{
                type:Number,
                default:0
            },
            max:{
                type:Number
            },
            defaultValTpl:{
                type:[String,Number,Boolean]
            },
            //基础配置
            option:{
                type:Object,
                default:function(){
                    return {
                        disabled:false,
                        size:"",
                        controls:true,//是否显示控制器
                        controlsPosition:"",//默认控制器在两边 ，可选right
                        precision:0,
                        step:1
                    }
                }
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
        created: function () {
        },
        mounted:function(){
            let t=this;
            _TY_Tool.buildDefaultValTpl(t,"valueBase");
        },
        methods: {
            change:function(val){
                this.$emit('input',val)
                this.$emit('change',val)
            }
        }
    }
</script>