<template>
    <el-button :style="relButton.style" class="bb-button" :type="relButton.type" :disabled="relButton.disabled" :size="relButton.size" :icon="relButton.icon" @click.native.prevent="click(relButton)">{{relButton.selectText || relButton.text}}<slot></slot></el-button>
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
                if(!this.button.style){
                    this.button.style = {};
                }
                if(this.button.color){
                    this.button.style.color=this.button.color;
                }
                if(this.button.fontSize){
                    this.button.style.fontSize=this.button.fontSize;
                }
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
            },
            loadChildBB(){
                let t=this;
                return _TY_Tool.loadChildBB(t);                
            }
        }
    }
</script>
<style scoped>
</style>