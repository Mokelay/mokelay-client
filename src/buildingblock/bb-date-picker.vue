<template>
    <el-date-picker 
        v-model="valueBase"
        :disabled="option.disabled"
        :editable="option.editable"
        @change="change"
        :type="type" placeholder="选择日期时间"></el-date-picker>
</template>

<script>
    import Util from '../libs/util';

    export default {
        name: 'bb-date-picker',
        props: {
            option:{
                type: Object,
                default:function(){
                    return {
                        disabled:false,
                        editable:false
                    }
                }
            },
            value:{
                type:String
            },
            type:{
                type:String,
                default:'datetime'
            }
        },
        data() {
            return {
                valueBase: this.value,
            }
        },
        watch:{
            valueBase(val){
                this.change(val);
            }
        },
        created: function () {
        },
        mounted:function(){
        },
        methods: {
            change:function(val){
                this.$emit('input',val)
                this.$emit('change',val)
            }
        }
    }
</script>