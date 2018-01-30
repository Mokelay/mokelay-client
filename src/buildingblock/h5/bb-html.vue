<template>
    <span class="bb-html" :contenteditable="contenteditable" v-on:dblclick="dblclick" v-on:blur="blur" v-html="valueBase"></span>
</template>

<script>
    export default {
        name: 'bb-html',
        props: {
            /*
                value 支持v-model
            */
            value:{
                type:[String,Number]
            },
            /*
                defaultValTpl 默认值支持模板
            */
            defaultValTpl:{
                type:[String,Number,Boolean]
            }
        },
        data() {
            return {
                valueBase: this.value,
                contenteditable:false
            }
        },
        computed:{
        },
        watch: {
            value(val){

            }
        },
        created: function () {
        },
        mounted:function(){
            let t=this;
            //渲染默认值模板
            _TY_Tool.buildDefaultValTpl(t,"valueBase");
        },
        methods: {
            dblclick:function(params){
                this.$emit('bb-dblclick');
            },
            blur:function(params){
                this.$emit('bb-blur');
            },
            edit:function(params){
                this.contenteditable = true;
            },
            cancel:function(params){
                this.contenteditable = false;
            }
        }
    }
</script>
<style lang='less' scoped>
</style>