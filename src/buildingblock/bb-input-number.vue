<template>
    <el-input-number v-model="valueBase" @change="change"></el-input-number>
</template>

<script>
    import Util from '../libs/util';

    export default {
        name: 'bb-input-number',
        props: {
            disabled:{
                type:Boolean
            },
            value:{
                type:[Number,String]
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
        },
        methods: {
            change:function(val){
                this.$emit('input',val)
                this.$emit('change',val)
            }
        }
    }
</script>