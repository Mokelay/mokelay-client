<template>
    <el-button class="m10" :type="button.type" :disabled="button.disabled" :icon="button.icon" @click.native.prevent="click(button)">{{button.selectText || button.text}}</el-button>
</template>

<script>
    import Util from '../libs/util';
    import Vue from 'vue'

    export default {
        name: 'bb-button',
        props: {
            button:{
                type:Object,
                default: function(){
                    return {};
                }
            }
        },
        data() {
            return {}
        },
        created: function () {
        },
        mounted:function(){
        },
        methods: {
            click:function(button){
                this.vue = Vue;
                Util.resolveButton(button,{
                    'bb':this,
                    "router": this.$route.params});
                this.$emit('buttonClick',button);
            }
        }
    }
</script>
<style scoped>
    .m10 {
        margin: 10px 0;
    }
</style>