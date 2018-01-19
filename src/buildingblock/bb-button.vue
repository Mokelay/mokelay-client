<template>
    <el-button class="bb-button" :type="relButton.type" :disabled="relButton.disabled" :size="relButton.size" :icon="relButton.icon" @click.native.prevent="click(relButton)">{{relButton.selectText || relButton.text}}<slot></slot></el-button>
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
                    return {
                        type:'primary',
                        text:'请设置按钮属性'
                    };
                }
            }
        },
        data() {
            return {

            }
        },
        computed: {
            relButton: function () {
                return this.button;
            }
        },
        created: function () {
        },
        mounted:function(){
        },
        methods: {
            click:function(button){
                this.vue = Vue;
                Util.resolveButton(button,_TY_Tool.buildTplParams(this),button.afterClick);
                this.$emit('buttonClick',button);
                this.$emit('click',button);
            }
        }
    }
</script>
<style scoped>
</style>