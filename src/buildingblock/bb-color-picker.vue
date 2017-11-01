<template>
    <el-color-picker v-model="valueBase" show-alpha @change='change'></el-color-picker>
</template>

<script>
    import Util from '../libs/util';

    export default {
        name: 'bb-color-picker',
        props: {
            value:{
                type:String
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
        },
        methods: {
            change:function(val){
                this.$emit('input',val)
                this.$emit('change',val)
            }
        }
    }
</script>