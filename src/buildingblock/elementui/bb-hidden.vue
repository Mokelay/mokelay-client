<template>
    <el-input
      type="hidden"
      v-model="valueBase"
      @change="change"
      >
    </el-input>
</template>

<script>
    import Util from '../../libs/util';

    export default {
        name: 'bb-hidden',
        props: {
            value:{
                type:[String,Number]
            },
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