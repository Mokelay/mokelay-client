<template>
      <el-input
        type="textarea"
        :rows="2"
        placeholder="请输入内容"
        v-model="valueBase"
        @change="change"
        :disabled="disabled"
        >
      </el-input>
</template>

<script>
    import Util from '../libs/util';

    export default {
        name: 'bb-textarea',
        props: {
            disabled:{
                type:Boolean
            },
            value:{
                type:[String,Number]
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