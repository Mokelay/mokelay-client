<template>
    <el-color-picker v-model="valueBase" :show-alpha="option.showAlpha" :size="option.size" :disabled="option.disabled" @change='change' :color-format="option.colorFormat"></el-color-picker>
</template>

<script>
    import Util from '../../libs/util';

    import Vue from 'vue';
    import {
            ColorPicker
    } from 'element-ui'
    Vue.use(ColorPicker);

    export default {
        name: 'bb-color-picker',
        props: {
            value:{
                type:String
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
                        showAlpha:true,
                        colorFormat:"hex"
                    };
                }
            }
        },
        data() {
            return {
                valueBase: this.value,
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