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
                const t = this;
                var button = this.button;
                if(button.icon && button.icon.indexOf('el-icon') == -1){//老配置兼容el-icon
                    button.icon = 'el-icon-' + button.icon;
                }
                return button
            }
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
                this.$emit('click',button);
            }
        }
    }
</script>
<style scoped>
</style>