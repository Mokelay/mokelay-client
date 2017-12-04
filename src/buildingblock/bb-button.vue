<template>
    <el-button class="bb-button" :type="relButton.type" :disabled="relButton.disabled" :icon="relButton.icon" @click.native.prevent="click(relButton)">{{relButton.selectText || relButton.text}}</el-button>
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
            },
            type:{
                type:String
            },
            disabled:{
                type:Boolean,
                default:false
            },
            icon:{
                type:String
            },
            text:{
                type:String
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
                if(t.icon && t.icon.indexOf('el-icon') == -1){ //新配置兼容el-icon
                    button.icon = 'el-icon-' + t.icon;
                }
                if(t.text || t.type){  //新配置覆盖老配置
                    button.type = t.type;
                    button.disabled = t.disabled;
                    button.text = t.text;
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
    .bb-button {
        margin: 10px 0;
    }
</style>